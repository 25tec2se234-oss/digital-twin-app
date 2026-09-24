const { pool } = require('../db');
const ApiError = require('../utils/apiError');

class OrgCompetencyLevelModel {
  static async getFrameworkLevels(organizationId, frameworkCode = 'DEFAULT_5_LEVEL') {
    const query = `
      SELECT * FROM org_competency_levels
      WHERE framework_code = $1 
        AND (organization_id = $2 OR organization_id IS NULL)
      ORDER BY level_order ASC
    `;
    const result = await pool.query(query, [frameworkCode, organizationId]);
    
    // If org has its own levels for this framework, it overrides global.
    // We can filter out global if org-specific exists for the SAME framework.
    const orgLevels = result.rows.filter(r => r.organization_id !== null);
    if (orgLevels.length > 0) return orgLevels;
    
    return result.rows.filter(r => r.organization_id === null);
  }

  static async createOrUpdateLevel(organizationId, data) {
    const { framework_code, level_name, level_order, min_score, max_score, description } = data;

    const query = `
      INSERT INTO org_competency_levels 
        (organization_id, framework_code, level_name, level_order, min_score, max_score, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (organization_id, framework_code, level_order) 
      DO UPDATE SET 
        level_name = EXCLUDED.level_name,
        min_score = EXCLUDED.min_score,
        max_score = EXCLUDED.max_score,
        description = EXCLUDED.description
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      organizationId, 
      framework_code || 'DEFAULT_5_LEVEL', 
      level_name, 
      level_order, 
      min_score, 
      max_score, 
      description
    ]);
    return result.rows[0];
  }

  static async getLevelForScore(organizationId, frameworkCode, score) {
    const levels = await this.getFrameworkLevels(organizationId, frameworkCode);
    if (!levels || levels.length === 0) return null;
    
    const matchedLevel = levels.find(l => score >= parseFloat(l.min_score) && score <= parseFloat(l.max_score));
    
    if (matchedLevel) return matchedLevel;
    
    // Fallback: if score > max, return highest level. if score < min, return lowest level.
    if (score > parseFloat(levels[levels.length - 1].max_score)) return levels[levels.length - 1];
    if (score < parseFloat(levels[0].min_score)) return levels[0];
    
    return null;
  }
}

module.exports = OrgCompetencyLevelModel;
