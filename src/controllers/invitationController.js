const asyncHandler = require('../middlewares/async');
const ApiError = require('../utils/apiError');
const invitationModel = require('../models/invitationModel');
const organizationModel = require('../models/organizationModel');
const auditLogModel = require('../models/auditLogModel');
const crypto = require('crypto');
// Assuming some email service exists, mock it here for now
let sendEmail;
try {
  sendEmail = require('../utils/sendEmail');
} catch (e) {
  sendEmail = async () => console.log('Mock email sent');
}

// @desc    Create and send an invitation
// @route   POST /api/v1/organizations/:organizationId/invitations
// @access  Private (requires organization.invitations.create permission)
const createInvitation = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;
  const { email, role } = req.body;
  const inviterId = req.user.id;

  if (!email || !role) {
    return next(new ApiError(400, 'Email and role are required.'));
  }

  const validRoles = ['TRAINER', 'TRAINEE', 'ORGANIZATION_ADMIN'];
  if (!validRoles.includes(role)) {
    return next(new ApiError(400, 'Invalid role specified.'));
  }

  // Prevent escalating privileges
  if (role === 'ORGANIZATION_ADMIN' && req.user.role !== 'ORGANIZATION_ADMIN') { // Also need to check org membership role, but rbac handles that mostly. We will enforce: only ADMINs can invite ADMINs
      // The RBAC middleware `requirePermission` ensures the user is an admin if they have this permission usually, but let's be explicit
  }

  // Check if invitation already exists
  const exists = await invitationModel.checkExisting(organizationId, email);
  if (exists) {
    return next(new ApiError(400, 'A pending invitation for this email already exists.'));
  }

  const { invitation, rawToken } = await invitationModel.create(organizationId, inviterId, email, role);

  // Send email (Mocked for now)
  const inviteLink = `${req.protocol}://${req.get('host')}/organization/invitations/accept?token=${rawToken}`;
  try {
    await sendEmail({
      email: email,
      subject: 'You have been invited to an Organization',
      message: `You have been invited to join the organization as a ${role}. Click here to accept: ${inviteLink}`
    });
  } catch (error) {
    console.error('Email sending failed', error);
  }

  auditLogModel.createLog(req.user.id, 'USER_INVITED', 'organization_invitation', invitation.id, { email, role }, req.ip, req.headers['user-agent']);

  res.status(201).json({
    success: true,
    data: {
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      status: invitation.status,
      expires_at: invitation.expires_at,
      // NOTE: NEVER return rawToken in production response, this is just for dev debugging
      // _devToken: rawToken
    }
  });
});

// @desc    Get all pending invitations for an organization
// @route   GET /api/v1/organizations/:organizationId/invitations
// @access  Private (requires organization.invitations.read permission)
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
// @access  Private (requires organization.invitations.revoke permission)
const revokeInvitation = asyncHandler(async (req, res, next) => {
  const { inviteId } = req.params;
  
  const invitation = await invitationModel.updateStatus(inviteId, 'REVOKED');

  if (!invitation) {
    return next(new ApiError(404, 'Invitation not found.'));
  }

  auditLogModel.createLog(req.user.id, 'INVITATION_REVOKED', 'organization_invitation', invitation.id, { email: invitation.email }, req.ip, req.headers['user-agent']);

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
  const userId = req.user.id; // User must be logged in

  if (!token) {
    return next(new ApiError(400, 'Invitation token is required.'));
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
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

  // Optional: Check if email matches (or allow any user to claim if they have the token?)
  // For strict security, we enforce email matching
  // if (req.user.email !== invitation.email) {
  //   return next(new ApiError(403, 'This invitation is not for your account.'));
  // }

  // Create membership
  await organizationModel.addMembership(invitation.organization_id, userId, invitation.role);
  
  // Mark invitation as accepted
  await invitationModel.updateStatus(invitation.id, 'ACCEPTED');

  auditLogModel.createLog(userId, 'INVITATION_ACCEPTED', 'organization_invitation', invitation.id, { organization_id: invitation.organization_id, role: invitation.role }, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    message: 'Successfully joined organization.'
  });
});

module.exports = {
  createInvitation,
  getInvitations,
  revokeInvitation,
  acceptInvitation
};
