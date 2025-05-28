# 🚀 MIGRATION PRISMA → SUPABASE-JS - DROPSKILLS

## 📋 ÉTAT ACTUEL

### Dépendances Prisma à supprimer :
- `@prisma/client`: ^6.8.2
- `prisma`: ^6.8.2
- `@next-auth/prisma-adapter`: ^1.0.7

### Fichiers Prisma à supprimer :
- `/prisma/` (tout le dossier)
- `/src/generated/prisma/` et `/src/generated/prisma-v2/`
- `/src/lib/prisma.ts`
- Scripts dans package.json : `db:generate`, `db:push`, `db:studio`

### Routes API utilisant Prisma (à migrer) :
- `/api/v2/test/route.ts`
- `/api/v2/categories/route.ts`
- `/api/v2/ai-tools/route.ts`
- `/api/v2/packs/route.ts`
- `/api/v2/admin/setup/route.ts`
- `/api/webhooks/systeme-io/route.ts`
- `/api/n8n/users/route.ts`
- `/api/n8n/users/[id]/route.ts`

### Hooks utilisant Prisma :
- `/src/hooks/useUserData.ts`

---

## 🗄️ STRUCTURE BASE DE DONNÉES SUPABASE

### Tables principales (basées sur le schéma Prisma) :

```sql
-- Users table (avec auth intégré)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table (rôles et métadonnées)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'USER' CHECK (role IN ('USER', 'PREMIUM', 'ADMIN', 'SUPER_ADMIN')),
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Packs table
CREATE TABLE packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL,
  status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  creator_id UUID REFERENCES users(id),
  category_id UUID REFERENCES categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Samples table
CREATE TABLE samples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  pack_id UUID REFERENCES packs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User_packs table (achats)
CREATE TABLE user_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  pack_id UUID REFERENCES packs(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, pack_id)
);

-- Favorites table
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  pack_id UUID REFERENCES packs(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, pack_id)
);

-- Pack_stats table
CREATE TABLE pack_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id UUID REFERENCES packs(id) ON DELETE CASCADE UNIQUE,
  views_count INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  purchases_count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI_tools table
CREATE TABLE ai_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  tool_type TEXT CHECK (tool_type IN ('ICP_MAKER', 'OFFER_GENERATOR', 'TITLE_GENERATOR', 'CONTENT_SYSTEM', 'TUNNEL_BUILDER', 'EMAIL_SEQUENCE', 'LEAD_MAGNET', 'VEILLE_STRATEGIQUE')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI_usage table
CREATE TABLE ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  tool_id UUID REFERENCES ai_tools(id),
  status TEXT DEFAULT 'SUCCESS' CHECK (status IN ('SUCCESS', 'ERROR', 'PENDING')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin_logs table
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔐 POLICIES RLS (ROW LEVEL SECURITY)

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM profiles 
      WHERE role IN ('ADMIN', 'SUPER_ADMIN')
    )
  );

-- Packs policies
CREATE POLICY "Anyone can view published packs" ON packs
  FOR SELECT USING (status = 'PUBLISHED');

CREATE POLICY "Creators can manage own packs" ON packs
  FOR ALL USING (auth.uid() = creator_id);

CREATE POLICY "Admins can manage all packs" ON packs
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM profiles 
      WHERE role IN ('ADMIN', 'SUPER_ADMIN')
    )
  );

-- User_packs policies
CREATE POLICY "Users can view own purchases" ON user_packs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own purchases" ON user_packs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can manage own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- AI_usage policies
CREATE POLICY "Users can view own AI usage" ON ai_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create AI usage" ON ai_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin_logs policies
CREATE POLICY "Only admins can view logs" ON admin_logs
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM profiles 
      WHERE role IN ('ADMIN', 'SUPER_ADMIN')
    )
  );
```

---

## 🔄 MAPPING PRISMA → SUPABASE-JS

### Requêtes de lecture :
```typescript
// AVANT (Prisma)
await prisma.user.findMany()
await prisma.user.findUnique({ where: { id } })
await prisma.pack.findMany({ include: { category: true } })

// APRÈS (Supabase)
await supabase.from('users').select('*')
await supabase.from('users').select('*').eq('id', id).single()
await supabase.from('packs').select('*, categories(*)')
```

### Requêtes de création :
```typescript
// AVANT (Prisma)
await prisma.user.create({ data: { email, password } })

// APRÈS (Supabase)
await supabase.from('users').insert({ email, password }).select().single()
```

### Requêtes de mise à jour :
```typescript
// AVANT (Prisma)
await prisma.user.update({ where: { id }, data: { firstName } })

// APRÈS (Supabase)
await supabase.from('users').update({ first_name: firstName }).eq('id', id).select().single()
```

### Requêtes de suppression :
```typescript
// AVANT (Prisma)
await prisma.user.delete({ where: { id } })

// APRÈS (Supabase)
await supabase.from('users').delete().eq('id', id)
```

---

## 📝 PLAN D'EXÉCUTION

### Phase 1 : Préparation
1. ✅ Créer les tables Supabase
2. ✅ Configurer les policies RLS
3. ✅ Tester la connexion Supabase

### Phase 2 : Migration du code
1. 🔄 Remplacer `/src/lib/prisma.ts` par helpers Supabase
2. 🔄 Migrer toutes les routes API
3. 🔄 Migrer les hooks
4. 🔄 Mettre à jour les scripts

### Phase 3 : Nettoyage
1. 🗑️ Supprimer les dépendances Prisma
2. 🗑️ Supprimer les fichiers Prisma
3. 🗑️ Nettoyer package.json
4. 🗑️ Mettre à jour .env

### Phase 4 : Tests
1. 🧪 Tester l'authentification
2. 🧪 Tester les CRUD operations
3. 🧪 Tester les permissions admin
4. 🧪 Validation complète 