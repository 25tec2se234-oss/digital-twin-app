const { pool } = require('../db');
const OrgNotificationService = require('./orgNotificationService');

class OrgCertificationService {

  static _generateCertNumber() {
    return 'DTV-CERT-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  /**
   * Evaluates if a user is eligible for a specific certificate template.
   * This logic runs purely server-side.
   */
  static async checkEligibility(organizationId, userId, templateId) {
    const templateQuery = `SELECT * FROM org_certificate_templates WHERE organization_id = $1 AND id = $2 AND status = 'ACTIVE'`;
    const templateRes = await pool.query(templateQuery, [organizationId, templateId]);
    
    if (templateRes.rows.length === 0) {
      throw new Error('Certificate template not found or inactive');
    }
    const template = templateRes.rows[0];
    const rules = template.eligibility_rules;
    
    let isEligible = true;
    let failureReasons = [];

    // Rule 1: Course Completion
    if (rules.course_id) {
        const enrollQuery = `
          SELECT status FROM org_course_enrollments 
          WHERE organization_id = $1 AND user_id = $2 AND course_id = $3
        `;
        const enrollRes = await pool.query(enrollQuery, [organizationId, userId, rules.course_id]);
        
        if (enrollRes.rows.length === 0 || enrollRes.rows[0].status !== 'COMPLETED') {
            isEligible = false;
            failureReasons.push('Required course is not completed');
        }
    }

    // Rule 2: Minimum Assessment Score
    if (rules.assessment_id && rules.min_score) {
        const assessQuery = `
          SELECT MAX(score) as best_score FROM org_assessment_attempts
          WHERE organization_id = $1 AND user_id = $2 AND assessment_id = $3 AND status = 'COMPLETED'
        `;
        const assessRes = await pool.query(assessQuery, [organizationId, userId, rules.assessment_id]);
        
        const bestScore = parseFloat(assessRes.rows[0]?.best_score) || 0;
        if (bestScore < rules.min_score) {
            isEligible = false;
            failureReasons.push(`Best score ${bestScore} is below required minimum ${rules.min_score}`);
        }
    }

    return { isEligible, failureReasons, template };
  }

  /**
   * Attempts to issue a certificate to a user if eligible.
   */
  static async issueCertificate(organizationId, userId, templateId) {
    // 1. Server-side eligibility check
    const { isEligible, failureReasons, template } = await this.checkEligibility(organizationId, userId, templateId);

    if (!isEligible) {
        throw new Error(`Ineligible for certificate: ${failureReasons.join(', ')}`);
    }

    // 2. Check if already issued
    const checkQuery = `SELECT id FROM org_certificates WHERE organization_id = $1 AND user_id = $2 AND template_id = $3`;
    const checkRes = await pool.query(checkQuery, [organizationId, userId, templateId]);
    if (checkRes.rows.length > 0) {
        throw new Error('Certificate has already been issued to this user');
    }

    // 3. Issue certificate
    const certNumber = this._generateCertNumber();
    
    let validUntil = null;
    if (template.validity_days) {
        const d = new Date();
        d.setDate(d.getDate() + template.validity_days);
        validUntil = d.toISOString();
    }

    const insertQuery = `
      INSERT INTO org_certificates 
        (organization_id, user_id, template_id, course_id, certificate_number, valid_until)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const courseId = template.eligibility_rules.course_id || null;
    const res = await pool.query(insertQuery, [organizationId, userId, templateId, courseId, certNumber, validUntil]);
    const certificate = res.rows[0];

    // 4. Trigger Notification
    await OrgNotificationService.publishNotification(
        organizationId,
        userId,
        'CERTIFICATE',
        'HIGH',
        'New Certificate Issued',
        `Congratulations! You have been issued a new certificate: ${template.name}`,
        `/certificates/${certificate.id}`,
        `cert_issue_${certificate.id}`
    );

    return certificate;
  }

  /**
   * Public/Secure verification of a certificate by its unique number.
   * Exposes only safe display fields.
   */
  static async verifyCertificate(certificateNumber) {
    const query = `
      SELECT 
        c.certificate_number,
        c.status,
        c.issued_at,
        c.valid_until,
        t.name as certificate_name,
        u.first_name,
        u.last_name,
        o.name as organization_name
      FROM org_certificates c
      JOIN org_certificate_templates t ON c.template_id = t.id
      JOIN users u ON c.user_id = u.id
      JOIN organizations o ON c.organization_id = o.id
      WHERE c.certificate_number = $1
    `;
    const res = await pool.query(query, [certificateNumber]);
    if (res.rows.length === 0) {
        return { isValid: false, message: 'Certificate not found' };
    }

    const cert = res.rows[0];
    const isExpired = cert.valid_until && new Date(cert.valid_until) < new Date();
    
    let currentStatus = cert.status;
    if (currentStatus === 'ACTIVE' && isExpired) {
        currentStatus = 'EXPIRED'; // computed state
    }

    return {
        isValid: currentStatus === 'ACTIVE',
        status: currentStatus,
        certificate_name: cert.certificate_name,
        holder_name: `${cert.first_name} ${cert.last_name}`,
        organization_name: cert.organization_name,
        issued_at: cert.issued_at,
        valid_until: cert.valid_until
    };
  }

  static async revokeCertificate(organizationId, certificateId, reason) {
    const query = `
      UPDATE org_certificates 
      SET status = 'REVOKED', revoked_at = CURRENT_TIMESTAMP, revoke_reason = $1
      WHERE organization_id = $2 AND id = $3
      RETURNING *
    `;
    const res = await pool.query(query, [reason, organizationId, certificateId]);
    if (res.rows.length === 0) {
        throw new Error('Certificate not found');
    }
    const cert = res.rows[0];

    await OrgNotificationService.publishNotification(
        organizationId,
        cert.user_id,
        'CERTIFICATE',
        'CRITICAL',
        'Certificate Revoked',
        `Your certificate has been revoked. Reason: ${reason}`,
        null,
        `cert_revoke_${cert.id}`
    );

    return cert;
  }
}

module.exports = OrgCertificationService;
