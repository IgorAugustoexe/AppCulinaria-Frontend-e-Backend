SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS dbAppReceitas
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;
USE dbAppReceitas;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NULL,
  login VARCHAR(100) NOT NULL,
  senha VARCHAR(255) NOT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  alterado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY login_UNIQUE (login)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categorias (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY nome_UNIQUE (nome)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS receitas (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuarios INT UNSIGNED NOT NULL,
  id_categorias INT UNSIGNED NULL,
  nome VARCHAR(100) NULL,
  tempo_preparo_minutos INT UNSIGNED NULL,
  porcoes INT UNSIGNED NULL,
  modo_preparo TEXT NOT NULL,
  ingredientes TEXT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  alterado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX fk_receitas_1_idx (id_usuarios),
  INDEX fk_receitas_2_idx (id_categorias),
  CONSTRAINT fk_receitas_1
    FOREIGN KEY (id_usuarios)
    REFERENCES usuarios (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_receitas_2
    FOREIGN KEY (id_categorias)
    REFERENCES categorias (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

INSERT INTO categorias (id, nome) VALUES
  (1, 'Bolos e tortas doces'),
  (2, 'Carnes'),
  (3, 'Aves'),
  (4, 'Peixes e frutos do mar'),
  (5, 'Saladas, molhos e acompanhamentos'),
  (6, 'Sopas'),
  (7, 'Massas'),
  (8, 'Bebidas'),
  (9, 'Doces e sobremesas'),
  (10, 'Lanches'),
  (11, 'Prato Único'),
  (12, 'Light'),
  (13, 'Alimentação Saudável')
ON DUPLICATE KEY UPDATE nome = VALUES(nome);
