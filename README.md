# HelpDog

Campanha solidária para **arrecadar recursos e alimentar cães de rua**.

**Site (GitHub Pages):** https://camilagoulartsoares.github.io/helpdog/

**Repositório:** https://github.com/camilagoulartsoares/helpdog

Projeto pessoal de [Camila Goulart Soares](https://github.com/camilagoulartsoares).

---

## Sobre a causa

Muitos cães vivem nas ruas sem alimentação regular. O HelpDog é uma vitrine digital da campanha: explica a causa, sugere valores de doação, registra contribuições e mostra o progresso da meta mensal de ração.

Com **a partir de R$ 1,00** já é possível ajudar.

---

## O que este projeto tem

### Frontend (Vue 3)

- Landing page com hero, sobre e produtos sugeridos
- Animações de entrada e layout responsivo
- Seção de doação com:
  - barra de progresso da meta
  - valores sugeridos (R$ 5, 10, 25, 50)
  - formulário (nome, e-mail opcional, valor, mensagem)
  - lista das doações mais recentes
- Botões dos produtos que sugerem um valor e levam até o formulário
- Proxy de desenvolvimento (`/api` → API local)
- Deploy estático no **GitHub Pages**

### Backend (Node.js)

- API REST com **Express**
- Validação de dados com **Zod**
- Banco **SQLite** via **Prisma ORM**
- Seed inicial (campanha + doações de exemplo)
- Endpoints:
  - `GET /api/health` — health check
  - `GET /api/campaign` — meta, arrecadado, % e nº de doadores
  - `GET /api/donations` — últimas doações
  - `POST /api/donations` — registra nova doação

### DevOps / DX

- Workflow GitHub Actions para build + deploy no Pages
- Scripts para subir frontend e API juntos
- `.env.example` para configurar a API

---

## Stack

| Camada | Tecnologias |
| --- | --- |
| Frontend | Vue 3, TypeScript, Vite, CSS próprio |
| Backend | Node.js, Express, Zod |
| Banco | SQLite + Prisma ORM |
| Deploy | GitHub Pages + GitHub Actions |
| DX | concurrently, tsx |

---

## Como rodar localmente (frontend + API)

### 1. Instalar dependências

```bash
npm install
npm install --prefix server
```

### 2. Subir tudo

```bash
npm run db:setup
npm run dev:all
```

- Frontend: http://localhost:5173/helpdog/
- API: http://localhost:3333

### Alternativa (dois terminais)

```bash
# terminal 1 — API
npm run db:setup
npm run dev:api

# terminal 2 — frontend
npm run dev
```

### Variáveis da API (`server/.env`)

```env
DATABASE_URL="file:./dev.db"
PORT=3333
CORS_ORIGIN="http://localhost:5173"
```

Exemplo em `server/.env.example`.

---

## Exemplo de doação (API)

```bash
curl -X POST http://localhost:3333/api/donations \
  -H "Content-Type: application/json" \
  -d '{
    "donorName": "Camila",
    "donorEmail": "camila@email.com",
    "amountCents": 2500,
    "message": "Para os doguinhos comerem bem"
  }'
```

> `amountCents` usa centavos: `2500` = R$ 25,00.

---

## Estrutura do repositório

```text
helpdog/
├── .github/workflows/deploy.yml   # Deploy automático no GitHub Pages
├── public/                        # Imagens e assets
├── src/                           # Frontend Vue
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── server/                        # Backend Express + Prisma
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── index.ts
│       ├── db.ts
│       └── routes/
│           ├── campaign.ts
│           └── donations.ts
├── package.json
├── vite.config.ts
└── README.md
```

---

## GitHub Pages

O frontend é publicado automaticamente a cada push na branch `main`.

1. Workflow: `.github/workflows/deploy.yml`
2. Build: `npm ci` + `npm run build`
3. Publicação do conteúdo da pasta `dist`
4. URL: https://camilagoulartsoares.github.io/helpdog/

### Importante sobre doações no Pages

O GitHub Pages hospeda **somente arquivos estáticos**. A API (Express + SQLite) roda no seu computador (ou em um host separado, como Render/Railway).

No site publicado:

- a landing e o layout funcionam normalmente
- se a API não estiver online, a seção de doação mostra um modo demonstração / aviso amigável

Para testar doações de ponta a ponta, use o ambiente local (`npm run dev:all`).

### Ativar Pages no repositório (se ainda não estiver)

No GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

---

## Scripts úteis

| Script | O que faz |
| --- | --- |
| `npm run dev` | Sobe só o frontend |
| `npm run dev:api` | Sobe só a API |
| `npm run dev:all` | Sobe frontend + API |
| `npm run db:setup` | Gera Prisma Client, cria DB e roda seed |
| `npm run build` | Build de produção do frontend |
| `npm run build:api` | Build da API |

---

## Próximos passos

- Integração real com Pix / gateway de pagamento
- Hospedar a API (Render, Railway, Fly.io)
- Painel admin para acompanhar doações
- Moderação de mensagens públicas

---

## Licença / uso

Projeto educacional e solidário. Sinta-se livre para adaptar a causa e a identidade visual, mantendo o respeito aos animais e a transparência da arrecadação.
