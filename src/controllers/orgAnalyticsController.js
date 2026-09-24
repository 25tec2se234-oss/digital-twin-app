const OrgAnalyticsService = require('../services/orgAnalyticsService');
const AIOperationInsightService = require('../services/aiOperationInsightService');

// GET /api/v1/organizations/:organizationId/analytics/overview
exports.getOverview = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const overview = await OrgAnalyticsService.getOverview(organizationId);
    res.json({ success: true, data: overview });
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics overview' });
  }
};

// GET /api/v1/organizations/:organizationId/analytics/insights
exports.getInsights = async (req, res) => {
  try {
    const { organizationId } = req.params;
    
    // First, try to get recent cached insights (e.g. from the last 24 hours)
    // For simplicity, we just fetch the top 5 most recent insights
    let insights = await AIOperationInsightService.getCachedInsights(organizationId, 5);
    
    // If we have no insights or want to force a refresh (maybe via query param ?refresh=true)
    if (insights.length === 0 || req.query.refresh === 'true') {
        const overview = await OrgAnalyticsService.getOverview(organizationId);
        const newInsight = await AIOperationInsightService.generateInsights(organizationId, overview);
        if (newInsight) {
            insights = [newInsight, ...insights];
        }
    }

    res.json({ success: true, data: insights });
  } catch (error) {
    console.error('Error fetching analytics insights:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch insights' });
  }
};
