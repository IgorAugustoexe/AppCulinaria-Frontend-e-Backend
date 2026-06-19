const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { env } = require("../../config/env");
const { httpError } = require("../../utils/httpError");
const authRepository = require("./auth.repository");

const loginRegex = /^[a-zA-Z0-9_]+$/;

const formatUser = (user) => {
  return {
    token: createAuthToken(user),
    id: user.id,
    nome: user.nome,
    login: user.login,
    criado_em: user.criado_em,
    alterado_em: user.alterado_em,
  };
};

const validateLoginFormat = (login) => {
  if (!loginRegex.test(login)) {
    throw httpError(400, "Login deve conter apenas letras, números, não é permitido caracteres especiais");
  }
};

const validateRequiredString = (value, fieldName) => {
  if (typeof value !== "string" || !value.trim()) {
    throw httpError(400, `${fieldName} é obrigatório`);
  }

  return value.trim();
};

function createAuthToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      login: user.login,
    },
    env.jwtSecret,
    { expiresIn: "7d" },
  );
}

const registerUser = async (data) => {
  const nome = validateRequiredString(data?.nome, "Nome");
  const login = validateRequiredString(data?.login, "Login");
  const senha = validateRequiredString(data?.senha, "Senha");

  validateLoginFormat(login);

  const existingUser = await authRepository.findUserByLogin(login);

  if (existingUser) {
    throw httpError(409, "Usuário já cadastrado");
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const user = await authRepository.createUser({ nome, login, senhaHash });

  return formatUser(user);
};

const loginUser = async (data) => {
  const login = validateRequiredString(data?.login, "Login");
  const senha = validateRequiredString(data?.senha, "Senha");

  validateLoginFormat(login);

  const user = await authRepository.findUserByLogin(login);

  if (!user) {
    throw httpError(401, "Usuário ou senha inválidos");
  }

  const validPassword = await bcrypt.compare(senha, user.senha);

  if (!validPassword) {
    throw httpError(401, "Usuário ou senha inválidos");
  }

  return formatUser(user);
};
module.exports = {
  loginUser,
  registerUser,
};
