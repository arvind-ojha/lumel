const schedule = require('node-schedule');
const { loadCSVData } = require('./dataLoader');
const logger = require('./logger');
const fs = require('fs');
const path = require('path');

let refreshInProgress = false;
let lastRefreshTime = null;
let lastRefreshStatus = null;
let lastRefreshError = null;

async function refreshData(filePath) {
  if (refreshInProgress) {
    throw new Error('A refresh is already in progress');
  }

  refreshInProgress = true;
  const startTime = new Date();
  logger.info(`Starting data refresh at ${startTime}`);

  try {
    // Validate file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Validate file extension
    if (path.extname(filePath).toLowerCase() !== '.csv') {
      throw new Error('File must be a CSV file');
    }

    // Get file size for progress tracking
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;
    logger.info(`Processing file: ${filePath} (${fileSize} bytes)`);

    const rowCount = await loadCSVData(filePath);
    const endTime = new Date();
    const duration = (endTime - startTime) / 1000;

    lastRefreshTime = endTime;
    lastRefreshStatus = 'success';
    lastRefreshError = null;

    logger.info(
      `Data refresh completed successfully in ${duration} seconds. Processed ${rowCount} rows.`
    );
    return { success: true, duration, rowCount };
  } catch (err) {
    lastRefreshStatus = 'error';
    lastRefreshError = err.message;
    logger.error(`Data refresh failed: ${err.message}`);
    return { success: false, error: err.message };
  } finally {
    refreshInProgress = false;
  }
}

function scheduleDailyRefresh(filePath, hour = 2) {
  schedule.scheduleJob(`0 ${hour} * * *`, () => {
    refreshData(filePath);
  });
  logger.info(`Scheduled daily data refresh at ${hour}:00 AM`);
}

function getRefreshStatus() {
  return {
    inProgress: refreshInProgress,
    lastRefreshTime,
    lastRefreshStatus,
    lastRefreshError,
  };
}

module.exports = {
  refreshData,
  scheduleDailyRefresh,
  getRefreshStatus,
};
