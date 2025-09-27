# 🇦🇩 Portal Andorra — Super Prompt Fusion

**Portal integral del Principat d'Andorra amb Intel·ligència Artificial avançada**

[![Deploy](https://github.com/codegcomercial-star/PORTAL-ANDORRA/workflows/deploy-vercel/badge.svg)](https://github.com/codegcomercial-star/PORTAL-ANDORRA/actions)
[![Auto Ingest](https://github.com/codegcomercial-star/PORTAL-ANDORRA/workflows/cron-news/badge.svg)](https://github.com/codegcomercial-star/PORTAL-ANDORRA/actions)
[![Tests](https://img.shields.io/badge/tests-34%2F34-brightgreen.svg)](./test-system-complete.sh)

## 🎯 **Visió General**

El Portal Andorra Super Prompt Fusion és un sistema integral automatitzat que agrega, processa i presenta informació del Principat d'Andorra utilitzant Intel·ligència Artificial avançada. **Zero manteniment manual requerit**.

### ✨ **Funcionalitats Principals**

🤖 **AUTOMATITZACIÓ TOTAL**
- Ingesta automàtica cada 15 minuts via GitHub Actions
- Deploy automàtic a Vercel en cada push
- Auto-aprovació de PRs amb workflows intel·ligents

📰 **SISTEMA DE NOTÍCIES + IA**
- Agregació RSS de 7 fonts oficials (Diari d'Andorra, Bondia, CNN, etc.)
- Anàlisi de sentiment automàtic
- Categorització i etiquetatge intel·ligent
- Suport multiidioma (ca, es, en, fr)

🏛️ **SCRAPING BOPA OFICIAL**
- Accés automatitzat al Butlletí Oficial del Principat d'Andorra
- Classificació per tipus: lleis, decrets, resolucions, anuncis
- Extracció intel·ligent de contingut i metadades
- Motor de cerca avançat per documents oficials

🏠 **IMMOBILIÀRIA + IA**
- Scraping de 4 immobiliàries principals d'Andorra
- Anàlisi de preus amb Intel·ligència Artificial
- Comparativa de mercat automatitzada
- Intel·ligència de barris i valoracions

💼 **FEINA + MATCHING IA**
- Agregació de 4 plataformes de feina principals
- Sistema de matching candidat-oferta amb IA
- Anàlisi de skills i gap detection
- Recomanacions de carrera personalitzades

🔍 **CERCA UNIVERSAL**
- Motor de cerca unificat cross-platform
- Scoring de rellevància amb IA
- Cerca semàntica avançada
- Facetes i suggeriments intel·ligents

## � **Configuració Ràpida**

### **Opció 1: Configuració Automàtica (Recomanada)**

```bash
# Clona el repositori
git clone https://github.com/codegcomercial-star/PORTAL-ANDORRA.git
cd PORTAL-ANDORRA

# Instal·la dependències
pnpm install

# Executa configuració completa automàtica
./setup-complete.sh
```

### **Opció 2: Configuració Manual**

#### **Requisits Previs**
- Node.js 18.0.0+ i pnpm 8.0.0+
- PostgreSQL o Vercel Postgres
- Compte GitHub i Vercel

#### **Passos Manuals**

```bash
# 1. Dependències
pnpm install

# 2. Variables d'entorn
cp .env.example .env.local
# Edita .env.local amb les teves configuracions

# 3. Base de dades
./setup-database.sh

# 4. GitHub Actions
./setup-github-actions.sh

# 5. Tests de verificació
./test-system-complete.sh

# 6. Desenvolupament local
pnpm dev
```

## 📋 **Variables d'Entorn Requerides**

### **Producció (GitHub Secrets)**
```env
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
BASE_URL=https://web-inky-alpha-95.vercel.app
INGEST_TOKEN=super-secret-ingest-token-2024
```

### **Desenvolupament (.env.local)**
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/portal_andorra
BASE_URL=http://localhost:3000
INGEST_TOKEN=dev-ingest-token-local-only
```

**📚 Guia completa**: [docs/GITHUB_SECRETS_GUIDE.md](./docs/GITHUB_SECRETS_GUIDE.md)

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
