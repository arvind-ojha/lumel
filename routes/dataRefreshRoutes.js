const express = require('express');
const dataRefreshController = require('../controllers/dataRefreshController');
const { scheduleDailyRefresh } = require('../helpers/refreshService');

const router = express.Router();

// Schedule daily refresh on startup
scheduleDailyRefresh(process.env.DATA_FILE_PATH);

// Manual refresh endpoint
router.post('/', dataRefreshController.refreshData);

// Get refresh status
router.get('/status', dataRefreshController.getStatus);

module.exports = router;
