import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("cookies_users", (table) => {
    table.increments("id").primary();
    table.string("login").unique().notNullable();
    table.string("password").notNullable();
    table.timestamp("registration_date").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("cookies_users");
}
