const asyncHandler = require('../middlewares/async');
const ApiError = require('../utils/apiError');
const invitationModel = require('../models/invitationModel');
const organizationModel = require('../models/organizationModel');
const auditLogModel = require('../models/auditLogModel');
const crypto = require('crypto');
const { sendOrgInvitation } = require('../services/emailService');

// @desc    Create and send an invitation
// @route   POST /api/v1/organizations/:organizationId/invitations
// @access  Private (requires members.invite permission)
const createInvitation = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;
  const { email, role } = req.body;
  const inviterId = req.user.id;

  if (!email || !role) {
    return next(new ApiError(400, 'Email and role are required.'));
  }

  // Normalize and validate email
  const normalizedEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return next(new ApiError(400, 'Please provide a valid email address.'));
  }

  const validRoles = ['TRAINER', 'TRAINEE', 'ORGANIZATION_ADMIN'];
  if (!validRoles.includes(role)) {
    return next(new ApiError(400, 'Invalid role specified.'));
  }

  // Check if invitation already exists
  const exists = await invitationModel.checkExisting(organizationId, normalizedEmail);
  if (exists) {
    return next(new ApiError(400, 'A pending invitation for this email already exists.'));
  }

  const org = await organizationModel.findById(organizationId);
  const { invitation, rawToken } = await invitationModel.create(organizationId, inviterId, normalizedEmail, role);

  const inviteLink = `${req.protocol}://${req.get('host')}/organization/invitations/accept?token=${rawToken}`;
  let emailDelivery = { success: false };
  try {
    emailDelivery = await sendOrgInvitation(
      normalizedEmail,
      req.user.name || 'An administrator',
      org?.name || 'Organization',
      role,
      inviteLink
    );
  } catch (error) {
    console.error('Email sending failed:', error.message);
  }

  await auditLogModel.createLog(
    req.user.id,
    organizationId,
    'USER_INVITED',
    'organization_invitation',
    invitation.id,
    { email: normalizedEmail, role, emailDelivered: emailDelivery?.success || false },
    req.ip,
    req.headers['user-agent']
  );

  res.status(201).json({
    success: true,
    data: {
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      status: invitation.status,
      expires_at: invitation.expires_at,
      email_delivered: emailDelivery?.success || false
    }
  });
});

// @desc    Get all pending invitations for an organization
// @route   GET /api/v1/organizations/:organizationId/invitations
// @access  Private (requires members.view permission)
const getInvitations = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;
  
  const invitations = await invitationModel.findPendingByOrganization(organizationId);

  res.status(200).json({
    success: true,
    count: invitations.length,
    data: invitations
  });
});

// @desc    Revoke an invitation
// @route   POST /api/v1/organizations/:organizationId/invitations/:inviteId/revoke
// @access  Private (requires members.invite permission)
const revokeInvitation = asyncHandler(async (req, res, next) => {
  const { organizationId, inviteId } = req.params;
  
  const invitation = await invitationModel.updateStatus(inviteId, 'REVOKED');

  if (!invitation) {
    return next(new ApiError(404, 'Invitation not found.'));
  }

  await auditLogModel.createLog(
    req.user.id,
    organizationId,
    'INVITATION_REVOKED',
    'organization_invitation',
    invitation.id,
    { email: invitation.email },
    req.ip,
    req.headers['user-agent']
  );

  res.status(200).json({
    success: true,
    message: 'Invitation revoked successfully.'
  });
});

// @desc    Accept an invitation
// @route   POST /api/v1/organizations/invitations/accept
// @access  Private (requires standard DTV user authentication)
const acceptInvitation = asyncHandler(async (req, res, next) => {
  const { token } = req.body;
  const userId = req.user.id;

  if (!token) {
    return next(new ApiError(400, 'Invitation token is required.'));
  }

  const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');
  const invitation = await invitationModel.findByTokenHash(tokenHash);

  if (!invitation) {
    return next(new ApiError(400, 'Invalid invitation token.'));
  }

  if (invitation.status !== 'PENDING') {
    return next(new ApiError(400, `Invitation is already ${invitation.status.toLowerCase()}.`));
  }

  if (new Date(invitation.expires_at) < new Date()) {
    await invitationModel.updateStatus(invitation.id, 'EXPIRED');
    return next(new ApiError(400, 'Invitation has expired.'));
  }

  // Enforce recipient email matching for security
  if (req.user.email && req.user.email.toLowerCase() !== invitation.email.toLowerCase()) {
    return next(new ApiError(403, 'This invitation was addressed to a different email address.'));
  }

  // Create membership atomically
  await organizationModel.addMembership(invitation.organization_id, userId, invitation.role);
  
  // Mark invitation as accepted
  await invitationModel.updateStatus(invitation.id, 'ACCEPTED');

  await auditLogModel.createLog(
    userId,
    invitation.organization_id,
    'INVITATION_ACCEPTED',
    'organization_invitation',
    invitation.id,
    { role: invitation.role },
    req.ip,
    req.headers['user-agent']
  );

  res.status(200).json({
    success: true,
    message: 'Successfully joined organization.'
  });
});

// @desc    Resend an invitation
// @route   POST /api/v1/organizations/:organizationId/invitations/:inviteId/resend
// @access  Private (requires members.invite permission)
const resendInvitation = asyncHandler(async (req, res, next) => {
  const { inviteId, organizationId } = req.params;
  
  const invitation = await invitationModel.updateStatus(inviteId, 'PENDING');
  if (!invitation) return next(new ApiError(404, 'Invitation not found.'));
  
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  
  const { pool } = require('../db');
  await pool.query(
    "UPDATE organization_invitations SET token_hash = $1, expires_at = CURRENT_TIMESTAMP + interval '7 days' WHERE id = $2",
    [tokenHash, inviteId]
  );
  
  const org = await organizationModel.findById(organizationId);
  const inviteLink = `${req.protocol}://${req.get('host')}/organization/invitations/accept?token=${rawToken}`;
  
  let emailDelivery = { success: false };
  try {
    emailDelivery = await sendOrgInvitation(
      invitation.email,
      req.user.name || 'An administrator',
      org?.name || 'Organization',
      invitation.role,
      inviteLink
    );
  } catch (error) {
    console.error('Email resending failed:', error.message);
  }
  
  await auditLogModel.createLog(
    req.user.id,
    organizationId,
    'INVITATION_RESENT',
    'organization_invitation',
    invitation.id,
    { email: invitation.email, emailDelivered: emailDelivery?.success || false },
    req.ip,
    req.headers['user-agent']
  );
  
  res.status(200).json({ 
    success: true, 
    message: 'Invitation resent successfully.',
    email_delivered: emailDelivery?.success || false
  });
});

module.exports = {
  createInvitation,
  getInvitations,
  revokeInvitation,
  acceptInvitation,
  resendInvitation
};
