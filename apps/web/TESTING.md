# 🧪 Testing Setup for Portal Andorra

## ✅ **CONFIGURACIÓN COMPLETADA**

Se ha implementado un sistema completo de testing automatizado para Portal Andorra con las siguientes características:

### 🛠️ **Stack de Testing Instalado**

- **Jest** - Framework de testing unitario
- **@testing-library/react** - Testing utilities para React
- **@testing-library/jest-dom** - Matchers adicionales para Jest
- **@testing-library/user-event** - Simulación de eventos de usuario
- **@playwright/test** - Testing E2E automatizado
- **lighthouse-ci** - Auditorías de rendimiento automatizadas
- **@axe-core/playwright** - Testing de accesibilidad automatizado

### 📁 **Estructura de Tests**

```
apps/web/
├── src/__tests__/
│   ├── components/
│   │   └── header.test.tsx
│   ├── pages/
│   │   └── home.test.tsx
│   └── utils/
│       └── cn.test.ts
├── tests/
│   └── e2e.spec.ts
├── jest.config.js
├── jest.setup.js
├── playwright.config.ts
└── lighthouserc.json
```

### ⚙️ **Scripts Disponibles**

```bash
# Tests unitarios
npm run test

# Tests en modo watch
npm run test:watch

# Tests con cobertura
npm run test:coverage

# Tests E2E con Playwright
npx playwright test

# Lighthouse CI
npx lhci autorun
```

### 🚀 **GitHub Actions CI/CD**

Se ha configurado `.github/workflows/test.yml` que ejecuta automáticamente:

- ✅ Tests unitarios con Jest
- ✅ Linting con ESLint  
- ✅ Build de la aplicación
- ✅ Tests E2E con Playwright
- ✅ Auditorías de Lighthouse en PRs
- ✅ Matriz de testing en Node.js 18.x y 20.x

### 🎯 **Tests Implementados**

#### **Header Component Tests**
- ✅ Renderizado de marca "Portal Andorra"
- ✅ Presencia del subtítulo "By Nexora"
- ✅ Estructura de navegación correcta
- ✅ Soporte multiidioma (CA, ES, EN, FR)
- ✅ Responsive design

#### **Home Page Tests**
- ✅ Estructura correcta de página
- ✅ Metadatos apropiados
- ✅ Soporte de internacionalización

#### **Utils Tests**
- ✅ Función `cn` para clases CSS
- ✅ Manejo de clases condicionales

#### **E2E Tests**
- ✅ Navegación principal
- ✅ Responsive design
- ✅ Selector de idiomas
- ✅ Funcionalidad de búsqueda
- ✅ Tests de accesibilidad

---

## 🤖 **PROMPTS PARA GITHUB COPILOT**

### 📝 **Prompt para Tests de Componentes**

```
Genera tests unitarios para el componente [NOMBRE_COMPONENTE] del Portal Andorra que verifican:

- Renderizado del título "Portal Andorra"
- Presencia del subtítulo "By Nexora" 
- Navegación entre idiomas (CA, ES, EN, FR)
- Responsive design en móvil
- Accesibilidad básica
- Interacciones de usuario

Usa @testing-library/react, jest, y el patrón de tests existente en src/__tests__/components/
```

### 📝 **Prompt para Tests E2E**

```
Crea tests E2E con Playwright para la página [NOMBRE_PÁGINA] del Portal Andorra:

- Navegación funcional
- Formularios interactivos
- Responsive design (móvil/desktop)
- Carga de datos dinámicos
- Accesibilidad con @axe-core/playwright
- Performance básico

Usa el patrón de tests/e2e.spec.ts existente
```

### 📝 **Prompt para Tests de API**

```
Genera tests unitarios para la API route [RUTA_API] del Portal Andorra:

- Respuestas HTTP correctas (200, 404, 500)
- Validación de parámetros de entrada
- Formato de respuesta JSON
- Manejo de errores
- Rate limiting si aplica
- Casos edge

Usa Jest y el patrón de testing de Next.js API routes
```

### 📝 **Prompt para Tests de Utilidades**

```
Crea tests unitarios para la función utilitaria [NOMBRE_FUNCIÓN]:

- Casos de uso normales
- Casos edge (null, undefined, empty)
- Validación de tipos
- Performance si es crítico
- Casos de error

Usa Jest y coloca en src/__tests__/utils/
```

### 📝 **Prompt para Tests de Hooks**

```
Genera tests para el hook personalizado [NOMBRE_HOOK] del Portal Andorra:

- Estados iniciales
- Transiciones de estado
- Side effects
- Cleanup
- Error handling
- Dependencies

Usa @testing-library/react-hooks y Jest
```

---

## 🎭 **VENTAJAS DEL TESTING AUTOMATIZADO**

### ✅ **Detección Temprana de Errores**
- Los tests se ejecutan en cada commit
- Feedback inmediato en desarrollo
- Prevención de regresiones

### ✅ **Verificación Automática en Deploy**
- Tests unitarios en CI/CD
- Tests E2E antes de producción
- Auditorías de performance automáticas

### ✅ **Garantía de Funcionalidad**
- Componentes siempre funcionan como esperado
- APIs mantienen contratos estables
- Compatibilidad entre navegadores verificada

### ✅ **Feedback en Pull Requests**
- Status checks automáticos
- Cobertura de código reportada
- Tests de accesibilidad integrados

### ✅ **Documentación Viva**
- Los tests documentan el comportamiento esperado
- Ejemplos de uso en código
- Especificaciones ejecutables

---

## 🚀 **COMANDOS RÁPIDOS**

```bash
# Ejecutar todos los tests
npm run test

# Tests específicos
npm run test -- --testNamePattern="Header"

# Tests con cobertura
npm run test:coverage

# E2E en modo headed
npx playwright test --headed

# Solo tests de accesibilidad
npx playwright test --grep="Accessibility"

# Lighthouse local
npx lhci autorun --url="http://localhost:3000"
```

---

## 📊 **MÉTRICAS DE CALIDAD**

El sistema de testing garantiza:

- **✅ 100% Tests Passing** - Todos los tests deben pasar
- **📈 >80% Code Coverage** - Cobertura mínima de código
- **🚀 Performance Score >80** - Lighthouse performance
- **♿ Accessibility Score >90** - Cumplimiento WCAG
- **🔍 0 Critical Vulnerabilities** - Seguridad verificada

---

## 🎯 **PRÓXIMOS PASOS**

1. **Expandir cobertura** - Añadir más tests de componentes
2. **Visual regression testing** - Screenshots comparativos
3. **Performance monitoring** - Métricas continuas
4. **Database testing** - Tests de integración con Prisma
5. **Mobile testing** - Tests específicos para dispositivos móviles

El sistema está listo para desarrollo TDD y garantiza calidad continua en Portal Andorra! 🎉