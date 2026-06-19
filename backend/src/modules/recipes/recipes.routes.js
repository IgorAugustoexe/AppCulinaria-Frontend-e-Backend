const { Router } = require("express");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const recipesController = require("./recipes.controller");

const recipesRoutes = Router();

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Lista receitas do usuário autenticado
 *     description: Lista somente as receitas vinculadas ao usuário identificado pelo token JWT. O id do usuário não deve ser enviado por query.
 *     tags: [Recipes]
 *     security:
 *       - ApiKeyAuth: []
 *         BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: id_categoria
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 50
 *     responses:
 *       200:
 *         description: Lista paginada de receitas
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: integer
 *                         currentPage:
 *                           type: integer
 *                         hasMore:
 *                           type: boolean
 *                         limit:
 *                           type: integer
 *                           maximum: 50
 *                         data:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Recipe'
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *             example:
 *               success: true
 *               message: Receitas listadas com sucesso
 *               data:
 *                 count: 1
 *                 currentPage: 1
 *                 hasMore: false
 *                 limit: 10
 *                 data:
 *                   - id: 1
 *                     id_usuario: 1
 *                     id_categoria: 1
 *                     nome: Bolo de cenoura
 *                     tempo_preparo_minutos: 45
 *                     porcoes: 8
 *                     ingredientes:
 *                       - 3 cenouras
 *                       - 4 ovos
 *                     modo_preparo: Misture tudo e asse por 45 minutos.
 *                 total: 1
 *                 totalPages: 1
 *       401:
 *         description: Token não informado ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               tokenNaoInformado:
 *                 value:
 *                   success: false
 *                   message: Token não informado
 *               tokenInvalido:
 *                 value:
 *                   success: false
 *                   message: Token inválido
 */
recipesRoutes.get("/", authMiddleware, recipesController.list);

/**
 * @swagger
 * /recipes:
 *   post:
 *     summary: Cadastra receita
 *     tags: [Recipes]
 *     security:
 *       - ApiKeyAuth: []
 *         BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecipeInput'
 *     responses:
 *       201:
 *         description: Receita cadastrada
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Recipe'
 *             example:
 *               success: true
 *               message: Receita cadastrada com sucesso
 *               data:
 *                 id: 1
 *                 id_usuario: 1
 *                 id_categoria: 1
 *                 nome: Bolo de cenoura
 *                 tempo_preparo_minutos: 45
 *                 porcoes: 8
 *                 ingredientes:
 *                   - 3 cenouras
 *                   - 4 ovos
 *                 modo_preparo: Misture tudo e asse por 45 minutos.
 *       401:
 *         description: Token não informado ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               tokenNaoInformado:
 *                 value:
 *                   success: false
 *                   message: Token não informado
 *               tokenInvalido:
 *                 value:
 *                   success: false
 *                   message: Token inválido
 */
recipesRoutes.post("/", authMiddleware, recipesController.create);

/**
 * @swagger
 * /recipes/{id}:
 *   put:
 *     summary: Edita receita
 *     tags: [Recipes]
 *     security:
 *       - ApiKeyAuth: []
 *         BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecipeInput'
 *     responses:
 *       200:
 *         description: Receita editada
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Recipe'
 *             example:
 *               success: true
 *               message: Receita editada com sucesso
 *               data:
 *                 id: 1
 *                 id_usuario: 1
 *                 id_categoria: 1
 *                 nome: Bolo de cenoura
 *                 tempo_preparo_minutos: 45
 *                 porcoes: 8
 *                 ingredientes:
 *                   - 3 cenouras
 *                   - 4 ovos
 *                 modo_preparo: Misture tudo e asse por 45 minutos.
 *       404:
 *         description: Receita não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Receita não encontrada
 *       401:
 *         description: Token não informado ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               tokenNaoInformado:
 *                 value:
 *                   success: false
 *                   message: Token não informado
 *               tokenInvalido:
 *                 value:
 *                   success: false
 *                   message: Token inválido
 */
recipesRoutes.put("/:id", authMiddleware, recipesController.update);

/**
 * @swagger
 * /recipes/{id}:
 *   delete:
 *     summary: Exclui receita
 *     tags: [Recipes]
 *     security:
 *       - ApiKeyAuth: []
 *         BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Receita excluída
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *             example:
 *               success: true
 *               message: Receita excluída com sucesso
 *               data:
 *                 id: 1
 *       404:
 *         description: Receita não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Receita não encontrada
 *       401:
 *         description: Token não informado ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               tokenNaoInformado:
 *                 value:
 *                   success: false
 *                   message: Token não informado
 *               tokenInvalido:
 *                 value:
 *                   success: false
 *                   message: Token inválido
 */
recipesRoutes.delete("/:id", authMiddleware, recipesController.remove);

module.exports = { recipesRoutes };
