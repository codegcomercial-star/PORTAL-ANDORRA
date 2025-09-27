-- Portal Andorra - Inicialització de Base de Dades
-- Aquest script crea les dades inicials necessàries per al funcionament del portal

-- Configuració inicial del sistema
INSERT INTO system_status (service, status, created_at, updated_at) VALUES
('news', 'active', NOW(), NOW()),
('bopa', 'active', NOW(), NOW()),  
('real_estate', 'active', NOW(), NOW()),
('jobs', 'active', NOW(), NOW()),
('search', 'active', NOW(), NOW())
ON CONFLICT (service) DO NOTHING;

-- Articles de benvinguda multiidioma
INSERT INTO news (id, title, content, summary, url, published_at, source, category, tags, language, created_at, updated_at) VALUES
('welcome-ca-001', 
 'Benvinguts al Portal d''Andorra', 
 'El Portal d''Andorra és la teva font principal d''informació sobre el Principat. Aquí trobaràs notícies actualitzades, documents oficials del BOPA, ofertes immobiliàries i d''ocupació, tot integrat amb intel·ligència artificial per oferir-te la millor experiència.', 
 'Portal oficial d''informació del Principat d''Andorra amb IA integrada', 
 'https://portal-andorra.ad', 
 NOW(), 
 'Portal Andorra', 
 'general', 
 ARRAY['benvinguda', 'portal', 'andorra', 'informació'], 
 'ca', 
 NOW(), 
 NOW()),

('welcome-es-001', 
 'Bienvenidos al Portal de Andorra', 
 'El Portal de Andorra es tu fuente principal de información sobre el Principado. Aquí encontrarás noticias actualizadas, documentos oficiales del BOPA, ofertas inmobiliarias y de empleo, todo integrado con inteligencia artificial para ofrecerte la mejor experiencia.', 
 'Portal oficial de información del Principado de Andorra con IA integrada', 
 'https://portal-andorra.ad', 
 NOW(), 
 'Portal Andorra', 
 'general', 
 ARRAY['bienvenida', 'portal', 'andorra', 'información'], 
 'es', 
 NOW(), 
 NOW()),

('welcome-en-001', 
 'Welcome to the Portal of Andorra', 
 'The Portal of Andorra is your main source of information about the Principality. Here you will find updated news, official BOPA documents, real estate and job offers, all integrated with artificial intelligence to offer you the best experience.', 
 'Official information portal of the Principality of Andorra with integrated AI', 
 'https://portal-andorra.ad', 
 NOW(), 
 'Portal Andorra', 
 'general', 
 ARRAY['welcome', 'portal', 'andorra', 'information'], 
 'en', 
 NOW(), 
 NOW()),

('welcome-fr-001', 
 'Bienvenue au Portail d''Andorre', 
 'Le Portail d''Andorre est votre source principale d''information sur la Principauté. Vous y trouverez des nouvelles actualisées, des documents officiels du BOPA, des offres immobilières et d''emploi, le tout intégré avec l''intelligence artificielle pour vous offrir la meilleure expérience.', 
 'Portail officiel d''information de la Principauté d''Andorre avec IA intégrée', 
 'https://portal-andorra.ad', 
 NOW(), 
 'Portal Andorra', 
 'general', 
 ARRAY['bienvenue', 'portail', 'andorre', 'information'], 
 'fr', 
 NOW(), 
 NOW())

ON CONFLICT (id) DO NOTHING;

-- Exemple de document BOPA
INSERT INTO bopa_documents (id, numero, fecha, titulo, contenido, seccion, tipo, url, keywords, language, created_at, updated_at) VALUES
('bopa-example-001',
 '20240101',
 '2024-01-01',
 'Exemple de document BOPA',
 'Aquest és un exemple de document del Butlletí Oficial del Principat d''Andorra per mostrar el funcionament del sistema.',
 'LEGISLACIÓ',
 'altres',
 'https://www.bopa.ad/exemple',
 ARRAY['exemple', 'bopa', 'document', 'oficial'],
 'ca',
 NOW(),
 NOW())
ON CONFLICT (id) DO NOTHING;

-- Exemple de propietat immobiliària
INSERT INTO real_estate_properties (
  id, title, description, price, currency, type, operation, address, parish, 
  surface, ai_description, price_analysis, features, neighborhood, source, 
  source_url, active, featured, published_at, created_at, updated_at
) VALUES
('property-example-001',
 'Àtic amb terrassa a Andorra la Vella',
 'Magnífic àtic de 120m² amb terrassa de 30m² al centre d''Andorra la Vella',
 450000,
 'EUR',
 'apartment',
 'sale',
 'Carrer Príncep Benlloch, Andorra la Vella',
 'andorra-la-vella',
 120,
 'Propietat excel·lent amb ubicació privilegiada al cor de la capital. Ideal per a famílies o inversors.',
 '{"marketValue": 460000, "pricePerM2": 3750, "comparison": "below", "confidenceScore": 0.85}',
 ARRAY['terrassa', 'centre', 'ascensor', 'lluminós'],
 '{"score": 9.5, "amenities": ["restaurants", "botigues", "transports"], "transport": ["bus", "aparcament"], "schools": ["escola_publica"]}',
 'Portal Andorra',
 'https://portal-andorra.ad/exemple-propietat',
 true,
 true,
 NOW(),
 NOW(),
 NOW())
ON CONFLICT (id) DO NOTHING;

-- Exemple d'oferta de feina
INSERT INTO job_offers (
  id, title, company, description, requirements, benefits, type, level, category, 
  skills, languages, salary, location, company_info, ai_summary, skills_match, 
  difficulty_score, popularity_score, source, source_url, active, featured, 
  published_at, created_at, updated_at
) VALUES
('job-example-001',
 'Desenvolupador Full Stack',
 'TechAndorra SL',
 'Busquem un desenvolupador experimentat per unir-se al nostre equip dinàmic',
 ARRAY['React', 'Node.js', '3+ anys experiència', 'TypeScript'],
 ARRAY['sou competitiu', 'teletreball', 'formació contínua'],
 'full-time',
 'mid',
 'Tecnologia',
 ARRAY['React', 'Node.js', 'TypeScript', 'JavaScript'],
 ARRAY['Català', 'Castellà', 'Anglès'],
 '{"min": 45000, "max": 60000, "currency": "EUR", "period": "year"}',
 '{"parish": "andorra-la-vella", "remote": true, "hybrid": true}',
 '{"name": "TechAndorra SL", "size": "medium", "industry": "Tecnologia"}',
 'Oportunitat excel·lent per a desenvolupadors amb experiència en tecnologies modernes',
 '{"required": ["React", "Node.js"], "preferred": ["TypeScript"], "nice_to_have": ["Docker"]}',
 6.5,
 0.8,
 'Portal Andorra',
 'https://portal-andorra.ad/exemple-feina',
 true,
 true,
 NOW(),
 NOW(),
 NOW())
ON CONFLICT (id) DO NOTHING;

-- Consultes de cerca d'exemple per analytics
INSERT INTO search_queries (query, results, created_at) VALUES
('notícies andorra', 25, NOW() - INTERVAL '1 day'),
('feina tecnologia', 12, NOW() - INTERVAL '2 hours'),
('pisos lloguer', 18, NOW() - INTERVAL '30 minutes'),
('lleis BOPA', 8, NOW() - INTERVAL '1 hour')
ON CONFLICT DO NOTHING;