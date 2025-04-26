exports.up = function (knex) {
  return knex.schema
    .createTable('customers', (table) => {
      table.string('customer_id', 50).primary();
      table.string('name', 100).notNullable();
      table.string('email', 100).notNullable();
      table.text('address').notNullable();
      table.timestamps(true, true);
    })
    .createTable('products', (table) => {
      table.string('product_id', 50).primary();
      table.string('name', 100).notNullable();
      table.string('category', 50).notNullable();
      table.text('description').defaultTo('');
      table.decimal('unit_price', 10, 2).notNullable();
      table.timestamps(true, true);
    })
    .createTable('orders', (table) => {
      table.string('order_id', 50).primary();
      table
        .string('customer_id', 50)
        .notNullable()
        .references('customer_id')
        .inTable('customers');
      table.timestamp('date_of_sale').notNullable();
      table.string('payment_method', 50).notNullable();
      table.decimal('shipping_cost', 10, 2).notNullable();
      table.string('region', 50).notNullable();
      table.timestamps(true, true);
    })
    .createTable('order_items', (table) => {
      table.increments('order_item_id').primary();
      table
        .string('order_id', 50)
        .notNullable()
        .references('order_id')
        .inTable('orders');
      table
        .string('product_id', 50)
        .notNullable()
        .references('product_id')
        .inTable('products');
      table.integer('quantity').notNullable();
      table.decimal('discount', 5, 2).defaultTo(0);
      table.timestamps(true, true);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('order_items')
    .dropTableIfExists('orders')
    .dropTableIfExists('products')
    .dropTableIfExists('customers');
};
