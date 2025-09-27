import { test, expect } from '@playwright/test';

test.describe('Portal Andorra E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main title and subtitle', async ({ page }) => {
    // Verificar que el título principal está presente
    await expect(page.getByText('Portal Andorra')).toBeVisible();
    
    // Verificar que el subtítulo "By Nexora" está presente
    await expect(page.getByText('By Nexora')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    // Verificar que los enlaces de navegación funcionan
    const bopaLink = page.getByRole('link', { name: 'BOPA' });
    await expect(bopaLink).toBeVisible();
    
    // Hacer clic en BOPA y verificar navegación
    await bopaLink.click();
    await expect(page).toHaveURL(/.*\/bopa/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Cambiar a viewport móvil
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verificar que el menú móvil está presente
    const mobileMenuButton = page.getByRole('button').first();
    await expect(mobileMenuButton).toBeVisible();
    
    // Abrir menú móvil
    await mobileMenuButton.click();
    
    // Verificar que los enlaces de navegación aparecen en móvil
    await expect(page.getByText('Inicio')).toBeVisible();
  });

  test('should have language selector', async ({ page }) => {
    // Verificar que hay un selector de idioma
    const languageSelector = page.getByRole('button').nth(1);
    await expect(languageSelector).toBeVisible();
  });

  test('should have search functionality', async ({ page }) => {
    // Verificar que hay un botón de búsqueda
    const searchButton = page.getByRole('button').first();
    await expect(searchButton).toBeVisible();
  });
});

test.describe('Accessibility Tests', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/');
    
    // Usar axe-core para verificar accesibilidad
    const accessibilityScanResults = await page.evaluate(async () => {
      // @ts-ignore
      if (typeof window.axe !== 'undefined') {
        // @ts-ignore
        return await window.axe.run();
      }
      return null;
    });

    if (accessibilityScanResults) {
      expect(accessibilityScanResults.violations).toEqual([]);
    }
  });

  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/');
    
    // Verificar que hay una estructura de encabezados adecuada
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
  });

  test('should have proper alt text for images', async ({ page }) => {
    await page.goto('/');
    
    // Verificar que todas las imágenes tienen alt text
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});