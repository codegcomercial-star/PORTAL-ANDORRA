#!/bin/bash

# Script de inicio específico para GitHub Codespaces
set -euo pipefail

echo "🔄 Iniciando Portal Andorra en GitHub Codespaces..."

# Variables de entorno específicas para Codespaces
export HOSTNAME="0.0.0.0"
export NODE_ENV="development"
export NEXT_PUBLIC_ENV="codespaces"

# URLs específicas para Codespaces
if [[ -n "${CODESPACE_NAME:-}" ]]; then
    export NEXTAUTH_URL="https://${CODESPACE_NAME}-3000.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
    export NEXT_PUBLIC_API_URL="https://${CODESPACE_NAME}-3001.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
else
    export NEXTAUTH_URL="http://localhost:3000"
    export NEXT_PUBLIC_API_URL="http://localhost:3001"
fi

echo "🌐 Portal URL: $NEXTAUTH_URL"
echo "🔗 API URL: $NEXT_PUBLIC_API_URL"

# Función para verificar si un puerto está disponible
is_port_free() {
    ! lsof -i:$1 >/dev/null 2>&1
}

# Función para esperar que un servicio esté listo
wait_for_service() {
    local port=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    echo "⏳ Esperando $service_name en puerto $port..."
    
    while [[ $attempt -le $max_attempts ]]; do
        if lsof -i:$port >/dev/null 2>&1; then
            echo "✅ $service_name está listo!"
            return 0
        fi
        
        echo "🔄 Intento $attempt/$max_attempts - $service_name aún no está listo..."
        sleep 2
        ((attempt++))
    done
    
    echo "❌ $service_name no se inició después de $max_attempts intentos"
    return 1
}

# Limpiar puertos si están ocupados
echo "🧹 Limpiando puertos..."
for port in 3000 3001 5432 6379; do
    if ! is_port_free $port; then
        echo "🔄 Liberando puerto $port..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
done

# Iniciar servicios en paralelo
echo "🚀 Iniciando servicios..."

# PostgreSQL
if is_port_free 5432; then
    echo "🗄️ Iniciando PostgreSQL..."
    docker run -d \
        --name portal-postgres \
        -p 5432:5432 \
        -e POSTGRES_DB=portal_andorra \
        -e POSTGRES_USER=portal_user \
        -e POSTGRES_PASSWORD=portal_password \
        postgres:16-alpine >/dev/null 2>&1 || true
fi

# Redis
if is_port_free 6379; then
    echo "📦 Iniciando Redis..."
    docker run -d \
        --name portal-redis \
        -p 6379:6379 \
        redis:7-alpine >/dev/null 2>&1 || true
fi

# Esperar servicios
wait_for_service 5432 "PostgreSQL" &
wait_for_service 6379 "Redis" &
wait

# Cambiar a directorio de la aplicación web
cd apps/web

# Instalar dependencias si es necesario
if [[ ! -d node_modules ]] || [[ package.json -nt node_modules ]]; then
    echo "📦 Instalando dependencias..."
    pnpm install --frozen-lockfile
fi

# Generar Prisma Client
echo "🔧 Generando Prisma Client..."
npx prisma generate --schema=../../prisma/schema.prisma || true

# Aplicar migraciones
echo "📊 Aplicando migraciones..."
npx prisma db push --schema=../../prisma/schema.prisma || echo "⚠️ Migraciones fallaron, continuando..."

# Iniciar aplicación
echo "🌐 Iniciando aplicación web en puerto 3000..."
export PORT=3000
pnpm dev
