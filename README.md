# Sales Data Analysis System

A comprehensive system for analyzing sales data with features for data loading, analysis, and reporting.

## Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 12
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sales-data-analysis
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
PORT=3000
NODE_ENV=development
```

4. Run database migrations:
```bash
npm run migrate
```

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Data Refresh

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/refresh` | POST | Trigger a manual data refresh | None | `{ message: string, rowsProcessed: number }` |
| `/api/refresh/status` | GET | Get the status of the last refresh | None | `{ inProgress: boolean, lastRefreshTime: string, lastRefreshStatus: string, lastRefreshError: string }` |

### Revenue Analysis

| Endpoint | Method | Description | Query Parameters | Response |
|----------|--------|-------------|------------------|----------|
| `/api/revenue/total` | GET | Get total revenue | `startDate`, `endDate` | `{ total_revenue: number }` |
| `/api/revenue/by-product` | GET | Get revenue by product | `startDate`, `endDate` | `[{ product_id: string, name: string, revenue: number }]` |
| `/api/revenue/by-category` | GET | Get revenue by category | `startDate`, `endDate` | `[{ category: string, revenue: number }]` |
| `/api/revenue/by-region` | GET | Get revenue by region | `startDate`, `endDate` | `[{ region: string, revenue: number }]` |

### Customer Analysis

| Endpoint | Method | Description | Query Parameters | Response |
|----------|--------|-------------|------------------|----------|
| `/api/customers/count` | GET | Get total number of customers | `startDate`, `endDate` | `{ total_customers: number }` |
| `/api/customers/orders/count` | GET | Get total number of orders | `startDate`, `endDate` | `{ total_orders: number }` |
| `/api/customers/orders/average-value` | GET | Get average order value | `startDate`, `endDate` | `{ average_order_value: number }` |
| `/api/customers/lifetime-value` | GET | Get customer lifetime value | `startDate`, `endDate` | `[{ customer_id: string, name: string, email: string, total_orders: number, total_spent: number, avg_order_value: number, first_purchase: string, last_purchase: string }]` |
| `/api/customers/segmentation` | GET | Get customer segmentation | `startDate`, `endDate` | `[{ customer_id: string, name: string, segment: string, order_count: number, total_spent: number, avg_order_value: number, days_active: number }]` |

### Product Analysis

| Endpoint | Method | Description | Query Parameters | Response |
|----------|--------|-------------|------------------|----------|
| `/api/products/top` | GET | Get top products by quantity | `startDate`, `endDate`, `limit` | `[{ product_id: string, name: string, category: string, total_quantity: number, total_revenue: number }]` |
| `/api/products/top/by-category` | GET | Get top products by category | `startDate`, `endDate`, `limit` | `[{ product_id: string, name: string, category: string, total_quantity: number }]` |
| `/api/products/top/by-region` | GET | Get top products by region | `startDate`, `endDate`, `limit` | `[{ product_id: string, name: string, region: string, total_quantity: number }]` |
| `/api/products/profit-margin` | GET | Get profit margin by product | `startDate`, `endDate` | `[{ product_id: string, name: string, category: string, total_quantity: number, total_revenue: number, estimated_cost: number, profit_margin: number }]` |

## Database Schema

The system uses a normalized database schema with the following tables:

- `customers`: Stores customer information
- `products`: Stores product information
- `orders`: Stores order information
- `order_items`: Stores order line items

## Data Refresh

The system supports both scheduled and manual data refresh:

- Scheduled refresh: Runs daily at 2:00 AM by default
- Manual refresh: Can be triggered via the API
- Progress tracking: Status of the refresh can be monitored via the API

## Error Handling

The system includes comprehensive error handling:

- Input validation
- Database error handling
- File system error handling
- API error responses

## Logging

The system uses Winston for logging:

- Error logs: `logs/error.log`
- Combined logs: `logs/combined.log`
- Console output in development mode

## License

MIT 