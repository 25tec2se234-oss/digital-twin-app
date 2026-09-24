const { pool } = require('../db');

class SkillGapService {
  /**
   * Recalculates all gaps for a specific trainee and a specific target (e.g. ROLE).
   */
  static async calculateTraineeGapsForTarget(organizationId, traineeId, targetType, targetId) {
    // 1. Get all active requirements for this target
    const reqQuery = `
      SELECT * FROM org_competency_requirements 
      WHERE organization_id = $1 AND target_type = $2 AND target_id = $3
        AND (effective_until IS NULL OR effective_until > CURRENT_TIMESTAMP)
    `;
    const requirements = await pool.query(reqQuery, [organizationId, targetType, targetId]);

    // 2. Get trainee's current competency and skill snapshots
    const snapQuery = `
      SELECT * FROM org_competency_snapshots
      WHERE organization_id = $1 AND trainee_id = $2 AND is_current = true
    `;
    const snapshotsRes = await pool.query(snapQuery, [organizationId, traineeId]);
    const snapshots = snapshotsRes.rows;

    const currentGaps = [];

    // 3. Compare each requirement against the snapshot
    for (const req of requirements.rows) {
      let currentScore = null;
      let currentLevel = null;
      let evidenceCount = 0;
      let confidence = 'NONE';
      let evidenceRecency = null; // Can be pulled if needed

      // Find matching snapshot
      const snap = snapshots.find(s => 
        (req.competency_id && s.competency_id === req.competency_id) || 
        (req.skill_id && s.skill_id === req.skill_id)
      );

      if (snap) {
        currentScore = parseFloat(snap.score);
        currentLevel = snap.level_name;
        evidenceCount = parseInt(snap.evidence_count);
        confidence = snap.confidence;
        evidenceRecency = snap.snapshot_date;
      }

      // 4. Classify Gap (Phase F)
      let gapType = 'NO_GAP';
      let scoreGap = 0;
      let levelGap = 0; // Negative means below requirement

      if (!snap || evidenceCount === 0) {
        gapType = 'EVIDENCE_GAP';
      } else {
        // Compare scores if required_score exists
        if (req.required_score !== null) {
          const reqScore = parseFloat(req.required_score);
          if (currentScore < reqScore) {
            gapType = 'SCORE_GAP';
            scoreGap = reqScore - currentScore;
          }
        }
        
        // Compare levels if required_level exists
        // (Assuming level_order is available via join or we assume levels map to simple ordered strings, 
        // for real deployment we should look up the order of both current and required levels)
        if (req.required_level && gapType === 'NO_GAP') {
          // This requires a join to org_competency_levels in a real scenario to compare level_order,
          // For now, if there is a level requirement and no score requirement, we might mark it LEVEL_GAP 
          // if we can resolve the order. We'll simplify here and rely on score if both exist.
        }
      }

      // 5. Determine Priority (Phase G)
      let priority = 'NONE';
      if (gapType !== 'NO_GAP') {
        if (req.mandatory) {
          priority = 'CRITICAL';
        } else if (req.importance === 'CRITICAL' || req.importance === 'HIGH') {
          priority = gapType === 'EVIDENCE_GAP' ? 'MEDIUM' : 'HIGH';
        } else {
          priority = 'LOW';
        }
      }

      currentGaps.push({
        requirement: req,
        currentScore,
        currentLevel,
        gapType,
        scoreGap,
        levelGap,
        priority,
        confidence,
        evidenceRecency
      });
    }

    // 6. Save Gaps to Database
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Mark old gaps for this target as not current
      await client.query(`
        UPDATE org_skill_gaps 
        SET is_current = false 
        WHERE organization_id = $1 AND trainee_id = $2 AND target_type = $3 AND target_id = $4
      `, [organizationId, traineeId, targetType, targetId]);

      for (const gap of currentGaps) {
        // Insert new gap
        const insertGap = `
          INSERT INTO org_skill_gaps 
            (organization_id, trainee_id, target_type, target_id, competency_id, skill_id, 
             current_score, required_score, score_gap, current_level, required_level, level_gap,
             gap_type, priority, confidence, evidence_recency, is_current, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, true, 'IDENTIFIED')
          RETURNING id
        `;
        const res = await client.query(insertGap, [
          organizationId, traineeId, targetType, targetId, gap.requirement.competency_id, gap.requirement.skill_id,
          gap.currentScore, gap.requirement.required_score, gap.scoreGap, gap.currentLevel, gap.requirement.required_level, gap.levelGap,
          gap.gapType, gap.priority, gap.confidence, gap.evidenceRecency
        ]);
        const gapId = res.rows[0].id;

        // 7. Generate Training Need (Phase H)
        if (gap.gapType !== 'NO_GAP') {
          let reason = '';
          if (gap.gapType === 'EVIDENCE_GAP') {
             reason = `Insufficient validated evidence to determine current competency for requirement.`;
          } else {
             reason = `Current score (${gap.currentScore}) is below the required score (${gap.requirement.required_score}).`;
          }

          const insertNeed = `
            INSERT INTO org_training_needs 
              (organization_id, trainee_id, target_type, target_id, competency_id, skill_id, priority, reason)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
          `;
          const needRes = await client.query(insertNeed, [
            organizationId, traineeId, targetType, targetId, gap.requirement.competency_id, gap.requirement.skill_id,
            gap.priority, reason
          ]);
          
          // Phase I: Course Matching (Asynchronous or inline)
          // We can trigger the matching engine here
          await this.matchCoursesToNeed(client, organizationId, needRes.rows[0].id, gap.requirement.competency_id, gap.requirement.skill_id);
        }
      }

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      console.error('Error calculating gaps:', e);
      throw e;
    } finally {
      client.release();
    }
  }

  // Phase I & J: Match courses to a training need
  static async matchCoursesToNeed(client, organizationId, needId, competencyId, skillId) {
    // 1. Find courses mapped to this skill or competency
    let courseQuery = `
      SELECT DISTINCT c.id, c.title
      FROM org_courses c
    `;
    const params = [organizationId];

    if (skillId) {
      courseQuery += `
        JOIN org_course_skills cs ON c.id = cs.course_id
        WHERE c.organization_id = $1 AND cs.skill_id = $2 AND c.status = 'PUBLISHED'
      `;
      params.push(skillId);
    } else if (competencyId) {
      // Find courses mapped to skills within this competency
      courseQuery += `
        JOIN org_course_skills cs ON c.id = cs.course_id
        JOIN org_competency_skills comp_s ON cs.skill_id = comp_s.skill_id
        WHERE c.organization_id = $1 AND comp_s.competency_id = $2 AND c.status = 'PUBLISHED'
      `;
      params.push(competencyId);
    } else {
      return; // Nothing to match
    }

    const matchingCourses = await client.query(courseQuery, params);

    for (const course of matchingCourses.rows) {
      const insertRec = `
        INSERT INTO org_training_recommendations 
          (organization_id, training_need_id, course_id, matching_score, match_factors)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (training_need_id, course_id) DO NOTHING
      `;
      await client.query(insertRec, [
        organizationId, needId, course.id, 90.00, JSON.stringify({ skill_match: true })
      ]);
    }
  }
}

module.exports = SkillGapService;
