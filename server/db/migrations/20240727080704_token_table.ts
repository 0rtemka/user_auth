import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("tokens", (table) => {
    table.integer("user_id").references("token_users.id").notNullable();
    table.string("token", 512).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("tokens");
}
