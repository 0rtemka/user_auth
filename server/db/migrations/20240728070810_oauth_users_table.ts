import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("oauth_users", (table) => {
    table.increments("id").primary();
    table.string("login").notNullable();
    table.string("email").unique().notNullable();
    table.timestamp("registration_date").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("oauth_users");
}
