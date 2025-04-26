const customerService = require('../services/customerService');

class CustomerController {
  async getCustomerCount(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const count = await customerService.getCustomerCount(startDate, endDate);
      res.json({ total_customers: count });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getOrderCount(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const count = await customerService.getOrderCount(startDate, endDate);
      res.json({ total_orders: count });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getAverageOrderValue(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const avgValue = await customerService.getAverageOrderValue(
        startDate,
        endDate
      );
      res.json({ average_order_value: avgValue });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getCustomerLifetimeValue(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const clv = await customerService.getCustomerLifetimeValue(
        startDate,
        endDate
      );
      res.json(clv);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getCustomerSegmentation(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const segments = await customerService.getCustomerSegmentation(
        startDate,
        endDate
      );
      res.json(segments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new CustomerController();
