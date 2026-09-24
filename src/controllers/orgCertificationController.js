const OrgCertificationService = require('../services/orgCertificationService');
const { pool } = require('../db');

exports.getTemplates = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const result = await pool.query(
      'SELECT * FROM org_certificate_templates WHERE organization_id = $1 AND status != $2 ORDER BY created_at DESC',
      [organizationId, 'ARCHIVED']
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching certificate templates:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch certificate templates' });
  }
};

exports.getMyCertificates = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT c.*, t.name as template_name FROM org_certificates c
       JOIN org_certificate_templates t ON c.template_id = t.id
       WHERE c.organization_id = $1 AND c.user_id = $2
       ORDER BY c.issued_at DESC`,
      [organizationId, userId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch certificates' });
  }
};

exports.issueCertificate = async (req, res) => {
  try {
    const { organizationId, templateId } = req.params;
    // Assuming a user requests their own certificate or an admin requests it for them.
    const targetUserId = req.body.user_id || req.user.id; 
    
    const certificate = await OrgCertificationService.issueCertificate(organizationId, targetUserId, templateId);
    res.status(201).json({ success: true, data: certificate });
  } catch (error) {
    console.error('Error issuing certificate:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.verifyCertificate = async (req, res) => {
  try {
    // This endpoint can be public, so it does not rely on req.user or organizationId matching
    const { certificateNumber } = req.params;
    const verification = await OrgCertificationService.verifyCertificate(certificateNumber);
    
    if (!verification.isValid && !verification.holder_name) {
         return res.status(404).json({ success: false, message: 'Certificate not found or verification information is invalid.' });
    }
    
    res.json({ success: true, data: verification });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    res.status(500).json({ success: false, message: 'Failed to verify certificate' });
  }
};

exports.revokeCertificate = async (req, res) => {
  try {
    const { organizationId, certificateId } = req.params;
    const { reason } = req.body;
    
    if (!reason) {
        return res.status(400).json({ success: false, message: 'Revocation reason is required' });
    }

    const cert = await OrgCertificationService.revokeCertificate(organizationId, certificateId, reason);
    res.json({ success: true, data: cert });
  } catch (error) {
    console.error('Error revoking certificate:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to revoke certificate' });
  }
};
