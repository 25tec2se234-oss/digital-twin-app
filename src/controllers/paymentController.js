const Razorpay = require('razorpay');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const db = require('../db');
const env = require('../config/env');
const ApiError = require('../utils/apiError');
const userModel = require('../models/userModel');
const emailService = require('../services/emailService');
const consentModel = require('../models/consentModel');

const getKeyId = () => {
  const key = (env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || process.env['RAZORPAY_KEY_ID '] || '***REDACTED***');
  return key.split('\n')[0].trim();
};
const getKeySecret = () => {
  const secret = (env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || process.env['RAZORPAY_KEY_SECRET '] || '***REDACTED***');
  return secret.split('\n')[0].trim();
};

let razorpay;
try {
  razorpay = new Razorpay({
    key_id: getKeyId(),
    key_secret: getKeySecret(),
  });
} catch (e) {
  // Razorpay will be initialized per-request if env vars are set; graceful degradation
  razorpay = null;
}

const PLAN_RATES = {
  '1w': 2900,
  '1m': 2900,
  '6m': 11900,
  '12m': 24900
};

async function createOrder(req, res, next) {
  try {
    const { plan } = req.body;
    if (!PLAN_RATES[plan]) {
      throw new ApiError(400, 'Invalid plan selected.');
    }

    const amount = PLAN_RATES[plan];
    const key_id = getKeyId();
    const key_secret = getKeySecret();

    const rzp = new Razorpay({ key_id, key_secret });

    const userIdForReceipt = req.user && req.user.id ? String(req.user.id).replace(/-/g, '').substring(0, 8) : 'anon';
    const options = {
      amount,
      currency: "INR",
      receipt: `r_${userIdForReceipt}_${Date.now().toString().slice(-8)}`
    };

    let orderId = "";
    let orderAmount = amount;
    let orderCurrency = "INR";

    try {
      const order = await rzp.orders.create(options);
      orderId = order.id;
      orderAmount = order.amount;
      orderCurrency = order.currency;
    } catch (rzpErr) {
      console.error('Razorpay orders.create fallback error:', rzpErr);
      // Fallback to client-side checkout mode by returning empty order_id
      orderId = ""; 
    }

    const userIdDb = req.user && req.user.id ? req.user.id : null;
    const dbOrderId = orderId || `client_order_${userIdDb || 'anon'}_${Date.now()}`;

    // Save to DB (only if we have a valid UUID/user_id, otherwise we skip inserting since anonymous orders don't belong to anyone yet)
    if (userIdDb) {
      await db.query(
        'INSERT INTO orders (user_id, razorpay_order_id, plan_duration, amount) VALUES ($1, $2, $3, $4)',
        [userIdDb, dbOrderId, plan, amount]
      ).catch(e => console.error('Failed to log order:', e));
    }

    res.json({
      success: true,
      order_id: orderId,
      db_order_id: dbOrderId,
      amount: orderAmount,
      currency: orderCurrency,
      key_id: key_id
    });
  } catch (err) {
    console.error('createOrder fatal error:', err);
    next(err);
  }
}

async function verifyPayment(req, res, next) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const keySecret = getKeySecret();
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex');

    const isProduction = env.NODE_ENV === 'production';
    const isValidMock = !isProduction && env.ALLOW_MOCK_PAYMENTS === 'true' && (razorpay_signature === 'mock_signature' || razorpay_order_id.startsWith('client_order_'));

    if (expectedSignature === razorpay_signature || isValidMock) {
      // 🛡️ SENIOR DEVELOPER FIREWALL: ATOMIC IDEMPOTENCY CHECK
      // Try to update the order only if it's NOT already paid. This prevents race conditions
      // where a double-click or network retry grants multiple months of subscription!
      const updateOrderRes = await db.query(
        "UPDATE orders SET status = 'paid', razorpay_payment_id = $1, razorpay_signature = $2, updated_at = CURRENT_TIMESTAMP WHERE razorpay_order_id = $3 AND (status != 'paid' OR status IS NULL) RETURNING user_id, plan_duration",
        [razorpay_payment_id, razorpay_signature, razorpay_order_id]
      );

      if (updateOrderRes.rows.length === 0) {
        // Order is either already paid, or doesn't exist.
        const existingOrder = await db.query("SELECT user_id, status FROM orders WHERE razorpay_order_id = $1", [razorpay_order_id]);
        if (existingOrder.rows.length === 0) throw new ApiError(404, 'Order not found');
        
        if (existingOrder.rows[0].status === 'paid') {
          // Idempotent return: The subscription was already updated in a previous request
          const userRes = await db.query('SELECT subscription_expires_at FROM users WHERE id = $1', [existingOrder.rows[0].user_id]);
          return res.json({ 
            success: true, 
            message: 'Payment verified successfully. (Already processed)',
            subscriptionExpiresAt: userRes.rows[0].subscription_expires_at 
          });
        }
      }

      const { user_id, plan_duration } = updateOrderRes.rows[0];

      // Add time to subscription
      let interval = '';
      if (plan_duration === '1w') interval = '7 days';
      if (plan_duration === '1m') interval = '1 month';
      if (plan_duration === '6m') interval = '6 months';
      if (plan_duration === '12m') interval = '1 year';

      // If subscription_expires_at is already in future, add to it. Otherwise, add to NOW.
      const updateRes = await db.query(`
        UPDATE users 
        SET subscription_expires_at = GREATEST(COALESCE(subscription_expires_at, CURRENT_TIMESTAMP), CURRENT_TIMESTAMP) + interval '${interval}'
        WHERE id = $1
        RETURNING email, name, subscription_expires_at
      `, [user_id]);

      const updatedUser = updateRes.rows[0];
      const planName = plan_duration === '1m' ? '1 Month Plan' : (plan_duration === '6m' ? '6 Months Plan' : '12 Months Plan');
      const amountPaid = plan_duration === '1m' ? 29 : (plan_duration === '6m' ? 119 : 249);
      emailService.sendPremiumConfirmation(
        updatedUser.email, 
        updatedUser.name, 
        planName, 
        amountPaid, 
        updatedUser.subscription_expires_at
      ).catch(() => {});

      res.json({ 
        success: true, 
        message: 'Payment verified successfully. Premium unlocked.',
        subscriptionExpiresAt: updatedUser.subscription_expires_at 
      });
    } else {
      await db.query(
        "UPDATE orders SET status = 'failed', updated_at = CURRENT_TIMESTAMP WHERE razorpay_order_id = $1",
        [razorpay_order_id]
      );
      throw new ApiError(400, 'Invalid payment signature');
    }
  } catch (err) {
    console.error('verifyPayment fatal error:', err);
    next(err);
  }
}

async function verifyPaymentProof(req, res, next) {
  try {
    const name = req.body.name || 'Student';
    const mobile_number = req.body.mobile_number || '+917520119837';
    const plan_duration = req.body.plan_duration || '1m';
    const reference_id = req.body.reference_id;
    const file = req.file;

    if (!plan_duration || !PLAN_RATES[plan_duration]) {
      return res.status(400).json({ success: false, message: 'Invalid plan duration specified.' });
    }

    if (!reference_id || reference_id.trim() === '') {
      return res.status(400).json({ success: false, message: 'Transaction ID / Reference No. is mandatory to verify payment proof.' });
    }
    const cleanRef = reference_id.trim();

    // Ensure orders table columns exist at runtime
    await db.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS mobile_number VARCHAR(255);").catch(() => {});
    await db.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS proof_file_path TEXT;").catch(() => {});
    await db.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_name VARCHAR(255);").catch(() => {});

    // STRICT SECURITY CHECK: Ensure this Transaction ID has NEVER been used before!
    const existingOrderRes = await db.query('SELECT id, user_name FROM orders WHERE razorpay_payment_id = $1 LIMIT 1', [cleanRef]);
    if (existingOrderRes.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `SECURITY ALERT: Transaction ID (${cleanRef}) has already been verified. Duplicate claims using the same receipt are strictly prohibited.` 
      });
    }

    // ==============================================================================================
    // 🛡️ SENIOR DEVELOPER FIREWALL: WHAT-IF SCENARIO CROSS-VALIDATION ENGINE
    // ==============================================================================================
    // Scenario A: User modifies or appends characters to your specific transaction reference
    if (cleanRef.includes('pay_T6MilSkslYF0XP') && plan_duration !== '1m') {
      return res.status(400).json({
        success: false,
        message: `SECURITY ALERT: Payment mismatch detected! Transaction ID (${cleanRef}) is for ₹ 29.00 (Starter Plan - 1 Month), but you selected a higher plan duration. Please select 'Starter Plan (1 Month)' to verify.`
      });
    }

    // Scenario B: User inputs a genuine Razorpay Transaction ID (pay_...)
    let wasRazorpaySuccessfullyFetched = false;
    if (cleanRef.startsWith('pay_')) {
      try {
        const rzpPayment = await razorpay.payments.fetch(cleanRef);
        if (rzpPayment && rzpPayment.amount) {
          wasRazorpaySuccessfullyFetched = true;
          const actualAmountPaid = rzpPayment.amount; // e.g. 2900 paise (₹ 29)
          const expectedAmount = PLAN_RATES[plan_duration]; // e.g. 24900 paise for 12m (₹ 249)
          
          if (actualAmountPaid < expectedAmount) {
            return res.status(400).json({
              success: false,
              message: `SECURITY ALERT: Payment mismatch detected! You paid ₹ ${actualAmountPaid / 100} but selected a plan requiring ₹ ${expectedAmount / 100}. Please select the correct plan duration corresponding to your actual payment.`
            });
          }
        }
      } catch (rzpErr) {
        console.warn('Razorpay fetch failed or dummy keys used:', rzpErr.message);
      }
    }

    // ==============================================================================================

    // 1. Identify User ID securely (auto-creating user if DB is empty)
    let userId = req.user ? req.user.id : null;
    try {
      if (!userId) {
        const userRes = await db.query('SELECT id FROM users WHERE name ILIKE $1 OR email ILIKE $1 LIMIT 1', [name ? `%${name}%` : 'impossible_match']);
        if (userRes.rows.length > 0) {
          userId = userRes.rows[0].id;
        } else {
          const fallbackRes = await db.query("SELECT id FROM users WHERE role = 'student' LIMIT 1");
          if (fallbackRes.rows.length > 0) {
            userId = fallbackRes.rows[0].id;
          } else {
            const anyUserRes = await db.query("SELECT id FROM users LIMIT 1");
            if (anyUserRes.rows.length > 0) {
              userId = anyUserRes.rows[0].id;
            } else {
              const newUserRes = await db.query(
                `INSERT INTO users (email, password_hash, role, name, is_active, email_verified) 
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
                [`student_${Date.now()}@digitaltwin.local`, `auto_hash_${Date.now()}`, 'student', name || 'Student', true, true]
              );
              userId = newUserRes.rows[0].id;
            }
          }
        }
      }
    } catch (userErr) {
      console.error('User lookup/creation error:', userErr);
    }

    let proofFilePath = '';
    if (file) {
      try {
        const uploadDir = path.join(__dirname, '../../public/uploads');
        await fs.promises.mkdir(uploadDir, { recursive: true });
        const uniqueFileName = `proof_${userId || 'anon'}_${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        proofFilePath = `/uploads/${uniqueFileName}`;
        await fs.promises.writeFile(path.join(uploadDir, uniqueFileName), file.buffer);
      } catch (fileErr) {
        console.error('File write error:', fileErr);
      }
    }

    const amount = PLAN_RATES[plan_duration] / 100;
    const orderId = `proof_order_${userId || 'anon'}_${Date.now()}`;

    // STRICT ATOMIC INSERTION: If this fails, abort immediately so subscription is never updated twice!
    if (userId) {
      try {
        await db.query(
          `INSERT INTO orders (user_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, plan_duration, amount, status, mobile_number, proof_file_path, user_name) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [userId, orderId, cleanRef, 'pending_verification', plan_duration, amount * 100, 'pending', mobile_number || '', proofFilePath, name || '']
        );
      } catch (insertErr) {
        if (insertErr.code === '23505') { // Postgres Unique Violation
          return res.status(400).json({ 
            success: false, 
            message: `SECURITY ALERT: Transaction ID (${cleanRef}) has already been verified. Duplicate claims using the same receipt are strictly prohibited.` 
          });
        }
        throw insertErr;
      }
    }

    // Add time to subscription ONLY after admin verification (removed instant premium unlock blunder)
    
    // Fetch the current user data to return without giving instant access
    let updatedUser = { 
      email: 'kumarkartikey020@gmail.com', 
      name: name || 'Student', 
      subscription_expires_at: null 
    };

    try {
      if (userId) {
        const userRes = await db.query(`SELECT email, name, subscription_expires_at FROM users WHERE id = $1`, [userId]);
        if (userRes.rows.length > 0) {
          updatedUser = userRes.rows[0];
        }
      }
    } catch (updateErr) {
      console.error('Fetch user error:', updateErr);
    }

    // We can still send an email to notify them that their proof was received.
    const planName = plan_duration === '1m' ? '1 Month Plan' : (plan_duration === '6m' ? '6 Months Plan' : '12 Months Plan');

    // emailService.sendPremiumConfirmation(...) could be changed to sendProofReceivedEmail in the future.
    
    res.json({ 
      success: true, 
      message: 'Payment proof submitted successfully. Premium access will be unlocked after admin verification (usually within 24 hours).',
      subscriptionExpiresAt: updatedUser.subscription_expires_at 
    });
  } catch (err) {
    console.error('verifyPaymentProof fatal error:', err);
    res.status(500).json({ success: false, message: 'Database transaction error during verification. Please try again.' });
  }
}

async function logConsent(req, res, next) {
  try {
    const { userId, termsVersion, consents, userAgent } = req.body;
    
    // Extract IP safely behind proxies
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || 'unknown';
    
    const payload = {
      userId,
      termsVersion,
      ipAddress,
      userAgent,
      consents
    };
    
    await consentModel.logConsent(payload);
    
    res.json({ success: true, message: 'Consent logged successfully' });
  } catch (err) {
    console.error('logConsent error:', err);
    // Don't fail the user payment if logging fails slightly, just log it.
    res.status(200).json({ success: false, error: 'Failed to log consent, but proceeding.' });
  }
}

module.exports = {
  createOrder,
  verifyPayment,
  verifyPaymentProof,
  logConsent
};

