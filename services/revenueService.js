const { query } = require('../config/db');

class RevenueService {
  async getTotalRevenue(startDate, endDate) {
    const result = await query(
      `
      SELECT SUM(oi.quantity * p.unit_price * (1 - oi.discount)) as total_revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      JOIN orders o ON oi.order_id = o.order_id
      WHERE o.date_of_sale BETWEEN $1 AND $2
    `,
      [startDate, endDate]
    );

    return result.rows[0].total_revenue || 0;
  }

  async getRevenueByProduct(startDate, endDate) {
    const result = await query(
      `
      SELECT p.product_id, p.name, SUM(oi.quantity * p.unit_price * (1 - oi.discount)) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      JOIN orders o ON oi.order_id = o.order_id
      WHERE o.date_of_sale BETWEEN $1 AND $2
      GROUP BY p.product_id, p.name
      ORDER BY revenue DESC
    `,
      [startDate, endDate]
    );

    return result.rows;
  }

  async getRevenueByCategory(startDate, endDate) {
    const result = await query(
      `
      SELECT p.category, SUM(oi.quantity * p.unit_price * (1 - oi.discount)) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      JOIN orders o ON oi.order_id = o.order_id
      WHERE o.date_of_sale BETWEEN $1 AND $2
      GROUP BY p.category
      ORDER BY revenue DESC
    `,
      [startDate, endDate]
    );

    return result.rows;
  }

  async getRevenueByRegion(startDate, endDate) {
    const result = await query(
      `
      SELECT o.region, SUM(oi.quantity * p.unit_price * (1 - oi.discount)) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      JOIN orders o ON oi.order_id = o.order_id
      WHERE o.date_of_sale BETWEEN $1 AND $2
      GROUP BY o.region
      ORDER BY revenue DESC
    `,
      [startDate, endDate]
    );

    return result.rows;
  }
}

module.exports = new RevenueService();
