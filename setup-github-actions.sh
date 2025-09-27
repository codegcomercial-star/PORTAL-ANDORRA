#!/bin/bash
# Portal Andorra - Activació de GitHub Actions Workflows
# Aquest script configura i activa tots els workflows necessaris

echo "⚡ PORTAL ANDORRA - ACTIVACIÓ GITHUB ACTIONS"
echo "=============================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Verificar si estem en un repositori Git
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ ERROR: No és un repositori Git${NC}"
    echo "Executa 'git init' primer"
    exit 1
fi

echo -e "${BLUE}1. Verificant workflows de GitHub Actions...${NC}"

# Llistar workflows existents
WORKFLOWS=(".github/workflows/auto-approve-and-automerge.yml" 
           ".github/workflows/deploy-vercel.yml"
           ".github/workflows/cron-news.yml" 
           ".github/workflows/deploy-on-merge.yml")

for workflow in "${WORKFLOWS[@]}"; do
    if [ -f "$workflow" ]; then
        echo -e "${GREEN}✅ $workflow${NC}"
    else
        echo -e "${RED}❌ $workflow no trobat${NC}"
    fi
done

echo ""
echo -e "${BLUE}2. Configurant secrets de GitHub...${NC}"
echo -e "${YELLOW}📝 Configura aquests secrets al repositori GitHub:${NC}"
echo ""
echo "🔗 Vés a: GitHub Repository -> Settings -> Secrets and variables -> Actions"
echo ""
echo -e "${BLUE}Secrets requerits:${NC}"
echo "• VERCEL_TOKEN - Token de Vercel per deploy automàtic"
echo "• VERCEL_ORG_ID - ID de l'organització Vercel" 
echo "• VERCEL_PROJECT_ID - ID del projecte Vercel"
echo "• BASE_URL - URL base del portal (https://portal-andorra.vercel.app)"
echo "• INGEST_TOKEN - Token secret per ingesta de contingut"
echo ""
echo -e "${YELLOW}Secrets opcionals:${NC}"
echo "• GITHUB_TOKEN - Token GitHub (ja disponible automàticament)"
echo "• OPENAI_API_KEY - Per millores d'IA futures"
echo "• ANTHROPIC_API_KEY - Per millores d'IA futures"

echo ""
echo -e "${BLUE}3. Verificant configuració dels workflows...${NC}"

# Auto-approve workflow
if [ -f ".github/workflows/auto-approve-and-automerge.yml" ]; then
    echo "🤖 Auto-approve workflow:"
    echo "  • S'executa en cada PR"
    echo "  • Auto-aprova PRs de: dependabot, github-actions, codespaces, codegcomercial-star"
    echo "  • Merge automàtic després d'aprovació"
fi

# Deploy Vercel workflow  
if [ -f ".github/workflows/deploy-vercel.yml" ]; then
    echo "🚀 Deploy Vercel workflow:"
    echo "  • S'executa en push a main"
    echo "  • Deploy automàtic a Vercel"
    echo "  • Notificació de status"
fi

# Cron news workflow
if [ -f ".github/workflows/cron-news.yml" ]; then
    echo "📰 Cron news workflow:"
    echo "  • S'executa cada 15 minuts"
    echo "  • Ingesta automàtica de contingut"
    echo "  • Processa notícies, BOPA, immobiliària, feina"
fi

# Deploy on merge workflow
if [ -f ".github/workflows/deploy-on-merge.yml" ]; then
    echo "🔄 Deploy on merge workflow:"
    echo "  • S'executa quan es fa merge a main"
    echo "  • Deploy automàtic després de CI"
    echo "  • Verificació de health checks"
fi

echo ""
echo -e "${BLUE}4. Creant fitxer de configuració GitHub...${NC}"

# Crear fitxer de configuració per GitHub
cat > .github/ISSUE_TEMPLATE/bug_report.md << 'EOF'
---
name: Bug report
about: Reportar un error del Portal Andorra
title: '[BUG] '
labels: bug
assignees: ''
---

**Descripció del bug**
Descripció clara i concisa del problema.

**Passos per reproduir**
1. Vés a '...'
2. Fes clic a '....'
3. Desplaça't fins '....'
4. Veu l'error

**Comportament esperat**
Descripció clara del que esperaves que passés.

**Screenshots**
Si és aplicable, afegeix screenshots per ajudar a explicar el problema.

**Entorn:**
 - OS: [ex: iOS]
 - Navegador [ex: chrome, safari]
 - Versió [ex: 22]

**Context adicional**
Qualsevol altra informació rellevant sobre el problema.
EOF

cat > .github/ISSUE_TEMPLATE/feature_request.md << 'EOF'
---
name: Feature request
about: Suggerir una nova funcionalitat per al Portal Andorra
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

**La teva petició de funcionalitat està relacionada amb un problema?**
Descripció clara i concisa del problema. Ex: Sempre estic frustrat quan [...]

**Descriu la solució que t'agradaria**
Descripció clara i concisa del que vols que passi.

**Descriu alternatives que has considerat**
Descripció clara i concisa de solucions o funcionalitats alternatives.

**Context adicional**
Afegeix qualsevol altra informació o screenshots sobre la petició de funcionalitat.
EOF

# Crear pull request template
cat > .github/pull_request_template.md << 'EOF'
## 📋 Descripció dels canvis

Descripció breu dels canvis implementats.

## 🔧 Tipus de canvi

- [ ] 🐛 Bug fix (canvi que no trenca res i soluciona un problema)
- [ ] ✨ Nova funcionalitat (canvi que no trenca res i afegeix funcionalitat)
- [ ] 💥 Breaking change (fix o funcionalitat que causaria que funcionalitat existent no funcioni com s'esperava)
- [ ] 📚 Documentació (canvis només en documentació)
- [ ] 🎨 Estil (formatat, missing semi colons, etc; cap canvi de codi)
- [ ] ♻️ Refactoring (canvi de codi que no fixa bugs ni afegeix funcionalitats)
- [ ] ⚡ Performance (canvi de codi que millora el rendiment)
- [ ] ✅ Test (afegir tests o corregir tests existents)
- [ ] 🔧 Build (canvis que afecten el sistema de build o dependències externes)

## 🧪 Tests

- [ ] Els tests passen localment amb els meus canvis
- [ ] He afegit tests que proven que els meus fixos són efectius o que la meva funcionalitat funciona
- [ ] He verificat que no hi ha regressions

## 📝 Checklist

- [ ] El meu codi segueix les guies d'estil del projecte
- [ ] He revisat el meu propi codi
- [ ] He comentat el meu codi, especialment en parts difícils d'entendre
- [ ] He fet els canvis corresponents a la documentació
- [ ] Els meus canvis no generen nous warnings

## 🔗 Issues relacionades

Fixes #(número de issue)

## 📸 Screenshots (si aplica)

Afegeix screenshots per mostrar els canvis visuals.
EOF

echo -e "${GREEN}✅ Fitxers de configuració GitHub creats${NC}"

echo ""
echo -e "${BLUE}5. Verificant estat del repositori...${NC}"

# Verificar si hi ha canvis pendents
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  Hi ha canvis pendents de commit${NC}"
    echo ""
    echo "Canvis detectats:"
    git status --short
    echo ""
    echo -e "${BLUE}Per activar els workflows:${NC}"
    echo "1. git add ."
    echo "2. git commit -m 'feat: configure GitHub Actions workflows'"
    echo "3. git push origin main"
else
    echo -e "${GREEN}✅ Repositori net${NC}"
fi

echo ""
echo -e "${BLUE}6. Configurant branques de protecció...${NC}"
echo -e "${YELLOW}📝 Configuració manual requerida a GitHub:${NC}"
echo ""
echo "🔗 Vés a: GitHub Repository -> Settings -> Branches"
echo ""
echo "Configura regla de protecció per 'main':"
echo "• ✅ Require a pull request before merging"
echo "• ✅ Require status checks to pass before merging"
echo "• ✅ Restrict pushes that create files"
echo "• ✅ Do not allow bypassing the above settings"

echo ""
echo "=============================================="
echo -e "${GREEN}🎉 WORKFLOWS GITHUB ACTIONS CONFIGURATS!${NC}"
echo "=============================================="
echo ""
echo -e "${BLUE}📊 Resum de workflows actius:${NC}"
echo "• 🤖 Auto-approve and merge - PRs automàtics"
echo "• 🚀 Deploy to Vercel - Deploy automàtic"  
echo "• 📰 Cron news ingestion - Cada 15 minuts"
echo "• 🔄 Deploy on merge - Deploy post-merge"
echo ""
echo -e "${YELLOW}🔑 Passos finals:${NC}"
echo "1. Configura els secrets a GitHub (llistats més amunt)"
echo "2. Fes push dels canvis per activar workflows"
echo "3. Crea un PR de prova per verificar auto-approve"
echo "4. Verifica que el cron job funcioni correctament"
echo ""
echo -e "${BLUE}🔍 Monitorització:${NC}"
echo "• GitHub Actions tab per veure execucions"
echo "• Vercel dashboard per deploys"
echo "• /api/ingest per verificar ingesta de contingut"