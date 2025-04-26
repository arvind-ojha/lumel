const { query } = require('../config/db');

class ProductService {
  async getTopProducts(startDate, endDate, limit = 10) {
    const result = await query(
      `
      SELECT 
        p.product_id,
        p.name,
        p.category,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.quantity * p.unit_price * (1 - oi.discount)) as total_revenue
      FROM products p
      JOIN order_items oi ON p.product_id = oi.product_id
      JOIN orders o ON oi.order_id = o.order_id
      WHERE o.date_of_sale BETWEEN $1 AND $2
      GROUP BY p.product_id, p.name, p.category
      ORDER BY total_quantity DESC
      LIMIT $3
    `,
      [startDate, endDate, limit]
    );
    return result.rows;
  }

  async getTopProductsByCategory(startDate, endDate, limit = 10) {
    const result = await query(
      `
      WITH ranked_products AS (
        SELECT 
          p.product_id,
          p.name,
          p.category,
          SUM(oi.quantity) as total_quantity,
          ROW_NUMBER() OVER (PARTITION BY p.category ORDER BY SUM(oi.quantity) DESC) as rank
        FROM products p
        JOIN order_items oi ON p.product_id = oi.product_id
        JOIN orders o ON oi.order_id = o.order_id
        WHERE o.date_of_sale BETWEEN $1 AND $2
        GROUP BY p.product_id, p.name, p.category
      )
      SELECT 
        product_id,
        name,
        category,
        total_quantity
      FROM ranked_products
      WHERE rank <= $3
      ORDER BY category, rank
    `,
      [startDate, endDate, limit]
    );
    return result.rows;
  }

  async getTopProductsByRegion(startDate, endDate, limit = 10) {
    const result = await query(
      `
      WITH ranked_products AS (
        SELECT 
          p.product_id,
          p.name,
          o.region,
          SUM(oi.quantity) as total_quantity,
          ROW_NUMBER() OVER (PARTITION BY o.region ORDER BY SUM(oi.quantity) DESC) as rank
        FROM products p
        JOIN order_items oi ON p.product_id = oi.product_id
        JOIN orders o ON oi.order_id = o.order_id
        WHERE o.date_of_sale BETWEEN $1 AND $2
        GROUP BY p.product_id, p.name, o.region
      )
      SELECT 
        product_id,
        name,
        region,
        total_quantity
      FROM ranked_products
      WHERE rank <= $3
      ORDER BY region, rank
    `,
      [startDate, endDate, limit]
    );
    return result.rows;
  }

  async getProfitMarginByProduct(startDate, endDate) {
    const result = await query(
      `
      SELECT 
        p.product_id,
        p.name,
        p.category,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.quantity * p.unit_price * (1 - oi.discount)) as total_revenue,
        SUM(oi.quantity * p.unit_price * (1 - oi.discount) * 0.7) as estimated_cost,
        (SUM(oi.quantity * p.unit_price * (1 - oi.discount)) - 
         SUM(oi.quantity * p.unit_price * (1 - oi.discount) * 0.7)) / 
        SUM(oi.quantity * p.unit_price * (1 - oi.discount)) as profit_margin
      FROM products p
      JOIN order_items oi ON p.product_id = oi.product_id
      JOIN orders o ON oi.order_id = o.order_id
      WHERE o.date_of_sale BETWEEN $1 AND $2
      GROUP BY p.product_id, p.name, p.category
      ORDER BY profit_margin DESC
    `,
      [startDate, endDate]
    );
    return result.rows;
  }
}

module.exports = new ProductService();
