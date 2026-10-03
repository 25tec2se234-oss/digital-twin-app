const asyncHandler = require('../middlewares/async');
const ApiError = require('../utils/apiError');
const orgDepartmentModel = require('../models/orgDepartmentModel');

exports.createDepartment = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;
  const { name, description } = req.body;
  
  if (!name) return next(new ApiError(400, 'Department name is required'));
  
  const dept = await orgDepartmentModel.create(organizationId, { name, description });
  res.status(201).json({ success: true, data: dept });
});

exports.getDepartments = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;
  const depts = await orgDepartmentModel.findByOrganization(organizationId);
  res.status(200).json({ success: true, count: depts.length, data: depts });
});

exports.updateDepartment = asyncHandler(async (req, res, next) => {
  const { organizationId, departmentId } = req.params;
  const dept = await orgDepartmentModel.update(departmentId, organizationId, req.body);
  if (!dept) return next(new ApiError(404, 'Department not found'));
  res.status(200).json({ success: true, data: dept });
});

exports.archiveDepartment = asyncHandler(async (req, res, next) => {
  const { organizationId, departmentId } = req.params;
  const dept = await orgDepartmentModel.archive(departmentId, organizationId);
  if (!dept) return next(new ApiError(404, 'Department not found'));
  res.status(200).json({ success: true, data: dept });
});

exports.assignMember = asyncHandler(async (req, res, next) => {
  const { organizationId, departmentId } = req.params;
  const { userId } = req.body;
  if (!userId) return next(new ApiError(400, 'userId is required'));
  
  await orgDepartmentModel.assignMember(organizationId, departmentId, userId);
  res.status(200).json({ success: true, message: 'Member assigned to department successfully' });
});
