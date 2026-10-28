const express = require('express');
const router = express.Router();
const careerReadinessController = require('../controllers/careerReadinessController');
const { authenticate, authenticateOptional } = require('../middlewares/auth');

// Profile Endpoints
router.get('/profile', authenticate, careerReadinessController.getProfile);
router.put('/profile', authenticate, careerReadinessController.updateProfile);

// Assessment Questions (Previewable if optional, but personalized for student)
router.get('/questions', authenticateOptional, careerReadinessController.getQuestions);

// Assessment Submission & Historical Reassessment
router.post('/assessment/submit', authenticate, careerReadinessController.submitAssessment);
router.get('/assessment/history', authenticate, careerReadinessController.getAssessmentHistory);

// Personalized Roadmap & Practical Tasks
router.get('/roadmap', authenticate, careerReadinessController.getRoadmap);
router.patch('/tasks/:taskId', authenticate, careerReadinessController.updateTask);

// Overall Career Readiness Progress Summary
router.get('/progress', authenticate, careerReadinessController.getProgress);

// Task 1: Natural Return Moments / Resume Next Action
router.get('/resume', authenticate, careerReadinessController.getReturnMoment);

// Task 2: Weekly Progress Summary
router.get('/weekly-summary', authenticate, careerReadinessController.getWeeklySummary);

// Task 3: Meaningful Milestones
router.get('/milestones', authenticate, careerReadinessController.getMilestones);

// Task 4: Notifications & Preferences
router.get('/notifications/preferences', authenticate, careerReadinessController.getNotificationPreferences);
router.put('/notifications/preferences', authenticate, careerReadinessController.updateNotificationPreferences);
// Unsubscribe is accessible without login using cryptographic token in email link
router.get('/notifications/unsubscribe', careerReadinessController.unsubscribeNotifications);

// Task 5: Retention Analytics Telemetry
router.post('/analytics/event', authenticate, careerReadinessController.trackClientEvent);
router.get('/analytics/retention-summary', authenticate, careerReadinessController.getRetentionSummary);

module.exports = router;
