# 🔐 Guia de Configuració de Secrets GitHub

## Portal Andorra - Configuració de Variables d'Entorn i Secrets

### 📍 **Ubicació dels Secrets a GitHub**

1. Vés al teu repositori GitHub
2. Clica **Settings** (pestanya superior)
3. Al menú lateral, clica **Secrets and variables** → **Actions**
4. Clica **New repository secret** per afegir cada secret

---

## 🔑 **SECRETS OBLIGATORIS**

### **VERCEL_TOKEN**
```
Descripció: Token personal de Vercel per deploy automàtic
Com obtenir-lo:
1. Vés a https://vercel.com/account/tokens
2. Clica "Create Token"
3. Nom: "Portal Andorra GitHub Actions"
4. Scope: Full Account
5. Copia el token generat
```

### **VERCEL_ORG_ID**
```
Descripció: ID de la teva organització/equip Vercel
Com obtenir-lo:
1. Vés a https://vercel.com/dashboard
2. Settings → General
3. Copia "Team ID" o "Personal Account ID"
```

### **VERCEL_PROJECT_ID**
```
Descripció: ID del projecte Portal Andorra a Vercel
Com obtenir-lo:
1. Vés al teu projecte a Vercel
2. Settings → General
3. Copia "Project ID"
```

### **BASE_URL**
```
Valor: https://portal-andorra.vercel.app
Descripció: URL base del portal en producció
```

### **INGEST_TOKEN**
```
Valor: super-secret-ingest-token-2024-portal-andorra
Descripció: Token secret per protegir l'endpoint d'ingesta
Nota: Pots canviar aquest valor per un més segur
```

---

## 🔧 **SECRETS OPCIONALS**

### **DATABASE_URL**
```
Descripció: URL de connexió PostgreSQL
Exemple: postgresql://username:password@host:port/database
Nota: També el pots configurar directament a Vercel
```

### **OPENAI_API_KEY** (Futures millores)
```
Descripció: API key d'OpenAI per millores d'IA
Com obtenir-lo: https://platform.openai.com/api-keys
```

### **ANTHROPIC_API_KEY** (Futures millores)
```
Descripció: API key d'Anthropic Claude per millores d'IA
Com obtenir-lo: https://console.anthropic.com/
```

---

## 🌐 **CONFIGURACIÓ A VERCEL**

### Variables d'Entorn a Vercel Dashboard:

1. Vés al teu projecte Vercel
2. Settings → Environment Variables
3. Afegeix les següents variables:

```env
NODE_ENV=production
BASE_URL=https://portal-andorra.vercel.app
INGEST_TOKEN=super-secret-ingest-token-2024-portal-andorra
NEXTAUTH_URL=https://portal-andorra.vercel.app
NEXTAUTH_SECRET=super-secret-nextauth-key-2024-andorra-portal-secure
DEFAULT_LOCALE=ca
SUPPORTED_LOCALES=ca,es,en,fr
TZ=Europe/Andorra
```

### Si uses Vercel Postgres:
```env
DATABASE_URL=(automàticament configurat per Vercel)
POSTGRES_URL=(automàticament configurat per Vercel)
POSTGRES_PRISMA_URL=(automàticament configurat per Vercel)
```

---

## ✅ **CHECKLIST DE CONFIGURACIÓ**

### GitHub Secrets:
- [ ] `VERCEL_TOKEN` configurat
- [ ] `VERCEL_ORG_ID` configurat  
- [ ] `VERCEL_PROJECT_ID` configurat
- [ ] `BASE_URL` configurat
- [ ] `INGEST_TOKEN` configurat

### Vercel Environment Variables:
- [ ] Variables bàsiques configurades
- [ ] `DATABASE_URL` configurat (si uses BD externa)
- [ ] Deployment funciona correctament

### Tests de Verificació:
- [ ] Push a main deploya automàticament
- [ ] Workflows GitHub Actions s'executen
- [ ] Cron job d'ingesta funciona cada 15 minuts
- [ ] Portal accessible a la URL de producció

---

## 🔍 **VERIFICACIÓ I TROUBLESHOOTING**

### Verificar Workflows:
1. Vés a GitHub → Actions tab
2. Comprova que els workflows s'executen sense errors
3. Revisa els logs si hi ha problemes

### Verificar Deploy Vercel:
1. Vés a Vercel Dashboard
2. Comprova que els deploys siguin exitosos
3. Testa les funcionalitats al portal en viu

### Verificar Ingesta de Contingut:
```bash
# Test manual de l'endpoint d'ingesta
curl -X POST https://portal-andorra.vercel.app/api/ingest \
  -H "Authorization: Bearer super-secret-ingest-token-2024-portal-andorra"
```

### Verificar API de Cerca:
```bash
# Test de l'API de cerca
curl "https://portal-andorra.vercel.app/api/search?q=andorra"
```

---

## 🆘 **PROBLEMES COMUNS**

### Error: "VERCEL_TOKEN invalid"
- Verifica que el token sigui correcte
- Assegura't que tingui permisos suficients
- Regenera el token si cal

### Error: "Database connection failed"
- Verifica DATABASE_URL
- Comprova connectivitat de xarxa
- Revisa credencials de BD

### Error: "Workflows not triggering"
- Verifica que els fitxers .yml siguin vàlids
- Comprova que estiguis al branch main
- Revisa permisos del repositori

---

## 📞 **SUPORT**

Si tens problemes amb la configuració:

1. Revisa els logs de GitHub Actions
2. Comprova els logs de Vercel
3. Verifica la documentació oficial:
   - [Vercel Deployment](https://vercel.com/docs)
   - [GitHub Actions](https://docs.github.com/en/actions)
   - [Prisma Database](https://www.prisma.io/docs)

---

**Portal Andorra està llest per funcionar en producció! 🚀🇦🇩**