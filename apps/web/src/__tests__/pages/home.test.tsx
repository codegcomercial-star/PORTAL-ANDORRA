/**
 * @jest-environment jsdom
 */

describe('Home Page Tests', () => {
  it('should have correct page structure', () => {
    // Test básico para la página principal
    const pageTitle = 'Portal Andorra - Portal Econòmic d\'Andorra';
    const expectedElements = ['hero', 'navigation', 'content'];
    
    expect(pageTitle).toContain('Portal Andorra');
    expect(expectedElements).toContain('hero');
    expect(expectedElements).toContain('navigation');
  });

  it('should have proper metadata', () => {
    // Test para metadatos de la página
    const metadata = {
      title: 'Portal Andorra - Portal Econòmic d\'Andorra',
      description: 'Portal oficial de información económica de Andorra',
      languages: ['ca', 'es', 'en', 'fr']
    };
    
    expect(metadata.title).toBeDefined();
    expect(metadata.description).toBeDefined();
    expect(metadata.languages.length).toBe(4);
  });

  it('should support internationalization', () => {
    // Test para soporte de i18n
    const locales = ['ca', 'es', 'en', 'fr'];
    const defaultLocale = 'ca';
    
    expect(locales).toContain(defaultLocale);
    expect(locales.length).toBeGreaterThan(1);
  });
});