const OrgKnowledgeService = require('../services/orgKnowledgeService');

exports.createResource = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const userId = req.user.id;
    const resource = await OrgKnowledgeService.createResource(organizationId, userId, req.body);
    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    console.error('Error creating knowledge resource:', error);
    res.status(500).json({ success: false, message: 'Failed to create resource' });
  }
};

exports.publishResource = async (req, res) => {
  try {
    const { organizationId, resourceId } = req.params;
    const resource = await OrgKnowledgeService.publishResource(organizationId, resourceId);
    if (!resource) {
        return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    res.json({ success: true, data: resource });
  } catch (error) {
    console.error('Error publishing knowledge resource:', error);
    res.status(500).json({ success: false, message: 'Failed to publish resource' });
  }
};

exports.listResources = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const filters = req.query; // related_competency_id, content_type
    const resources = await OrgKnowledgeService.listResources(organizationId, filters);
    res.json({ success: true, data: resources });
  } catch (error) {
    console.error('Error listing resources:', error);
    res.status(500).json({ success: false, message: 'Failed to list resources' });
  }
};

exports.recommendResources = async (req, res) => {
  try {
    const { organizationId, competencyId } = req.params;
    const resources = await OrgKnowledgeService.recommendForCompetency(organizationId, competencyId);
    res.json({ success: true, data: resources });
  } catch (error) {
    console.error('Error recommending resources:', error);
    res.status(500).json({ success: false, message: 'Failed to recommend resources' });
  }
};
