const express = require('express');
const revenueController = require('../controllers/revenueController');

const router = express.Router();

router.get('/total', revenueController.getTotalRevenue);
router.get('/by-product', revenueController.getRevenueByProduct);
router.get('/by-category', revenueController.getRevenueByCategory);
router.get('/by-region', revenueController.getRevenueByRegion);

module.exports = router;
