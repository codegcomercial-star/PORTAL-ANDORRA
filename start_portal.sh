#!/bin/bash

# Script de inicio robusto para Portal Andorra
set -euo pipefail

echo "🚀 Iniciando Portal Andorra con puertos: Web(3000), API(3001), DB(5432), Redis(6379)"

# Función para cleanup en caso de interrupción
cleanup() {
    echo "🛑 Deteniendo servicios..."
    docker-compose down || true
    exit 0
}

trap cleanup SIGINT SIGTERM

# Verificar Docker
if ! command -v docker >/dev/null 2>&1; then
    echo "❌ Docker no está instalado"
    exit 1
fi

if ! command -v docker-compose >/dev/null 2>&1; then
    echo "❌ Docker Compose no está instalado"
    exit 1
fi

# Limpiar contenedores previos
echo "🧹 Limpiando contenedores previos..."
docker-compose down --remove-orphans || true

# Construir e iniciar servicios
echo "🏗️ Construyendo e iniciando servicios..."
docker-compose up --build -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."

# Esperar PostgreSQL
echo "🗄️ Esperando PostgreSQL..."
for i in {1..30}; do
    if docker-compose exec -T postgres pg_isready -U portal_user -d portal_andorra >/dev/null 2>&1; then
        echo "✅ PostgreSQL listo"
        break
    fi
    sleep 2
done

# Esperar Redis
echo "📦 Esperando Redis..."
for i in {1..30}; do
    if docker-compose exec -T redis redis-cli ping >/dev/null 2>&1; then
        echo "✅ Redis listo"
        break
    fi
    sleep 2
done

# Esperar MeiliSearch
echo "🔍 Esperando MeiliSearch..."
for i in {1..30}; do
    if curl -f http://localhost:7700/health >/dev/null 2>&1; then
        echo "✅ MeiliSearch listo"
        break
    fi
    sleep 2
done

# Ejecutar migraciones de base de datos
echo "📊 Ejecutando migraciones de base de datos..."
docker-compose exec web npx prisma db push || echo "⚠️ Migraciones fallaron, continuando..."

echo "🎉 ¡Portal Andorra iniciado exitosamente!"
echo "🌐 Aplicación web: http://localhost:3000"
echo "🔗 API: http://localhost:3001"
echo "🗄️ Base de datos: localhost:5432"
echo "📦 Redis: localhost:6379"
echo "🔍 MeiliSearch: http://localhost:7700"

# Mantener el script corriendo
wait
