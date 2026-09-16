const express = require('express');
const teamController = require('../controllers/teamController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.get('/', teamController.getPublicTeam);

// Admin routes
router.use(authenticate, authorize('admin'));
router.get('/admin', teamController.getAdminTeam);
router.post('/', teamController.createMember);
router.put('/:id', teamController.updateMember);
router.patch('/:id/status', teamController.updateMemberStatus);
router.delete('/:id', teamController.deleteMember);

module.exports = router;
