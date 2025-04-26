exports.up = function (knex) {
  return knex.schema
    .alterTable('orders', (table) => {
      table.index('customer_id');
      table.index('date_of_sale');
      table.index('region');
    })
    .alterTable('products', (table) => {
      table.index('category');
    })
    .alterTable('order_items', (table) => {
      table.index('order_id');
      table.index('product_id');
    });
};

exports.down = function (knex) {
  return knex.schema
    .alterTable('orders', (table) => {
      table.dropIndex('customer_id');
      table.dropIndex('date_of_sale');
      table.dropIndex('region');
    })
    .alterTable('products', (table) => {
      table.dropIndex('category');
    })
    .alterTable('order_items', (table) => {
      table.dropIndex('order_id');
      table.dropIndex('product_id');
    });
};
