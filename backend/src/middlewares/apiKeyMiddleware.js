const { env } = require("../config/env");
const { errorResponse } = require("./apiResponse");

const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (apiKey !== env.apiKey) {
    return errorResponse(res, 401, "API key inválida");
  }

  return next();
};

module.exports = { apiKeyMiddleware };
