#!/bin/bash

# =============================================================================
# PORTAL ANDORRA - FIX ESPECÍFICO PARA GITHUB CODESPACES
# =============================================================================
# Solución definitiva para problemas de puertos en Codespaces
# =============================================================================

set -euo pipefail

echo "🚀 INICIANDO FIX PARA GITHUB CODESPACES..."

# Función para logging
log_info() {
    echo "ℹ️  $1"
}

log_success() {
    echo "✅ $1"
}

log_error() {
    echo "❌ $1"
}

# =============================================================================
# 1. DETECTAR Y MATAR PROCESOS EN PUERTOS PROBLEMÁTICOS
# =============================================================================

cleanup_ports() {
    local ports=(3000 3001 3002 3003 5432 6379 7700 8000 8080)
    
    log_info "Limpiando puertos problemáticos..."
    
    for port in "${ports[@]}"; do
        # Buscar procesos en el puerto
        local pids=$(lsof -ti:$port 2>/dev/null || true)
        
        if [[ -n "$pids" ]]; then
            log_info "Matando procesos en puerto $port: $pids"
            echo "$pids" | xargs kill -9 2>/dev/null || true
            sleep 1
        fi
        
        # Verificar que el puerto esté libre
        if ! lsof -i:$port >/dev/null 2>&1; then
            log_success "Puerto $port liberado"
        fi
    done
}

# =============================================================================
# 2. CONFIGURACIÓN ESPECÍFICA PARA CODESPACES
# =============================================================================

setup_codespaces_config() {
    log_info "Configurando para GitHub Codespaces..."
    
    # Crear directorio devcontainer si no existe
    mkdir -p .devcontainer
    
    # Crear configuración específica para Codespaces
    cat > .devcontainer/port-config.json << 'EOF'
{
  "forwardPorts": [3000, 3001, 5432, 6379, 7700],
  "portsAttributes": {
    "3000": {
      "label": "Portal Andorra Web",
      "visibility": "public",
      "onAutoForward": "openBrowser"
    },
    "3001": {
      "label": "Portal API",
      "visibility": "public"
    },
    "5432": {
      "label": "PostgreSQL",
      "visibility": "private"
    },
    "6379": {
      "label": "Redis",
      "visibility": "private"
    },
    "7700": {
      "label": "MeiliSearch",
      "visibility": "private"
    }
  }
}
EOF

    # Actualizar devcontainer.json si existe
    if [[ -f .devcontainer/devcontainer.json ]]; then
        # Backup del original
        cp .devcontainer/devcontainer.json .devcontainer/devcontainer.json.bak
        
        # Usar jq para agregar configuración de puertos
        if command -v jq >/dev/null 2>&1; then
            jq '. + {
                "forwardPorts": [3000, 3001, 5432, 6379, 7700],
                "portsAttributes": {
                    "3000": {"label": "Portal Web", "visibility": "public"},
                    "3001": {"label": "Portal API", "visibility": "public"},
                    "5432": {"label": "PostgreSQL", "visibility": "private"},
                    "6379": {"label": "Redis", "visibility": "private"},
                    "7700": {"label": "MeiliSearch", "visibility": "private"}
                }
            }' .devcontainer/devcontainer.json > .devcontainer/devcontainer.json.tmp
            mv .devcontainer/devcontainer.json.tmp .devcontainer/devcontainer.json
        fi
    fi
    
    log_success "Configuración de Codespaces actualizada"
}

# =============================================================================
# 3. SCRIPT DE INICIO ESPECÍFICO PARA CODESPACES
# =============================================================================

create_codespaces_startup() {
    log_info "Creando script de inicio para Codespaces..."
    
    cat > codespaces_start.sh << 'EOF'
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
EOF

    chmod +x codespaces_start.sh
    log_success "Script de Codespaces creado: codespaces_start.sh"
}

# =============================================================================
# 4. CONFIGURAR VARIABLES DE ENTORNO PARA CODESPACES
# =============================================================================

setup_codespaces_env() {
    log_info "Configurando variables de entorno para Codespaces..."
    
    # Crear .env específico para Codespaces
    cat > .env.codespaces << 'EOF'
# Configuración específica para GitHub Codespaces
NODE_ENV=development
NEXT_PUBLIC_ENV=codespaces

# Puertos fijos para Codespaces
PORT=3000
API_PORT=3001
DB_PORT=5432
REDIS_PORT=6379

# URLs dinámicas (se configuran en runtime)
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://portal_user:portal_password@localhost:5432/portal_andorra
REDIS_URL=redis://localhost:6379

# Configuración de desarrollo
DEBUG=true
RATE_LIMIT_ENABLED=false
CACHE_TTL_WEATHER=300
CACHE_TTL_BOPA=1800

# Secrets (configurar en Codespaces secrets)
OPENAI_API_KEY=${OPENAI_API_KEY:-}
CLAUDE_API_KEY=${CLAUDE_API_KEY:-}
WEATHER_API_KEY=${WEATHER_API_KEY:-}
NEXTAUTH_SECRET=codespaces-secret-key-change-me
EOF

    # Copiar a .env.local si no existe
    if [[ ! -f .env.local ]]; then
        cp .env.codespaces .env.local
        log_success ".env.local creado desde configuración de Codespaces"
    fi
    
    # También crear en el directorio web
    if [[ -d apps/web ]]; then
        cp .env.codespaces apps/web/.env.local
        log_success "apps/web/.env.local creado desde configuración de Codespaces"
    fi
}

# =============================================================================
# 5. VERIFICACIÓN RÁPIDA DE SERVICIOS
# =============================================================================

quick_health_check() {
    log_info "Creando verificación rápida de servicios..."
    
    # Crear script de verificación rápida
    cat > quick_check.sh << 'EOF'
#!/bin/bash

echo "🏥 Verificación rápida de Portal Andorra..."

# Verificar puertos
for port in 3000 5432 6379; do
    if lsof -i:$port >/dev/null 2>&1; then
        echo "✅ Puerto $port: ACTIVO"
    else
        echo "❌ Puerto $port: INACTIVO"
    fi
done

# Verificar URLs si estamos en Codespaces
if [[ -n "${CODESPACE_NAME:-}" ]]; then
    base_url="https://${CODESPACE_NAME}-3000.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
    echo "🌐 URL del portal: $base_url"
    
    if curl -f -s "$base_url" >/dev/null 2>&1; then
        echo "✅ Portal web: ACCESIBLE"
    else
        echo "❌ Portal web: NO ACCESIBLE"
    fi
fi

echo "🏥 Verificación completada"
EOF

    chmod +x quick_check.sh
    log_success "Verificación rápida creada: quick_check.sh"
}

# =============================================================================
# 6. SCRIPT PRINCIPAL
# =============================================================================

main() {
    echo "🚀 GITHUB CODESPACES - PORTAL ANDORRA FIX"
    echo "=========================================="
    
    # Verificar que estamos en Codespaces
    if [[ -z "${CODESPACES:-}" ]]; then
        log_error "Este script está diseñado para GitHub Codespaces"
        echo "Para otros entornos, usa: ./port_manager.sh"
        exit 1
    fi
    
    log_info "Codespace detectado: ${CODESPACE_NAME:-unknown}"
    
    # Ejecutar pasos de configuración
    cleanup_ports
    setup_codespaces_config
    create_codespaces_startup
    setup_codespaces_env
    quick_health_check
    
    echo ""
    echo "🎉 CONFIGURACIÓN DE CODESPACES COMPLETADA"
    echo "========================================"
    echo ""
    echo "🚀 PARA INICIAR EL PORTAL:"
    echo "   ./codespaces_start.sh"
    echo ""
    echo "🔍 PARA VERIFICAR ESTADO:"
    echo "   ./quick_check.sh"
    echo ""
    echo "🌐 URL del Portal (cuando esté iniciado):"
    if [[ -n "${CODESPACE_NAME:-}" ]]; then
        echo "   https://${CODESPACE_NAME}-3000.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
    else
        echo "   http://localhost:3000"
    fi
    echo ""
    log_success "¡Portal Andorra listo para Codespaces!"
}

# Ejecutar si el script es llamado directamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi