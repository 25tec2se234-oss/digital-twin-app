const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const orgRoleModel = require('../models/orgRoleModel');
const auditLogModel = require('../models/auditLogModel');

// @desc    Create a role
// @route   POST /api/v1/organizations/:organizationId/roles
// @access  Private (Admin)
exports.createRole = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;

  const role = await orgRoleModel.create(organizationId, req.user.id, req.body);

  auditLogModel.createLog(req.user.id, 'ROLE_CREATED', 'org_roles', role.id, { name: role.name }, req.ip, req.headers['user-agent']);

  res.status(201).json({
    success: true,
    data: role
  });
});

// @desc    Get all roles
// @route   GET /api/v1/organizations/:organizationId/roles
// @access  Private
exports.getRoles = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;
  const { status, department } = req.query;

  const roles = await orgRoleModel.findAll(organizationId, { status, department });

  res.status(200).json({
    success: true,
    count: roles.length,
    data: roles
  });
});

// @desc    Get single role
// @route   GET /api/v1/organizations/:organizationId/roles/:id
// @access  Private
exports.getRole = asyncHandler(async (req, res, next) => {
  const { organizationId, id } = req.params;

  const role = await orgRoleModel.findById(id, organizationId);
  if (!role) {
    return next(new ApiError(404, 'Role not found.'));
  }

  res.status(200).json({
    success: true,
    data: role
  });
});

// @desc    Update role
// @route   PUT /api/v1/organizations/:organizationId/roles/:id
// @access  Private (Admin)
exports.updateRole = asyncHandler(async (req, res, next) => {
  const { organizationId, id } = req.params;

  const updatedRole = await orgRoleModel.update(id, organizationId, req.body);

  auditLogModel.createLog(req.user.id, 'ROLE_UPDATED', 'org_roles', id, { fields: Object.keys(req.body) }, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    data: updatedRole
  });
});

// @desc    Archive role
// @route   DELETE /api/v1/organizations/:organizationId/roles/:id
// @access  Private (Admin)
exports.archiveRole = asyncHandler(async (req, res, next) => {
  const { organizationId, id } = req.params;

  await orgRoleModel.archive(id, organizationId);

  auditLogModel.createLog(req.user.id, 'ROLE_ARCHIVED', 'org_roles', id, {}, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    data: {}
  });
});
