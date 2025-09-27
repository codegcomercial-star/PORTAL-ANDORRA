#!/bin/bash

# Health Check para Portal Andorra
set -euo pipefail

echo "🏥 Verificando salud de servicios..."

# Verificar aplicación web
if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
    echo "✅ Aplicación web: HEALTHY"
else
    echo "❌ Aplicación web: UNHEALTHY"
fi

# Verificar base de datos
if docker-compose exec -T postgres pg_isready -U portal_user -d portal_andorra >/dev/null 2>&1; then
    echo "✅ PostgreSQL: HEALTHY"
else
    echo "❌ PostgreSQL: UNHEALTHY"
fi

# Verificar Redis
if docker-compose exec -T redis redis-cli ping >/dev/null 2>&1; then
    echo "✅ Redis: HEALTHY"
else
    echo "❌ Redis: UNHEALTHY"
fi

# Verificar MeiliSearch
if curl -f http://localhost:7700/health >/dev/null 2>&1; then
    echo "✅ MeiliSearch: HEALTHY"
else
    echo "❌ MeiliSearch: UNHEALTHY"
fi

echo "🏥 Health check completado"
