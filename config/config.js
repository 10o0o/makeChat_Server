const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: process.env.DATABASE_PASSWORD,
    database: "authentication",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: process.env.DATABASE_PASSWORD,
    database: "authentication",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
