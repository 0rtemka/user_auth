import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("token_users", (table) => {
    table.increments("id").primary();
    table.string("login").unique().notNullable();
    table.string("password").notNullable();
    table.timestamp("registration_date");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("token_users");
}