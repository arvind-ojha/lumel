const express = require('express');
const customerController = require('../controllers/customerController');

const router = express.Router();

router.get('/count', customerController.getCustomerCount);
router.get('/orders/count', customerController.getOrderCount);
router.get('/orders/average-value', customerController.getAverageOrderValue);
router.get('/lifetime-value', customerController.getCustomerLifetimeValue);
router.get('/segmentation', customerController.getCustomerSegmentation);

module.exports = router;
