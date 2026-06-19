const cors = require("cors");
const express = require("express");
const { apiKeyMiddleware } = require("./middlewares/apiKeyMiddleware");
const { errorHandler, successResponse } = require("./middlewares/apiResponse");
const { router } = require("./routes");
const { setupSwagger } = require("./config/swagger");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/teste", (req, res) => {
  return successResponse(res, 200, "API funcionando", { status: "ok" });
});

setupSwagger(app);

app.use("/api", apiKeyMiddleware, router);
app.use(errorHandler);

module.exports = { app };
