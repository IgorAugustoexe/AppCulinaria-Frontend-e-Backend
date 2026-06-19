require("dotenv").config();

const env = {
  port: Number(process.env.PORT || 3000),
  apiKey: process.env.API_KEY || "app-api-key",
  jwtSecret: process.env.JWT_SECRET || "dev-jwt-secret",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "dbAppReceitas",
  },
};

module.exports = { env };
