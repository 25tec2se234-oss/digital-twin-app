const express = require('express');
const router = express.Router({ mergeParams: true });
const { requireOrganizationMembership, requirePermission } = require('../middlewares/rbac');
const orgKnowledgeController = require('../controllers/orgKnowledgeController');

const multer = require('multer');
const path = require('path');
const upload = multer({ 
  dest: process.env.UPLOAD_DIR || 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 } 
});
router.use(requireOrganizationMembership);

// AI Knowledge Search
router.post('/ai-search', orgKnowledgeController.aiSearch);

// List/Search published resources
router.get('/', orgKnowledgeController.listResources);
router.get('/recommend/competency/:competencyId', orgKnowledgeController.recommendResources);

// Download specific resource file securely
router.get('/:resourceId/download', orgKnowledgeController.downloadResource);

// Admin / Content Creators only
router.use(requirePermission('organization.courses.manage')); 

// We will use the same multer config here
const uploadMw = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('SECURITY ALERT: Invalid file type. Only PDFs, Docs, and TXT files are allowed for Knowledge Hub.'), false);
    }
  }
});

router.post('/', uploadMw.single('file'), orgKnowledgeController.createResource);
router.post('/:resourceId/versions', uploadMw.single('file'), orgKnowledgeController.createVersion);
router.put('/:resourceId/publish', orgKnowledgeController.publishResource);
router.put('/:resourceId/archive', orgKnowledgeController.archiveResource);

module.exports = router;
