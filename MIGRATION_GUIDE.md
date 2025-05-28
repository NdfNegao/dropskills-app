# 🚀 GUIDE DE MIGRATION PRISMA → SUPABASE - DROPSKILLS

## ✅ ÉTAPES RÉALISÉES

### 1. Code migré
- ✅ `/src/lib/supabase.ts` - Client Supabase avec helpers
- ✅ `/src/app/api/v2/test/route.ts` - Route de test migrée
- ✅ `/src/app/api/v2/categories/route.ts` - Route catégories migrée
- ✅ `/src/app/api/v2/ai-tools/route.ts` - Route outils IA migrée
- ✅ `package.json` - Dépendances Prisma supprimées
- ✅ `scripts/create-admin.js` - Script admin avec Supabase
- ✅ `env.example` - Variables Prisma supprimées
- ✅ `supabase_migration.sql` - Script de création des tables

### 2. Fichiers supprimés
- ✅ `/src/lib/prisma.ts` - Client Prisma supprimé

---

## 🔄 ÉTAPES À FINALISER

### ÉTAPE 1 : Exécuter le script SQL Supabase

1. **Connectez-vous à votre dashboard Supabase**
2. **Allez dans SQL Editor**
3. **Exécutez le script `supabase_migration.sql`**

```bash
# Le script va créer :
# - Toutes les tables nécessaires
# - Les index pour les performances
# - Les policies RLS pour la sécurité
# - Les triggers pour updated_at
# - Les données initiales (catégories, outils IA)
```

### ÉTAPE 2 : Supprimer les dossiers Prisma

```bash
# Supprimer le dossier prisma
rm -rf prisma/

# Supprimer les fichiers générés
rm -rf src/generated/

# Supprimer node_modules et réinstaller
rm -rf node_modules/
npm install
```

### ÉTAPE 3 : Migrer les routes API restantes

Les routes suivantes utilisent encore Prisma et doivent être migrées :

```bash
# Routes à migrer
src/app/api/v2/packs/route.ts
src/app/api/v2/admin/setup/route.ts
src/app/api/webhooks/systeme-io/route.ts
src/app/api/n8n/users/route.ts
src/app/api/n8n/users/[id]/route.ts
```

### ÉTAPE 4 : Migrer les hooks

```bash
# Hook à migrer
src/hooks/useUserData.ts
```

### ÉTAPE 5 : Tester la migration

```bash
# 1. Démarrer le serveur
npm run dev

# 2. Tester les routes migrées
curl http://localhost:3001/api/v2/test
curl http://localhost:3001/api/v2/categories
curl http://localhost:3001/api/v2/ai-tools

# 3. Créer un admin
npm run create-admin

# 4. Initialiser les outils IA
curl -X POST http://localhost:3001/api/v2/ai-tools \
  -H "Content-Type: application/json" \
  -d '{"action": "init_default_tools"}'
```

---

## 📝 MIGRATION DES ROUTES RESTANTES

### Route Packs (`/api/v2/packs/route.ts`)

```typescript
// AVANT (Prisma)
const packs = await prisma.pack.findMany({
  where: { status: 'PUBLISHED' },
  include: {
    category: true,
    samples: true,
    stats: true
  }
})

// APRÈS (Supabase)
const packs = await SupabaseHelper.findManyPacks({
  where: { status: 'PUBLISHED' },
  include: {
    category: true,
    samples: true,
    stats: true
  }
})
```

### Route Admin Setup (`/api/v2/admin/setup/route.ts`)

```typescript
// AVANT (Prisma)
const user = await prisma.user.findUnique({
  where: { email }
})

// APRÈS (Supabase)
const user = await SupabaseHelper.findUserByEmail(email)
```

### Hook useUserData (`/hooks/useUserData.ts`)

```typescript
// AVANT (Prisma)
import { prisma } from '@/lib/prisma'

// APRÈS (Supabase)
import { SupabaseHelper } from '@/lib/supabase'
```

---

## 🔐 AUTHENTIFICATION SUPABASE

### Configuration NextAuth avec Supabase

Mettre à jour `/src/lib/auth.ts` :

```typescript
import { SupabaseAdapter } from "@next-auth/supabase-adapter"
import { supabase } from "@/lib/supabase"

export const authOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  // ... rest of config
}
```

### Gestion des rôles

```typescript
// Vérifier le rôle d'un utilisateur
async function getUserRole(userId: string) {
  const profile = await SupabaseHelper.findProfileByUserId(userId)
  return profile?.role || 'USER'
}

// Middleware pour vérifier les permissions
export async function checkPremiumAccess(userId: string) {
  const role = await getUserRole(userId)
  return ['PREMIUM', 'ADMIN', 'SUPER_ADMIN'].includes(role)
}
```

---

## 🧪 TESTS DE VALIDATION

### 1. Test des tables

```sql
-- Vérifier que toutes les tables existent
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'users', 'profiles', 'categories', 'packs', 'samples',
    'user_packs', 'favorites', 'pack_stats', 'ai_tools',
    'ai_usage', 'admin_logs'
  );
```

### 2. Test des policies RLS

```sql
-- Vérifier les policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

### 3. Test des données initiales

```sql
-- Vérifier les catégories
SELECT * FROM categories;

-- Vérifier les outils IA
SELECT * FROM ai_tools;
```

### 4. Test de l'authentification

```bash
# Créer un admin
npm run create-admin

# Créer un admin personnalisé
npm run create-admin -- --custom
```

---

## 🚨 POINTS D'ATTENTION

### 1. Variables d'environnement

Assurez-vous d'avoir :
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx
```

### 2. Permissions Supabase

- Le service role key doit avoir tous les droits
- L'anon key doit respecter les policies RLS

### 3. Migration des données existantes

Si vous avez des données Prisma existantes :

```sql
-- Exporter depuis Prisma
pg_dump your_prisma_db > backup.sql

-- Adapter le format pour Supabase
-- Puis importer dans Supabase
```

### 4. Types TypeScript

Les types sont maintenant définis dans `/src/lib/supabase.ts` :
- `User`, `Profile`, `Category`, `Pack`, etc.

---

## ✅ CHECKLIST FINALE

- [ ] Script SQL exécuté dans Supabase
- [ ] Dossiers Prisma supprimés
- [ ] Dependencies réinstallées
- [ ] Routes API migrées
- [ ] Hooks migrés
- [ ] Tests passés
- [ ] Admin créé
- [ ] Outils IA initialisés
- [ ] Authentification fonctionnelle

---

## 🎉 MIGRATION TERMINÉE !

Une fois toutes les étapes complétées, votre application Dropskills fonctionnera entièrement avec Supabase, sans aucune dépendance Prisma.

**Avantages obtenus :**
- ✅ Plus de complexité Prisma
- ✅ Authentification Supabase intégrée
- ✅ Sécurité RLS native
- ✅ Performance optimisée
- ✅ Moins de dépendances
- ✅ Code plus simple et maintenable 