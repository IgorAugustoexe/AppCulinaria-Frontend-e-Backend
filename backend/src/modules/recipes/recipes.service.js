const { httpError } = require("../../utils/httpError");
const recipesRepository = require("./recipes.repository");

const validateRequiredString = (value, fieldName) => {
  if (typeof value !== "string" || !value.trim()) {
    throw httpError(400, `${fieldName} é obrigatório`);
  }

  return value.trim();
};

const validatePositiveNumber = (value, fieldName) => {
  const number = Number(value);

  if (!Number.isInteger(number) || number <= 0) {
    throw httpError(400, `${fieldName} deve ser um número inteiro maior que zero`);
  }

  return number;
};

const validateIngredients = (ingredients) => {
  if (!Array.isArray(ingredients)) {
    throw httpError(400, "Ingredientes é obrigatório");
  }

  const normalizedIngredients = ingredients.map((ingredient) => String(ingredient).trim()).filter(Boolean);

  if (!normalizedIngredients.length) {
    throw httpError(400, "Informe pelo menos um ingrediente");
  }

  return normalizedIngredients;
};

const normalizeRecipePayload = (data, userId) => {
  return {
    id_usuarios: userId,
    id_categorias: validatePositiveNumber(data?.id_categoria, "Categoria"),
    nome: validateRequiredString(data?.nome, "Nome da receita"),
    tempo_preparo_minutos: validatePositiveNumber(data?.tempo_preparo_minutos, "Tempo de preparo"),
    porcoes: validatePositiveNumber(data?.porcoes, "Porções"),
    ingredientes: validateIngredients(data?.ingredientes),
    modo_preparo: validateRequiredString(data?.modo_preparo, "Modo de preparo"),
  };
};

const normalizeFilters = (query, userId) => {
  return {
    search: query.search?.trim() || "",
    id_categorias: query.id_categoria || query.categoryId || "",
    id_usuarios: userId,
  };
};

const normalizePagination = (query) => {
  const page = Number.parseInt(query.page, 10);
  const limit = Number.parseInt(query.limit, 10);

  return {
    page: page > 0 ? page : 1,
    limit: limit > 0 ? Math.min(limit, 50) : 10,
  };
};

const listRecipes = async (query, userId) => {
  const filters = normalizeFilters(query, userId);
  const pagination = normalizePagination(query);
  const [recipes, total] = await Promise.all([
    recipesRepository.findAll(filters, pagination),
    recipesRepository.countAll(filters),
  ]);
  const totalPages = Math.ceil(total / pagination.limit);

  return {
    count: recipes.length,
    currentPage: pagination.page,
    hasMore: pagination.page < totalPages,
    limit: pagination.limit,
    data: recipes,
    total,
    totalPages,
  };
};

const createRecipe = (data, userId) => {
  return recipesRepository.create(normalizeRecipePayload(data, userId));
};

const updateRecipe = async (id, data, userId) => {
  const recipe = await recipesRepository.update(id, normalizeRecipePayload(data, userId));

  if (!recipe) {
    throw httpError(404, "Receita não encontrada");
  }

  return recipe;
};

const deleteRecipe = async (id, userId) => {
  const removed = await recipesRepository.remove(id, userId);

  if (!removed) {
    throw httpError(404, "Receita não encontrada");
  }

  return { id: Number(id) };
};

module.exports = {
  createRecipe,
  deleteRecipe,
  listRecipes,
  updateRecipe,
};
