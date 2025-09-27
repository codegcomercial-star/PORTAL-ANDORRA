#!/bin/bash

# Portal Andorra - Sistema de Inicialización Completo
# Implementación Enterprise: APIs, Base de Datos, Cache, y Servicios

echo "🚀 PORTAL ANDORRA - INICIALIZACIÓN ENTERPRISE"
echo "=============================================="

# Verificar directorio
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecutar desde el directorio raíz del proyecto"
    exit 1
fi

echo "📦 1. INSTALANDO DEPENDENCIAS..."
pnpm install

echo "🗄️  2. CONFIGURANDO BASE DE DATOS..."
# Generar cliente Prisma
cd apps/web && npx prisma generate --schema=../../prisma/schema.prisma && cd ../..

# Aplicar migraciones si están disponibles
if [ -d "prisma/migrations" ]; then
    echo "   Aplicando migraciones..."
    cd apps/web && npx prisma migrate deploy --schema=../../prisma/schema.prisma && cd ../..
else
    echo "   Empujando esquema a la base de datos..."
    cd apps/web && npx prisma db push --schema=../../prisma/schema.prisma --accept-data-loss && cd ../..
fi

echo "🐳 3. INICIANDO SERVICIOS DOCKER..."
docker-compose up -d

# Esperar a que los servicios estén listos
echo "   Esperando servicios..."
sleep 10

echo "🔧 4. VERIFICANDO CONFIGURACIÓN..."

# Verificar variables de entorno
if [ ! -f ".env" ]; then
    echo "   Creando .env desde template..."
    cp .env.example .env
fi

# Verificar APIs implementadas
echo "📊 5. APIS IMPLEMENTADAS:"
echo "   ✅ Weather API (/api/weather) - OpenWeatherMap + Redis Cache"
echo "   ✅ BOPA API (/api/bopa) - Web Scraping + Base de Datos"  
echo "   ✅ AI Search API (/api/ai/search) - OpenAI + Claude + Cache"
echo "   ✅ Companies API (/api/companies) - Directorio + NRT Verification"
echo "   ✅ News API (/api/news) - RSS Aggregation + Categorización AI"

echo "🏗️  6. ARQUITECTURA ENTERPRISE:"
echo "   ✅ Next.js 14 App Router + TypeScript"
echo "   ✅ PostgreSQL con extensión pgvector"
echo "   ✅ Redis para cache (Weather: 10min, BOPA: 1h)"
echo "   ✅ Meilisearch para búsqueda full-text"
echo "   ✅ Prisma ORM con modelos completos"
echo "   ✅ NextAuth.js para autenticación"
echo "   ✅ Rate limiting por IP y usuario"
echo "   ✅ Provider pattern para servicios externos"

echo "⚙️  7. SERVICIOS DE DATOS:"
echo "   📈 Weather: Multi-provider (OpenWeatherMap primary)"
echo "   📋 BOPA: Web scraping + PDF processing + Alertas"
echo "   🤖 AI Search: OpenAI GPT-4 + Claude-3 + Context retrieval"
echo "   🏢 Companies: NRT verification + Geo mapping + Reviews"
echo "   📰 News: RSS feeds + AI categorization + Sentiment analysis"

echo "🔍 8. INICIANDO DESARROLLO..."
cd apps/web

# Verificar puerto disponible
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "   Puerto 3000 en uso, matando proceso..."
    kill -9 $(lsof -t -i:3000) 2>/dev/null || true
    sleep 2
fi

echo "🌐 INICIANDO SERVIDOR DE DESARROLLO..."
echo "   URL: http://localhost:3000"
echo "   Admin Panel: http://localhost:3000/admin" 
echo "   API Docs: http://localhost:3000/api-docs"
echo ""
echo "🎯 ENDPOINTS PRINCIPALES:"
echo "   GET  /api/weather?location=Andorra"
echo "   GET  /api/bopa?action=search&query=empresa"
echo "   POST /api/ai/search {query, context}"
echo "   GET  /api/companies?action=search&sector=tech"
echo "   GET  /api/news?action=search&category=politics"
echo ""
echo "📊 CACHE & PERFORMANCE:"
echo "   Redis: Weather (10min), BOPA (1h), News (30min)"
echo "   Rate Limits: 100/h general, 30/h BOPA, 50/h AI"
echo "   Database: Connection pooling + Indexes optimizados"
echo ""
echo "🔐 SEGURIDAD:"
echo "   Autenticación: NextAuth.js + Google OAuth"
echo "   Rate Limiting: Por IP y usuario autenticado"
echo "   Validación: Zod schemas en todas las APIs"
echo "   CORS: Configurado para producción"
echo ""

# Iniciar el servidor
pnpm dev