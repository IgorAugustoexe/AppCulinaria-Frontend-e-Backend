const { successResponse } = require("../../middlewares/apiResponse");
const authService = require("./auth.service");

const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    return successResponse(res, 201, "Usuário cadastrado com sucesso", user);
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await authService.loginUser(req.body);
    return successResponse(res, 200, "Login realizado com sucesso", user);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  login,
  register,
};
