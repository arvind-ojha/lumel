const revenueService = require('../services/revenueService');

class RevenueController {
  async getTotalRevenue(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const totalRevenue = await revenueService.getTotalRevenue(
        startDate,
        endDate
      );
      res.json({ total_revenue: totalRevenue });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getRevenueByProduct(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const revenueByProduct = await revenueService.getRevenueByProduct(
        startDate,
        endDate
      );
      res.json(revenueByProduct);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getRevenueByCategory(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const revenueByCategory = await revenueService.getRevenueByCategory(
        startDate,
        endDate
      );
      res.json(revenueByCategory);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getRevenueByRegion(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const revenueByRegion = await revenueService.getRevenueByRegion(
        startDate,
        endDate
      );
      res.json(revenueByRegion);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new RevenueController();
