const db = require('../db');

// --- Offer Company Settings ---
async function getCompanySettings() {
  const result = await db.query('SELECT * FROM offer_company_settings ORDER BY created_at DESC LIMIT 1');
  return result.rows[0];
}

async function upsertCompanySettings(settings) {
  const current = await getCompanySettings();
  if (current) {
    const result = await db.query(
      `UPDATE offer_company_settings 
       SET company_name = $1, brand_name = $2, legal_entity_name = $3, company_logo = $4, company_address = $5, company_email = $6, company_phone = $7, website = $8, cin = $9, gstin = $10, tagline = $11, offer_prefix = $12, updated_at = now() 
       WHERE id = $13 RETURNING *`,
      [settings.company_name, settings.brand_name, settings.legal_entity_name, settings.company_logo, settings.company_address, settings.company_email, settings.company_phone, settings.website, settings.cin, settings.gstin, settings.tagline, settings.offer_prefix, current.id]
    );
    return result.rows[0];
  } else {
    const result = await db.query(
      `INSERT INTO offer_company_settings (company_name, brand_name, legal_entity_name, company_logo, company_address, company_email, company_phone, website, cin, gstin, tagline, offer_prefix) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [settings.company_name, settings.brand_name, settings.legal_entity_name, settings.company_logo, settings.company_address, settings.company_email, settings.company_phone, settings.website, settings.cin, settings.gstin, settings.tagline, settings.offer_prefix]
    );
    return result.rows[0];
  }
}

// --- Offer Signatories ---
async function listSignatories() {
  const result = await db.query('SELECT * FROM offer_signatories WHERE is_active = true ORDER BY display_order ASC, created_at ASC');
  return result.rows;
}

async function createSignatory(data) {
  const result = await db.query(
    'INSERT INTO offer_signatories (name, designation, email, phone, signature_url, signature_type, display_order) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [data.name, data.designation, data.email, data.phone, data.signature_url, data.signature_type, data.display_order || 0]
  );
  return result.rows[0];
}

async function updateSignatory(id, data) {
  const result = await db.query(
    'UPDATE offer_signatories SET name = $1, designation = $2, email = $3, phone = $4, signature_url = $5, signature_type = $6, display_order = $7, updated_at = now() WHERE id = $8 RETURNING *',
    [data.name, data.designation, data.email, data.phone, data.signature_url, data.signature_type, data.display_order || 0, id]
  );
  return result.rows[0];
}

async function deleteSignatory(id) {
  await db.query('UPDATE offer_signatories SET is_active = false, updated_at = now() WHERE id = $1', [id]);
}

// --- Offer Letters ---
async function listOffers(options) {
  const { search, status, limit = 50, offset = 0 } = options;
  let query = 'SELECT id, offer_id, candidate_details, position_details, status, created_at, verification_token, count(*) OVER() AS total FROM offer_letters WHERE 1=1';
  const params = [];
  
  if (search) {
    params.push(`%${search}%`);
    query += ` AND (offer_id ILIKE $${params.length} OR candidate_details->>'name' ILIKE $${params.length} OR candidate_details->>'email' ILIKE $${params.length} OR position_details->>'designation' ILIKE $${params.length})`;
  }
  if (status) {
    params.push(status);
    query += ` AND status = $${params.length}`;
  }
  
  params.push(limit);
  const limitIdx = params.length;
  params.push(offset);
  const offsetIdx = params.length;
  
  query += ` ORDER BY created_at DESC LIMIT $${limitIdx} OFFSET $${offsetIdx}`;
  
  const result = await db.query(query, params);
  const total = result.rows[0] ? Number(result.rows[0].total) : 0;
  
  return { offers: result.rows, total };
}

async function getOfferById(id) {
  const result = await db.query('SELECT * FROM offer_letters WHERE id = $1', [id]);
  return result.rows[0];
}

async function getOfferByVerificationToken(token) {
  const result = await db.query(`
    SELECT ol.*, s.name as signatory_name, s.designation as signatory_designation, s.signature_url, s.signature_type
    FROM offer_letters ol 
    LEFT JOIN offer_signatories s ON ol.signatory_id = s.id 
    WHERE ol.verification_token = $1
  `, [token]);
  return result.rows[0];
}

async function generateNextOfferId(prefix = 'DTV-OFR') {
  const year = new Date().getFullYear();
  const basePrefix = `${prefix}-${year}`;
  const result = await db.query(
    "SELECT offer_id FROM offer_letters WHERE offer_id LIKE $1 ORDER BY created_at DESC LIMIT 1",
    [`${basePrefix}-%`]
  );
  
  let nextSeq = 1;
  if (result.rows.length > 0) {
    const lastId = result.rows[0].offer_id;
    const parts = lastId.split('-');
    const lastSeq = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastSeq)) {
      nextSeq = lastSeq + 1;
    }
  }
  
  const formattedSeq = String(nextSeq).padStart(4, '0');
  return `${basePrefix}-${formattedSeq}`;
}

async function createOffer(data, userId) {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  let offerId = data.offer_id;
  if (!offerId) {
    const settings = await getCompanySettings();
    const prefix = settings ? settings.offer_prefix : 'DTV-OFR';
    offerId = await generateNextOfferId(prefix);
  }

  const result = await db.query(
    `INSERT INTO offer_letters (
      offer_id, verification_token, candidate_details, position_details, 
      compensation_details, responsibilities, clauses, status, 
      signatory_id, template_id, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
    [
      offerId, token, data.candidate_details, data.position_details,
      data.compensation_details, data.responsibilities, data.clauses,
      data.status || 'DRAFT', data.signatory_id, data.template_id, userId
    ]
  );
  
  await logAuditAction(result.rows[0].id, 'CREATED', userId);
  return result.rows[0];
}

async function updateOffer(id, data, userId) {
  const result = await db.query(
    `UPDATE offer_letters SET 
      candidate_details = $1, position_details = $2, compensation_details = $3, 
      responsibilities = $4, clauses = $5, status = $6, signatory_id = $7, 
      template_id = $8, updated_at = now() 
    WHERE id = $9 RETURNING *`,
    [
      data.candidate_details, data.position_details, data.compensation_details, 
      data.responsibilities, data.clauses, data.status, data.signatory_id, 
      data.template_id, id
    ]
  );
  
  await logAuditAction(id, 'UPDATED', userId);
  return result.rows[0];
}

async function updateOfferStatus(id, status, userId, extraData = {}) {
  let query = 'UPDATE offer_letters SET status = $1, updated_at = now()';
  const params = [status];
  let paramIdx = 2;

  if (status === 'REVOKED') {
    query += `, revoked_at = now()`;
  } else if (status === 'ACCEPTED') {
    query += `, accepted_at = now(), accepted_ip = $${paramIdx++}, accepted_signature = $${paramIdx++}`;
    params.push(extraData.ip, extraData.signature);
  } else if (status === 'DECLINED') {
    query += `, declined_at = now(), declined_reason = $${paramIdx++}`;
    params.push(extraData.reason);
  }

  query += ` WHERE id = $${paramIdx} RETURNING *`;
  params.push(id);

  const result = await db.query(query, params);
  await logAuditAction(id, status, userId, extraData.ip);
  return result.rows[0];
}

async function deleteOffer(id, userId) {
  // Hard delete or soft delete? The schema seems to support soft delete if we use status 'REVOKED' maybe, 
  // but to truly emulate Firebase deleteDoc we will just DELETE it.
  await db.query('DELETE FROM offer_letters WHERE id = $1', [id]);
  await logAuditAction(id, 'DELETED', userId);
}

async function logAuditAction(offerId, action, userId, ipAddress = null) {
  await db.query(
    'INSERT INTO offer_audit_logs (offer_id, action, user_id, ip_address) VALUES ($1, $2, $3, $4)',
    [offerId, action, userId, ipAddress]
  );
}

async function getAuditLogs(offerId) {
  const result = await db.query(
    'SELECT l.*, u.name as user_name, u.email as user_email FROM offer_audit_logs l LEFT JOIN users u ON l.user_id = u.id WHERE l.offer_id = $1 ORDER BY l.created_at DESC',
    [offerId]
  );
  return result.rows;
}

module.exports = {
  getCompanySettings,
  upsertCompanySettings,
  listSignatories,
  createSignatory,
  updateSignatory,
  deleteSignatory,
  listOffers,
  getOfferById,
  getOfferByVerificationToken,
  createOffer,
  updateOffer,
  updateOfferStatus,
  deleteOffer,
  getAuditLogs
};
