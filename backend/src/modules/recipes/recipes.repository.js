const { pool } = require("../../config/database");

const parseIngredients = (value) => {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const formatRecipe = (row) => {
  if (!row) return null;

  return {
    id: row.id,
    id_usuario: row.id_usuarios,
    id_categoria: row.id_categorias,
    nome: row.nome,
    tempo_preparo_minutos: row.tempo_preparo_minutos,
    porcoes: row.porcoes,
    ingredientes: parseIngredients(row.ingredientes),
    modo_preparo: row.modo_preparo,
    criado_em: row.criado_em,
    alterado_em: row.alterado_em,
  };
};

const buildRecipeFilters = (filters) => {
  const where = [];
  const params = [];

  if (filters.search) {
    where.push("(nome LIKE ? OR modo_preparo LIKE ? OR ingredientes LIKE ?)");
    params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
  }

  if (filters.id_categorias) {
    where.push("id_categorias = ?");
    params.push(filters.id_categorias);
  }

  if (filters.id_usuarios) {
    where.push("id_usuarios = ?");
    params.push(filters.id_usuarios);
  }

  return {
    whereSql: where.length ? `WHERE ${where.join(" AND ")}` : "",
    params,
  };
};

const countAll = async (filters) => {
  const { whereSql, params } = buildRecipeFilters(filters);

  const [rows] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM receitas
     ${whereSql}`,
    params,
  );

  return Number(rows[0]?.total || 0);
};

const findAll = async (filters, pagination) => {
  const { whereSql, params } = buildRecipeFilters(filters);
  const limit = Number(pagination.limit);
  const offset = Number((pagination.page - 1) * pagination.limit);

  const [rows] = await pool.query(
    `SELECT id, id_usuarios, id_categorias, nome, tempo_preparo_minutos, porcoes, modo_preparo, ingredientes, criado_em, alterado_em
     FROM receitas
     ${whereSql}
     ORDER BY criado_em DESC, id DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );

  return rows.map(formatRecipe);
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT id, id_usuarios, id_categorias, nome, tempo_preparo_minutos, porcoes, modo_preparo, ingredientes, criado_em, alterado_em
     FROM receitas
     WHERE id = ?
     LIMIT 1`,
    [id],
  );

  return formatRecipe(rows[0]);
};

const create = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO receitas
      (id_usuarios, id_categorias, nome, tempo_preparo_minutos, porcoes, modo_preparo, ingredientes, criado_em, alterado_em)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      data.id_usuarios,
      data.id_categorias,
      data.nome,
      data.tempo_preparo_minutos,
      data.porcoes,
      data.modo_preparo,
      JSON.stringify(data.ingredientes),
    ],
  );

  return findById(result.insertId);
};

const update = async (id, data) => {
  const [result] = await pool.execute(
    `UPDATE receitas
     SET id_usuarios = ?,
         id_categorias = ?,
         nome = ?,
         tempo_preparo_minutos = ?,
         porcoes = ?,
         modo_preparo = ?,
         ingredientes = ?,
         alterado_em = NOW()
     WHERE id = ? AND id_usuarios = ?`,
    [
      data.id_usuarios,
      data.id_categorias,
      data.nome,
      data.tempo_preparo_minutos,
      data.porcoes,
      data.modo_preparo,
      JSON.stringify(data.ingredientes),
      id,
      data.id_usuarios,
    ],
  );

  if (!result.affectedRows) return null;

  return findById(id);
};

const remove = async (id, userId) => {
  const [result] = await pool.execute("DELETE FROM receitas WHERE id = ? AND id_usuarios = ?", [id, userId]);
  return result.affectedRows > 0;
};

module.exports = {
  countAll,
  create,
  findAll,
  findById,
  remove,
  update,
};
