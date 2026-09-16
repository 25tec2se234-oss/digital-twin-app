const { pool } = require('../db');

class TeamModel {
  async getAll({ activeOnly = true } = {}) {
    let query = 'SELECT * FROM team_members';
    const params = [];
    if (activeOnly) {
      query += ' WHERE is_active = $1';
      params.push(true);
    }
    query += ' ORDER BY display_order ASC, created_at ASC';
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  async getById(id) {
    const result = await pool.query('SELECT * FROM team_members WHERE id = $1', [id]);
    return result.rows[0];
  }

  async create(data) {
    const { name, role, category, bio, imageUrl, skills, socialLinks, displayOrder, isFeatured, isActive } = data;
    
    const result = await pool.query(
      `INSERT INTO team_members 
        (name, role, category, bio, image_url, skills, social_links, display_order, is_featured, is_active)
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        name,
        role,
        category || null,
        bio || null,
        imageUrl || null,
        skills ? JSON.stringify(skills) : '[]',
        socialLinks ? JSON.stringify(socialLinks) : '{}',
        displayOrder || 0,
        isFeatured || false,
        isActive !== false // defaults to true if undefined
      ]
    );
    return result.rows[0];
  }

  async update(id, data) {
    // Only update provided fields
    const updates = [];
    const values = [];
    let idx = 1;

    const fields = [
      { key: 'name', dbField: 'name' },
      { key: 'role', dbField: 'role' },
      { key: 'category', dbField: 'category' },
      { key: 'bio', dbField: 'bio' },
      { key: 'imageUrl', dbField: 'image_url' },
      { key: 'displayOrder', dbField: 'display_order' },
      { key: 'isFeatured', dbField: 'is_featured' },
      { key: 'isActive', dbField: 'is_active' }
    ];

    fields.forEach(field => {
      if (data[field.key] !== undefined) {
        updates.push(`${field.dbField} = $${idx}`);
        values.push(data[field.key]);
        idx++;
      }
    });

    if (data.skills !== undefined) {
      updates.push(`skills = $${idx}`);
      values.push(JSON.stringify(data.skills));
      idx++;
    }

    if (data.socialLinks !== undefined) {
      updates.push(`social_links = $${idx}`);
      values.push(JSON.stringify(data.socialLinks));
      idx++;
    }

    if (updates.length === 0) return this.getById(id);

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    
    values.push(id);
    const query = `UPDATE team_members SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async delete(id) {
    const result = await pool.query('DELETE FROM team_members WHERE id = $1 RETURNING id', [id]);
    return result.rows.length > 0;
  }
}

module.exports = new TeamModel();
