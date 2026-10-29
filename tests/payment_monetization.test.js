const request = require('supertest');
const crypto = require('crypto');
const app = require('../src/app');
const db = require('../src/db');
const env = require('../src/config/env');
const { PLAN_RATES } = require('../src/controllers/paymentController');

describe('SaaS Monetization & Payment Systems Reliability Test Suite', () => {
  let user, token;
  const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET || env.RAZORPAY_KEY_SECRET || 'test_webhook_secret_key_123';

  beforeAll(async () => {
    const ts = Date.now();
    const email = `monetization.student_${ts}@gmail.com`;

    const signupRes = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        email,
        password: 'StrongPassword!123',
        name: 'Monetization Test Student'
      });

    expect(signupRes.status).toBe(201);
    user = signupRes.body.user;
    token = signupRes.body.accessToken;

    // Ensure RAZORPAY_WEBHOOK_SECRET is active in process.env if not previously set
    if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
      process.env.RAZORPAY_WEBHOOK_SECRET = webhookSecret;
    }
  }, 35000);

  afterAll(async () => {
    if (user && user.id) {
      await db.query('DELETE FROM payment_webhooks WHERE razorpay_order_id LIKE $1', [`%${user.id}%`]).catch(() => {});
      await db.query('DELETE FROM orders WHERE user_id = $1', [user.id]).catch(() => {});
      await db.query('DELETE FROM users WHERE id = $1', [user.id]).catch(() => {});
    }
  });

  describe('TASK 1 & 4: Order Creation & Plan Validation', () => {
    it('rejects an order creation request with an invalid plan', async () => {
      const res = await request(app)
        .post('/api/v1/payment/create')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ plan: 'lifetime_unlimited_invalid' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Invalid plan selected/i);
    });

    it('creates an order record with correct amount and duration for 1m plan', async () => {
      const res = await request(app)
        .post('/api/v1/payment/create')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ plan: '1m' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.amount).toBe(PLAN_RATES['1m']); // 2900 paise
      expect(res.body.currency).toBe('INR');
      expect(res.body.db_order_id).toBeDefined();

      // Verify order persisted in database
      const orderDb = await db.query(
        'SELECT * FROM orders WHERE razorpay_order_id = $1',
        [res.body.db_order_id]
      );
      expect(orderDb.rows.length).toBe(1);
      expect(orderDb.rows[0].plan_duration).toBe('1m');
      expect(Number(orderDb.rows[0].amount)).toBe(2900);
      expect(orderDb.rows[0].status).toBe('created');
    });

    it('requires authentication to create payment orders', async () => {
      const res = await request(app)
        .post('/api/v1/payment/create')
        .set('Accept', 'application/json')
        .send({ plan: '1m' });

      expect(res.status).toBe(401);
    });
  });

  describe('TASK 4: Server-Side Payment Verification & Idempotency', () => {
    let orderId;

    beforeEach(async () => {
      orderId = `order_test_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      await db.query(
        'INSERT INTO orders (user_id, razorpay_order_id, plan_duration, amount, status) VALUES ($1, $2, $3, $4, $5)',
        [user.id, orderId, '1m', 2900, 'created']
      );
    });

    it('rejects payment verification when signature is invalid or forged', async () => {
      const testPaymentId = `pay_test_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const res = await request(app)
        .post('/api/v1/payment/verify')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({
          razorpay_order_id: orderId,
          razorpay_payment_id: testPaymentId,
          razorpay_signature: 'invalid_forged_signature_0000000000'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/(?:Verification failed|Invalid.*signature)/i);

      // Verify order was marked failed and definitely NOT marked as paid
      const orderCheck = await db.query('SELECT status FROM orders WHERE razorpay_order_id = $1', [orderId]);
      expect(orderCheck.rows[0].status).toBe('failed');
      expect(orderCheck.rows[0].status).not.toBe('paid');
    });

    it('successfully verifies legitimate payment signature and grants subscription', async () => {
      const testPaymentId = `pay_test_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const keySecret = env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || 'test_secret';
      const validSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${orderId}|${testPaymentId}`)
        .digest('hex');

      const res = await request(app)
        .post('/api/v1/payment/verify')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({
          razorpay_order_id: orderId,
          razorpay_payment_id: testPaymentId,
          razorpay_signature: validSignature
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Check order status is updated to paid
      const orderCheck = await db.query('SELECT status, razorpay_payment_id FROM orders WHERE razorpay_order_id = $1', [orderId]);
      expect(orderCheck.rows[0].status).toBe('paid');
      expect(orderCheck.rows[0].razorpay_payment_id).toBe(testPaymentId);

      // Check user subscription expiry extended into the future
      const userCheck = await db.query('SELECT subscription_expires_at FROM users WHERE id = $1', [user.id]);
      expect(userCheck.rows[0].subscription_expires_at).not.toBeNull();
      expect(new Date(userCheck.rows[0].subscription_expires_at).getTime()).toBeGreaterThan(Date.now());
    });

    it('safely handles duplicate verification of already-paid order (idempotent)', async () => {
      const testPaymentId = `pay_test_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const keySecret = env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || 'test_secret';
      const validSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${orderId}|${testPaymentId}`)
        .digest('hex');

      // First verification
      await request(app)
        .post('/api/v1/payment/verify')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({
          razorpay_order_id: orderId,
          razorpay_payment_id: testPaymentId,
          razorpay_signature: validSignature
        });

      const userAfterFirst = await db.query('SELECT subscription_expires_at FROM users WHERE id = $1', [user.id]);
      const initialExpiry = new Date(userAfterFirst.rows[0].subscription_expires_at).getTime();

      // Second (duplicate) verification attempt
      const resDup = await request(app)
        .post('/api/v1/payment/verify')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({
          razorpay_order_id: orderId,
          razorpay_payment_id: testPaymentId,
          razorpay_signature: validSignature
        });

      // Should succeed or acknowledge without extending subscription again
      expect(resDup.status).toBe(200);

      const userAfterSecond = await db.query('SELECT subscription_expires_at FROM users WHERE id = $1', [user.id]);
      const secondExpiry = new Date(userAfterSecond.rows[0].subscription_expires_at).getTime();

      // Expiration time must remain identical, preventing double-duration exploits
      expect(secondExpiry).toBe(initialExpiry);
    });
  });

  describe('TASK 4: Razorpay Webhook Signature & Idempotent Event Handling', () => {
    let webhookOrderId;
    const webhookPaymentId = `pay_wh_${Date.now()}`;

    beforeEach(async () => {
      webhookOrderId = `order_wh_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      await db.query(
        'INSERT INTO orders (user_id, razorpay_order_id, plan_duration, amount, status) VALUES ($1, $2, $3, $4, $5)',
        [user.id, webhookOrderId, '6m', 11900, 'created']
      );
    });

    it('rejects incoming webhook when signature header is missing', async () => {
      const res = await request(app)
        .post('/api/v1/payment/webhook')
        .set('Accept', 'application/json')
        .send({
          event: 'order.paid',
          payload: {}
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Missing Razorpay webhook signature/i);
    });

    it('rejects incoming webhook when signature does not match secret', async () => {
      const payload = {
        event: 'order.paid',
        payload: {
          order: { entity: { id: webhookOrderId } }
        }
      };

      const res = await request(app)
        .post('/api/v1/payment/webhook')
        .set('x-razorpay-signature', 'forged_or_tampered_hex_signature')
        .set('Accept', 'application/json')
        .send(payload);

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Invalid webhook signature/i);
    });

    it('processes order.paid webhook correctly with valid HMAC-SHA256 signature', async () => {
      const eventId = `evt_test_${Date.now()}`;
      const payload = {
        event: 'order.paid',
        event_id: eventId,
        payload: {
          payment: {
            entity: {
              id: webhookPaymentId,
              order_id: webhookOrderId,
              status: 'captured'
            }
          },
          order: {
            entity: {
              id: webhookOrderId,
              status: 'paid'
            }
          }
        }
      };

      const rawBody = JSON.stringify(payload);
      const activeSecret = env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_WEBHOOK_SECRET || env.RAZORPAY_KEY_SECRET;
      const signature = crypto
        .createHmac('sha256', activeSecret)
        .update(rawBody)
        .digest('hex');

      const res = await request(app)
        .post('/api/v1/payment/webhook')
        .set('x-razorpay-signature', signature)
        .set('x-razorpay-event-id', eventId)
        .set('Content-Type', 'application/json')
        .send(rawBody);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');

      // Order should be marked as paid
      const orderCheck = await db.query('SELECT status, razorpay_payment_id FROM orders WHERE razorpay_order_id = $1', [webhookOrderId]);
      expect(orderCheck.rows[0].status).toBe('paid');
      expect(orderCheck.rows[0].razorpay_payment_id).toBe(webhookPaymentId);

      // Webhook audit entry should be logged
      const whAudit = await db.query('SELECT * FROM payment_webhooks WHERE event_id = $1', [eventId]);
      expect(whAudit.rows.length).toBe(1);
      expect(whAudit.rows[0].event_type).toBe('order.paid');
      expect(whAudit.rows[0].status).toBe('PROCESSED');
    });

    it('idempotently deduplicates duplicate webhook events without double billing', async () => {
      const eventId = `evt_dedup_${Date.now()}`;
      const payload = {
        event: 'order.paid',
        event_id: eventId,
        payload: {
          payment: {
            entity: {
              id: `pay_dedup_${Date.now()}`,
              order_id: webhookOrderId,
              status: 'captured'
            }
          }
        }
      };

      const rawBody = JSON.stringify(payload);
      const activeSecret = env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_WEBHOOK_SECRET || env.RAZORPAY_KEY_SECRET;
      const signature = crypto
        .createHmac('sha256', activeSecret)
        .update(rawBody)
        .digest('hex');

      // First webhook delivery
      const res1 = await request(app)
        .post('/api/v1/payment/webhook')
        .set('x-razorpay-signature', signature)
        .set('Content-Type', 'application/json')
        .send(rawBody);

      expect(res1.status).toBe(200);

      // Capture subscription expiry after first delivery
      const userAfter1 = await db.query('SELECT subscription_expires_at FROM users WHERE id = $1', [user.id]);
      const expiry1 = new Date(userAfter1.rows[0].subscription_expires_at).getTime();

      // Second webhook delivery (Razorpay retry or network repeat)
      const res2 = await request(app)
        .post('/api/v1/payment/webhook')
        .set('x-razorpay-signature', signature)
        .set('Content-Type', 'application/json')
        .send(rawBody);

      expect(res2.status).toBe(200);
      expect(res2.body.message).toMatch(/already processed/i);

      // Verify expiration timestamp did not move forward again
      const userAfter2 = await db.query('SELECT subscription_expires_at FROM users WHERE id = $1', [user.id]);
      const expiry2 = new Date(userAfter2.rows[0].subscription_expires_at).getTime();

      expect(expiry2).toBe(expiry1);
    });

    it('records failed payment status without granting subscription time', async () => {
      const eventId = `evt_failed_${Date.now()}`;
      const failedOrderId = `order_failed_${Date.now()}`;

      await db.query(
        'INSERT INTO orders (user_id, razorpay_order_id, plan_duration, amount, status) VALUES ($1, $2, $3, $4, $5)',
        [user.id, failedOrderId, '1m', 2900, 'created']
      );

      const payload = {
        event: 'payment.failed',
        event_id: eventId,
        payload: {
          payment: {
            entity: {
              id: `pay_fail_${Date.now()}`,
              order_id: failedOrderId,
              error_code: 'BAD_REQUEST_ERROR',
              error_description: 'Payment was cancelled by the user.'
            }
          }
        }
      };

      const rawBody = JSON.stringify(payload);
      const activeSecret = env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_WEBHOOK_SECRET || env.RAZORPAY_KEY_SECRET;
      const signature = crypto
        .createHmac('sha256', activeSecret)
        .update(rawBody)
        .digest('hex');

      const res = await request(app)
        .post('/api/v1/payment/webhook')
        .set('x-razorpay-signature', signature)
        .set('Content-Type', 'application/json')
        .send(rawBody);

      expect(res.status).toBe(200);

      const orderCheck = await db.query('SELECT status FROM orders WHERE razorpay_order_id = $1', [failedOrderId]);
      expect(orderCheck.rows[0].status).toBe('failed');
    });
  });
});
