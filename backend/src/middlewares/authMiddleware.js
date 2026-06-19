const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const { httpError } = require("../utils/httpError");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw httpError(401, "Token não informado");
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    throw httpError(401, "Token inválido");
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    req.user = {
      id: decoded.sub,
      login: decoded.login,
    };

    return next();
  } catch {
    throw httpError(401, "Token inválido");
  }
};

module.exports = { authMiddleware };
