// src/validations/authRules.ts
import { REGEX_NAME, REGEX_USERNAME } from "../utils/regex";

export const requiredRule = {
  required: "Campo obrigatório",
};

export const registerRules = {
  name: {
    required: "Campo obrigatório",
    pattern: {
      value: REGEX_NAME,
      message: "Nome inválido, informe ao menos o nome e sobrenome.",
    },
  },
  login: {
    required: "Campo obrigatório",
    pattern: {
      value: REGEX_USERNAME,
      message: "Usuário não deve conter espaços",
    },
  },
  password: {
    required: "Campo obrigatório",
    minLength: {
      value: 6,
      message: "Senha deve ter no mínimo 6 caracteres",
    },
  },
};

export const loginRules = {
  login: registerRules.login,
  password: {
    required: "Campo obrigatório",
  },
};
