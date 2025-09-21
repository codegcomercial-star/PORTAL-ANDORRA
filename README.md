# Portal Andorra

Portal Econòmic d'Andorra - Una plataforma completa per accedir a informació econòmica i legal d'Andorra.

## 🚀 Característiques

- **BOPA**: Accés complet al Butlletí Oficial del Principat d'Andorra
- **Normativa**: Portal Jurídic amb totes les lleis i reglaments
- **Notícies**: Agregador de notícies dels mitjans andorrans
- **Clima**: Predicció meteorològica per Andorra
- **Finances**: Mercats, divises i criptomonedes en temps real
- **Calculadora IRPF**: Calcula els teus impostos amb les tarifes oficials
- **Cercador IA**: Pregunta qualsevol cosa sobre la normativa andorrana
- **Multiidioma**: Català, Espanyol, Anglès i Francès

## 📋 Requisits previs

- Node.js 18.0.0 o superior
- pnpm 8.0.0 o superior
- Docker i Docker Compose
- PostgreSQL amb extensió pgvector

## 🛠️ Configuració del desenvolupament

### 1. Clona el repositori

```bash
git clone <repository-url>
cd PORTAL-ANDORRA
```

### 2. Instal·la les dependències

```bash
pnpm install
```

### 3. Configura l'entorn

```bash
cp .env.example .env
```

Edita el fitxer `.env` amb les teves configuracions.

### 4. Inicia els serveis amb Docker

```bash
pnpm docker:up
```

Això iniciarà:
- PostgreSQL amb pgvector a `localhost:5432`
- Redis a `localhost:6379`
- Meilisearch a `localhost:7700`
- MailHog a `localhost:8025` (UI web)
- Adminer a `localhost:8080` (UI base de dades)

### 5. Configura la base de dades

```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

### 6. Inicia l'aplicació de desenvolupament

```bash
pnpm dev
```

L'aplicació estarà disponible a:
- Web app: http://localhost:3000
- Admin panel: http://localhost:3001
- Workers: Background processes

## 📁 Estructura del projecte

```
portal-andorra/
├── apps/
│   ├── web/                # Next.js frontend + API routes
│   ├── admin/              # Panel d'administració
│   └── workers/            # ETL, scrapers, jobs, cron
├── packages/
│   ├── ui/                 # Sistema de disseny (shadcn/ui)
│   ├── config/             # Configuracions compartides
│   ├── core/               # Lògica de negoci
│   ├── auth/               # Autenticació i autorització
│   ├── payments/           # Integració amb Stripe
│   ├── search/             # Meilisearch + pgvector
│   └── i18n/               # Internacionalització
├── infra/
│   ├── docker/             # Configuració Docker
│   ├── terraform/          # Infraestructura com a codi
│   └── scripts/            # Scripts d'utilitat
├── prisma/                 # Esquema i migracions de DB
└── docs/                   # Documentació
```

## 🔧 Scripts disponibles

- `pnpm dev` - Inicia el mode desenvolupament
- `pnpm build` - Construeix l'aplicació per producció
- `pnpm start` - Inicia l'aplicació de producció
- `pnpm lint` - Executa el linter
- `pnpm typecheck` - Verifica els tipus TypeScript
- `pnpm test` - Executa les proves
- `pnpm e2e` - Executa les proves E2E
- `pnpm db:migrate` - Aplica migracions
- `pnpm db:seed` - Genera dades de prova
- `pnpm etl:run` - Executa els processos ETL
- `pnpm search:reindex` - Reindexe la cerca

## 📊 Mode Demo

L'aplicació inclou un mode demo complet amb:
- Dades sintètiques per BOPA, normativa i notícies
- Simuladors de mercats financers i clima
- Sistema de pagaments en mode mock
- Autenticació local sense Google OAuth

## 🌍 Internacionalització

Idiomes suportats:
- **ca**: Català (per defecte)
- **es**: Espanyol
- **en**: Anglès
- **fr**: Francès

## 🔐 Autenticació

- Google OAuth (si configurat)
- Magic Links per correu
- Autenticació local en mode demo

## 💳 Sistema de pagaments

- Integració amb Stripe
- Plans Free, Premium B2C i B2B
- Mode mock sense claus API

## 🔍 Cerca i IA

- Cerca de text complet amb Meilisearch
- Cerca semàntica amb pgvector
- Cercador IA amb RAG (Retrieval Augmented Generation)
- Embeddings locals amb transformers.js

## 📈 Observabilitat

- Logs estructurats
- Mètriques de rendiment
- Monitorització d'errors
- Analytics opcionals

## 🚀 Desplegament

### Desenvolupament local
```bash
pnpm docker:up
pnpm dev
```

### Producció
```bash
pnpm build
pnpm start
```

### Amb Terraform
```bash
cd infra/terraform
terraform init
terraform plan
terraform apply
```

## 🤝 Contribució

1. Fork el projecte
2. Crea una branca per la teva funcionalitat
3. Commiteja els canvis
4. Push a la branca
5. Obre un Pull Request

## 📝 Llicència

Aquest projecte està sota llicència MIT.

## 📞 Suport

Per qualsevol dubte o problema, obre un issue a GitHub.

---

**Portal Andorra** - Tota la informació d'Andorra en un sol lloc 🇦🇩
