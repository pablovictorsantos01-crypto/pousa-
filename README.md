# Pousa — site de hospedagens estilo Airbnb

Site animado de hospedagens com login/cadastro (senha criptografada com bcrypt)
e banco de dados local SQLite.

## Como rodar

```bash
npm install
npm start
```

Depois abra: http://localhost:3000

## Estrutura

- `server.js` — servidor Express + rotas de API (auth, listings, favoritos)
- `db.js` — configuração do SQLite local (arquivo `pousa.db`, criado automaticamente)
- `public/` — frontend (HTML, CSS, JS puro, sem framework)
  - `index.html` — página principal com busca e grade de hospedagens
  - `login.html` / `register.html` — autenticação
  - `css/style.css` — identidade visual (paleta, tipografia, animações)
  - `js/main.js` — lógica da home (listagens, filtros, favoritos)
  - `js/auth.js` — lógica de login/cadastro

## Como funciona a autenticação

- Senhas nunca são salvas em texto puro — são hasheadas com `bcryptjs` antes de ir pro banco.
- Sessão é mantida via cookie (`express-session`), válida por 7 dias.
- Rotas de favoritos exigem login (`/api/favorites`).

## Banco de dados

SQLite local via `better-sqlite3` — o arquivo `pousa.db` é criado automaticamente
na primeira execução, com 3 tabelas: `users`, `listings`, `favorites`.
Hospedagens de exemplo já vêm populadas (8 listagens pelo Brasil).
