# Portal Andorra - Documentación Técnica Enterprise

## 📊 RESUMEN EJECUTIVO

Portal Andorra ha sido completamente auditado, corregido e implementado como una **plataforma enterprise robusta** con arquitectura de microservicios, APIs RESTful completas, cache inteligente, y servicios de datos en tiempo real.

### ✅ IMPLEMENTACIÓN COMPLETADA (100%)

**10 Sistemas Principales Implementados:**
1. **API Weather** - Servicio meteorológico multi-proveedor
2. **API BOPA** - Web scraping del Butlletí Oficial  
3. **API AI Search** - Búsqueda inteligente con IA
4. **API Companies** - Directorio empresarial con verificación NRT
5. **API News** - Agregación de noticias con categorización IA
6. **Sistema de Autenticación** - NextAuth.js + OAuth
7. **Base de Datos** - PostgreSQL + pgvector + Redis
8. **Rate Limiting** - Control de acceso por IP/usuario
9. **Caching Strategy** - Redis con TTL optimizado
10. **Docker Architecture** - Servicios containerizados

---

## 🏗️ ARQUITECTURA ENTERPRISE

### Stack Tecnológico
```
Frontend:     Next.js 14 App Router + TypeScript + Tailwind CSS
Backend:      Next.js API Routes + tRPC
Database:     PostgreSQL 16 + pgvector extension  
Cache:        Redis 7 + TTL strategies
Search:       Meilisearch + Full-text indexing
Auth:         NextAuth.js 4.24 + Google OAuth
ORM:          Prisma 5.22 + Connection pooling
Validation:   Zod schemas + Type safety
Monitoring:   Built-in analytics + Error tracking
```

### Microservicios Implementados
```
🌤️  Weather Service    - Multi-provider weather data
📋 BOPA Service        - Official bulletin scraping
🤖 AI Search Service   - Multi-model AI responses  
🏢 Company Service     - Business directory + NRT
📰 News Service        - RSS aggregation + AI categorization
```

---

## 📡 APIs IMPLEMENTADAS

### 1. Weather API (`/api/weather`)

**Características:**
- Provider principal: OpenWeatherMap
- Fallback automático a servicios alternativos
- Cache Redis: 10 minutos TTL
- Almacenamiento en PostgreSQL
- Rate limit: 100 requests/hora

**Endpoints:**
```bash
GET  /api/weather?location=Andorra&lang=es
POST /api/weather/alerts
GET  /api/weather/forecast?location=Andorra&days=7
```

**Respuesta Example:**
```json
{
  "success": true,
  "data": {
    "location": "Andorra la Vella",
    "temperature": 15.2,
    "condition": "Partly Cloudy",
    "humidity": 65,
    "windSpeed": 12.5,
    "forecast": [...]
  },
  "cached": false,
  "timestamp": "2024-12-08T10:30:00Z"
}
```

### 2. BOPA API (`/api/bopa`)

**Características:**
- Web scraping del sitio oficial BOPA
- Procesamiento de PDFs
- Sistema de alertas por email
- Cache Redis: 1 hora TTL
- Búsqueda full-text

**Endpoints:**
```bash
GET  /api/bopa?action=search&query=empresa&category=laws
POST /api/bopa (crear alerta)
GET  /api/bopa?action=categories
GET  /api/bopa?action=alerts (usuario logueado)
```

### 3. AI Search API (`/api/ai/search`)

**Características:**
- Modelos: OpenAI GPT-4 + Claude-3 Haiku
- Context retrieval inteligente
- Cache de consultas frecuentes: 1 hora
- Rate limiting: 50 requests/hora

**Endpoints:**
```bash
POST /api/ai/search
Body: {
  "query": "Como crear una empresa en Andorra",
  "context": "laws",
  "maxTokens": 1000
}

GET /api/ai/search?action=history (usuario)
GET /api/ai/search?action=suggestions&query=empresa
```

### 4. Companies API (`/api/companies`)

**Características:**
- Verificación NRT automática
- Geolocalización con coordenadas
- Sistema de reviews y ratings
- Cache por sectores: 1 hora

**Endpoints:**
```bash
GET  /api/companies?action=search&sector=technology
GET  /api/companies?action=details&id=company-id
POST /api/companies (crear empresa)
PUT  /api/companies?id=company-id (actualizar)
GET  /api/companies?action=sectors
```

### 5. News API (`/api/news`)

**Características:**
- RSS feeds: andorradifusio.ad, govern.ad, rtva.ad
- Categorización automática con IA
- Análisis de sentimiento
- Cache: 30 minutos TTL

**Endpoints:**
```bash
GET /api/news?action=search&category=politics
GET /api/news?action=categories
GET /api/news?action=article&id=article-id
```

---

## 🗄️ BASE DE DATOS

### Modelos Principales
```sql
-- Usuarios y Autenticación
User, Account, Session, Role, Permission

-- BOPA Sistema
BopaEntry, BopaAlert 

-- Empresas
Company, CompanyView, Review

-- Noticias
NewsArticle

-- Weather
WeatherData, WeatherForecast

-- Búsquedas
SearchHistory

-- Sistema
ApiKey, ApiWebhook, AuditLog
```

### Indexes Optimizados
```sql
-- Performance indexes
CREATE INDEX idx_bopa_published_date ON bopa_entries(published_date);
CREATE INDEX idx_bopa_category ON bopa_entries(category);
CREATE INDEX idx_companies_sector ON companies(sector);
CREATE INDEX idx_news_category ON news_articles(category);
CREATE INDEX idx_weather_location ON weather_data(location);
```

---

## ⚡ CACHING STRATEGY

### Redis TTL Configuration
```javascript
Weather Data:     600s  (10 minutos)
BOPA Results:     3600s (1 hora) 
AI Responses:     3600s (1 hora)
Company Search:   3600s (1 hora)
News Articles:    1800s (30 minutos)
User Sessions:    86400s (24 horas)
```

### Cache Keys Pattern
```
weather:{location}:{timestamp}
bopa:search:{query_hash}
ai:search:{query_hash}
companies:search:{params_hash}
news:search:{params_hash}
```

---

## 🔒 SEGURIDAD & RATE LIMITING

### Rate Limits por Endpoint
```javascript
General APIs:     100 requests/hora por IP
BOPA API:         30 requests/hora por IP
AI Search:        50 requests/hora por IP
Authenticated:    5x multiplier
Admin Users:      No limits
```

### Autenticación
```javascript
// NextAuth.js Configuration
Providers: Google OAuth + Credentials
Session: JWT strategy
Callbacks: Role-based access
Pages: Custom sign-in/sign-up
```

---

## 🐳 DEPLOYMENT DOCKER

### Services Configuration
```yaml
services:
  postgres:
    image: postgres:16-alpine
    extensions: [vector]
    volumes: [./infra/docker/postgres/init.sql]
    
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    
  meilisearch:
    image: getmeili/meilisearch:v1.5
    environment: [MEILI_ENV=production]
    
  adminer:
    image: adminer
    ports: ["8080:8080"]
```

### Environment Variables
```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/portal_andorra"

# Cache
REDIS_HOST="localhost"
REDIS_PORT="6379"

# APIs
OPENAI_API_KEY="sk-..."
CLAUDE_API_KEY="sk-ant-..."
OPENWEATHERMAP_API_KEY="..."

# Auth
NEXTAUTH_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

---

## 🚀 DEPLOYMENT & OPERATIONS

### Inicialización Rápida
```bash
# Clonar e inicializar
git clone [repo]
cd portal-andorra
./init-enterprise.sh
```

### Scripts Disponibles
```bash
pnpm dev          # Desarrollo
pnpm build        # Build producción
pnpm start        # Producción
pnpm db:generate  # Generar Prisma client
pnpm db:migrate   # Aplicar migraciones
pnpm db:studio    # Prisma Studio
docker-compose up # Servicios Docker
```

### Monitoring & Health Checks
```bash
# Health endpoints
GET /api/health
GET /api/health/database
GET /api/health/redis
GET /api/health/services
```

---

## 📊 PERFORMANCE METRICS

### Benchmarks Esperados
```
Database Queries:     <100ms promedio
API Response Times:   <200ms sin cache, <50ms con cache
Cache Hit Ratio:      >80% para consultas frecuentes
Concurrent Users:     1000+ usuarios simultáneos
Throughput:           10,000+ requests/minuto
```

### Optimizaciones Implementadas
- Connection pooling en Prisma
- Lazy loading de componentes
- Image optimization automática
- Bundle splitting por rutas
- Service Worker para cache offline

---

## 🔧 TROUBLESHOOTING

### Problemas Comunes
```bash
# Reset completo
docker-compose down
docker system prune
./init-enterprise.sh

# Regenerar Prisma
cd apps/web
npx prisma generate --schema=../../prisma/schema.prisma

# Verificar servicios
docker-compose ps
redis-cli ping
psql -h localhost -U postgres -d portal_andorra -c "SELECT 1"
```

### Logs & Debugging
```bash
# Ver logs de servicios
docker-compose logs postgres
docker-compose logs redis
docker-compose logs meilisearch

# Logs de aplicación
cd apps/web && pnpm dev --verbose
```

---

## 🎯 PRÓXIMOS PASOS ENTERPRISE

### Fase 2 - Escalabilidad
- [ ] Kubernetes deployment
- [ ] CDN integration (Cloudflare)
- [ ] Multi-region database replication
- [ ] Advanced monitoring (Grafana + Prometheus)

### Fase 3 - Features Avanzadas  
- [ ] Real-time notifications (WebSockets)
- [ ] Advanced analytics dashboard
- [ ] ML-powered recommendations
- [ ] Multi-language content management

---

## 📞 CONTACTO TÉCNICO

Para soporte técnico o consultas sobre la implementación enterprise:

- **Documentación**: Ver `docs/` folder
- **API Testing**: Postman collection disponible
- **Database Schema**: Prisma Studio en http://localhost:5555
- **Admin Panel**: http://localhost:3000/admin

---

**Estado del Proyecto: ✅ PRODUCTION READY**

La implementación enterprise del Portal Andorra está **completa y operativa**, con todas las funcionalidades solicitadas implementadas, probadas y documentadas según especificaciones enterprise.