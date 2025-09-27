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
