const { query } = require('../config/db');

class CustomerService {
  async getCustomerCount(startDate, endDate) {
    const result = await query(
      `
      SELECT COUNT(DISTINCT customer_id) as count
      FROM orders
      WHERE date_of_sale BETWEEN $1 AND $2
    `,
      [startDate, endDate]
    );
    return result.rows[0].count;
  }

  async getOrderCount(startDate, endDate) {
    const result = await query(
      `
      SELECT COUNT(*) as count
      FROM orders
      WHERE date_of_sale BETWEEN $1 AND $2
    `,
      [startDate, endDate]
    );
    return result.rows[0].count;
  }

  async getAverageOrderValue(startDate, endDate) {
    const result = await query(
      `
      SELECT AVG(order_total) as avg_value
      FROM (
        SELECT o.order_id, SUM(oi.quantity * p.unit_price * (1 - oi.discount)) as order_total
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN products p ON oi.product_id = p.product_id
        WHERE o.date_of_sale BETWEEN $1 AND $2
        GROUP BY o.order_id
      ) as order_totals
    `,
      [startDate, endDate]
    );
    return result.rows[0].avg_value || 0;
  }

  async getCustomerLifetimeValue(startDate, endDate) {
    const result = await query(
      `
      SELECT 
        c.customer_id,
        c.name,
        c.email,
        COUNT(DISTINCT o.order_id) as total_orders,
        SUM(oi.quantity * p.unit_price * (1 - oi.discount)) as total_spent,
        AVG(oi.quantity * p.unit_price * (1 - oi.discount)) as avg_order_value,
        MIN(o.date_of_sale) as first_purchase,
        MAX(o.date_of_sale) as last_purchase
      FROM customers c
      JOIN orders o ON c.customer_id = o.customer_id
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN products p ON oi.product_id = p.product_id
      WHERE o.date_of_sale BETWEEN $1 AND $2
      GROUP BY c.customer_id, c.name, c.email
      ORDER BY total_spent DESC
    `,
      [startDate, endDate]
    );
    return result.rows;
  }

  async getCustomerSegmentation(startDate, endDate) {
    const result = await query(
      `
      WITH customer_stats AS (
        SELECT 
          c.customer_id,
          c.name,
          COUNT(DISTINCT o.order_id) as order_count,
          SUM(oi.quantity * p.unit_price * (1 - oi.discount)) as total_spent,
          AVG(oi.quantity * p.unit_price * (1 - oi.discount)) as avg_order_value,
          EXTRACT(DAY FROM (MAX(o.date_of_sale) - MIN(o.date_of_sale))) as days_active
        FROM customers c
        JOIN orders o ON c.customer_id = o.customer_id
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN products p ON oi.product_id = p.product_id
        WHERE o.date_of_sale BETWEEN $1 AND $2
        GROUP BY c.customer_id, c.name
      )
      SELECT 
        customer_id,
        name,
        CASE
          WHEN total_spent > 1000 AND order_count > 5 THEN 'VIP'
          WHEN total_spent > 500 AND order_count > 3 THEN 'Loyal'
          WHEN total_spent > 100 AND order_count > 1 THEN 'Regular'
          ELSE 'New'
        END as segment,
        order_count,
        total_spent,
        avg_order_value,
        days_active
      FROM customer_stats
      ORDER BY total_spent DESC
    `,
      [startDate, endDate]
    );
    return result.rows;
  }
}

module.exports = new CustomerService();
