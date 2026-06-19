const { Router } = require("express");
const { authRoutes } = require("../modules/auth/auth.routes");
const { recipesRoutes } = require("../modules/recipes/recipes.routes");

const router = Router();

router.use("/auth", authRoutes);
router.use("/recipes", recipesRoutes);

module.exports = { router };
