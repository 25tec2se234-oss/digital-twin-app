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

module.exports = router;
