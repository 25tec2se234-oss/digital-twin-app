const db = require('../db');
const logger = require('../config/logger');

async function logConsent(data) {
  try {
    const text = `
      INSERT INTO payment_consents(
        user_id, terms_version, ip_address, user_agent, 
        refund_accepted, dispute_accepted, fraud_logging_accepted,
        age_and_parental_consent
      ) 
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, created_at
    `;
    const values = [
      data.userId || 'guest',
      data.termsVersion || 'v1.0',
      data.ipAddress || 'unknown',
      data.userAgent || 'unknown',
      data.consents?.refundPolicyAccepted === true,
      data.consents?.disputePolicyAccepted === true,
      data.consents?.fraudLoggingAccepted === true,
      data.consents?.ageAndParentalConsent === true
    ];
    
    const result = await db.query(text, values);
    return result.rows[0];
  } catch (err) {
    logger.error('Error logging payment consent to database:', { error: err.message, stack: err.stack });
    throw err;
  }
}

module.exports = {
  logConsent
};
