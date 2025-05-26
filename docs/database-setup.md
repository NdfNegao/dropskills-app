# 🗄️ Configuration Base de Données DropSkills

## 📋 Vue d'ensemble

Ce document décrit la configuration complète de la base de données PostgreSQL pour DropSkills, hébergée sur Supabase avec intégration Prisma.

## 🚀 Étapes de déploiement

### 1. Configuration Supabase

1. **Créer un projet Supabase**
   ```bash
   # Aller sur https://supabase.com
   # Créer un nouveau projet
   # Noter les clés API et l'URL
   ```

2. **Configurer les variables d'environnement**
   ```bash
   cp env.example .env.local
   # Remplir avec vos clés Supabase
   ```

### 2. Déploiement du schéma

1. **Générer et déployer le schéma Prisma**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

2. **Vérifier le déploiement**
   ```bash
   npx prisma studio
   ```

### 3. Configuration RLS (Row Level Security)

Exécuter dans l'éditeur SQL de Supabase :

```sql
-- ============================================================================
-- CONFIGURATION RLS (ROW LEVEL SECURITY)
-- ============================================================================

-- Activer RLS sur toutes les tables sensibles
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pack_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ia_tool_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Politiques pour les utilisateurs
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id);

-- Politiques pour les packs
CREATE POLICY "Anyone can view public packs" ON packs
  FOR SELECT USING (visibility = 'PUBLIC');

CREATE POLICY "Users can view purchased packs" ON packs
  FOR SELECT USING (
    id IN (
      SELECT pack_id FROM pack_users 
      WHERE user_id = auth.uid()::text 
      AND status = 'ACTIVE'
    )
  );

CREATE POLICY "Creators can manage own packs" ON packs
  FOR ALL USING (creator_id = auth.uid()::text);

-- Politiques pour les achats
CREATE POLICY "Users can view own purchases" ON pack_users
  FOR SELECT USING (user_id = auth.uid()::text);

-- Politiques pour l'usage IA
CREATE POLICY "Users can view own IA usage" ON ia_tool_usage
  FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can create IA usage" ON ia_tool_usage
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);

-- Politiques pour le support
CREATE POLICY "Users can view own tickets" ON support_tickets
  FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can create tickets" ON support_tickets
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);

-- Politiques pour les notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid()::text);
```

### 4. Fonctions et triggers

```sql
-- ============================================================================
-- FONCTIONS ET TRIGGERS
-- ============================================================================

-- Fonction pour mettre à jour les statistiques des packs
CREATE OR REPLACE FUNCTION update_pack_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Nouveau téléchargement/achat
    UPDATE pack_stats 
    SET 
      downloads = downloads + 1,
      purchases = CASE WHEN NEW.status = 'ACTIVE' THEN purchases + 1 ELSE purchases END,
      revenue = CASE WHEN NEW.amount IS NOT NULL THEN revenue + NEW.amount ELSE revenue END
    WHERE pack_id = NEW.pack_id;
    
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour les statistiques
CREATE TRIGGER pack_stats_trigger
  AFTER INSERT ON pack_users
  FOR EACH ROW
  EXECUTE FUNCTION update_pack_stats();

-- Fonction pour les métriques quotidiennes
CREATE OR REPLACE FUNCTION update_daily_metrics()
RETURNS void AS $$
DECLARE
  today_date DATE := CURRENT_DATE;
BEGIN
  INSERT INTO daily_metrics (
    date,
    new_users,
    active_users,
    total_users,
    pack_views,
    pack_downloads,
    pack_purchases,
    ia_tool_usage,
    tokens_consumed,
    revenue
  )
  VALUES (
    today_date,
    (SELECT COUNT(*) FROM users WHERE DATE(created_at) = today_date),
    (SELECT COUNT(*) FROM users WHERE DATE(last_login_at) = today_date),
    (SELECT COUNT(*) FROM users WHERE status = 'ACTIVE'),
    0, -- À calculer selon vos besoins
    (SELECT COUNT(*) FROM pack_users WHERE DATE(created_at) = today_date),
    (SELECT COUNT(*) FROM pack_users WHERE DATE(created_at) = today_date AND status = 'ACTIVE'),
    (SELECT COUNT(*) FROM ia_tool_usage WHERE DATE(created_at) = today_date),
    (SELECT COALESCE(SUM(tokens_used), 0) FROM ia_tool_usage WHERE DATE(created_at) = today_date),
    (SELECT COALESCE(SUM(amount), 0) FROM pack_users WHERE DATE(created_at) = today_date)
  )
  ON CONFLICT (date) DO UPDATE SET
    new_users = EXCLUDED.new_users,
    active_users = EXCLUDED.active_users,
    total_users = EXCLUDED.total_users,
    pack_downloads = EXCLUDED.pack_downloads,
    pack_purchases = EXCLUDED.pack_purchases,
    ia_tool_usage = EXCLUDED.ia_tool_usage,
    tokens_consumed = EXCLUDED.tokens_consumed,
    revenue = EXCLUDED.revenue;
END;
$$ LANGUAGE plpgsql;

-- Planifier l'exécution quotidienne (via pg_cron si disponible)
-- SELECT cron.schedule('daily-metrics', '0 1 * * *', 'SELECT update_daily_metrics();');
```

### 5. Index pour les performances

```sql
-- ============================================================================
-- INDEX POUR LES PERFORMANCES
-- ============================================================================

-- Index sur les emails (recherche utilisateurs)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(subscription_type, subscription_status);

-- Index sur les packs
CREATE INDEX IF NOT EXISTS idx_packs_visibility ON packs(visibility);
CREATE INDEX IF NOT EXISTS idx_packs_status ON packs(status);
CREATE INDEX IF NOT EXISTS idx_packs_creator ON packs(creator_id);
CREATE INDEX IF NOT EXISTS idx_packs_category ON packs(category_id);
CREATE INDEX IF NOT EXISTS idx_packs_tags ON packs USING GIN(tags);

-- Index sur les achats
CREATE INDEX IF NOT EXISTS idx_pack_users_user ON pack_users(user_id);
CREATE INDEX IF NOT EXISTS idx_pack_users_pack ON pack_users(pack_id);
CREATE INDEX IF NOT EXISTS idx_pack_users_status ON pack_users(status);
CREATE INDEX IF NOT EXISTS idx_pack_users_origin ON pack_users(origin);

-- Index sur l'usage IA
CREATE INDEX IF NOT EXISTS idx_ia_usage_user ON ia_tool_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_ia_usage_tool ON ia_tool_usage(tool_id);
CREATE INDEX IF NOT EXISTS idx_ia_usage_date ON ia_tool_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_ia_usage_status ON ia_tool_usage(status);

-- Index sur les webhooks
CREATE INDEX IF NOT EXISTS idx_webhooks_status ON webhook_events(status);
CREATE INDEX IF NOT EXISTS idx_webhooks_provider ON webhook_events(provider);
CREATE INDEX IF NOT EXISTS idx_webhooks_email ON webhook_events(user_email);
CREATE INDEX IF NOT EXISTS idx_webhooks_date ON webhook_events(created_at);

-- Index sur le support
CREATE INDEX IF NOT EXISTS idx_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned ON support_tickets(assigned_to_id);

-- Index composites pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_pack_users_active ON pack_users(user_id, status) WHERE status = 'ACTIVE';
CREATE INDEX IF NOT EXISTS idx_packs_public ON packs(visibility, status) WHERE visibility = 'PUBLIC' AND status = 'ACTIVE';
```

## 🔐 Configuration de l'authentification

### 1. Intégration Supabase Auth

```sql
-- ============================================================================
-- INTÉGRATION SUPABASE AUTH
-- ============================================================================

-- Fonction pour synchroniser les utilisateurs Supabase avec notre table users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, provider, created_at)
  VALUES (
    NEW.id::text,
    NEW.email,
    CASE 
      WHEN NEW.app_metadata->>'provider' = 'google' THEN 'GOOGLE'::auth_provider
      WHEN NEW.app_metadata->>'provider' = 'github' THEN 'GITHUB'::auth_provider
      ELSE 'EMAIL'::auth_provider
    END,
    NEW.created_at
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour la synchronisation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 2. Configuration des providers OAuth

Dans le dashboard Supabase > Authentication > Providers :

- **Google** : Configurer avec `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET`
- **GitHub** : Configurer avec `GITHUB_CLIENT_ID` et `GITHUB_CLIENT_SECRET`

## 🔗 Intégration n8n

### Endpoints API disponibles

#### Utilisateurs
- `GET /api/n8n/users` - Liste des utilisateurs
- `POST /api/n8n/users` - Créer un utilisateur
- `GET /api/n8n/users/[id]` - Détails d'un utilisateur
- `PUT /api/n8n/users/[id]` - Mettre à jour un utilisateur
- `DELETE /api/n8n/users/[id]` - Supprimer un utilisateur

#### Packs
- `GET /api/n8n/packs` - Liste des packs
- `POST /api/n8n/packs` - Créer un pack
- `GET /api/n8n/packs/[id]` - Détails d'un pack
- `PUT /api/n8n/packs/[id]` - Mettre à jour un pack

#### Webhooks
- `POST /api/webhooks/systeme-io` - Webhook Systeme.io
- `POST /api/webhooks/stripe` - Webhook Stripe

### Authentification n8n

Toutes les requêtes doivent inclure :
```
Headers:
  x-api-key: YOUR_N8N_API_KEY
  Content-Type: application/json
```

## 📊 Analytics et métriques

### Requêtes utiles

```sql
-- Utilisateurs actifs par jour
SELECT 
  DATE(last_login_at) as date,
  COUNT(*) as active_users
FROM users 
WHERE last_login_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(last_login_at)
ORDER BY date;

-- Top packs par revenus
SELECT 
  p.title,
  ps.revenue,
  ps.purchases,
  ps.downloads
FROM packs p
JOIN pack_stats ps ON p.id = ps.pack_id
ORDER BY ps.revenue DESC
LIMIT 10;

-- Usage IA par outil
SELECT 
  it.name,
  COUNT(*) as usage_count,
  SUM(itu.tokens_used) as total_tokens
FROM ia_tools it
JOIN ia_tool_usage itu ON it.id = itu.tool_id
WHERE itu.created_at >= NOW() - INTERVAL '30 days'
GROUP BY it.id, it.name
ORDER BY usage_count DESC;
```

## 🚨 Sécurité et bonnes pratiques

1. **Variables d'environnement** : Toujours utiliser des variables d'environnement pour les clés sensibles
2. **RLS** : Row Level Security activé sur toutes les tables sensibles
3. **Validation** : Validation des données côté API et base de données
4. **Audit** : Logs d'audit pour toutes les actions administratives
5. **Backup** : Sauvegardes automatiques configurées sur Supabase

## 🔄 Maintenance

### Tâches quotidiennes automatisées
- Mise à jour des métriques quotidiennes
- Nettoyage des logs anciens
- Vérification des webhooks en erreur

### Tâches hebdomadaires
- Analyse des performances des requêtes
- Vérification de l'espace disque
- Audit des accès utilisateurs

## 📞 Support

Pour toute question sur la base de données :
1. Vérifier les logs dans Supabase Dashboard
2. Utiliser `npx prisma studio` pour explorer les données
3. Consulter la documentation Prisma et Supabase 