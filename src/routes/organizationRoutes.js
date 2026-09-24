const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const { requireOrganizationMembership, requirePermission } = require('../middlewares/rbac');
const {
  createOrganization,
  updateOrganization,
  getMyOrganizations,
  getOrganizationById,
  getOrganizationMembers,
  addOrganizationMember,
  updateOrganizationMemberRole,
  updateOrganizationMemberStatus,
  removeOrganizationMember
} = require('../controllers/organizationController');

// All organization routes require authentication
router.use(authenticate);

// Global organization routes
router.post('/', createOrganization);
router.get('/', getMyOrganizations);

const {
  createInvitation,
  getInvitations,
  revokeInvitation,
  acceptInvitation
} = require('../controllers/invitationController');

// Accept invitation (global route, but user must be authenticated)
router.post('/invitations/accept', authenticate, acceptInvitation);

// Tenant-specific routes (Require organization membership)
router.use('/:organizationId', requireOrganizationMembership);

router.get('/:organizationId', requirePermission('organization.read'), getOrganizationById);
router.put('/:organizationId', requirePermission('organization.settings.update'), updateOrganization);

router.get(
  '/:organizationId/members', 
  requirePermission('organization.users.read'), 
  getOrganizationMembers
);

router.post(
  '/:organizationId/members', 
  requirePermission('organization.users.create'), 
  addOrganizationMember
);

router.put(
  '/:organizationId/members/:userId/role',
  requirePermission('organization.users.update'),
  updateOrganizationMemberRole
);

router.put(
  '/:organizationId/members/:userId/status',
  requirePermission('people.activate'),
  updateOrganizationMemberStatus
);

router.delete(
  '/:organizationId/members/:userId',
  requirePermission('organization.users.delete'),
  removeOrganizationMember
);

const orgCourseRoutes = require('./orgCourseRoutes');
router.use('/:organizationId/courses', orgCourseRoutes);

const { getMyEnrollments } = require('../controllers/orgCourseEnrollmentController');
router.get('/:organizationId/my-enrollments', getMyEnrollments);

// Assessment Questions (Question Bank)
const orgQuestionRoutes = require('./orgQuestionRoutes');
router.use('/:organizationId/questions', orgQuestionRoutes);

// Roles
const orgRoleRoutes = require('./orgRoleRoutes');
router.use('/:organizationId/roles', orgRoleRoutes);

// Requirements
const orgRequirementRoutes = require('./orgRequirementRoutes');
router.use('/:organizationId/requirements', orgRequirementRoutes);
const { getTargetRequirements } = require('../controllers/orgRequirementController');
router.get('/:organizationId/targets/:targetType/:targetId/requirements', requirePermission('organization.read'), getTargetRequirements);

// Competencies
const orgCompetencyRoutes = require('./orgCompetencyRoutes');
router.use('/:organizationId/competencies', orgCompetencyRoutes);

const orgCompetencyLevelRoutes = require('./orgCompetencyLevelRoutes');
router.use('/:organizationId/competency-levels', orgCompetencyLevelRoutes);

// Skills
const orgSkillRoutes = require('./orgSkillRoutes');
router.use('/:organizationId/skills', orgSkillRoutes);

// Evidence
const orgCompetencyEvidenceRoutes = require('./orgCompetencyEvidenceRoutes');
router.use('/:organizationId/trainees/:traineeId/evidence', orgCompetencyEvidenceRoutes);

// Snapshots/Profiles & Skill Gaps
const orgCompetencySnapshotRoutes = require('./orgCompetencySnapshotRoutes');
router.use('/:organizationId/trainees/:traineeId', orgCompetencySnapshotRoutes);

const orgSkillGapRoutes = require('./orgSkillGapRoutes');
router.use('/:organizationId/trainees/:traineeId', orgSkillGapRoutes);

// Org-wide Training Needs
const { getOrganizationTrainingNeeds } = require('../controllers/orgSkillGapController');
router.get('/:organizationId/training-needs', requirePermission('organization.read'), getOrganizationTrainingNeeds);

// Invitations
router.post(
  '/:organizationId/invitations',
  requirePermission('organization.invitations.create'),
  createInvitation
);

router.get(
  '/:organizationId/invitations',
  requirePermission('organization.invitations.read'),
  getInvitations
);

router.post(
  '/:organizationId/invitations/:inviteId/revoke',
  requirePermission('organization.invitations.revoke'),
  revokeInvitation
);

const orgTrainerMatchRoutes = require('./orgTrainerMatchRoutes');
router.use('/:organizationId', orgTrainerMatchRoutes);

const orgAnalyticsRoutes = require('./orgAnalyticsRoutes');
router.use('/:organizationId/analytics', orgAnalyticsRoutes);

const orgNotificationRoutes = require('./orgNotificationRoutes');
router.use('/:organizationId/notifications', orgNotificationRoutes);

const orgKnowledgeRoutes = require('./orgKnowledgeRoutes');
router.use('/:organizationId/knowledge', orgKnowledgeRoutes);

const orgCertificationRoutes = require('./orgCertificationRoutes');
router.use('/:organizationId/certificates', orgCertificationRoutes);

const orgDigitalTwinRoutes = require('./orgDigitalTwinRoutes');
router.use('/:organizationId/digital-twin', orgDigitalTwinRoutes);

const enterpriseAiRoutes = require('./enterpriseAiRoutes');
router.use('/:organizationId/ai', enterpriseAiRoutes);

module.exports = router;
