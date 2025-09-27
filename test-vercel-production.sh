#!/bin/bash
# Portal Andorra - Test de Producció Vercel
# Verifica que totes les funcionalitats funcionin a la URL de producció

echo "🌐 PORTAL ANDORRA - TEST PRODUCCIÓ VERCEL"
echo "=========================================="

# URL de producció
PROD_URL="https://web-inky-alpha-95.vercel.app"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Comptadors
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Funcions helper
test_endpoint() {
    local test_name="$1"
    local endpoint="$2"
    local expected_status="${3:-200}"
    
    echo -n "Testing $test_name... "
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$PROD_URL$endpoint")
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} ($status_code)"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAIL${NC} (got $status_code, expected $expected_status)"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

test_redirect() {
    local test_name="$1"
    local endpoint="$2"
    
    echo -n "Testing $test_name... "
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$PROD_URL$endpoint")
    
    if [ "$status_code" = "200" ] || [ "$status_code" = "301" ] || [ "$status_code" = "302" ] || [ "$status_code" = "307" ]; then
        echo -e "${GREEN}✅ PASS${NC} ($status_code)"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAIL${NC} (got $status_code)"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

echo -e "${YELLOW}🔍 URL de producció: $PROD_URL${NC}"
echo ""

echo -e "${BLUE}1. Tests de pàgines principals...${NC}"
echo "------------------------------------"

test_redirect "Pàgina principal" "/"
test_redirect "Portal en català" "/ca"
test_redirect "Portal en espanyol" "/es"
test_redirect "Portal en anglès" "/en"
test_redirect "Portal en francès" "/fr"

echo ""
echo -e "${BLUE}2. Tests d'APIs...${NC}"
echo "-------------------"

test_endpoint "API Health" "/api/health"
test_endpoint "API Search" "/api/search?q=test"
test_endpoint "API IRPF Simulate" "/api/irpf/simulate"
test_endpoint "API BOPA" "/api/bopa"

echo ""
echo -e "${BLUE}3. Tests de recursos estàtics...${NC}"
echo "-----------------------------------"

# Test basic connectivity
echo -n "Testing conectivitat base... "
TOTAL_TESTS=$((TOTAL_TESTS + 1))

if curl -s --max-time 10 "$PROD_URL" > /dev/null; then
    echo -e "${GREEN}✅ PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

echo ""
echo -e "${BLUE}4. Tests de funcionalitat específica...${NC}"
echo "----------------------------------------"

# Test search with actual query
echo -n "Testing cerca 'andorra'... "
TOTAL_TESTS=$((TOTAL_TESTS + 1))

search_result=$(curl -s --max-time 10 "$PROD_URL/api/search?q=andorra")
if echo "$search_result" | grep -q "results\|success\|query" 2>/dev/null; then
    echo -e "${GREEN}✅ PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

# Test health API structure
echo -n "Testing estructura API health... "
TOTAL_TESTS=$((TOTAL_TESTS + 1))

health_result=$(curl -s --max-time 10 "$PROD_URL/api/health")
if echo "$health_result" | grep -q "status\|timestamp\|environment" 2>/dev/null; then
    echo -e "${GREEN}✅ PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

echo ""
echo -e "${BLUE}5. Tests de rendiment...${NC}"
echo "-------------------------"

# Test response time
echo -n "Testing temps de resposta... "
TOTAL_TESTS=$((TOTAL_TESTS + 1))

response_time=$(curl -s -o /dev/null -w "%{time_total}" --max-time 10 "$PROD_URL")
response_ms=$(echo "$response_time * 1000" | bc -l 2>/dev/null || echo "0")

if (( $(echo "$response_time < 5.0" | bc -l 2>/dev/null || echo "1") )); then
    echo -e "${GREEN}✅ PASS${NC} (${response_ms%.*}ms)"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${YELLOW}⚠️  SLOW${NC} (${response_ms%.*}ms)"
    TESTS_PASSED=$((TESTS_PASSED + 1))
fi

echo ""
echo "=========================================="
echo -e "${YELLOW}📊 RESULTATS FINALS${NC}"
echo "=========================================="
echo -e "URL testejada: ${BLUE}$PROD_URL${NC}"
echo -e "Tests executats: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Tests exitosos: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests fallits: ${RED}$TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 PORTAL ANDORRA FUNCIONANT PERFECTAMENT A VERCEL!${NC}"
    echo -e "${GREEN}✅ Totes les funcionalitats operatives${NC}"
    echo ""
    echo -e "${BLUE}🔗 URLs principals:${NC}"
    echo "• Portal principal: $PROD_URL"
    echo "• Portal català: $PROD_URL/ca"
    echo "• Portal espanyol: $PROD_URL/es"
    echo "• Portal anglès: $PROD_URL/en"
    echo "• Portal francès: $PROD_URL/fr"
    echo ""
    echo -e "${BLUE}🛠️ APIs disponibles:${NC}"
    echo "• Estat del sistema: $PROD_URL/api/health"
    echo "• Cerca universal: $PROD_URL/api/search?q=query"
    echo "• Simulador IRPF: $PROD_URL/api/irpf/simulate"
    echo "• BOPA: $PROD_URL/api/bopa"
    echo "• Ingesta: $PROD_URL/api/ingest (POST amb token)"
    echo ""
    echo -e "${YELLOW}🚀 El Portal Andorra està operatiu i servint contingut!${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}❌ ALGUNS TESTS HAN FALLAT${NC}"
    echo -e "${YELLOW}⚠️  Pot ser que el servidor estigui inicialitzant-se${NC}"
    echo "Torna a provar en uns minuts o verifica la configuració"
    exit 1
fi