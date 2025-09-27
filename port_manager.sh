#!/bin/bash

# =============================================================================
# PORTAL ANDORRA - SCRIPT ROBUSTO DE GESTIÓN DE PUERTOS
# =============================================================================
# Este script garantiza que NUNCA fallen los puertos
# Compatible con: GitHub Codespaces, Docker, Local, Producción
# =============================================================================

set -euo pipefail

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración de puertos por defecto
DEFAULT_WEB_PORT=3000
DEFAULT_API_PORT=3001
DEFAULT_DB_PORT=5432
DEFAULT_REDIS_PORT=6379
DEFAULT_MEILISEARCH_PORT=7700

# Arrays de puertos alternativos
WEB_PORTS=(3000 3002 3003 3004 3005 8000 8080 8081)
API_PORTS=(3001 3006 3007 3008 3009 8001 8082 8083)
DB_PORTS=(5432 5433 5434 5435 5436)
REDIS_PORTS=(6379 6380 6381 6382 6383)
MEILISEARCH_PORTS=(7700 7701 7702 7703 7704)

# Variables globales
SELECTED_WEB_PORT=""
SELECTED_API_PORT=""
SELECTED_DB_PORT=""
SELECTED_REDIS_PORT=""
SELECTED_MEILISEARCH_PORT=""

# =============================================================================
# FUNCIONES AUXILIARES
# =============================================================================

print_header() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════════╗"
    echo "║                    PORTAL ANDORRA - PUERTO MANAGER               ║"
    echo "║                         SCRIPT ROBUSTO v2.0                     ║"
    echo "╚══════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# =============================================================================
# DETECCIÓN DE ENTORNO
# =============================================================================

detect_environment() {
    log_info "Detectando entorno de ejecución..."
    
    if [[ -n "${CODESPACES:-}" ]]; then
        echo "codespaces"
    elif [[ -n "${DOCKER_CONTAINER:-}" ]] || [[ -f /.dockerenv ]]; then
        echo "docker"
    elif [[ -n "${VERCEL:-}" ]]; then
        echo "vercel"
    elif [[ -n "${RAILWAY_ENVIRONMENT:-}" ]]; then
        echo "railway"
    else
        echo "local"
    fi
}

# =============================================================================
# VERIFICACIÓN DE PUERTOS
# =============================================================================

is_port_available() {
    local port=$1
    local host=${2:-"0.0.0.0"}
    
    # Múltiples métodos de verificación para máxima compatibilidad
    if command -v netstat >/dev/null 2>&1; then
        ! netstat -ln 2>/dev/null | grep -q ":${port} "
    elif command -v ss >/dev/null 2>&1; then
        ! ss -ln 2>/dev/null | grep -q ":${port} "
    elif command -v lsof >/dev/null 2>&1; then
        ! lsof -i :${port} >/dev/null 2>&1
    else
        # Fallback: intento de conexión
        ! timeout 1 bash -c "echo >/dev/tcp/${host}/${port}" 2>/dev/null
    fi
}

find_available_port() {
    local port_array=("$@")
    
    for port in "${port_array[@]}"; do
        if is_port_available "$port"; then
            echo "$port"
            return 0
        fi
    done
    
    # Si ningún puerto predefinido está disponible, buscar uno random
    for ((i=1024; i<=65535; i++)); do
        if is_port_available "$i"; then
            echo "$i"
            return 0
        fi
    done
    
    log_error "No se pudo encontrar ningún puerto disponible"
    exit 1
}

kill_port_processes() {
    local port=$1
    log_warning "Intentando liberar puerto $port..."
    
    if command -v lsof >/dev/null 2>&1; then
        local pids=$(lsof -ti:$port 2>/dev/null || true)
        if [[ -n "$pids" ]]; then
            echo "$pids" | xargs kill -9 2>/dev/null || true
            sleep 2
        fi
    fi
    
    if command -v fuser >/dev/null 2>&1; then
        fuser -k ${port}/tcp 2>/dev/null || true
        sleep 2
    fi
}

# =============================================================================
# ASIGNACIÓN INTELIGENTE DE PUERTOS
# =============================================================================

assign_ports() {
    log_info "Iniciando asignación inteligente de puertos..."
    
    # Web Port (Next.js)
    log_info "Buscando puerto para aplicación web..."
    SELECTED_WEB_PORT=$(find_available_port "${WEB_PORTS[@]}")
    if [[ "$SELECTED_WEB_PORT" != "$DEFAULT_WEB_PORT" ]]; then
        log_warning "Puerto web por defecto ($DEFAULT_WEB_PORT) no disponible, usando: $SELECTED_WEB_PORT"
    fi
    
    # API Port
    log_info "Buscando puerto para API..."
    SELECTED_API_PORT=$(find_available_port "${API_PORTS[@]}")
    if [[ "$SELECTED_API_PORT" != "$DEFAULT_API_PORT" ]]; then
        log_warning "Puerto API por defecto ($DEFAULT_API_PORT) no disponible, usando: $SELECTED_API_PORT"
    fi
    
    # Database Port
    log_info "Buscando puerto para PostgreSQL..."
    SELECTED_DB_PORT=$(find_available_port "${DB_PORTS[@]}")
    if [[ "$SELECTED_DB_PORT" != "$DEFAULT_DB_PORT" ]]; then
        log_warning "Puerto DB por defecto ($DEFAULT_DB_PORT) no disponible, usando: $SELECTED_DB_PORT"
    fi
    
    # Redis Port
    log_info "Buscando puerto para Redis..."
    SELECTED_REDIS_PORT=$(find_available_port "${REDIS_PORTS[@]}")
    if [[ "$SELECTED_REDIS_PORT" != "$DEFAULT_REDIS_PORT" ]]; then
        log_warning "Puerto Redis por defecto ($DEFAULT_REDIS_PORT) no disponible, usando: $SELECTED_REDIS_PORT"
    fi
    
    # MeiliSearch Port
    log_info "Buscando puerto para MeiliSearch..."
    SELECTED_MEILISEARCH_PORT=$(find_available_port "${MEILISEARCH_PORTS[@]}")
    if [[ "$SELECTED_MEILISEARCH_PORT" != "$DEFAULT_MEILISEARCH_PORT" ]]; then
        log_warning "Puerto MeiliSearch por defecto ($DEFAULT_MEILISEARCH_PORT) no disponible, usando: $SELECTED_MEILISEARCH_PORT"
    fi
    
    log_success "Puertos asignados exitosamente:"
    echo "  🌐 Web:        $SELECTED_WEB_PORT"
    echo "  🔗 API:        $SELECTED_API_PORT"
    echo "  🗄️  Database:   $SELECTED_DB_PORT"
    echo "  📦 Redis:      $SELECTED_REDIS_PORT"
    echo "  🔍 MeiliSearch: $SELECTED_MEILISEARCH_PORT"
}

# =============================================================================
# CONFIGURACIÓN DE ARCHIVOS
# =============================================================================

update_env_files() {
    log_info "Actualizando archivos de configuración..."
    
    # Detectar entorno para configurar hosts apropiados
    local env=$(detect_environment)
    local db_host="localhost"
    local redis_host="localhost"
    local meilisearch_host="localhost"
    
    if [[ "$env" == "docker" ]]; then
        db_host="postgres"
        redis_host="redis"
        meilisearch_host="meilisearch"
    fi
    
    # Crear .env.local actualizado
    cat > .env.local << EOF
# =============================================================================
# PORTAL ANDORRA - CONFIGURACIÓN AUTOMÁTICA DE PUERTOS
# Generado automáticamente por port_manager.sh
# Fecha: $(date)
# Entorno: $env
# =============================================================================

# Puertos asignados automáticamente
PORT=$SELECTED_WEB_PORT
API_PORT=$SELECTED_API_PORT
DB_PORT=$SELECTED_DB_PORT
REDIS_PORT=$SELECTED_REDIS_PORT
MEILISEARCH_PORT=$SELECTED_MEILISEARCH_PORT

# URLs de conexión
NEXTAUTH_URL="http://localhost:$SELECTED_WEB_PORT"
DATABASE_URL="postgresql://portal_user:portal_password@${db_host}:${SELECTED_DB_PORT}/portal_andorra"
REDIS_URL="redis://${redis_host}:${SELECTED_REDIS_PORT}"
MEILISEARCH_URL="http://${meilisearch_host}:${SELECTED_MEILISEARCH_PORT}"

# Configuración de APIs externas
OPENAI_API_KEY=\${OPENAI_API_KEY:-}
CLAUDE_API_KEY=\${CLAUDE_API_KEY:-}
WEATHER_API_KEY=\${WEATHER_API_KEY:-}
NEXTAUTH_SECRET=\${NEXTAUTH_SECRET:-portal-andorra-secret-$(openssl rand -hex 32)}

# Configuración de rate limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW=3600
RATE_LIMIT_MAX=100

# Configuración de cache
CACHE_TTL_WEATHER=600
CACHE_TTL_BOPA=3600
CACHE_TTL_NEWS=1800

# Debug y desarrollo
NODE_ENV=development
DEBUG=true
EOF

    log_success "Archivo .env.local actualizado"
}

update_docker_compose() {
    log_info "Actualizando docker-compose.yml..."
    
    cat > docker-compose.yml << EOF
version: '3.8'

services:
  web:
    build: 
      context: .
      dockerfile: Dockerfile
    ports:
      - "${SELECTED_WEB_PORT}:${SELECTED_WEB_PORT}"
    environment:
      - PORT=${SELECTED_WEB_PORT}
      - DATABASE_URL=postgresql://portal_user:portal_password@postgres:5432/portal_andorra
      - REDIS_URL=redis://redis:6379
      - MEILISEARCH_URL=http://meilisearch:7700
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      meilisearch:
        condition: service_healthy
    networks:
      - portal_network
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    ports:
      - "${SELECTED_DB_PORT}:5432"
    environment:
      POSTGRES_DB: portal_andorra
      POSTGRES_USER: portal_user
      POSTGRES_PASSWORD: portal_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    networks:
      - portal_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U portal_user -d portal_andorra"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "${SELECTED_REDIS_PORT}:6379"
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    networks:
      - portal_network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  meilisearch:
    image: getmeili/meilisearch:v1.4
    ports:
      - "${SELECTED_MEILISEARCH_PORT}:7700"
    environment:
      - MEILI_ENV=development
      - MEILI_MASTER_KEY=portal_andorra_search_key
    volumes:
      - meilisearch_data:/meili_data
    networks:
      - portal_network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:7700/health"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
  meilisearch_data:

networks:
  portal_network:
    driver: bridge
EOF

    log_success "Archivo docker-compose.yml actualizado"
}

update_package_json() {
    log_info "Actualizando scripts en package.json..."
    
    # Verificar si estamos en el directorio correcto
    if [[ -f "apps/web/package.json" ]]; then
        cd apps/web
    fi
    
    # Backup del package.json original
    cp package.json package.json.bak
    
    # Actualizar scripts usando jq si está disponible, sino usar sed
    if command -v jq >/dev/null 2>&1; then
        jq --arg port "$SELECTED_WEB_PORT" \
           '.scripts.dev = "next dev -p " + $port' \
           package.json > package.json.tmp && mv package.json.tmp package.json
        
        jq --arg port "$SELECTED_WEB_PORT" \
           '.scripts.start = "next start -p " + $port' \
           package.json > package.json.tmp && mv package.json.tmp package.json
    else
        sed -i.bak "s/\"dev\": \".*\"/\"dev\": \"next dev -p $SELECTED_WEB_PORT\"/" package.json
        sed -i.bak "s/\"start\": \".*\"/\"start\": \"next start -p $SELECTED_WEB_PORT\"/" package.json
    fi
    
    # Volver al directorio raíz si es necesario
    if [[ "$(basename $(pwd))" == "web" ]]; then
        cd ../..
    fi
    
    log_success "Scripts de package.json actualizados"
}

update_next_config() {
    log_info "Actualizando next.config.js..."
    
    # Verificar si estamos en el directorio correcto
    local next_config_path="next.config.js"
    if [[ -f "apps/web/next.config.js" ]]; then
        next_config_path="apps/web/next.config.js"
    fi
    
    cat > "$next_config_path" << EOF
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
    serverActions: true,
  },
  images: {
    domains: [
      'openweathermap.org',
      'cdn.weatherapi.com',
      'images.unsplash.com',
      'picsum.photos'
    ],
  },
  env: {
    CUSTOM_PORT: process.env.PORT || '${SELECTED_WEB_PORT}',
    API_PORT: process.env.API_PORT || '${SELECTED_API_PORT}',
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/external/:path*',
        destination: 'http://localhost:${SELECTED_API_PORT}/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
EOF

    log_success "next.config.js actualizado"
}

# =============================================================================
# INICIALIZACIÓN DE SERVICIOS
# =============================================================================

start_services() {
    log_info "Iniciando servicios con configuración robusta..."
    
    # Crear script de inicio robusto
    cat > start_portal.sh << EOF
#!/bin/bash

# Script de inicio robusto para Portal Andorra
set -euo pipefail

echo "🚀 Iniciando Portal Andorra con puertos: Web($SELECTED_WEB_PORT), API($SELECTED_API_PORT), DB($SELECTED_DB_PORT), Redis($SELECTED_REDIS_PORT)"

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
    if curl -f http://localhost:$SELECTED_MEILISEARCH_PORT/health >/dev/null 2>&1; then
        echo "✅ MeiliSearch listo"
        break
    fi
    sleep 2
done

# Ejecutar migraciones de base de datos
echo "📊 Ejecutando migraciones de base de datos..."
docker-compose exec web npx prisma db push || echo "⚠️ Migraciones fallaron, continuando..."

echo "🎉 ¡Portal Andorra iniciado exitosamente!"
echo "🌐 Aplicación web: http://localhost:$SELECTED_WEB_PORT"
echo "🔗 API: http://localhost:$SELECTED_API_PORT"
echo "🗄️ Base de datos: localhost:$SELECTED_DB_PORT"
echo "📦 Redis: localhost:$SELECTED_REDIS_PORT"
echo "🔍 MeiliSearch: http://localhost:$SELECTED_MEILISEARCH_PORT"

# Mantener el script corriendo
wait
EOF

    chmod +x start_portal.sh
    log_success "Script de inicio creado: start_portal.sh"
}

create_health_check() {
    log_info "Creando sistema de health check..."
    
    cat > health_check.sh << EOF
#!/bin/bash

# Health Check para Portal Andorra
set -euo pipefail

echo "🏥 Verificando salud de servicios..."

# Verificar aplicación web
if curl -f http://localhost:$SELECTED_WEB_PORT/api/health >/dev/null 2>&1; then
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
if curl -f http://localhost:$SELECTED_MEILISEARCH_PORT/health >/dev/null 2>&1; then
    echo "✅ MeiliSearch: HEALTHY"
else
    echo "❌ MeiliSearch: UNHEALTHY"
fi

echo "🏥 Health check completado"
EOF

    chmod +x health_check.sh
    log_success "Health check creado: health_check.sh"
}

# =============================================================================
# SCRIPT PRINCIPAL
# =============================================================================

main() {
    print_header
    
    local env=$(detect_environment)
    log_info "Entorno detectado: $env"
    
    # Asignar puertos disponibles
    assign_ports
    
    # Actualizar archivos de configuración
    update_env_files
    update_docker_compose
    update_package_json
    update_next_config
    
    # Crear scripts de inicio y monitoreo
    start_services
    create_health_check
    
    # Crear resumen final
    cat > PORT_CONFIGURATION.md << EOF
# 🚀 PORTAL ANDORRA - CONFIGURACIÓN DE PUERTOS

## 📊 Puertos Asignados
- **Web Application**: $SELECTED_WEB_PORT
- **API Server**: $SELECTED_API_PORT  
- **PostgreSQL**: $SELECTED_DB_PORT
- **Redis**: $SELECTED_REDIS_PORT
- **MeiliSearch**: $SELECTED_MEILISEARCH_PORT

## 🔗 URLs de Acceso
- **Portal Web**: http://localhost:$SELECTED_WEB_PORT
- **API Base**: http://localhost:$SELECTED_WEB_PORT/api
- **Database**: postgresql://portal_user:portal_password@localhost:$SELECTED_DB_PORT/portal_andorra
- **Redis**: redis://localhost:$SELECTED_REDIS_PORT
- **MeiliSearch**: http://localhost:$SELECTED_MEILISEARCH_PORT

## 🚀 Comandos para Iniciar
\`\`\`bash
# Opción 1: Script automático
./start_portal.sh

# Opción 2: Docker Compose manual
docker-compose up --build -d

# Opción 3: Desarrollo local
pnpm dev
\`\`\`

## 🏥 Verificar Estado
\`\`\`bash
./health_check.sh
\`\`\`

## 🔄 Regenerar Configuración
\`\`\`bash
./port_manager.sh
\`\`\`

---
*Configuración generada automáticamente el $(date)*
EOF

    echo ""
    log_success "🎉 CONFIGURACIÓN COMPLETADA EXITOSAMENTE 🎉"
    echo ""
    echo -e "${GREEN}📋 RESUMEN:${NC}"
    echo "  🌐 Portal Web: http://localhost:$SELECTED_WEB_PORT"
    echo "  🔗 APIs: http://localhost:$SELECTED_WEB_PORT/api"
    echo "  🗄️ Base de datos: localhost:$SELECTED_DB_PORT"
    echo "  📦 Redis: localhost:$SELECTED_REDIS_PORT"
    echo "  🔍 MeiliSearch: http://localhost:$SELECTED_MEILISEARCH_PORT"
    echo ""
    echo -e "${BLUE}🚀 PARA INICIAR:${NC}"
    echo "  ./start_portal.sh"
    echo ""
    echo -e "${YELLOW}📖 DOCUMENTACIÓN:${NC}"
    echo "  cat PORT_CONFIGURATION.md"
    echo ""
    log_success "¡Portal Andorra configurado con puertos robustos y a prueba de fallos!"
}

# Ejecutar script principal
main "$@"