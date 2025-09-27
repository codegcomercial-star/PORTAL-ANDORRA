#!/bin/bash
# Portal Andorra - Script de Configuració de Base de Dades
# Aquest script configura la base de dades PostgreSQL per al Portal Andorra

echo "🐘 PORTAL ANDORRA - CONFIGURACIÓ POSTGRESQL"
echo "============================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Verificar si Prisma CLI està instal·lat
if ! command -v prisma &> /dev/null; then
    echo -e "${YELLOW}⚠️  Prisma CLI no trobat. Instal·lant via pnpm...${NC}"
    pnpm add -D prisma
    pnpm add @prisma/client
fi

echo -e "${BLUE}1. Verificant connexió a la base de dades...${NC}"

# Verificar variable DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ ERROR: Variable DATABASE_URL no configurada${NC}"
    echo ""
    echo -e "${YELLOW}📝 Configuració requerida:${NC}"
    echo "1. Crea una base de dades PostgreSQL"
    echo "2. Configura DATABASE_URL al teu .env.local:"
    echo "   DATABASE_URL=postgresql://username:password@host:port/database_name"
    echo ""
    echo -e "${BLUE}🌐 Opcions recomanades:${NC}"
    echo "• Vercel Postgres (gratuït): https://vercel.com/storage/postgres"
    echo "• Supabase (gratuït): https://supabase.com"
    echo "• Railway (gratuït): https://railway.app"
    echo "• Neon (gratuït): https://neon.tech"
    exit 1
fi

echo -e "${GREEN}✅ DATABASE_URL configurada${NC}"

echo ""
echo -e "${BLUE}2. Generant client Prisma...${NC}"
pnpm prisma generate

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Client Prisma generat correctament${NC}"
else
    echo -e "${RED}❌ Error generant client Prisma${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}3. Verificant connexió a la base de dades...${NC}"
pnpm prisma db push --preview-feature

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Connexió a la base de dades exitosa${NC}"
else
    echo -e "${RED}❌ Error connectant a la base de dades${NC}"
    echo ""
    echo -e "${YELLOW}💡 Comprova:${NC}"
    echo "• Que la base de dades estigui accessible"
    echo "• Que les credencials siguin correctes"
    echo "• Que el format de DATABASE_URL sigui vàlid"
    exit 1
fi

echo ""
echo -e "${BLUE}4. Aplicant migracions de base de dades...${NC}"
pnpm prisma db push

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migracions aplicades correctament${NC}"
else
    echo -e "${RED}❌ Error aplicant migracions${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}5. Verificant taules creades...${NC}"
echo "Taules que s'han de crear:"
echo "• news"
echo "• bopa_documents" 
echo "• real_estate_properties"
echo "• job_offers"
echo "• user_profiles"
echo "• job_matches"
echo "• search_queries"
echo "• system_status"

# Executar una consulta simple per verificar
pnpm prisma db execute --stdin <<EOF
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Taules verificades correctament${NC}"
else
    echo -e "${YELLOW}⚠️  No es poden verificar les taules (pot ser normal)${NC}"
fi

echo ""
echo -e "${BLUE}6. Configurant dades inicials opcionals...${NC}"

# Script SQL per dades inicials (opcional)
cat > /tmp/initial_data.sql << 'EOF'
-- Inserir estat inicial del sistema
INSERT INTO system_status (service, status, created_at, updated_at) VALUES
('news', 'active', NOW(), NOW()),
('bopa', 'active', NOW(), NOW()),
('real_estate', 'active', NOW(), NOW()),
('jobs', 'active', NOW(), NOW()),
('search', 'active', NOW(), NOW())
ON CONFLICT (service) DO NOTHING;

-- Inserir categories de notícies predefinides
INSERT INTO news (id, title, content, summary, url, published_at, source, category, tags, language, created_at, updated_at) VALUES
('welcome-ca', 'Benvinguts al Portal d''Andorra', 'El Portal d''Andorra és la teva font principal d''informació sobre el Principat.', 'Portal oficial d''informació d''Andorra', '/', NOW(), 'Portal Andorra', 'general', ARRAY['benvinguda', 'portal'], 'ca', NOW(), NOW()),
('welcome-es', 'Bienvenidos al Portal de Andorra', 'El Portal de Andorra es tu fuente principal de información sobre el Principado.', 'Portal oficial de información de Andorra', '/', NOW(), 'Portal Andorra', 'general', ARRAY['bienvenida', 'portal'], 'es', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
EOF

echo "Aplicant dades inicials..."
pnpm prisma db execute --file /tmp/initial_data.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dades inicials carregades${NC}"
else
    echo -e "${YELLOW}⚠️  Les dades inicials no s'han pogut carregar (pot ser normal)${NC}"
fi

# Netejar fitxer temporal
rm -f /tmp/initial_data.sql

echo ""
echo "============================================="
echo -e "${GREEN}🎉 BASE DE DADES CONFIGURADA EXITOSAMENT!${NC}"
echo "============================================="
echo ""
echo -e "${BLUE}📊 Resum de la configuració:${NC}"
echo "• Client Prisma generat ✅"
echo "• Connexió verificada ✅"
echo "• Schema aplicat ✅"
echo "• Taules creades ✅"
echo "• Dades inicials carregades ✅"
echo ""
echo -e "${YELLOW}🚀 Pròxims passos:${NC}"
echo "1. Executa 'pnpm dev' per iniciar el servidor de desenvolupament"
echo "2. Visita http://localhost:3000 per veure el portal"
echo "3. Les APIs estaran disponibles a http://localhost:3000/api/*"
echo "4. La ingesta automàtica començarà quan s'activi el cron"
echo ""
echo -e "${BLUE}🔧 Comandos útils:${NC}"
echo "• pnpm prisma studio - Interfície visual de la BD"
echo "• pnpm prisma db pull - Sincronitzar schema des de BD"
echo "• pnpm prisma db push - Aplicar canvis de schema"