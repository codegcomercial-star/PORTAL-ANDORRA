# Portal Andorra - Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm 8+
- Docker & Docker Compose

### Development Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd PORTAL-ANDORRA
   pnpm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env as needed (works with defaults for demo)
   ```

3. **Start Infrastructure**
   ```bash
   pnpm docker:up
   ```

4. **Run Development Server**
   ```bash
   pnpm dev
   ```

5. **Visit Application**
   - Web: http://localhost:3000
   - Database UI: http://localhost:8080 (Adminer)
   - Email UI: http://localhost:8025 (MailHog)

## Available Scripts

- `pnpm dev` - Start development servers
- `pnpm build` - Build all applications
- `pnpm lint` - Lint all code
- `pnpm typecheck` - TypeScript validation
- `pnpm test` - Run all tests
- `pnpm docker:up` - Start Docker services
- `pnpm docker:down` - Stop Docker services

## Project Structure

```
apps/
├── web/           # Main Next.js application
├── workers/       # Background job processors
└── admin/         # Admin panel (structure ready)

packages/
├── config/        # Shared configurations
├── ui/           # Component library (ready for expansion)
├── core/         # Business logic (ready for implementation)
└── auth/         # Authentication (ready for NextAuth)
```

## Demo Features

The application runs in demo mode by default with:
- Mock BOPA documents
- Synthetic news articles  
- Simulated financial data
- Working IRPF calculator
- Background job processing

## Next Steps

1. Implement real data sources
2. Add authentication system
3. Build RAG/AI search features
4. Integrate payment system
5. Create admin panel

## Support

See README.md for detailed documentation or open GitHub issues for support.