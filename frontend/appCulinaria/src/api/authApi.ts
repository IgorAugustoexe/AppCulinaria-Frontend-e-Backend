import { api } from "../config/axios";
import { AuthSuccessResponse, LoginRequest, RegisterRequest } from "../types/api";
import { LoginInput, RegisterInput } from "../types/auth";

const mapLoginInput = (data: LoginInput): LoginRequest => ({
  login: data.username,
  senha: data.password,
});

const mapRegisterInput = (data: RegisterInput): RegisterRequest => ({
  nome: data.name,
  login: data.username,
  senha: data.password,
});

export const authApi = {
  async login(data: LoginInput) {
    const response = await api.post<AuthSuccessResponse>("/auth/login", mapLoginInput(data));
    return response.data.data;
  },

  async register(data: RegisterInput) {
    const response = await api.post<AuthSuccessResponse>("/auth/register", mapRegisterInput(data));
    return response.data.data;
  },
};
