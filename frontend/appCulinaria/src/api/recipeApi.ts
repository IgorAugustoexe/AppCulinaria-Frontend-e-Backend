import { api } from "../config/axios";
import {
  DeleteRecipeSuccessResponse,
  RecipeFilters,
  RecipeInput,
  RecipeListSuccessResponse,
  RecipeSuccessResponse,
} from "../types/api";

export const recipeApi = {
  async list(filters: RecipeFilters = {}) {
    const response = await api.get<RecipeListSuccessResponse>("/recipes", {
      params: {
        search: filters.search || undefined,
        id_categoria: filters.id_categoria || undefined,
        page: filters.page || undefined,
        limit: filters.limit || undefined,
      },
    });

    return response.data.data;
  },

  async create(data: RecipeInput) {
    const response = await api.post<RecipeSuccessResponse>("/recipes", data);
    return response.data.data;
  },

  async update(id: number, data: RecipeInput) {
    const response = await api.put<RecipeSuccessResponse>(`/recipes/${id}`, data);
    return response.data.data;
  },

  async remove(id: number) {
    const response = await api.delete<DeleteRecipeSuccessResponse>(`/recipes/${id}`);
    return response.data.data;
  },
};
