const OrgDigitalTwinService = require('../services/orgDigitalTwinService');

exports.generateSnapshot = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const snapshot = await OrgDigitalTwinService.generateSnapshot(organizationId);
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
