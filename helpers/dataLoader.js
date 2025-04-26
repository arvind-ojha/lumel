const fs = require('fs');
const fastcsv = require('fast-csv');
const { query } = require('../config/db');
const logger = require('./logger');

async function loadCSVData(filePath) {
  const stream = fs.createReadStream(filePath);
  const csvStream = fastcsv.parse({ headers: true });

  const customerCache = new Map();
  const productCache = new Map();
  let batchCount = 0;

  logger.info('Starting data load...');

  return new Promise((resolve, reject) => {
    stream
      .pipe(csvStream)
      .on('data', async (row) => {
        try {
          // Process customers
          if (!customerCache.has(row['Customer ID'])) {
            await query(
              'INSERT INTO customers (customer_id, name, email, address) VALUES ($1, $2, $3, $4) ON CONFLICT (customer_id) DO NOTHING',
              [
                row['Customer ID'],
                row['Customer Name'],
                row['Customer Email'],
                row['Customer Address'],
              ]
            );
            customerCache.set(row['Customer ID'], true);
          }

          // Process products
          if (!productCache.has(row['Product ID'])) {
            await query(
              'INSERT INTO products (product_id, name, category, description, unit_price) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (product_id) DO NOTHING',
              [
                row['Product ID'],
                row['Product Name'],
                row['Category'],
                '',
                row['Unit Price'],
              ]
            );
            productCache.set(row['Product ID'], true);
          }

          // Process orders
          await query(
            'INSERT INTO orders (order_id, customer_id, date_of_sale, payment_method, shipping_cost, region) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (order_id) DO NOTHING',
            [
              row['Order ID'],
              row['Customer ID'],
              new Date(row['Date of Sale']),
              row['Payment Method'],
              row['Shipping Cost'],
              row['Region'],
            ]
          );

          // Process order items
          await query(
            'INSERT INTO order_items (order_id, product_id, quantity, discount) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
            [
              row['Order ID'],
              row['Product ID'],
              row['Quantity Sold'],
              row['Discount'],
            ]
          );

          batchCount++;
          if (batchCount % 1000 === 0) {
            logger.info(`Processed ${batchCount} rows...`);
          }
        } catch (err) {
          logger.error('Error processing row:', err);
        }
      })
      .on('end', () => {
        logger.info(
          `Data load completed. Processed ${batchCount} rows in total.`
        );
        resolve(batchCount);
      })
      .on('error', (err) => {
        logger.error('CSV processing error:', err);
        reject(err);
      });
  });
}

module.exports = { loadCSVData };
