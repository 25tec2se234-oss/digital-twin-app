const OrgReportingService = require('../services/orgReportingService');

exports.getDashboard = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const metrics = await OrgReportingService.getDashboardMetrics(organizationId);
    res.json({ success: true, data: metrics });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard metrics.' });
  }
};

exports.getDepartmentsAnalytics = async (req, res) => {
  try {
    const { organizationId } = req.params;
    // Basic pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const data = await OrgReportingService.getDepartmentAnalytics(organizationId);
    
    // Manual slice for pagination since getDepartmentAnalytics returns all
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedData = data.slice(startIndex, endIndex);

    res.json({ 
        success: true, 
        data: paginatedData,
        pagination: {
            page,
            limit,
            total: data.length,
            totalPages: Math.ceil(data.length / limit)
        }
    });
  } catch (error) {
    console.error('Error fetching department analytics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch department analytics.' });
  }
};

exports.exportReport = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { type, format } = req.query; // type: capacity, gaps, training. format: csv, pdf

    if (!['capacity', 'gaps', 'training'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid report type. Allowed: capacity, gaps, training.' });
    }

    const { data, fields } = await OrgReportingService.getReportData(organizationId, type);

    if (format === 'csv') {
      const csv = OrgReportingService.generateCSV(data, fields);
      res.setHeader('Content-disposition', `attachment; filename=${type}_report.csv`);
      res.set('Content-Type', 'text/csv');
      return res.status(200).send(csv);
    } else if (format === 'pdf') {
      return OrgReportingService.generatePDF(`${type.toUpperCase()} Report`, data, res);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid format. Allowed: csv, pdf.' });
    }

  } catch (error) {
    console.error('Error exporting report:', error);
    res.status(500).json({ success: false, message: 'Failed to export report.' });
  }
};
