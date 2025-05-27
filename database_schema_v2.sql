-- =====================================================
-- DROPSKILLS - SCHÉMA BASE DE DONNÉES OPTIMAL V2
-- Compatible Supabase/PostgreSQL
-- Optimisé pour SaaS formation & outils IA
-- =====================================================

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CORE BUSINESS TABLES
-- =====================================================

-- Table: users (utilisateurs finaux)
-- Stockage des données utilisateur essentielles
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  first_name text,
  last_name text,
  avatar_url text,
  role text DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN', 'SUPER_ADMIN')),
  status text DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'BANNED')),
  last_login_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Index pour optimiser les requêtes fréquentes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Table: categories (classification des packs)
-- Organisation hiérarchique des contenus
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  icon text, -- Nom d'icône ou URL
  color text, -- Code couleur hex
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active);

-- Table: packs (formations/produits digitaux)
-- Cœur métier : les formations vendues
CREATE TABLE packs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  short_description text, -- Pour les listes/cartes
  content_type text DEFAULT 'MIXED' CHECK (content_type IN ('VIDEO', 'AUDIO', 'EBOOK', 'MIXED')),
  
  -- Pricing & Business
  price numeric(10,2) NOT NULL DEFAULT 0,
  original_price numeric(10,2), -- Prix barré
  currency text DEFAULT 'EUR',
  
  -- Media & Assets
  cover_image_url text,
  preview_video_url text,
  files jsonb, -- Structure: {"videos": [...], "pdfs": [...], "audios": [...]}
  
  -- Organization
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  difficulty_level text CHECK (difficulty_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
  estimated_duration integer, -- En minutes
  
  -- Status & Visibility
  status text DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  is_featured boolean DEFAULT false,
  is_free boolean DEFAULT false,
  
  -- SEO & Marketing
  meta_title text,
  meta_description text,
  
  -- Timestamps
  published_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Index critiques pour performance
CREATE INDEX idx_packs_slug ON packs(slug);
CREATE INDEX idx_packs_status ON packs(status);
CREATE INDEX idx_packs_category ON packs(category_id);
CREATE INDEX idx_packs_featured ON packs(is_featured);
CREATE INDEX idx_packs_price ON packs(price);
CREATE INDEX idx_packs_published_at ON packs(published_at);

-- Table: user_packs (achats et accès utilisateurs)
-- Relation many-to-many avec métadonnées business
CREATE TABLE user_packs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pack_id uuid NOT NULL REFERENCES packs(id) ON DELETE CASCADE,
  
  -- Transaction Info
  transaction_id text, -- ID de Systeme.io
  payment_method text, -- 'SYSTEME_IO', 'STRIPE', 'FREE', etc.
  amount_paid numeric(10,2),
  currency text DEFAULT 'EUR',
  
  -- Access Control
  status text DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'REFUNDED', 'SUSPENDED')),
  access_granted_at timestamp with time zone DEFAULT now(),
  access_expires_at timestamp with time zone, -- NULL = permanent
  
  -- Progress Tracking
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  last_accessed_at timestamp with time zone,
  completion_date timestamp with time zone,
  
  -- Metadata
  notes text, -- Notes admin
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  -- Contrainte unicité
  UNIQUE(user_id, pack_id)
);

-- Index pour requêtes fréquentes
CREATE INDEX idx_user_packs_user ON user_packs(user_id);
CREATE INDEX idx_user_packs_pack ON user_packs(pack_id);
CREATE INDEX idx_user_packs_status ON user_packs(status);
CREATE INDEX idx_user_packs_transaction ON user_packs(transaction_id);

-- Table: samples (extraits gratuits)
-- Échantillons pour tester avant achat
CREATE TABLE samples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id uuid NOT NULL REFERENCES packs(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  
  -- Media
  file_url text NOT NULL,
  file_type text NOT NULL CHECK (file_type IN ('VIDEO', 'AUDIO', 'PDF', 'IMAGE')),
  file_size bigint, -- En bytes
  duration integer, -- En secondes pour video/audio
  
  -- Organization
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_samples_pack ON samples(pack_id);
CREATE INDEX idx_samples_active ON samples(is_active);

-- =====================================================
-- 2. TAGGING SYSTEM
-- =====================================================

-- Table: tags (système de tags flexible)
CREATE TABLE tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  color text, -- Code couleur hex
  usage_count integer DEFAULT 0, -- Dénormalisé pour performance
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_usage ON tags(usage_count DESC);

-- Table: pack_tags (relation many-to-many)
CREATE TABLE pack_tags (
  pack_id uuid NOT NULL REFERENCES packs(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (pack_id, tag_id)
);

-- =====================================================
-- 3. ENGAGEMENT & ANALYTICS
-- =====================================================

-- Table: favorites (favoris utilisateurs)
CREATE TABLE favorites (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pack_id uuid NOT NULL REFERENCES packs(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (user_id, pack_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_pack ON favorites(pack_id);

-- Table: pack_stats (métriques business)
-- Dénormalisé pour performance des dashboards
CREATE TABLE pack_stats (
  pack_id uuid PRIMARY KEY REFERENCES packs(id) ON DELETE CASCADE,
  
  -- Engagement
  views_count integer DEFAULT 0,
  favorites_count integer DEFAULT 0,
  samples_downloads integer DEFAULT 0,
  
  -- Business
  purchases_count integer DEFAULT 0,
  revenue_total numeric(12,2) DEFAULT 0,
  
  -- Ratings (pour futur)
  average_rating numeric(3,2) DEFAULT 0,
  ratings_count integer DEFAULT 0,
  
  -- Timestamps
  last_viewed_at timestamp with time zone,
  updated_at timestamp with time zone DEFAULT now()
);

-- =====================================================
-- 4. IA & OUTILS
-- =====================================================

-- Table: ai_tools (outils IA disponibles)
-- Configuration des outils IA intégrés
CREATE TABLE ai_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  
  -- Configuration
  tool_type text NOT NULL CHECK (tool_type IN ('GENERATOR', 'ANALYZER', 'OPTIMIZER', 'ASSISTANT')),
  api_endpoint text,
  config jsonb, -- Configuration spécifique (prompts, paramètres, etc.)
  
  -- Access Control
  is_active boolean DEFAULT true,
  requires_pack_access boolean DEFAULT false, -- Si lié à un pack spécifique
  pack_id uuid REFERENCES packs(id) ON DELETE SET NULL,
  
  -- Limits
  daily_limit integer, -- NULL = illimité
  monthly_limit integer,
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_ai_tools_slug ON ai_tools(slug);
CREATE INDEX idx_ai_tools_active ON ai_tools(is_active);
CREATE INDEX idx_ai_tools_pack ON ai_tools(pack_id);

-- Table: ai_usage (logs d'utilisation IA)
-- Traçabilité et analytics des outils IA
CREATE TABLE ai_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tool_id uuid NOT NULL REFERENCES ai_tools(id) ON DELETE CASCADE,
  
  -- Request Info
  input_data jsonb, -- Données d'entrée (anonymisées si nécessaire)
  output_data jsonb, -- Résultat généré
  
  -- Metadata
  execution_time_ms integer, -- Temps d'exécution
  tokens_used integer, -- Pour APIs avec comptage tokens
  cost_cents integer, -- Coût en centimes
  
  -- Status
  status text DEFAULT 'SUCCESS' CHECK (status IN ('SUCCESS', 'ERROR', 'TIMEOUT')),
  error_message text,
  
  -- Context
  ip_address inet,
  user_agent text,
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT now()
);

-- Index pour analytics et monitoring
CREATE INDEX idx_ai_usage_user ON ai_usage(user_id);
CREATE INDEX idx_ai_usage_tool ON ai_usage(tool_id);
CREATE INDEX idx_ai_usage_date ON ai_usage(created_at);
CREATE INDEX idx_ai_usage_status ON ai_usage(status);

-- =====================================================
-- 5. ADMIN & AUDIT
-- =====================================================

-- Table: admin_logs (logs d'administration)
-- Traçabilité des actions admin (RGPD compliant)
CREATE TABLE admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Action Info
  action text NOT NULL, -- 'CREATE_USER', 'UPDATE_PACK', 'DELETE_SAMPLE', etc.
  resource_type text NOT NULL, -- 'users', 'packs', 'samples', etc.
  resource_id uuid, -- ID de la ressource affectée
  
  -- Details
  changes jsonb, -- Avant/après pour les modifications
  reason text, -- Raison de l'action (optionnel)
  
  -- Context
  ip_address inet,
  user_agent text,
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_admin_logs_admin ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_resource ON admin_logs(resource_type, resource_id);
CREATE INDEX idx_admin_logs_date ON admin_logs(created_at);

-- =====================================================
-- 6. TRIGGERS & FONCTIONS
-- =====================================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_packs_updated_at BEFORE UPDATE ON packs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_packs_updated_at BEFORE UPDATE ON user_packs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_samples_updated_at BEFORE UPDATE ON samples FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_tools_updated_at BEFORE UPDATE ON ai_tools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pack_stats_updated_at BEFORE UPDATE ON pack_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour maintenir les compteurs de tags
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tags SET usage_count = usage_count - 1 WHERE id = OLD.tag_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tag_usage_on_pack_tags 
    AFTER INSERT OR DELETE ON pack_tags 
    FOR EACH ROW EXECUTE FUNCTION update_tag_usage_count();

-- =====================================================
-- 7. RLS (ROW LEVEL SECURITY) - SÉCURITÉ SUPABASE
-- =====================================================

-- Activer RLS sur les tables sensibles
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

-- Politiques RLS basiques (à adapter selon vos besoins)
-- Les utilisateurs peuvent voir leurs propres données
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own packs" ON user_packs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own AI usage" ON ai_usage FOR SELECT USING (auth.uid() = user_id);

-- Les packs publics sont visibles par tous
CREATE POLICY "Published packs are viewable by everyone" ON packs FOR SELECT USING (status = 'PUBLISHED');

-- =====================================================
-- 8. DONNÉES INITIALES
-- =====================================================

-- Catégories par défaut
INSERT INTO categories (name, slug, description, icon, color) VALUES
('Marketing Digital', 'marketing-digital', 'Stratégies et outils marketing', 'megaphone', '#FF6B6B'),
('Entrepreneuriat', 'entrepreneuriat', 'Création et gestion d''entreprise', 'briefcase', '#4ECDC4'),
('Productivité', 'productivite', 'Outils et méthodes de productivité', 'zap', '#45B7D1'),
('Intelligence Artificielle', 'ia', 'Outils et formations IA', 'cpu', '#96CEB4'),
('Vente & Négociation', 'vente', 'Techniques de vente et négociation', 'trending-up', '#FFEAA7');

-- Outils IA par défaut
INSERT INTO ai_tools (name, slug, description, tool_type, is_active) VALUES
('Générateur d''idées business', 'business-ideas', 'Génère des idées de business personnalisées', 'GENERATOR', true),
('Analyseur de marché', 'market-analyzer', 'Analyse la viabilité d''un marché', 'ANALYZER', true),
('Optimiseur de contenu', 'content-optimizer', 'Optimise le contenu marketing', 'OPTIMIZER', true),
('Assistant stratégique', 'strategy-assistant', 'Aide à la prise de décision stratégique', 'ASSISTANT', true);

-- =====================================================
-- FIN DU SCHÉMA
-- ===================================================== 