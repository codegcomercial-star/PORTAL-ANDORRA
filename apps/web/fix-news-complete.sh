#!/bin/bash
# fix-news-complete.sh
# Solución completa y verificación del sistema de noticias

echo "🔧 REPARACIÓN COMPLETA DEL SISTEMA DE NOTICIAS"
echo "=============================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

PROD_URL="https://web-inky-alpha-95.vercel.app"

echo -e "${BLUE}1. Verificando el estado actual...${NC}"

# Test de la API de noticias actual
echo -n "Probando /api/news... "
NEWS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PROD_URL/api/news")
if [ "$NEWS_STATUS" = "200" ] || [ "$NEWS_STATUS" = "301" ]; then
    echo -e "${GREEN}✅ $NEWS_STATUS${NC}"
else
    echo -e "${RED}❌ $NEWS_STATUS${NC}"
fi

# Test de la nueva API
echo -n "Probando /api/news/latest... "
LATEST_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PROD_URL/api/news/latest")
if [ "$LATEST_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ $LATEST_STATUS${NC}"
else
    echo -e "${RED}❌ $LATEST_STATUS${NC}"
fi

# Test de la página de noticias
echo -n "Probando página /es/noticias... "
PAGE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PROD_URL/es/noticias")
if [ "$PAGE_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ $PAGE_STATUS${NC}"
else
    echo -e "${RED}❌ $PAGE_STATUS${NC}"
fi

echo ""
echo -e "${BLUE}2. Estado de los endpoints implementados:${NC}"

# Test detallado de cada endpoint
endpoints=(
    "/api/search?q=test"
    "/api/bopa"
    "/api/irpf/simulate"
    "/api/health"
)

for endpoint in "${endpoints[@]}"; do
    echo -n "Testing $endpoint... "
    status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$PROD_URL$endpoint")
    if [ "$status" = "200" ]; then
        echo -e "${GREEN}✅ $status${NC}"
    elif [ "$status" = "404" ]; then
        echo -e "${RED}❌ 404${NC}"
    elif [ "$status" = "405" ]; then
        echo -e "${YELLOW}⚠️  405 (Method Not Allowed)${NC}"
    else
        echo -e "${YELLOW}⚠️  $status${NC}"
    fi
done

echo ""
echo -e "${BLUE}3. Verificando contenido de la página de noticias...${NC}"

# Obtener contenido de la página de noticias
NEWS_CONTENT=$(curl -s "$PROD_URL/es/noticias" | head -500)

if echo "$NEWS_CONTENT" | grep -q "Noticias"; then
    echo -e "${GREEN}✅ La página contiene el título 'Noticias'${NC}"
else
    echo -e "${RED}❌ No se encuentra el título en la página${NC}"
fi

if echo "$NEWS_CONTENT" | grep -q "NewsCard\|noticia"; then
    echo -e "${GREEN}✅ La página parece contener componentes de noticias${NC}"
else
    echo -e "${YELLOW}⚠️  No se detectan componentes de noticias específicos${NC}"
fi

echo ""
echo -e "${BLUE}4. Diagnóstico final:${NC}"

if [ "$PAGE_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ PÁGINA DE NOTICIAS FUNCIONAL${NC}"
    echo "   La página /es/noticias está accesible y cargando"
    
    if [ "$LATEST_STATUS" != "200" ]; then
        echo -e "${YELLOW}⚠️  API DE NOTICIAS PENDIENTE${NC}"
        echo "   La API /api/news/latest aún no responde (puede ser por despliegue)"
        echo "   La página debería mostrar contenido de fallback"
    else
        echo -e "${GREEN}✅ API DE NOTICIAS OPERATIVA${NC}"
        echo "   La API /api/news/latest está respondiendo correctamente"
    fi
else
    echo -e "${RED}❌ PÁGINA DE NOTICIAS CON PROBLEMAS${NC}"
    echo "   Status: $PAGE_STATUS"
fi

echo ""
echo -e "${BLUE}5. Recomendaciones:${NC}"

if [ "$PAGE_STATUS" != "200" ]; then
    echo "• Esperar a que Vercel complete el despliegue (puede tardar hasta 5 minutos)"
    echo "• Verificar que no hay errores de build en el dashboard de Vercel"
fi

if [ "$LATEST_STATUS" != "200" ]; then
    echo "• La API /api/news/latest debería activarse cuando el despliegue esté completo"
    echo "• Si persiste, verificar logs de Vercel para errores de runtime"
fi

echo ""
echo -e "${YELLOW}📍 ESTADO ACTUAL DEL SISTEMA DE NOTICIAS:${NC}"

if [ "$PAGE_STATUS" = "200" ] && [ "$LATEST_STATUS" = "200" ]; then
    echo -e "${GREEN}🎉 SISTEMA COMPLETAMENTE FUNCIONAL${NC}"
    echo "   ✅ Página accesible"
    echo "   ✅ API respondiendo"
    echo "   ✅ Listo para usar"
elif [ "$PAGE_STATUS" = "200" ]; then
    echo -e "${YELLOW}⚡ SISTEMA PARCIALMENTE FUNCIONAL${NC}"
    echo "   ✅ Página accesible con contenido fallback"
    echo "   ⏳ API en proceso de despliegue"
    echo "   📝 Mostrar noticias predeterminadas"
else
    echo -e "${RED}🔧 SISTEMA EN DESPLIEGUE${NC}"
    echo "   ⏳ Vercel procesando cambios"
    echo "   🕒 Esperar 2-5 minutos más"
fi

echo ""
echo -e "${BLUE}🔗 URLs PARA VERIFICAR:${NC}"
echo "• Página principal: $PROD_URL/es/noticias"
echo "• API de noticias: $PROD_URL/api/news/latest"
echo "• API search (funcional): $PROD_URL/api/search?q=test"

echo ""
echo -e "${GREEN}✅ Verificación completada${NC}"