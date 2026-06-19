# App Culinaria Frontend

App mobile em React Native para login, cadastro e gerenciamento de receitas.

Ele conversa com o backend do App Culinaria usando `x-api-key` em todas as requisições e `Bearer token` nas rotas protegidas de receitas.

## Requisitos

```txt
Node: >= 22.11.0
Backend rodando na porta 3000
```

Antes de testar login, cadastro ou receitas, suba o backend com Docker conforme explicado no README do backend.

## Instalar dependencias

Na pasta do app:

```bash
npm install
```

## Configurar `.env`

O app le as variaveis pelo `react-native-dotenv`.

### Android Emulator

```env
API_URL=http://10.0.2.2:3000/api
X_API_KEY=app-api-key
```

No Android Emulator, `localhost` aponta para o proprio emulador. Por isso usamos `10.0.2.2`, que aponta para a maquina onde o backend esta rodando.

### Aparelho fisico

```env
API_URL=http://ENDERECO_IP_DA_MAQUINA:3000/api
X_API_KEY=app-api-key
```

Exemplo:

```env
API_URL=http://192.168.1.6:3000/api
X_API_KEY=app-api-key
```

Nesse caso, o celular e a maquina precisam estar na mesma rede.

Sempre que alterar o `.env`, reinicie o Metro limpando o cache:

```bash
npm start -- --reset-cache
```

## Rodar

Terminal 1:

```bash
npm start
```

Terminal 2 para Android:

```bash
npm run android
```

O `bundle install` e o `bundle exec pod install` normalmente so precisam ser executados na primeira instalacao ou quando alguma dependencia nativa mudar.

## Como a API esta configurada

A configuracao principal fica em:

```txt
src/config/axios.ts
```

Esse arquivo cria a instancia do Axios com:

```ts
baseURL: API_URL
headers: {
  "x-api-key": X_API_KEY
}
```

Antes de cada requisicao, o Axios tambem olha o Redux:

```txt
src/redux/reducers/UserReducer.ts
```

Se existir `authToken` salvo no usuario, ele envia:

```ts
Authorization: `Bearer ${token}`;
```

Com isso, login e cadastro usam apenas `x-api-key`, enquanto receitas usam `x-api-key` + `Bearer token`.

## APIs do app

As chamadas ficam separadas por contexto:

```txt
src/api/authApi.ts
src/api/recipeApi.ts
```

`authApi` cuida de:

```txt
POST /auth/login
POST /auth/register
```

`recipeApi` cuida de:

```txt
GET    /recipes
POST   /recipes
PUT    /recipes/:id
DELETE /recipes/:id
```

A listagem de receitas aceita filtros e paginacao:

```ts
{
  search?: string;
  id_categoria?: number;
  page?: number;
  limit?: number;
}
```

O retorno paginado vem no formato:

```ts
{
  count: number;
  currentPage: number;
  hasMore: boolean;
  limit: number;
  data: Recipe[];
  total: number;
  totalPages: number;
}
```

## Tipagens

As tipagens das respostas da API ficam em:

```txt
src/types/api.ts
```

Ali ficam os tipos de usuario, login, cadastro, receitas, filtros, respostas de sucesso, respostas de erro e paginacao.

## Categorias

As categorias exibidas no app ficam estaticas em:

```txt
src/mocks/categories.ts
```

O backend tambem tem uma tabela de categorias, mas ela existe para consultas internas e relacionamento das receitas.

O ponto importante e manter os IDs alinhados entre app e backend. Assim, quando o app envia `id_categoria`, o backend consegue encontrar a categoria correta.

## Estrutura principal

```txt
src/api              chamadas para o backend
src/components       componentes reutilizaveis
src/config           configuracao do Axios
src/mocks            listas estaticas usadas no app
src/redux            estado global e persistencia
src/screens          telas de login, cadastro, receitas e feedback
src/themes           cores e estilos base
src/types            tipagens do app e da API
src/validations      validacoes dos formularios
```

## Problemas comuns

### `Network Error`

Normalmente e algum desses pontos:

- backend nao esta rodando;
- `API_URL` esta apontando para o lugar errado;
- celular fisico nao esta na mesma rede da maquina;
- Android Emulator esta usando `localhost` em vez de `10.0.2.2`;
- Metro ainda esta com `.env` antigo em cache.

Depois de ajustar o `.env`, rode:

```bash
npm start -- --reset-cache
```

### Login fica carregando por muito tempo

Confira se o backend responde pelo navegador ou Swagger:

```txt
http://localhost:3000/api-docs
```

Se funcionar no Swagger e falhar no app, quase sempre o problema esta no `API_URL` usado pelo dispositivo.

### Erro de `x-api-key`

Confira se o `.env` tem:

```env
X_API_KEY=app-api-key
```

Esse valor precisa bater com o valor configurado no backend.

## Scripts uteis

```bash
npm start
npm run android
npm run ios
npm test
```
