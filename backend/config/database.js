// backend/config/database.js
const config = require("./index");

module.exports = {
  development: {
    username: "postgres",
    password: "admin",
    database: "recipedia",
    host: "localhost",
    dialect: "postgres",
    // schema: config.schema,
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    seederStorage: "sequelize",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    define: {
      schema: config.schema,
    },
  },
};
