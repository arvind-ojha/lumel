const { refreshData, getRefreshStatus } = require('../helpers/refreshService');
const path = require('path');
const fs = require('fs');

class DataRefreshController {
  async refreshData(req, res) {
    try {
      const filePath = path.join(process.cwd(), 'sample.csv');
      console.log('Attempting to read file from:', filePath);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.error('File does not exist at path:', filePath);
        return res
          .status(404)
          .json({ error: 'sample.csv file not found in root directory' });
      }

      console.log('File exists, proceeding with refresh...');
      const result = await refreshData(filePath);

      if (result.success) {
        res.json({
          message: `Data refreshed successfully in ${result.duration} seconds`,
          rowsProcessed: result.rowCount,
        });
      } else {
        res.status(500).json({ error: result.error });
      }
    } catch (err) {
      console.error('Error in refreshData:', err);
      res.status(500).json({ error: err.message });
    }
  }

  async getStatus(req, res) {
    try {
      const status = getRefreshStatus();
      res.json(status);
    } catch (err) {
      console.error('Error getting refresh status:', err);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new DataRefreshController();
