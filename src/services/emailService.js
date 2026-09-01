const nodemailer = require('nodemailer');
const env = require('../config/env');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
    },
    tls: { rejectUnauthorized: false }
});

const canSendEmail = () => env.BREVO_API_KEY || (env.SMTP_USER && env.SMTP_PASS);

async function sendHtmlEmail(toEmail, subject, htmlContent, fromName = 'Digital Twin') {
    if (env.BREVO_API_KEY) {
        // Use Brevo REST API
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: fromName, email: env.SMTP_USER || 'no-reply@digitaltwinvrs.com' },
                to: [{ email: toEmail }],
                subject: subject,
                htmlContent: htmlContent
            })
        });
        
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Brevo API Error: ${response.status} - ${errorData}`);
        }
        return await response.json();
    } else {
        // Fallback to Nodemailer (Gmail)
        const mailOptions = {
            from: `"${fromName}" <${env.SMTP_USER}>`,
            to: toEmail,
            subject: subject,
            html: htmlContent
        };
        return await transporter.sendMail(mailOptions);
    }
}

async function sendVerificationEmail(toEmail, otpCode) {
    if (env.NODE_ENV === 'test') return;
    if (!canSendEmail()) {
        console.warn('⚠️ Email credentials not set. Email delivery is disabled. (Check environment variables)');
        console.log(`\n📧 MOCK EMAIL TO: ${toEmail}\n🔒 OTP CODE: ${otpCode}\n`);
        return;
    }

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
            <h2 style="color: #2a7de1; text-align: center;">Welcome to Digital Twin!</h2>
            <p style="font-size: 16px; color: #333;">Please use the verification code below to activate your account and verify your email address.</p>
            <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 25px 0;">
                <strong style="font-size: 32px; letter-spacing: 5px; color: #000;">${otpCode}</strong>
            </div>
            <p style="font-size: 14px; color: #666;">This code will expire in 10 minutes.</p>
            <p style="font-size: 14px; color: #666;">If you did not request this code, please ignore this email.</p>
            <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 30px 0;" />
            <p style="font-size: 12px; color: #aaa; text-align: center;">&copy; ${new Date().getFullYear()} Digital Twin. All rights reserved.</p>
        </div>
    `;

    try {
        await sendHtmlEmail(toEmail, 'Verify your Digital Twin Account', html);
        console.log(`Email OTP sent successfully to ${toEmail}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
    }
}

async function sendPasswordResetEmail(toEmail, otpCode) {
    if (env.NODE_ENV === 'test') return;
    if (!canSendEmail()) {
        console.warn('⚠️ Email credentials not set.');
        console.log(`\n📧 MOCK RESET EMAIL TO: ${toEmail}\n🔒 OTP CODE: ${otpCode}\n`);
        return;
    }

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
            <h2 style="color: #e12a2a; text-align: center;">Password Reset Request</h2>
            <p style="font-size: 16px; color: #333;">We received a request to reset your password. Use the code below to reset it.</p>
            <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 25px 0;">
                <strong style="font-size: 32px; letter-spacing: 5px; color: #000;">${otpCode}</strong>
            </div>
            <p style="font-size: 14px; color: #666;">This code will expire in 10 minutes.</p>
            <p style="font-size: 14px; color: #666;">If you did not request this code, please ignore this email.</p>
            <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 30px 0;" />
            <p style="font-size: 12px; color: #aaa; text-align: center;">&copy; ${new Date().getFullYear()} Digital Twin. All rights reserved.</p>
        </div>
    `;

    try {
        await sendHtmlEmail(toEmail, 'Reset your Digital Twin Password', html);
        console.log(`Password reset email sent successfully to ${toEmail}`);
    } catch (error) {
        console.error('Error sending reset email:', error);
        throw error;
    }
}

async function sendWelcomeEmail(toEmail, userName) {
    if (env.NODE_ENV === 'test') return;
    if (!canSendEmail()) {
        console.warn('⚠️ Email credentials not set.');
        console.log(`\n📧 MOCK WELCOME EMAIL TO: ${toEmail}\n👋 Hello ${userName || 'Student'}, welcome to Digital Twin Verse! Your 5-day Premium trial has begun.\n`);
        return;
    }

    const html = `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; background: #0b1322; color: #e8f0f8; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;">
            <div style="text-align: center; padding-bottom: 20px;">
                <h1 style="color: #ffd700; margin: 0; font-size: 28px;">Digital Twin Verse</h1>
                <p style="color: #a78bfa; margin: 5px 0 0 0; font-size: 14px;">AI Career Simulation Platform</p>
            </div>
            <h2 style="color: #ffffff;">Hello ${userName || 'Student'},</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">Welcome to the future of learning! We are thrilled to have you onboard. Your account has been instantly credited with a <strong>5-Day Free Premium Trial</strong>.</p>
            <div style="background: linear-gradient(135deg, rgba(167,139,250,0.15), rgba(232,140,42,0.15)); padding: 20px; border-left: 4px solid #a78bfa; border-radius: 6px; margin: 25px 0;">
                <h3 style="margin: 0 0 10px 0; color: #a78bfa;">🚀 What's Unlocked in Your Trial:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #e2e8f0; line-height: 1.8;">
                    <li><strong>AI Advisor</strong> - Auto-generate custom weekly study plans</li>
                    <li><strong>Career Explorer</strong> - Interactive simulation data</li>
                    <li><strong>Parent Portal Link</strong> - Real-time active tracking for parents</li>
                </ul>
            </div>
            <p style="font-size: 14px; color: #94a3b8;">Log in now to set your goals and explore your personalized dashboard.</p>
            <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 30px 0;" />
            <p style="font-size: 12px; color: #64748b; text-align: center;">&copy; ${new Date().getFullYear()} Digital Twin Verse by DTV Family. All rights reserved.</p>
        </div>
    `;

    try {
        await sendHtmlEmail(toEmail, 'Welcome to Digital Twin Verse! Your 5-Day Premium Trial has Begun', html, 'Digital Twin Verse');
        console.log(`Welcome email sent successfully to ${toEmail}`);
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
}

async function sendPremiumConfirmation(toEmail, userName, planName, amountPaid, expiresAt) {
    if (env.NODE_ENV === 'test') return;
    if (!canSendEmail()) {
        console.warn('⚠️ Email credentials not set.');
        console.log(`\n📧 MOCK PREMIUM CONFIRMATION TO: ${toEmail}\n🎉 Thank you ${userName || 'Student'}, your Premium Subscription (${planName}) is confirmed!\n`);
        return;
    }

    const html = `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; background: #0b1322; color: #e8f0f8; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;">
            <div style="text-align: center; padding-bottom: 20px;">
                <h1 style="color: #ffd700; margin: 0; font-size: 28px;">Digital Twin Verse</h1>
                <span style="background: #e88c2a; color: #000; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: bold;">PREMIUM ACTIVE</span>
            </div>
            <h2 style="color: #ffffff;">Thank you, ${userName || 'Student'}!</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">We have successfully received your payment. Your premium membership has been instantly fully activated across our AI Engine and Career Explorer.</p>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h3 style="margin: 0 0 15px 0; color: #ffd700; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">📋 Subscription Receipt</h3>
                <table style="width: 100%; font-size: 15px; color: #e2e8f0;">
                    <tr><td style="padding: 5px 0; color: #94a3b8;">Plan Duration:</td><td style="text-align: right; font-weight: bold;">${planName}</td></tr>
                    <tr><td style="padding: 5px 0; color: #94a3b8;">Amount Paid:</td><td style="text-align: right; font-weight: bold;">₹${amountPaid}</td></tr>
                    <tr><td style="padding: 5px 0; color: #94a3b8;">Active Until:</td><td style="text-align: right; font-weight: bold; color: #2ecc71;">${new Date(expiresAt).toLocaleDateString()}</td></tr>
                </table>
            </div>
            <p style="font-size: 14px; color: #94a3b8;">You now have unhindered access to our advanced AI Advisor, custom study plan generation, and the active Parent Portal link.</p>
            <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 30px 0;" />
            <p style="font-size: 12px; color: #64748b; text-align: center;">&copy; ${new Date().getFullYear()} Digital Twin Verse by DTV Family. All rights reserved.</p>
        </div>
    `;

    try {
        await sendHtmlEmail(toEmail, '🎉 Premium Subscription Confirmed! Welcome to Digital Twin Verse VIP', html, 'Digital Twin Verse');
        console.log(`Premium confirmation email sent successfully to ${toEmail}`);
    } catch (error) {
        console.error('Error sending premium confirmation email:', error);
    }
}

async function sendParentInvitation(parentEmail, studentName, inviteLink) {
    if (env.NODE_ENV === 'test') return;
    if (!canSendEmail()) {
        console.warn('⚠️ Email credentials not set.');
        console.log(`\n📧 MOCK PARENT INVITATION TO: ${parentEmail}\n🔗 Link: ${inviteLink}\n`);
        return;
    }

    const html = `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; background: #0b1322; color: #e8f0f8; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;">
            <div style="text-align: center; padding-bottom: 20px;">
                <h1 style="color: #ffd700; margin: 0; font-size: 28px;">Digital Twin Verse</h1>
                <p style="color: #a78bfa; margin: 5px 0 0 0; font-size: 14px;">Parent Portal Access</p>
            </div>
            <h2 style="color: #ffffff;">Hello Parent,</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">Your child <strong>${studentName}</strong> has invited you to connect with their personal Digital Twin account to stay updated on their academic goals, focus accuracy, and weekly study routines.</p>
            <div style="text-align: center; margin: 35px 0;">
                <a href="${inviteLink}" style="background: #e88c2a; color: #000000; padding: 14px 32px; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 8px; display: inline-block;">Access Parent Portal</a>
            </div>
            <p style="font-size: 14px; color: #94a3b8;">If the button above does not work, copy and paste this link into your browser:<br><br><a href="${inviteLink}" style="color: #a78bfa;">${inviteLink}</a></p>
            <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 30px 0;" />
            <p style="font-size: 12px; color: #64748b; text-align: center;">&copy; ${new Date().getFullYear()} Digital Twin Verse by DTV Family. All rights reserved.</p>
        </div>
    `;

    try {
        await sendHtmlEmail(parentEmail, `📊 ${studentName} invited you to track their academic journey on Digital Twin Verse`, html, 'Digital Twin Verse');
        console.log(`Parent invitation email sent successfully to ${parentEmail}`);
    } catch (error) {
        console.error('Error sending parent invitation email:', error);
    }
}

async function sendDemoEndingSoonEmail(toEmail, userName, expiryDate) {
    if (env.NODE_ENV === 'test') return;
    if (!canSendEmail()) {
        console.warn('⚠️ Email credentials not set.');
        console.log(`\n📧 MOCK DEMO ENDING SOON EMAIL TO: ${toEmail}\n⚠️ ${userName}, your demo ends on ${expiryDate}!\n`);
        return;
    }

    const html = `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; background: #0b1322; color: #e8f0f8; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;">
            <div style="text-align: center; padding-bottom: 20px;">
                <h1 style="color: #ffd700; margin: 0; font-size: 28px;">Digital Twin Verse</h1>
                <span style="background: #e12a2a; color: #fff; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: bold;">DEMO ENDING</span>
            </div>
            <h2 style="color: #ffffff;">Hello ${userName || 'Student'},</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">Your Premium Demo will expire on <strong>${expiryDate}</strong>.</p>
            <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">Don't lose access to your personalized AI Career Guidance, Study Routines, and Premium Analytics. Renew your subscription today to ensure uninterrupted service.</p>
            <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 30px 0;" />
            <p style="font-size: 12px; color: #64748b; text-align: center;">&copy; ${new Date().getFullYear()} Digital Twin Verse by DTV Family. All rights reserved.</p>
        </div>
    `;

    try {
        await sendHtmlEmail(toEmail, '⚠️ Your Digital Twin Premium Demo is Ending Soon', html, 'Digital Twin Verse');
    } catch (error) {
        console.error('Error sending demo ending email:', error);
    }
}

async function sendSubscriptionExpiredEmail(toEmail, userName) {
    if (env.NODE_ENV === 'test') return;
    if (!canSendEmail()) {
        console.warn('⚠️ Email credentials not set.');
        console.log(`\n📧 MOCK EXPIRED EMAIL TO: ${toEmail}\n⚠️ ${userName}, your subscription has expired!\n`);
        return;
    }

    const html = `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; background: #0b1322; color: #e8f0f8; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;">
            <div style="text-align: center; padding-bottom: 20px;">
                <h1 style="color: #ffd700; margin: 0; font-size: 28px;">Digital Twin Verse</h1>
                <span style="background: #e12a2a; color: #fff; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: bold;">EXPIRED</span>
            </div>
            <h2 style="color: #ffffff;">Hello ${userName || 'Student'},</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">Your Premium Access has expired. Your AI insights, reports, and personalized routines are now locked.</p>
            <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">Log in to the dashboard and upgrade your plan to restore access immediately. Nothing is lost, but you'll need an active plan to view your data.</p>
            <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 30px 0;" />
            <p style="font-size: 12px; color: #64748b; text-align: center;">&copy; ${new Date().getFullYear()} Digital Twin Verse by DTV Family. All rights reserved.</p>
        </div>
    `;

    try {
        await sendHtmlEmail(toEmail, '🔒 Your Digital Twin Premium Access Has Expired', html, 'Digital Twin Verse');
    } catch (error) {
        console.error('Error sending expired email:', error);
    }
}

async function sendParentTestAlert(toEmail, studentName) {
    if (!canSendEmail()) {
        console.warn('⚠️ Email credentials not set.');
        console.log(`\n📧 MOCK TEST ALERT EMAIL TO: ${toEmail}\n`);
        return true;
    }

    const html = `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; background: #0b1322; color: #e8f0f8; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;">
            <div style="text-align: center; padding-bottom: 20px;">
                <h1 style="color: #ffd700; margin: 0; font-size: 28px;">Digital Twin Verse</h1>
                <span style="background: #e12a2a; color: #fff; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: bold;">TEST NOTIFICATION</span>
            </div>
            <h2 style="color: #ffffff;">Hello Parent,</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">This is a test notification to confirm that your email preferences are working correctly.</p>
            <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">You will now receive AI-driven alerts about ${studentName}'s academic performance, behavioral flags, and weekly summaries here.</p>
            <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 30px 0;" />
            <p style="font-size: 12px; color: #64748b; text-align: center;">&copy; ${new Date().getFullYear()} Digital Twin Verse by DTV Family. All rights reserved.</p>
        </div>
    `;

    try {
        await sendHtmlEmail(toEmail, `🚨 Test Alert: AI Academic Trigger for ${studentName}`, html, 'Digital Twin Verse');
        return true;
    } catch (error) {
        console.error('Error sending test alert email:', error);
        throw error;
    }
}

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendWelcomeEmail,
    sendPremiumConfirmation,
    sendParentInvitation,
    sendDemoEndingSoonEmail,
    sendSubscriptionExpiredEmail,
    sendParentTestAlert
};
