const offerLetterModel = require('../models/offerLetterModel');
const ApiError = require('../utils/apiError');
const logger = require('../config/logger');

// --- Company Settings ---
async function getSettings(req, res, next) {
  try {
    let settings = await offerLetterModel.getCompanySettings();
    if (!settings) {
      settings = await offerLetterModel.upsertCompanySettings({
        company_name: 'Digital Twin Verse',
        brand_name: 'DTV',
        offer_prefix: 'DTV-OFR'
      });
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
}

async function updateSettings(req, res, next) {
  try {
    const settings = await offerLetterModel.upsertCompanySettings(req.body);
    res.json(settings);
  } catch (error) {
    next(error);
  }
}

// --- Signatories ---
async function listSignatories(req, res, next) {
  try {
    const signatories = await offerLetterModel.listSignatories();
    res.json(signatories);
  } catch (error) {
    next(error);
  }
}

async function createSignatory(req, res, next) {
  try {
    const signatory = await offerLetterModel.createSignatory(req.body);
    res.status(201).json(signatory);
  } catch (error) {
    next(error);
  }
}

async function updateSignatory(req, res, next) {
  try {
    const signatory = await offerLetterModel.updateSignatory(req.params.id, req.body);
    res.json(signatory);
  } catch (error) {
    next(error);
  }
}

async function deleteSignatory(req, res, next) {
  try {
    await offerLetterModel.deleteSignatory(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

// --- Offers ---
async function listOffers(req, res, next) {
  try {
    const options = {
      search: req.query.search,
      status: req.query.status,
      limit: parseInt(req.query.limit, 10) || 50,
      offset: parseInt(req.query.offset, 10) || 0
    };
    const data = await offerLetterModel.listOffers(options);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function getOffer(req, res, next) {
  try {
    const offer = await offerLetterModel.getOfferById(req.params.id);
    if (!offer) return next(new ApiError(404, 'Offer not found'));
    res.json(offer);
  } catch (error) {
    next(error);
  }
}

async function createOffer(req, res, next) {
  try {
    const offer = await offerLetterModel.createOffer(req.body, req.user.id);
    res.status(201).json(offer);
  } catch (error) {
    next(error);
  }
}

async function updateOffer(req, res, next) {
  try {
    const offer = await offerLetterModel.updateOffer(req.params.id, req.body, req.user.id);
    res.json(offer);
  } catch (error) {
    next(error);
  }
}

async function changeOfferStatus(req, res, next) {
  try {
    const { status } = req.body;
    const allowedStatuses = ['GENERATED', 'SENT', 'REVOKED', 'EXPIRED'];
    if (!allowedStatuses.includes(status)) {
      return next(new ApiError(400, 'Invalid status update via admin API'));
    }
    const offer = await offerLetterModel.updateOfferStatus(req.params.id, status, req.user.id, { ip: req.ip });
    res.json(offer);
  } catch (error) {
    next(error);
  }
}

async function getAuditLogs(req, res, next) {
  try {
    const logs = await offerLetterModel.getAuditLogs(req.params.id);
    res.json(logs);
  } catch (error) {
    next(error);
  }
}

async function deleteOffer(req, res, next) {
  try {
    await offerLetterModel.deleteOffer(req.params.id, req.user.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

// --- Public Endpoints ---
async function verifyOffer(req, res, next) {
  try {
    const offer = await offerLetterModel.getOfferByVerificationToken(req.params.token);
    if (!offer) return next(new ApiError(404, 'Invalid or expired verification link'));
    
    // Do NOT return compensation details or full clauses publicly
    const publicOffer = {
      offer_id: offer.offer_id,
      status: offer.status,
      candidate_name: offer.candidate_details?.name,
      designation: offer.position_details?.designation,
      employment_type: offer.position_details?.employment_type,
      joining_date: offer.position_details?.joining_date,
      created_at: offer.created_at,
      accepted_at: offer.accepted_at,
      revoked_at: offer.revoked_at,
      signatory_name: offer.signatory_name,
      signatory_designation: offer.signatory_designation
    };
    
    // Only return detailed public info if not revoked
    if (offer.status !== 'REVOKED') {
      publicOffer.responsibilities = offer.responsibilities;
      publicOffer.work_mode = offer.position_details?.work_mode;
      publicOffer.location = offer.position_details?.location;
    }

    res.json(publicOffer);
  } catch (error) {
    next(error);
  }
}

async function acceptOffer(req, res, next) {
  try {
    const offer = await offerLetterModel.getOfferByVerificationToken(req.params.token);
    if (!offer) return next(new ApiError(404, 'Invalid verification link'));
    
    if (offer.status === 'REVOKED' || offer.status === 'EXPIRED') {
      return next(new ApiError(400, 'This offer is no longer valid'));
    }
    if (offer.status === 'ACCEPTED' || offer.status === 'DECLINED') {
      return next(new ApiError(400, `Offer already ${offer.status.toLowerCase()}`));
    }

    const { signature } = req.body;
    await offerLetterModel.updateOfferStatus(offer.id, 'ACCEPTED', null, { 
      ip: req.ip,
      signature: signature
    });

    res.json({ success: true, message: 'Offer accepted successfully' });
  } catch (error) {
    next(error);
  }
}

async function declineOffer(req, res, next) {
  try {
    const offer = await offerLetterModel.getOfferByVerificationToken(req.params.token);
    if (!offer) return next(new ApiError(404, 'Invalid verification link'));
    
    if (offer.status === 'REVOKED' || offer.status === 'EXPIRED') {
      return next(new ApiError(400, 'This offer is no longer valid'));
    }
    if (offer.status === 'ACCEPTED' || offer.status === 'DECLINED') {
      return next(new ApiError(400, `Offer already ${offer.status.toLowerCase()}`));
    }

    const { reason } = req.body;
    await offerLetterModel.updateOfferStatus(offer.id, 'DECLINED', null, { 
      ip: req.ip,
      reason: reason
    });

    res.json({ success: true, message: 'Offer declined successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSettings,
  updateSettings,
  listSignatories,
  createSignatory,
  updateSignatory,
  deleteSignatory,
  listOffers,
  getOffer,
  createOffer,
  updateOffer,
  changeOfferStatus,
  getAuditLogs,
  verifyOffer,
  acceptOffer,
  declineOffer,
  deleteOffer
};
