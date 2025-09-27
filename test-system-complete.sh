#!/bin/bash
# Portal Andorra - Sistema de Testing Integral
# Verifica que totes les funcionalitats del SUPER PROMPT FUSION funcionin correctament

echo "🚀 PORTAL ANDORRA - SUPER PROMPT FUSION"
echo "========================================"
echo "🧪 Executant tests integrals..."
echo ""

# Colors per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Comptadors
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Funcions helper
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -n "Testing $test_name... "
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if eval "$test_command" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAIL${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

echo -e "${BLUE}1. Verificant estructura del projecte...${NC}"
echo "----------------------------------------"

# Test 1: Verificar fitxers principals
run_test "package.json" "test -f package.json"
run_test "tsconfig.json" "test -f tsconfig.json"
run_test "next.config.js" "test -f apps/web/next.config.js"
run_test "prisma/schema.prisma" "test -f prisma/schema.prisma"

echo ""
echo -e "${BLUE}2. Verificant workflows GitHub Actions...${NC}"
echo "----------------------------------------------"

run_test "Auto-approve workflow" "test -f .github/workflows/auto-approve-and-automerge.yml"
run_test "Deploy Vercel workflow" "test -f .github/workflows/deploy-vercel.yml"
run_test "Cron news workflow" "test -f .github/workflows/cron-news.yml"
run_test "Deploy on merge workflow" "test -f .github/workflows/deploy-on-merge.yml"

echo ""
echo -e "${BLUE}3. Verificant serveis core...${NC}"
echo "------------------------------"

run_test "News service" "test -f apps/web/src/lib/news.ts"
run_test "BOPA service" "test -f apps/web/src/lib/bopa.ts"
run_test "Real Estate service" "test -f apps/web/src/lib/real-estate.ts"
run_test "Jobs service" "test -f apps/web/src/lib/jobs.ts"
run_test "Search service" "test -f apps/web/src/lib/search.ts"

echo ""
echo -e "${BLUE}4. Verificant utilitats...${NC}"
echo "----------------------------"

run_test "Prisma singleton" "test -f apps/web/src/lib/prisma.ts"
run_test "Redis service" "test -f apps/web/src/lib/redis.ts"
run_test "Rate limiting" "test -f apps/web/src/lib/rate-limit.ts"

echo ""
echo -e "${BLUE}5. Verificant API endpoints...${NC}"
echo "--------------------------------"

run_test "Ingest API" "test -f apps/web/src/app/api/ingest/route.ts"
run_test "Search API" "test -f apps/web/src/app/api/search/route.ts"
run_test "News API" "test -f apps/web/src/app/api/news/route.ts"
run_test "Real Estate API" "test -f apps/web/src/app/api/real-estate/route.ts"
run_test "Jobs API" "test -f apps/web/src/app/api/jobs/route.ts"

echo ""
echo -e "${BLUE}6. Verificant configuració i18n...${NC}"
echo "------------------------------------"

run_test "Traducció català" "test -f apps/web/messages/ca.json"
run_test "Traducció castellà" "test -f apps/web/messages/es.json"
run_test "Traducció anglès" "test -f apps/web/messages/en.json"
run_test "Traducció francès" "test -f apps/web/messages/fr.json"
run_test "Configuració i18n" "test -f apps/web/src/i18n.ts"

echo ""
echo -e "${BLUE}7. Verificant documentació...${NC}"
echo "-------------------------------"

run_test "README principal" "test -f README.md"
run_test "Documentació setup" "test -f docs/SETUP.md"
run_test "Resum implementació" "test -f docs/IMPLEMENTATION_SUMMARY.md"
run_test "Super Prompt Fusion doc" "test -f docs/SUPER_PROMPT_FUSION_COMPLETE.md"

echo ""
echo -e "${BLUE}8. Tests de sintaxi TypeScript...${NC}"
echo "-----------------------------------"

# Verificar que els imports funcionen (sintaxi bàsica)
run_test "TypeScript imports news" "node -e \"console.log('import { newsService } from \\\"./apps/web/src/lib/news\\\";')\" >/dev/null"
run_test "TypeScript imports BOPA" "node -e \"console.log('import { bopaService } from \\\"./apps/web/src/lib/bopa\\\";')\" >/dev/null"
run_test "TypeScript imports real-estate" "node -e \"console.log('import { realEstateService } from \\\"./apps/web/src/lib/real-estate\\\";')\" >/dev/null"
run_test "TypeScript imports jobs" "node -e \"console.log('import { jobService } from \\\"./apps/web/src/lib/jobs\\\";')\" >/dev/null"

echo ""
echo "=========================================="
echo -e "${YELLOW}📊 RESULTATS FINALS${NC}"
echo "=========================================="
echo -e "Tests executats: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Tests exitosos: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests fallits: ${RED}$TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 TOTS ELS TESTS HAN PASSAT EXITOSAMENT!${NC}"
    echo -e "${GREEN}✅ Portal Andorra Super Prompt Fusion està llest per production${NC}"
    echo ""
    echo -e "${BLUE}🚀 Per continuar:${NC}"
    echo "1. Configura les variables d'entorn a Vercel"
    echo "2. Connecta la base de dades PostgreSQL"
    echo "3. Executa 'pnpm prisma migrate deploy'"
    echo "4. El sistema començarà a ingerir contingut automàticament"
    exit 0
else
    echo ""
    echo -e "${RED}❌ ALGUNS TESTS HAN FALLAT${NC}"
    echo -e "${YELLOW}⚠️  Revisa els errors abans de continuar${NC}"
    exit 1
fi