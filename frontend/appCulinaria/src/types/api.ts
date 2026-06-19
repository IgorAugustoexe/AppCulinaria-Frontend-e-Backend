export interface ApiErrorResponse {
  success: false;
  message: string;
}

export interface PaginatedRecipeResponse {
  count: number;
  currentPage: number;
  hasMore: boolean;
  limit: number;
  data: Recipe[];
  total: number;
  totalPages: number;
}

export interface ApiUser {
  id: number;
  nome: string;
  login: string;
  token: string;
  criado_em?: string;
  alterado_em?: string;
}

export interface AuthSuccessResponse {
  success: true;
  message: string;
  data: ApiUser;
}

export interface LoginRequest {
  login: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  login: string;
  senha: string;
}

export interface Recipe {
  id: number;
  id_usuario: number;
  id_categoria: number;
  nome: string;
  tempo_preparo_minutos: number;
  porcoes: number;
  ingredientes: string[];
  modo_preparo: string;
  criado_em?: string;
  alterado_em?: string;
}

export interface RecipeListSuccessResponse {
  success: true;
  message: string;
  data: PaginatedRecipeResponse;
}

export interface RecipeSuccessResponse {
  success: true;
  message: string;
  data: Recipe;
}

export interface RecipeInput {
  id_categoria: number;
  nome: string;
  tempo_preparo_minutos: number;
  porcoes: number;
  ingredientes: string[];
  modo_preparo: string;
}

export interface RecipeFilters {
  search?: string;
  id_categoria?: number | null;
  page?: number;
  limit?: number;
}

export interface DeleteRecipeResponse {
  id: number;
}

export interface DeleteRecipeSuccessResponse {
  success: true;
  message: string;
  data: DeleteRecipeResponse;
}
