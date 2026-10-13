const OrgDigitalTwinService = require('../services/orgDigitalTwinService');
const auditLogModel = require('../models/auditLogModel');

exports.generateSnapshot = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const snapshot = await OrgDigitalTwinService.generateSnapshot(organizationId);
    
    // Record audit event
    if (req.user?.id) {
      await auditLogModel.createLog(
        req.user.id,
        organizationId,
        'DIGITAL_TWIN_REFRESHED',
        'digital_twin_snapshot',
        snapshot.id,
        {
          version: snapshot.snapshot_version,
          confidence: snapshot.confidence,
          competency_coverage: snapshot.competency_coverage,
          evidence_coverage: snapshot.evidence_coverage
        },
        req.ip,
        req.headers ? req.headers['user-agent'] : null
      );
    }

    res.status(201).json({ success: true, data: snapshot });
  } catch (error) {
    console.error('Error generating twin snapshot:', error);
    res.status(500).json({ success: false, message: 'Failed to generate digital twin' });
  }
};

exports.getLatestSnapshot = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const snapshot = await OrgDigitalTwinService.getLatestSnapshot(organizationId);
    if (!snapshot) {
      return res.status(404).json({ success: false, message: 'No digital twin snapshot found' });
    }
    res.json({ success: true, data: snapshot });
  } catch (error) {
    console.error('Error fetching twin snapshot:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch digital twin' });
  }
};

exports.getHistoricalSnapshots = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const history = await OrgDigitalTwinService.getHistoricalSnapshots(organizationId, 10);
    res.json({ success: true, data: history });
  } catch (error) {
    console.error('Error fetching historical snapshots:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch historical snapshots' });
  }
};
