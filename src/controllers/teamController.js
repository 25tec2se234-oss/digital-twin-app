const teamModel = require('../models/teamModel');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

const getPublicTeam = asyncHandler(async (req, res) => {
  const team = await teamModel.getAll({ activeOnly: true });
  res.json({ team });
});

const getAdminTeam = asyncHandler(async (req, res) => {
  const team = await teamModel.getAll({ activeOnly: false });
  res.json({ team });
});

const createMember = asyncHandler(async (req, res) => {
  const data = req.body;
  if (!data.name || !data.role) {
    throw new ApiError(400, 'Name and Role are required.');
  }

  const newMember = await teamModel.create(data);
  res.status(201).json({ member: newMember });
});

const updateMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const existing = await teamModel.getById(id);
  if (!existing) {
    throw new ApiError(404, 'Team member not found.');
  }

  const updatedMember = await teamModel.update(id, data);
  res.json({ member: updatedMember });
});

const deleteMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const existing = await teamModel.getById(id);
  if (!existing) {
    throw new ApiError(404, 'Team member not found.');
  }

  await teamModel.delete(id);
  res.status(204).send();
});

const updateMemberStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isActive, isFeatured } = req.body;
  
  const existing = await teamModel.getById(id);
  if (!existing) {
    throw new ApiError(404, 'Team member not found.');
  }

  const updateData = {};
  if (isActive !== undefined) updateData.isActive = isActive;
  if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

  const updatedMember = await teamModel.update(id, updateData);
  res.json({ member: updatedMember });
});

module.exports = {
  getPublicTeam,
  getAdminTeam,
  createMember,
  updateMember,
  deleteMember,
  updateMemberStatus
};
