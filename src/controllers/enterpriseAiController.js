const EnterpriseAiService = require('../services/enterpriseAiService');

exports.askAi = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const userId = req.user.id;
    const { queryText } = req.body;

    if (!queryText) {
        return res.status(400).json({ success: false, message: 'queryText is required' });
    }

    const aiResponse = await EnterpriseAiService.askQuestion(organizationId, userId, queryText);
    res.json({ success: true, data: aiResponse });
  } catch (error) {
    console.error('Enterprise AI Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to process AI request' });
  }
};
