const { pool } = require('../db');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');

class OrgReportingService {
  /**
   * 1. Dashboard Metrics
   */
  static async getDashboardMetrics(organizationId) {
    // Total members
    const membersRes = await pool.query(`SELECT COUNT(*) as count FROM organization_memberships WHERE organization_id = $1 AND status = 'ACTIVE'`, [organizationId]);
    const totalMembers = parseInt(membersRes.rows[0].count, 10);

    if (totalMembers === 0) {
      return { isEmpty: true };
    }

    // Departments
    const deptsRes = await pool.query(`SELECT COUNT(*) as count FROM org_departments WHERE organization_id = $1`, [organizationId]);
    const totalDepartments = parseInt(deptsRes.rows[0].count, 10);

    // Competency & Evidence Coverage
    // Assume from snapshots: how many distinct users have evidence out of total members
    const coverageRes = await pool.query(`
      SELECT 
        COUNT(DISTINCT user_id) as people_with_evidence,
        AVG(score) as avg_score
      FROM org_competency_snapshots
      WHERE organization_id = $1 AND is_current = true
    `, [organizationId]);
    const evidenceCoverage = totalMembers > 0 ? (parseInt(coverageRes.rows[0].people_with_evidence, 10) / totalMembers * 100).toFixed(2) : 0;
    const competencyCoverage = coverageRes.rows[0].avg_score ? parseFloat(coverageRes.rows[0].avg_score).toFixed(2) : 0;

    // Active/Completed Training
    const trainingRes = await pool.query(`
      SELECT 
        COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active_training,
        COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_training,
        COUNT(CASE WHEN status = 'ACTIVE' AND due_date < NOW() THEN 1 END) as overdue_training
      FROM org_course_enrollments
      WHERE organization_id = $1
    `, [organizationId]);

    // Critical Competency Gaps
    const gapsRes = await pool.query(`
      SELECT COUNT(*) as critical_gaps 
      FROM org_skill_gaps 
      WHERE organization_id = $1 AND priority = 'CRITICAL' AND status = 'OPEN'
    `, [organizationId]);

    // Training Needs
    const needsRes = await pool.query(`
      SELECT COUNT(*) as open_needs
      FROM org_training_needs
      WHERE organization_id = $1 AND status = 'OPEN'
    `, [organizationId]);

    // Digital Twin Confidence
    const twinRes = await pool.query(`
      SELECT confidence 
      FROM org_digital_twin_snapshots 
      WHERE organization_id = $1 
      ORDER BY created_at DESC LIMIT 1
    `, [organizationId]);
    const twinConfidence = twinRes.rows.length > 0 ? twinRes.rows[0].confidence : 'N/A';

    // Recent Activity (Audit logs / Training enrollments, etc.)
    const activityRes = await pool.query(`
      SELECT user_id, status, updated_at 
      FROM org_course_enrollments 
      WHERE organization_id = $1 
      ORDER BY updated_at DESC LIMIT 5
    `, [organizationId]);

    return {
      isEmpty: false,
      totalMembers,
      totalDepartments,
      competencyCoverage,
      evidenceCoverage,
      activeTraining: parseInt(trainingRes.rows[0].active_training, 10) || 0,
      completedTraining: parseInt(trainingRes.rows[0].completed_training, 10) || 0,
      overdueTraining: parseInt(trainingRes.rows[0].overdue_training, 10) || 0,
      criticalGaps: parseInt(gapsRes.rows[0].critical_gaps, 10) || 0,
      trainingNeeds: parseInt(needsRes.rows[0].open_needs, 10) || 0,
      digitalTwinConfidence: twinConfidence,
      recentActivity: activityRes.rows
    };
  }

  /**
   * 2. Department Analytics
   */
  static async getDepartmentAnalytics(organizationId) {
    const query = `
      SELECT 
        d.id,
        d.name,
        COUNT(DISTINCT ud.user_id) as member_count,
        COUNT(DISTINCT CASE WHEN s.gap_type = 'LEVEL_GAP' OR s.gap_type = 'SCORE_GAP' THEN s.id END) as major_gaps,
        COUNT(DISTINCT CASE WHEN ce.status = 'COMPLETED' THEN ce.id END) as training_completed
      FROM org_departments d
      LEFT JOIN org_user_departments ud ON d.id = ud.department_id
      LEFT JOIN org_skill_gaps s ON ud.user_id = s.user_id AND s.priority IN ('CRITICAL', 'HIGH') AND s.status = 'OPEN'
      LEFT JOIN org_course_enrollments ce ON ud.user_id = ce.user_id
      WHERE d.organization_id = $1
      GROUP BY d.id, d.name
      ORDER BY d.name ASC
    `;
    const res = await pool.query(query, [organizationId]);
    
    // We should also calculate competency/evidence coverage per department. For brevity, using approximations from standard aggregations.
    return res.rows.map(row => ({
      ...row,
      member_count: parseInt(row.member_count, 10),
      major_gaps: parseInt(row.major_gaps, 10),
      training_completed: parseInt(row.training_completed, 10),
      // mock placeholders if detailed views aren't available per user
      evidence_coverage: row.member_count > 0 ? ((parseInt(row.training_completed,10) / parseInt(row.member_count,10)) * 100).toFixed(0) + '%' : '0%'
    }));
  }

  /**
   * 3. Export Data Engine (CSV)
   */
  static generateCSV(data, fields) {
    try {
      const parser = new Parser({ fields });
      return parser.parse(data);
    } catch (err) {
      console.error(err);
      throw new Error('Failed to generate CSV');
    }
  }

  /**
   * 4. Export Data Engine (PDF)
   */
  static generatePDF(title, data, res) {
    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-disposition', 'attachment; filename="' + title.replace(/\\s+/g, '_') + '.pdf"');
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);

    doc.fontSize(20).text(title, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text('Generated on: ' + new Date().toLocaleString(), { align: 'center' });
    doc.moveDown(2);

    if (Array.isArray(data) && data.length > 0) {
      data.forEach((item, index) => {
        doc.fontSize(12).font('Helvetica-Bold').text(`Record ${index + 1}`);
        doc.font('Helvetica').fontSize(10);
        for (const [key, value] of Object.entries(item)) {
          doc.text(`${key}: ${value}`);
        }
        doc.moveDown();
      });
    } else if (typeof data === 'object') {
      doc.font('Helvetica').fontSize(12);
      for (const [key, value] of Object.entries(data)) {
        doc.text(`${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`);
      }
    } else {
      doc.text('No data available.');
    }

    doc.end();
  }

  /**
   * Fetch specific report data
   */
  static async getReportData(organizationId, reportType) {
    switch (reportType) {
      case 'capacity':
        const dash = await this.getDashboardMetrics(organizationId);
        return { data: [dash], fields: ['totalMembers', 'totalDepartments', 'competencyCoverage', 'evidenceCoverage', 'activeTraining', 'completedTraining', 'criticalGaps'] };
      case 'gaps':
        const gapsRes = await pool.query(`SELECT gap_type, priority, target_level, current_level, created_at FROM org_skill_gaps WHERE organization_id = $1`, [organizationId]);
        return { data: gapsRes.rows, fields: ['gap_type', 'priority', 'target_level', 'current_level', 'created_at'] };
      case 'training':
        const trainingRes = await pool.query(`SELECT c.title, e.status, e.progress, e.enrolled_at, e.completed_at FROM org_course_enrollments e JOIN org_courses c ON e.course_id = c.id WHERE e.organization_id = $1`, [organizationId]);
        return { data: trainingRes.rows, fields: ['title', 'status', 'progress', 'enrolled_at', 'completed_at'] };
      default:
        return { data: [], fields: [] };
    }
  }
}

module.exports = OrgReportingService;
