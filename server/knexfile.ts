import type { Knex } from "knex";


const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: {
      host: "localhost",
      port: 5432,
      database: "auth_db",
      user: "postgres",
      password: "123"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "db/migrations"
    }
  },
};

module.exports = config;
