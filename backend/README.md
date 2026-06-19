# App Culinária Backend

Backend em Node.js + Express com MySQL, Docker, Swagger, `x-api-key` e senha com hash.

## Instalar Docker

Baixe e instale o Docker Desktop pelo site oficial:

```txt
https://docs.docker.com/get-started/get-docker/
```

Depois de instalar, confirme se o Docker está funcionando:

```bash
docker --version
docker compose version
```

Comandos principais:

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f api
docker compose logs -f mysql
docker compose down
docker compose down -v
```

O comando `docker compose down -v` remove também o volume do MySQL. Use quando quiser recriar o banco do zero.

## Rodar

```bash
docker compose up -d --build
```

Serviços:

```txt
API: http://localhost:3000
Swagger: http://localhost:3000/api-docs
MySQL: localhost:3307
```

Teste se a API está funcionando corretamente:

```bash
curl http://localhost:3000/teste
```

## Beekeeper Studio

Conecte no MySQL com:

```txt
Host: localhost
Port: 3307
User: root
Password: root
Database: dbAppReceitas
```

Tabelas esperadas:

```txt
usuarios
categorias
receitas
```

Arquivo de inicialização:

```txt
docker/mysql/init/01-schema.sql
```

Categorias:

```txt
As categorias são estáticas no app frontend. A tabela categorias existe no backend
para integridade referencial e filtros internos por id. Os IDs cadastrados no seed
do backend precisam permanecer alinhados com a lista fixa de categorias do app.
```

## Swagger

Acesse:

```txt
http://localhost:3000/api-docs
```

Clique em **Authorize** e informe:

```txt
app-api-key
Bearer token retornado no login
```

## Rotas

```txt
POST   /api/auth/register
POST   /api/auth/login
GET    /api/recipes
POST   /api/recipes
PUT    /api/recipes/:id
DELETE /api/recipes/:id
```

Filtros de receita:

```txt
GET /api/recipes?search=bolo&id_categoria=1&page=1&limit=10
```

Paginação da listagem:

```txt
page: página atual. Padrão 1.
limit: limite por página. Padrão 10, máximo 50.
```

Resposta da listagem:

```ts
{
  success: true;
  message: "Receitas listadas com sucesso";
  data: {
    count: number;
    currentPage: number;
    hasMore: boolean;
    limit: number;
    data: Recipe[];
    total: number;
    totalPages: number;
  };
}
```

## Axios no app

Android Emulator:

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://10.0.2.2:3000/api",
  headers: {
    "x-api-key": "app-api-key",
  },
});
```

Aparelho físico:

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://ENDERECO_IP_MAQUINA:3000/api",
  headers: {
    "x-api-key": "app-api-key",
  },
});
```

No login, a API retorna o usuário com token dentro do padrão de sucesso:

```ts
{
  success: true;
  message: "Login realizado com sucesso";
  data: {
    id: number;
    nome: string;
    login: string;
    token: string;
  }
}
```

Use esse token nas rotas de listar, cadastrar, editar e excluir receitas:

```ts
headers: {
  "x-api-key": "app-api-key",
  Authorization: `Bearer ${response.data.data.token}`,
}
```

Nessas rotas, o app não precisa enviar `id_usuario`; a API pega o usuário pelo token.

## Recriar banco

Se alterar o SQL inicial ou quiser limpar os dados:

```bash
docker compose down -v
docker compose up -d --build
```
