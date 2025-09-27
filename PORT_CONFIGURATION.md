# 🚀 PORTAL ANDORRA - CONFIGURACIÓN DE PUERTOS

## 📊 Puertos Asignados
- **Web Application**: 3000
- **API Server**: 3001  
- **PostgreSQL**: 5432
- **Redis**: 6379
- **MeiliSearch**: 7700

## 🔗 URLs de Acceso
- **Portal Web**: http://localhost:3000
- **API Base**: http://localhost:3000/api
- **Database**: postgresql://portal_user:portal_password@localhost:5432/portal_andorra
- **Redis**: redis://localhost:6379
- **MeiliSearch**: http://localhost:7700

## 🚀 Comandos para Iniciar
```bash
# Opción 1: Script automático
./start_portal.sh

# Opción 2: Docker Compose manual
docker-compose up --build -d

# Opción 3: Desarrollo local
pnpm dev
```

## 🏥 Verificar Estado
```bash
./health_check.sh
```

## 🔄 Regenerar Configuración
```bash
./port_manager.sh
```

---
*Configuración generada automáticamente el Fri Sep 26 18:25:08 UTC 2025*
