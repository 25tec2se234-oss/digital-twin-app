const asyncHandler = require('../middlewares/async');
const ApiError = require('../utils/apiError');
const organizationModel = require('../models/organizationModel');
const auditLogModel = require('../models/auditLogModel');

// @desc    Create a new organization
// @route   POST /api/v1/organizations
// @access  Private (Super Admin or Users with intent to create a tenant)
const createOrganization = asyncHandler(async (req, res, next) => {
  const { name, description, logoUrl } = req.body;

  if (!name) {
    return next(new ApiError(400, 'Organization name is required.'));
  }

  // Generate a basic slug
  const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const uniqueSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const slug = `${baseSlug}-${uniqueSuffix}`;

  const organization = await organizationModel.create({
    name,
    slug,
    description,
    logoUrl
  });

  // Automatically make the creator the ORGANIZATION_ADMIN
  await organizationModel.addMembership(organization.id, req.user.id, 'ORGANIZATION_ADMIN');

  res.status(201).json({
    success: true,
    data: organization
  });
});

// @desc    Get all organizations for the authenticated user
// @route   GET /api/v1/organizations
// @access  Private
const getMyOrganizations = asyncHandler(async (req, res, next) => {
  const organizations = await organizationModel.getUserOrganizations(req.user.id);

  res.status(200).json({
    success: true,
    data: organizations
  });
});

// @desc    Update organization profile
// @route   PUT /api/v1/organizations/:organizationId
// @access  Private (requires organization.settings.update permission)
const updateOrganization = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;
  const { description, logoUrl } = req.body;

  const organization = await organizationModel.update(organizationId, {
    description,
    logoUrl
  });

  if (!organization) {
    return next(new ApiError(404, 'Organization not found or could not be updated.'));
  }

  auditLogModel.createLog(req.user.id, 'ORGANIZATION_UPDATED', 'organization', organizationId, { description, logoUrl }, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    data: organization
  });
});

// @desc    Get organization by ID
// @route   GET /api/v1/organizations/:organizationId
// @access  Private (requires organization membership)
const getOrganizationById = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;

  const organization = await organizationModel.findById(organizationId);
  
  if (!organization) {
    return next(new ApiError(404, 'Organization not found.'));
  }

  res.status(200).json({
    success: true,
    data: organization,
    membership: req.organizationMembership // Attached by the RBAC middleware
  });
});

// @desc    Get organization members
// @route   GET /api/v1/organizations/:organizationId/members
// @access  Private (requires organization.users.read permission)
const getOrganizationMembers = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;
  const limit = parseInt(req.query.limit, 10) || 50;
  const offset = parseInt(req.query.offset, 10) || 0;

  const result = await organizationModel.getOrganizationMembers(organizationId, limit, offset);

  res.status(200).json({
    success: true,
    data: result.members,
    pagination: {
      total: result.total,
      limit,
      offset
    }
  });
});

// @desc    Invite/Add a user to the organization
// @route   POST /api/v1/organizations/:organizationId/members
// @access  Private (requires organization.users.create permission)
const addOrganizationMember = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;
  const { userId, role } = req.body;

  if (!userId || !role) {
    return next(new ApiError(400, 'User ID and Role are required.'));
  }

  const validRoles = ['ORGANIZATION_ADMIN', 'TRAINER', 'TRAINEE'];
  if (!validRoles.includes(role)) {
    return next(new ApiError(400, 'Invalid role specified.'));
  }

  const membership = await organizationModel.addMembership(organizationId, userId, role);

  res.status(201).json({
    success: true,
    data: membership
  });
});

// @desc    Update a member's role
// @route   PUT /api/v1/organizations/:organizationId/members/:userId/role
// @access  Private (requires organization.users.update permission)
const updateOrganizationMemberRole = asyncHandler(async (req, res, next) => {
  const { organizationId, userId } = req.params;
  const { role } = req.body;

  if (!role) {
    return next(new ApiError(400, 'Role is required.'));
  }

  const validRoles = ['ORGANIZATION_ADMIN', 'TRAINER', 'TRAINEE'];
  if (!validRoles.includes(role)) {
    return next(new ApiError(400, 'Invalid role specified.'));
  }

  // Prevent self-demotion if you are the only admin
  if (req.user.id === userId && role !== 'ORGANIZATION_ADMIN') {
    return next(new ApiError(400, 'Cannot change your own role from Admin.'));
  }

  const membership = await organizationModel.updateMemberRole(organizationId, userId, role);

  if (!membership) {
    return next(new ApiError(404, 'Membership not found.'));
  }

  auditLogModel.createLog(req.user.id, 'ROLE_CHANGED', 'organization_membership', membership.id, { new_role: role }, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    data: membership
  });
});

// @desc    Update a member's status (Activate/Deactivate)
// @route   PUT /api/v1/organizations/:organizationId/members/:userId/status
// @access  Private (requires people.activate permission)
const updateOrganizationMemberStatus = asyncHandler(async (req, res, next) => {
  const { organizationId, userId } = req.params;
  const { status } = req.body;

  if (!status) {
    return next(new ApiError(400, 'Status is required.'));
  }

  const validStatuses = ['Active', 'Inactive', 'Suspended'];
  if (!validStatuses.includes(status)) {
    return next(new ApiError(400, 'Invalid status specified.'));
  }

  if (req.user.id === userId) {
    return next(new ApiError(400, 'Cannot change your own status.'));
  }

  const membership = await organizationModel.updateMemberStatus(organizationId, userId, status);

  if (!membership) {
    return next(new ApiError(404, 'Membership not found.'));
  }

  auditLogModel.createLog(req.user.id, 'USER_STATUS_UPDATED', 'organization_membership', membership.id, { new_status: status }, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    data: membership
  });
});

// @desc    Remove a member from the organization
// @route   DELETE /api/v1/organizations/:organizationId/members/:userId
// @access  Private (requires organization.users.delete permission)
const removeOrganizationMember = asyncHandler(async (req, res, next) => {
  const { organizationId, userId } = req.params;

  if (req.user.id === userId) {
    return next(new ApiError(400, 'Cannot remove yourself from the organization.'));
  }

  const membership = await organizationModel.removeMember(organizationId, userId);

  if (!membership) {
    return next(new ApiError(404, 'Membership not found.'));
  }

  auditLogModel.createLog(req.user.id, 'USER_REMOVED', 'organization_membership', membership.id, { user_id: userId }, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    message: 'Member removed from organization successfully.'
  });
});

exports.getOrganizationMemberProfile = asyncHandler(async (req, res, next) => {
  const { organizationId, userId } = req.params;
  
  // Verify membership
  const membership = await organizationModel.getMembership(organizationId, userId);
  if (!membership) {
    return next(new ApiError(404, 'User is not a member of this organization'));
  }

  // Get basic user profile (from main DB, reuse DTV logic where possible)
  const userResult = await db.query('SELECT id, name, email, avatar_url, phone_number FROM users WHERE id = $1', [userId]);
  const user = userResult.rows[0];

  // Get Department and Org Role
  const deptResult = await db.query(
    'SELECT d.id, d.name FROM org_departments d JOIN org_user_departments ud ON d.id = ud.department_id WHERE ud.user_id = $1 AND ud.organization_id = $2',
    [userId, organizationId]
  );
  
  const roleResult = await db.query(
    'SELECT r.id, r.name FROM org_roles r JOIN org_user_roles ur ON r.id = ur.role_id WHERE ur.user_id = $1 AND ur.organization_id = $2',
    [userId, organizationId]
  );

  // Get Competencies & Gaps
  const gapsResult = await db.query(
    'SELECT gap_type, priority, skill_id, competency_id, required_level, current_level, score_gap FROM org_skill_gaps WHERE trainee_id = $1 AND organization_id = $2 AND is_current = true',
    [userId, organizationId]
  );

  // Get Assigned Training
  const trainingResult = await db.query(
    'SELECT n.id, n.status, n.priority, c.title FROM org_training_needs n LEFT JOIN org_training_recommendations r ON n.id = r.training_need_id LEFT JOIN org_courses c ON r.course_id = c.id WHERE n.trainee_id = $1 AND n.organization_id = $2',
    [userId, organizationId]
  );

  // Get Competency Matrix (Required from role vs Actual from snapshots)
  const matrixResult = await db.query(`
    SELECT 
      c.name as competency_name,
      r.required_level,
      r.required_score,
      s.level_name as current_level,
      s.score as current_score,
      s.evidence_count,
      s.confidence,
      (s.score - r.required_score) as gap_score
    FROM org_competency_requirements r
    JOIN org_competencies c ON r.competency_id = c.id
    LEFT JOIN org_competency_snapshots s 
      ON s.competency_id = r.competency_id 
      AND s.trainee_id = $1 
      AND s.is_current = true
    WHERE r.target_type = 'ROLE' 
      AND r.organization_id = $2
      AND r.target_id IN (
        SELECT role_id FROM org_user_roles WHERE user_id = $1 AND organization_id = $2
      )
  `, [userId, organizationId]);

  res.status(200).json({
    success: true,
    data: {
      profile: user,
      membership: membership,
      department: deptResult.rows[0] || null,
      jobRole: roleResult.rows[0] || null,
      skillGaps: gapsResult.rows,
      trainingNeeds: trainingResult.rows,
      competencyMatrix: matrixResult.rows
    }
  });
});

module.exports = {
  createOrganization,
  updateOrganization,
  getMyOrganizations,
  getOrganizationById,
  getOrganizationMembers,
  addOrganizationMember,
  updateOrganizationMemberRole,
  updateOrganizationMemberStatus,
  removeOrganizationMember,
  getOrganizationMemberProfile: exports.getOrganizationMemberProfile
};
