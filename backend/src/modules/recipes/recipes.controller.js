const { successResponse } = require("../../middlewares/apiResponse");
const recipesService = require("./recipes.service");

const list = async (req, res, next) => {
  try {
    const recipes = await recipesService.listRecipes(req.query, req.user.id);
    return successResponse(res, 200, "Receitas listadas com sucesso", recipes);
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const recipe = await recipesService.createRecipe(req.body, req.user.id);
    return successResponse(res, 201, "Receita cadastrada com sucesso", recipe);
  } catch (error) {
    return next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const recipe = await recipesService.updateRecipe(req.params.id, req.body, req.user.id);
    return successResponse(res, 200, "Receita editada com sucesso", recipe);
  } catch (error) {
    return next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const recipe = await recipesService.deleteRecipe(req.params.id, req.user.id);
    return successResponse(res, 200, "Receita excluída com sucesso", recipe);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  create,
  list,
  remove,
  update,
};
