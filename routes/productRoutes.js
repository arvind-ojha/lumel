const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.get('/top', productController.getTopProducts);
router.get('/top/by-category', productController.getTopProductsByCategory);
router.get('/top/by-region', productController.getTopProductsByRegion);
router.get('/profit-margin', productController.getProfitMarginByProduct);

module.exports = router;
