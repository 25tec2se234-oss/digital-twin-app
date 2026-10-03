const OrgEnterpriseAiService = require('../services/orgEnterpriseAiService');

exports.queryEnterpriseAi = async (req, res) => {
    try {
        const { organizationId } = req.params;
        const { question } = req.body;
        
        // Ensure user is defined and authorized (assumes auth middleware sets req.user)
        const userId = req.user?.id;

        if (!question) {
            return res.status(400).json({ success: false, message: 'Question is required' });
        }

        const answer = await OrgEnterpriseAiService.query(organizationId, userId, question);

        res.json({
            success: true,
            data: {
                answer
            }
        });
    } catch (error) {
        console.error('Error in Enterprise AI query:', error);
        if (error.message === 'AI Provider is not configured.') {
             return res.status(503).json({ success: false, message: 'AI service is temporarily unavailable.' });
        }
        res.status(500).json({ success: false, message: 'Failed to process AI query.' });
    }
};
