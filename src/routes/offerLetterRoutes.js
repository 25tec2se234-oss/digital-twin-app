const express = require('express');
const router = express.Router();
const offerLetterController = require('../controllers/offerLetterController');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');

// --- Public Endpoints ---
router.get('/verify/:token', offerLetterController.verifyOffer);
router.post('/verify/:token/accept', offerLetterController.acceptOffer);
router.post('/verify/:token/decline', offerLetterController.declineOffer);

// --- Protected Endpoints (Admin Only) ---
router.use(authenticate);
router.use(authorizeAdmin);

// Settings
router.get('/settings', offerLetterController.getSettings);
router.put('/settings', offerLetterController.updateSettings);

// Signatories
router.get('/signatories', offerLetterController.listSignatories);
router.post('/signatories', offerLetterController.createSignatory);
router.put('/signatories/:id', offerLetterController.updateSignatory);
router.delete('/signatories/:id', offerLetterController.deleteSignatory);

// Offers
router.get('/', offerLetterController.listOffers);
router.post('/', offerLetterController.createOffer);
router.get('/:id', offerLetterController.getOffer);
router.put('/:id', offerLetterController.updateOffer);
router.post('/:id/status', offerLetterController.changeOfferStatus);
router.delete('/:id', offerLetterController.deleteOffer);
router.get('/:id/audit', offerLetterController.getAuditLogs);

module.exports = router;
