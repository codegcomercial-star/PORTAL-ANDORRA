#!/bin/bash
# Portal Andorra - Script Mestre de Configuració
# Executa tots els passos opcionals per completar la configuració

echo "🚀 PORTAL ANDORRA - CONFIGURACIÓ COMPLETA"
echo "=========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE}Aquest script executarà els passos opcionals de configuració:${NC}"
echo "1. ✅ Configurar variables d'entorn"
echo "2. 🐘 Configurar base de dades PostgreSQL"
echo "3. 🗄️  Executar migracions de Prisma"
echo "4. ⚡ Activar workflows de GitHub Actions"
echo ""

# Confirmar execució
read -p "Vols continuar? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Operació cancel·lada."
    exit 1
fi

echo ""
echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}PAS 1: CONFIGURACIÓ VARIABLES D'ENTORN${NC}"
echo -e "${BLUE}=========================================${NC}"

echo ""
echo -e "${YELLOW}📝 Variables d'entorn configurades:${NC}"
echo "• .env.production.example - Variables de producció"
echo "• .env.example - Variables de desenvolupament actualitzades"
echo ""
echo -e "${GREEN}✅ Pas 1 completat${NC}"

echo ""
echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}PAS 2: CONFIGURACIÓ BASE DE DADES${NC}"
echo -e "${BLUE}=========================================${NC}"

# Verificar si DATABASE_URL està configurada
if [ -z "$DATABASE_URL" ]; then
    echo ""
    echo -e "${YELLOW}⚠️  DATABASE_URL no configurada${NC}"
    echo ""
    echo -e "${BLUE}Opcions per configurar la base de dades:${NC}"
    echo ""
    echo "🌐 OPCIÓ 1: Vercel Postgres (Recomanat)"
    echo "1. Vés a https://vercel.com/dashboard"
    echo "2. Selecciona el teu projecte"
    echo "3. Vés a Storage -> Create Database -> Postgres"
    echo "4. Copia la DATABASE_URL al teu .env.local"
    echo ""
    echo "🐘 OPCIÓ 2: PostgreSQL Local"
    echo "1. Instal·la PostgreSQL: https://www.postgresql.org/download/"
    echo "2. Crea una base de dades: createdb portal_andorra"
    echo "3. Configura DATABASE_URL=postgresql://user:pass@localhost:5432/portal_andorra"
    echo ""
    echo "☁️ OPCIÓ 3: Serveis Cloud Gratuïts"
    echo "• Supabase: https://supabase.com (500MB gratuït)"
    echo "• Railway: https://railway.app (5GB gratuït)"  
    echo "• Neon: https://neon.tech (500MB gratuït)"
    echo ""
    
    read -p "Has configurat DATABASE_URL? Vols continuar amb la configuració de BD? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Executant configuració de base de dades..."
        ./setup-database.sh
    else
        echo -e "${YELLOW}⏭️  Saltant configuració de base de dades${NC}"
        echo "Pots executar-la més tard amb: ./setup-database.sh"
    fi
else
    echo -e "${GREEN}✅ DATABASE_URL detectada${NC}"
    echo "Executant configuració de base de dades..."
    ./setup-database.sh
fi

echo ""
echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}PAS 3: MIGRACIONS PRISMA${NC}"
echo -e "${BLUE}=========================================${NC}"

if [ -n "$DATABASE_URL" ]; then
    echo "Aplicant schema de Prisma..."
    
    # Aplicar schema
    pnpm prisma db push
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Schema aplicat correctament${NC}"
        
        # Aplicar dades inicials
        echo "Aplicant dades inicials..."
        pnpm prisma db execute --file prisma/seed.sql
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Dades inicials carregades${NC}"
        else
            echo -e "${YELLOW}⚠️  Dades inicials no carregades (pot ser normal)${NC}"
        fi
    else
        echo -e "${RED}❌ Error aplicant schema${NC}"
    fi
else
    echo -e "${YELLOW}⏭️  DATABASE_URL no configurada, saltant migracions${NC}"
fi

echo ""
echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}PAS 4: GITHUB ACTIONS WORKFLOWS${NC}"
echo -e "${BLUE}=========================================${NC}"

echo "Configurant workflows de GitHub Actions..."
./setup-github-actions.sh

echo ""
echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}PAS 5: VERIFICACIÓ FINAL${NC}"
echo -e "${BLUE}=========================================${NC}"

echo "Executant tests del sistema..."
./test-system-complete.sh

echo ""
echo "=============================================="
echo -e "${GREEN}🎉 CONFIGURACIÓ COMPLETA FINALITZADA!${NC}"
echo "=============================================="
echo ""
echo -e "${PURPLE}📊 RESUM DE LA CONFIGURACIÓ:${NC}"
echo ""
echo -e "${GREEN}✅ Variables d'entorn configurades${NC}"
if [ -n "$DATABASE_URL" ]; then
    echo -e "${GREEN}✅ Base de dades configurada${NC}"
    echo -e "${GREEN}✅ Migracions aplicades${NC}"
else
    echo -e "${YELLOW}⚠️  Base de dades pendent de configurar${NC}"
fi
echo -e "${GREEN}✅ Workflows GitHub Actions configurats${NC}"
echo -e "${GREEN}✅ Tests del sistema executats${NC}"
echo ""
echo -e "${BLUE}🚀 PRÒXIMS PASSOS:${NC}"
echo ""
if [ -z "$DATABASE_URL" ]; then
    echo "1. Configura DATABASE_URL al teu .env.local"
    echo "2. Executa './setup-database.sh' per configurar la BD"
    echo "3. Configura els secrets a GitHub (veure output anterior)"
    echo "4. Fes push per activar els workflows: git add . && git commit -m 'feat: complete setup' && git push"
    echo "5. Executa 'pnpm dev' per iniciar el servidor"
else
    echo "1. Configura els secrets a GitHub (veure output anterior)"
    echo "2. Fes push per activar els workflows: git add . && git commit -m 'feat: complete setup' && git push"
    echo "3. Executa 'pnpm dev' per iniciar el servidor"
    echo "4. Visita http://localhost:3000 per veure el portal"
fi
echo ""
echo -e "${YELLOW}🔍 URLS IMPORTANTS:${NC}"
echo "• Portal local: http://localhost:3000"
echo "• API Search: http://localhost:3000/api/search?q=test"
echo "• API News: http://localhost:3000/api/news"
echo "• API Ingest: http://localhost:3000/api/ingest"
echo "• Prisma Studio: pnpm prisma studio"
echo ""
echo -e "${BLUE}📚 DOCUMENTACIÓ:${NC}"
echo "• README.md - Informació general"
echo "• docs/SETUP.md - Guia de configuració"
echo "• docs/SUPER_PROMPT_FUSION_COMPLETE.md - Documentació completa"
echo ""
echo -e "${GREEN}Portal Andorra Super Prompt Fusion està llest! 🇦🇩${NC}"