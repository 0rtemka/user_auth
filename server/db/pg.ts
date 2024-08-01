import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

export const pg = knex({
    client: "pg",
    connection: process.env.PG_CONNECTION_STRING,
});