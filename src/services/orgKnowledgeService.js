const { pool } = require('../db');
const OrgNotificationService = require('./orgNotificationService');

class OrgKnowledgeService {
  static async createResource(organizationId, userId, data) {
    const { title, description, content_type, resource_url, visibility, related_competency_id, related_course_id } = data;
    
    const query = `
      INSERT INTO org_knowledge_resources 
        (organization_id, created_by, title, description, content_type, resource_url, visibility, related_competency_id, related_course_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const res = await pool.query(query, [
      organizationId, userId, title, description, content_type, resource_url, visibility || 'ORGANIZATION',
      related_competency_id || null, related_course_id || null
    ]);

    return res.rows[0];
  }

  static async publishResource(organizationId, resourceId) {
    const query = `
      UPDATE org_knowledge_resources
      SET status = 'PUBLISHED', published_at = CURRENT_TIMESTAMP
      WHERE organization_id = $1 AND id = $2
      RETURNING *
    `;
    const res = await pool.query(query, [organizationId, resourceId]);
    return res.rows[0];
  }

  static async listResources(organizationId, filters = {}) {
    let query = `SELECT * FROM org_knowledge_resources WHERE organization_id = $1 AND status = 'PUBLISHED'`;
    const params = [organizationId];
    
    if (filters.related_competency_id) {
        params.push(filters.related_competency_id);
        query += ` AND related_competency_id = $${params.length}`;
    }

    if (filters.content_type) {
        params.push(filters.content_type);
        query += ` AND content_type = $${params.length}`;
    }

    query += ` ORDER BY published_at DESC`;
    const res = await pool.query(query, params);
    return res.rows;
  }

  /**
   * Recommends knowledge resources based on a specific competency gap.
   */
  static async recommendForCompetency(organizationId, competencyId) {
      const query = `
        SELECT * FROM org_knowledge_resources
        WHERE organization_id = $1 
          AND status = 'PUBLISHED' 
          AND related_competency_id = $2
        ORDER BY published_at DESC
        LIMIT 5
      `;
      const res = await pool.query(query, [organizationId, competencyId]);
      return res.rows;
  }
}

module.exports = OrgKnowledgeService;
