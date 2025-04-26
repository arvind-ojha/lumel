const express = require('express');
const bodyParser = require('body-parser');
const dataRefreshRoutes = require('./routes/dataRefreshRoutes');
const revenueRoutes = require('./routes/revenueRoutes');
const customerRoutes = require('./routes/customerRoutes');
const productRoutes = require('./routes/productRoutes');
const logger = require('./helpers/logger');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/refresh', dataRefreshRoutes);
app.use('/api/revenue', revenueRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
