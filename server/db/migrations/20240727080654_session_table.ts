import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("sessions", (table) => {
    table.string("session_id").primary();
    table.integer("user_id").references("cookies_users.id").notNullable();
    table.bigInteger("exp").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("sessions");
}

