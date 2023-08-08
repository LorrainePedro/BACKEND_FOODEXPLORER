exports.up = (knex) =>
  knex.schema.createTable("dishes", (table) => {
    table.increments("id");
    table.text("title").notNullable();
    table.text("description");
    table.text("category").notNullable();
    table.text("price").notNullable();
    table.text("image");
  });

exports.down = (knex) => knex.schema.dropTable("dishes");
