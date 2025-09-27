-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Note: Additional indexes will be created after Prisma schema is applied
-- These are commented out until tables exist:
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_embeddings_vector ON embeddings USING ivfflat (embedding vector_cosine_ops);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_articles_fts ON articles USING gin(to_tsvector('spanish', title || ' ' || coalesce(content, '')));
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_laws_fts ON laws USING gin(to_tsvector('spanish', title || ' ' || coalesce(summary, '')));
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bulletins_fts ON bulletins USING gin(to_tsvector('spanish', title || ' ' || coalesce(summary, '')));

-- Create trigram indexes for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_articles_title_trgm ON articles USING gin(title gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_laws_title_trgm ON laws USING gin(title gin_trgm_ops);