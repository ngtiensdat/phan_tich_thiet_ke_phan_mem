// src/config/knex-config.js
require("dotenv").config();

console.log("DB_HOST:", process.env.DB_HOST); // Thêm để debug
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);

module.exports = {
    development: {
        client: "mysql2",
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306,
        },
        pool: { min: 2, max: 10 },
        migrations: {
            tableName: "knex_migrations",
        },
    },
    production: {
        client: "mysql2",
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306,
        },
        pool: { min: 2, max: 20 },
        migrations: {
            tableName: "knex_migrations",
        },
    },
};