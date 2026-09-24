const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  updateProgress,
  getMyCourseProgress
} = require('../controllers/orgResourceProgressController');

router.put('/:resourceId/progress', updateProgress);
router.get('/my-progress', getMyCourseProgress);

module.exports = router;
