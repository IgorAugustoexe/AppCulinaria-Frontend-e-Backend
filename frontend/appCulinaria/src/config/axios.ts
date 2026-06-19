import axios, { AxiosError } from "axios";
import { API_URL, X_API_KEY } from "@env";
import { store } from "../redux/Store";
import { ApiErrorResponse } from "../types/api";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "x-api-key": X_API_KEY,
  },
});

api.interceptors.request.use((config) => {
  const token = store.getState()?.user?.authToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Ocorreu um erro ao realizar esta operação, por favor verifique sua conexão e tente novamente.",
) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export type ApiAxiosError = AxiosError<ApiErrorResponse>;
