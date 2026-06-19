const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "App Culinária API",
      version: "1.0.0",
      description: "API para autenticação e receitas.",
    },
    servers: [{ url: "http://localhost:3000/api" }],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
        },
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operação realizada com sucesso" },
            data: { type: "object" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Mensagem do erro" },
          },
        },
        RegisterInput: {
          type: "object",
          properties: {
            nome: { type: "string", example: "Igor" },
            login: { type: "string", example: "igor1" },
            senha: { type: "string", example: "123456" },
          },
        },
        LoginInput: {
          type: "object",
          properties: {
            login: { type: "string", example: "igor1" },
            senha: { type: "string", example: "123456" },
          },
        },
        User: {
          type: "object",
          properties: {
            token: { type: "string", example: "jwt.token.aqui" },
            id: { type: "integer", example: 1 },
            nome: { type: "string", example: "Igor" },
            login: { type: "string", example: "igor1" },
            criado_em: { type: "string", format: "date-time" },
            alterado_em: { type: "string", format: "date-time" },
          },
        },
        RecipeInput: {
          type: "object",
          properties: {
            id_categoria: { type: "integer", example: 1 },
            nome: { type: "string", example: "Bolo de cenoura" },
            tempo_preparo_minutos: { type: "integer", example: 45 },
            porcoes: { type: "integer", example: 8 },
            ingredientes: {
              type: "array",
              items: { type: "string" },
              example: ["3 cenouras", "4 ovos", "2 xícaras de farinha"],
            },
            modo_preparo: { type: "string", example: "Misture tudo e asse por 45 minutos." },
          },
        },
        Recipe: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            id_usuario: { type: "integer", example: 1 },
            id_categoria: { type: "integer", example: 1 },
            nome: { type: "string", example: "Bolo de cenoura" },
            tempo_preparo_minutos: { type: "integer", example: 45 },
            porcoes: { type: "integer", example: 8 },
            ingredientes: {
              type: "array",
              items: { type: "string" },
              example: ["3 cenouras", "4 ovos", "2 xícaras de farinha"],
            },
            modo_preparo: { type: "string", example: "Misture tudo e asse por 45 minutos." },
            criado_em: { type: "string", format: "date-time" },
            alterado_em: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  apis: ["./src/modules/**/*.routes.js"],
});

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = { setupSwagger };
