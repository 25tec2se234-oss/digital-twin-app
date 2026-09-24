const express = require('express');
const router = express.Router({ mergeParams: true });
const { requirePermission } = require('../middlewares/rbac');
const {
  enrollTrainee,
  getCourseEnrollments
} = require('../controllers/orgCourseEnrollmentController');

router.post('/', requirePermission('course.enroll'), enrollTrainee);
router.get('/', requirePermission('course.read'), getCourseEnrollments);

module.exports = router;
