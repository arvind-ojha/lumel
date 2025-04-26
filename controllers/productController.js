const productService = require('../services/productService');

class ProductController {
  async getTopProducts(req, res) {
    try {
      const { startDate, endDate, limit = 10 } = req.query;
      const topProducts = await productService.getTopProducts(
        startDate,
        endDate,
        limit
      );
      res.json(topProducts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getTopProductsByCategory(req, res) {
    try {
      const { startDate, endDate, limit = 10 } = req.query;
      const topProducts = await productService.getTopProductsByCategory(
        startDate,
        endDate,
        limit
      );
      res.json(topProducts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getTopProductsByRegion(req, res) {
    try {
      const { startDate, endDate, limit = 10 } = req.query;
      const topProducts = await productService.getTopProductsByRegion(
        startDate,
        endDate,
        limit
      );
      res.json(topProducts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getProfitMarginByProduct(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const profitMargins = await productService.getProfitMarginByProduct(
        startDate,
        endDate
      );
      res.json(profitMargins);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new ProductController();
