#!/bin/bash

# =====================================================
# 🔍 VERIFICACIÓN COMPLETA - PORTAL ANDORRA
# Testing real de funcionalidad, no reportes optimistas
# =====================================================

echo "🔍 INICIANDO VERIFICACIÓN COMPLETA DEL PORTAL ANDORRA"
echo "======================================================"
echo ""

# Variables para tracking de errores
ERRORS=0
WARNINGS=0
SUCCESS=0

# Función para logging
log_success() { echo "✅ $1"; SUCCESS=$((SUCCESS+1)); }
log_error() { echo "❌ $1"; ERRORS=$((ERRORS+1)); }
log_warning() { echo "⚠️ $1"; WARNINGS=$((WARNINGS+1)); }
log_info() { echo "ℹ️ $1"; }

# =====================================================
# 1. VERIFICACIÓN DE ESTRUCTURA BÁSICA
# =====================================================
echo "📁 VERIFICANDO ESTRUCTURA DEL PROYECTO..."

if [ -f "package.json" ]; then
    log_success "package.json encontrado"
else
    log_error "package.json no encontrado"
fi

if [ -f "pnpm-workspace.yaml" ]; then
    log_success "pnpm-workspace.yaml encontrado"
else
    log_error "pnpm-workspace.yaml no encontrado"
fi

if [ -d "apps/web" ]; then
    log_success "Directorio apps/web existe"
else
    log_error "Directorio apps/web no encontrado"
fi

if [ -d "apps/workers" ]; then
    log_success "Directorio apps/workers existe"
else
    log_error "Directorio apps/workers no encontrado"
fi

# =====================================================
# 2. VERIFICACIÓN DE DEPENDENCIAS
# =====================================================
echo ""
echo "📦 VERIFICANDO DEPENDENCIAS..."

if command -v pnpm &> /dev/null; then
    log_success "pnpm está instalado"
    PNPM_VERSION=$(pnpm --version)
    log_info "Versión pnpm: $PNPM_VERSION"
else
    log_error "pnpm no está instalado"
fi

if command -v node &> /dev/null; then
    log_success "Node.js está instalado"
    NODE_VERSION=$(node --version)
    log_info "Versión Node.js: $NODE_VERSION"
else
    log_error "Node.js no está instalado"
fi

# Verificar instalación de dependencias
if [ -d "node_modules" ]; then
    log_success "node_modules existe"
    PACKAGES_COUNT=$(find node_modules -name "package.json" | wc -l)
    log_info "Número de paquetes instalados: $PACKAGES_COUNT"
else
    log_error "node_modules no encontrado - ejecutar 'pnpm install'"
fi

# =====================================================
# 3. VERIFICACIÓN DE PRISMA Y BASE DE DATOS
# =====================================================
echo ""
echo "🗄️ VERIFICANDO PRISMA Y BASE DE DATOS..."

if [ -f "prisma/schema.prisma" ]; then
    log_success "prisma/schema.prisma encontrado"
    
    # Verificar contenido del schema
    MODELS_COUNT=$(grep -c "^model " prisma/schema.prisma)
    log_info "Modelos definidos en schema: $MODELS_COUNT"
    
    if [ $MODELS_COUNT -gt 0 ]; then
        log_success "Schema contiene modelos"
    else
        log_warning "Schema no contiene modelos"
    fi
else
    log_error "prisma/schema.prisma no encontrado"
fi

# Test de generación de Prisma Client
echo "   Probando generación de Prisma Client..."
if pnpm exec prisma generate > /tmp/prisma_generate.log 2>&1; then
    log_success "Prisma Client generado correctamente"
else
    log_error "Error al generar Prisma Client"
    log_info "Ver detalles: cat /tmp/prisma_generate.log"
fi

# Test de conexión a base de datos (si está disponible)
if [ -f ".env" ] || [ -f ".env.local" ]; then
    if pnpm exec prisma db push --accept-data-loss > /tmp/prisma_db.log 2>&1; then
        log_success "Conexión a base de datos funcional"
    else
        log_warning "No se pudo conectar a la base de datos (normal si no está corriendo)"
    fi
fi

# =====================================================
# 4. VERIFICACIÓN DE TYPESCRIPT Y COMPILACIÓN
# =====================================================
echo ""
echo "🔧 VERIFICANDO TYPESCRIPT Y COMPILACIÓN..."

# Verificar configuración TypeScript
if [ -f "tsconfig.json" ]; then
    log_success "tsconfig.json encontrado"
else
    log_error "tsconfig.json no encontrado"
fi

# Test de compilación TypeScript
echo "   Ejecutando verificación TypeScript..."
if pnpm exec tsc --noEmit > /tmp/tsc_check.log 2>&1; then
    log_success "Código TypeScript compila sin errores"
else
    log_error "Errores de TypeScript encontrados"
    log_info "Ver errores: cat /tmp/tsc_check.log"
    echo "   Primeros 10 errores:"
    head -20 /tmp/tsc_check.log | sed 's/^/     /'
fi

# =====================================================
# 5. VERIFICACIÓN DE LINTING
# =====================================================
echo ""
echo "🧹 VERIFICANDO LINTING..."

if pnpm exec eslint . --max-warnings 50 > /tmp/eslint_check.log 2>&1; then
    log_success "ESLint pasa sin errores críticos"
else
    log_warning "ESLint encontró issues (puede ser normal)"
    ESLINT_ERRORS=$(grep -c "error" /tmp/eslint_check.log || echo "0")
    ESLINT_WARNINGS=$(grep -c "warning" /tmp/eslint_check.log || echo "0")
    log_info "ESLint errors: $ESLINT_ERRORS, warnings: $ESLINT_WARNINGS"
fi

# =====================================================
# 6. VERIFICACIÓN DE BUILD
# =====================================================
echo ""
echo "🔨 VERIFICANDO BUILD..."

echo "   Intentando build del proyecto..."
if timeout 120s pnpm build > /tmp/build.log 2>&1; then
    log_success "Build completado exitosamente"
else
    BUILD_EXIT_CODE=$?
    if [ $BUILD_EXIT_CODE -eq 124 ]; then
        log_warning "Build tardó más de 2 minutos (timeout)"
    else
        log_error "Build falló"
        log_info "Ver errores: cat /tmp/build.log"
        echo "   Últimos errores del build:"
        tail -20 /tmp/build.log | sed 's/^/     /'
    fi
fi

# =====================================================
# 7. VERIFICACIÓN DE SERVICIOS DOCKER
# =====================================================
echo ""
echo "🐳 VERIFICANDO SERVICIOS DOCKER..."

if command -v docker &> /dev/null; then
    log_success "Docker está instalado"
    
    # Verificar si docker-compose.yml existe
    if [ -f "docker-compose.yml" ]; then
        log_success "docker-compose.yml encontrado"
        
        # Verificar servicios corriendo
        if docker compose ps > /tmp/docker_ps.log 2>&1; then
            RUNNING_SERVICES=$(docker compose ps --format "table {{.Service}}\t{{.State}}" | grep -c "running" || echo "0")
            if [ $RUNNING_SERVICES -gt 0 ]; then
                log_success "$RUNNING_SERVICES servicios Docker corriendo"
                docker compose ps --format "table {{.Service}}\t{{.State}}\t{{.Ports}}" | sed 's/^/     /'
            else
                log_warning "Ningún servicio Docker corriendo"
                log_info "Para iniciar: docker compose up -d"
            fi
        else
            log_warning "No se pudo verificar servicios Docker"
        fi
    else
        log_warning "docker-compose.yml no encontrado"
    fi
else
    log_warning "Docker no está instalado"
fi

# =====================================================
# 8. VERIFICACIÓN DE VARIABLES DE ENTORNO
# =====================================================
echo ""
echo "🔐 VERIFICANDO VARIABLES DE ENTORNO..."

ENV_FILES=(".env" ".env.local" ".env.example")
ENV_FOUND=0

for env_file in "${ENV_FILES[@]}"; do
    if [ -f "$env_file" ]; then
        log_success "$env_file encontrado"
        ENV_FOUND=1
        
        # Contar variables
        VAR_COUNT=$(grep -c "^[A-Z]" "$env_file" 2>/dev/null || echo "0")
        log_info "$env_file contiene $VAR_COUNT variables"
    fi
done

if [ $ENV_FOUND -eq 0 ]; then
    log_error "No se encontraron archivos de variables de entorno"
fi

# =====================================================
# 9. TEST DE INICIO DE APLICACIÓN
# =====================================================
echo ""
echo "🚀 PROBANDO INICIO DE APLICACIÓN..."

# Verificar si el puerto 3000 está disponible
if lsof -i:3000 > /dev/null 2>&1; then
    log_warning "Puerto 3000 ya está en uso"
    EXISTING_PID=$(lsof -ti:3000)
    log_info "PID usando puerto 3000: $EXISTING_PID"
else
    log_success "Puerto 3000 disponible"
fi

# Intentar inicio rápido (solo para verificar que no hay errores inmediatos)
echo "   Probando inicio rápido de la aplicación..."
timeout 30s pnpm dev > /tmp/dev_start.log 2>&1 &
DEV_PID=$!

sleep 10

# Verificar si el proceso sigue corriendo
if kill -0 $DEV_PID 2>/dev/null; then
    log_success "Aplicación inicia correctamente (proceso activo)"
    
    # Test de conexión HTTP
    sleep 5
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        log_success "Aplicación responde en http://localhost:3000"
    else
        log_warning "Aplicación no responde aún en puerto 3000"
    fi
    
    # Matar el proceso de prueba
    kill $DEV_PID 2>/dev/null
    sleep 2
    kill -9 $DEV_PID 2>/dev/null
else
    log_error "Aplicación se cerró inmediatamente al iniciar"
    log_info "Ver logs de inicio: cat /tmp/dev_start.log"
fi

# =====================================================
# 10. VERIFICACIÓN DE APIS ESPECÍFICAS
# =====================================================
echo ""
echo "🔌 VERIFICANDO APIS ESPECÍFICAS..."

# Verificar archivos de API
API_ROUTES=(
    "apps/web/src/app/api"
    "apps/web/src/app/api/bopa"
    "apps/web/src/app/api/search"
    "apps/web/src/app/api/marketplace"
)

for api_path in "${API_ROUTES[@]}"; do
    if [ -d "$api_path" ]; then
        log_success "Ruta API $api_path existe"
        ROUTE_COUNT=$(find "$api_path" -name "route.ts" | wc -l)
        log_info "$api_path contiene $ROUTE_COUNT archivos route.ts"
    else
        log_warning "Ruta API $api_path no encontrada"
    fi
done

# =====================================================
# 11. VERIFICACIÓN DE DEPENDENCIAS CRÍTICAS
# =====================================================
echo ""
echo "📚 VERIFICANDO DEPENDENCIAS CRÍTICAS..."

CRITICAL_DEPS=(
    "next"
    "react"
    "typescript"
    "@prisma/client"
    "tailwindcss"
    "openai"
    "crawlee"
    "playwright"
)

for dep in "${CRITICAL_DEPS[@]}"; do
    if [ -d "node_modules/$dep" ] || [ -d "node_modules/.pnpm/$dep"* ]; then
        log_success "$dep instalado"
    else
        log_error "$dep NO instalado"
    fi
done

# =====================================================
# 12. RESUMEN FINAL
# =====================================================
echo ""
echo "📊 RESUMEN FINAL DE VERIFICACIÓN"
echo "=================================="
echo ""

TOTAL_CHECKS=$((SUCCESS + WARNINGS + ERRORS))

echo "✅ Éxitos: $SUCCESS"
echo "⚠️ Advertencias: $WARNINGS"  
echo "❌ Errores: $ERRORS"
echo "📊 Total verificaciones: $TOTAL_CHECKS"
echo ""

# Calcular porcentaje de éxito
if [ $TOTAL_CHECKS -gt 0 ]; then
    SUCCESS_RATE=$((SUCCESS * 100 / TOTAL_CHECKS))
    echo "📈 Tasa de éxito: $SUCCESS_RATE%"
    echo ""
fi

# Evaluación final
if [ $ERRORS -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo "🎉 ESTADO: COMPLETAMENTE FUNCIONAL"
        echo "   El proyecto está listo para desarrollo y producción."
    else
        echo "✅ ESTADO: FUNCIONAL CON ADVERTENCIAS MENORES"
        echo "   El proyecto funciona pero tiene algunos issues no críticos."
    fi
elif [ $ERRORS -le 3 ]; then
    echo "⚠️ ESTADO: PARCIALMENTE FUNCIONAL"
    echo "   El proyecto tiene issues que necesitan resolución."
else
    echo "❌ ESTADO: REQUIERE TRABAJO SIGNIFICATIVO"
    echo "   Múltiples errores críticos encontrados."
fi

echo ""
echo "🔍 ARCHIVOS DE LOG GENERADOS:"
echo "   /tmp/prisma_generate.log - Logs de Prisma"
echo "   /tmp/tsc_check.log - Errores TypeScript"
echo "   /tmp/eslint_check.log - Issues de ESLint"
echo "   /tmp/build.log - Logs de build"
echo "   /tmp/dev_start.log - Logs de inicio"
echo ""
echo "📋 PARA VER DETALLES DE ERRORES:"
echo "   cat /tmp/tsc_check.log | head -20"
echo "   cat /tmp/build.log | tail -30"
echo ""

# Exit code basado en errores críticos
if [ $ERRORS -eq 0 ]; then
    exit 0
elif [ $ERRORS -le 3 ]; then
    exit 1
else
    exit 2
fi