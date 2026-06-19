const { pool } = require("../../config/database");

const findUserByLogin = async (login) => {
  const [rows] = await pool.execute(
    "SELECT id, nome, login, senha, criado_em, alterado_em FROM usuarios WHERE login = ? LIMIT 1",
    [login],
  );

  return rows[0] || null;
};

const createUser = async ({ nome, login, senhaHash }) => {
  const [result] = await pool.execute(
    "INSERT INTO usuarios (nome, login, senha, criado_em, alterado_em) VALUES (?, ?, ?, NOW(), NOW())",
    [nome, login, senhaHash],
  );

  const [rows] = await pool.execute(
    "SELECT id, nome, login, criado_em, alterado_em FROM usuarios WHERE id = ? LIMIT 1",
    [result.insertId],
  );

  return rows[0];
};

module.exports = {
  createUser,
  findUserByLogin,
};
