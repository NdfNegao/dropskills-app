# 🚀 PLAN DE MIGRATION DROPSKILLS V2

## 📊 **ÉTAPE 1 : AUDIT & SAUVEGARDE**

### 1.1 Sauvegarde complète
```bash
# Backup complet de la base actuelle
pg_dump -h your-supabase-host -U postgres -d postgres > dropskills_backup_$(date +%Y%m%d).sql
```

### 1.2 Audit des données existantes
```sql
-- Compter les enregistrements par table
SELECT 
  schemaname,
  tablename,
  n_tup_ins as "Total Rows"
FROM pg_stat_user_tables 
ORDER BY n_tup_ins DESC;

-- Identifier les relations critiques
SELECT 
  tc.table_name, 
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';
```

## 🔄 **ÉTAPE 2 : MIGRATION DES DONNÉES**

### 2.1 Créer le nouveau schéma
```sql
-- Exécuter le script database_schema_v2.sql dans un nouveau schéma
CREATE SCHEMA dropskills_v2;
-- Puis exécuter tout le contenu du fichier database_schema_v2.sql
```

### 2.2 Migration des utilisateurs
```sql
-- Migrer les utilisateurs existants
INSERT INTO dropskills_v2.users (id, email, first_name, last_name, avatar_url, role, status, created_at, updated_at)
SELECT 
  id,
  email,
  COALESCE(firstName, first_name) as first_name,
  COALESCE(lastName, last_name) as last_name,
  avatar_url,
  CASE 
    WHEN role = 'SUPER_ADMIN' THEN 'SUPER_ADMIN'
    WHEN role = 'ADMIN' THEN 'ADMIN'
    ELSE 'USER'
  END as role,
  COALESCE(status, 'ACTIVE') as status,
  created_at,
  updated_at
FROM public.users -- ou public.profiles selon votre structure actuelle
WHERE email IS NOT NULL;
```

### 2.3 Migration des catégories
```sql
-- Migrer les catégories existantes
INSERT INTO dropskills_v2.categories (id, name, slug, description, created_at, updated_at)
SELECT 
  id,
  name,
  LOWER(REPLACE(REPLACE(name, ' ', '-'), 'é', 'e')) as slug, -- Générer slug
  description,
  created_at,
  updated_at
FROM public.categories
WHERE name IS NOT NULL;
```

### 2.4 Migration des packs/produits
```sql
-- Migrer les packs (adapter selon votre structure actuelle)
INSERT INTO dropskills_v2.packs (
  id, title, slug, description, price, cover_image_url, 
  category_id, status, is_featured, created_at, updated_at
)
SELECT 
  id,
  COALESCE(title, name) as title,
  LOWER(REPLACE(REPLACE(COALESCE(title, name), ' ', '-'), 'é', 'e')) as slug,
  description,
  COALESCE(price, 0) as price,
  COALESCE(cover_image_url, image_url) as cover_image_url,
  category_id,
  CASE 
    WHEN status = 'ACTIVE' THEN 'PUBLISHED'
    WHEN status = 'DRAFT' THEN 'DRAFT'
    ELSE 'ARCHIVED'
  END as status,
  COALESCE(is_featured, false) as is_featured,
  created_at,
  updated_at
FROM public.packs -- ou public.products
WHERE title IS NOT NULL OR name IS NOT NULL;
```

### 2.5 Migration des achats/accès
```sql
-- Migrer les relations utilisateur-pack
INSERT INTO dropskills_v2.user_packs (
  user_id, pack_id, transaction_id, amount_paid, 
  status, access_granted_at, created_at
)
SELECT 
  user_id,
  pack_id,
  transaction_id,
  COALESCE(amount, 0) as amount_paid,
  CASE 
    WHEN status = 'ACTIVE' THEN 'ACTIVE'
    WHEN status = 'REFUNDED' THEN 'REFUNDED'
    ELSE 'ACTIVE'
  END as status,
  COALESCE(created_at, now()) as access_granted_at,
  created_at
FROM public.pack_users -- ou table équivalente
WHERE user_id IS NOT NULL AND pack_id IS NOT NULL;
```

### 2.6 Migration des échantillons
```sql
-- Migrer les samples
INSERT INTO dropskills_v2.samples (
  id, pack_id, title, file_url, file_type, 
  sort_order, is_active, created_at
)
SELECT 
  id,
  pack_id,
  title,
  file_url,
  CASE 
    WHEN file_url LIKE '%.mp4' OR file_url LIKE '%.mov' THEN 'VIDEO'
    WHEN file_url LIKE '%.mp3' OR file_url LIKE '%.wav' THEN 'AUDIO'
    WHEN file_url LIKE '%.pdf' THEN 'PDF'
    ELSE 'IMAGE'
  END as file_type,
  COALESCE(sort_order, 0) as sort_order,
  COALESCE(is_active, true) as is_active,
  created_at
FROM public.samples
WHERE pack_id IS NOT NULL AND file_url IS NOT NULL;
```

### 2.7 Migration des favoris
```sql
-- Migrer les favoris
INSERT INTO dropskills_v2.favorites (user_id, pack_id, created_at)
SELECT 
  user_id,
  COALESCE(pack_id, product_id) as pack_id,
  created_at
FROM public.favorites
WHERE user_id IS NOT NULL AND (pack_id IS NOT NULL OR product_id IS NOT NULL);
```

## 🔧 **ÉTAPE 3 : MISE À JOUR DE L'APPLICATION**

### 3.1 Nouveau schéma Prisma
```prisma
// Remplacer le contenu de prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email         String   @unique
  firstName     String?  @map("first_name")
  lastName      String?  @map("last_name")
  avatarUrl     String?  @map("avatar_url")
  role          String   @default("USER")
  status        String   @default("ACTIVE")
  lastLoginAt   DateTime? @map("last_login_at")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  // Relations
  userPacks     UserPack[]
  favorites     Favorite[]
  aiUsage       AiUsage[]
  adminLogs     AdminLog[]

  @@map("users")
}

model Category {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name        String   @unique
  slug        String   @unique
  description String?
  icon        String?
  color       String?
  sortOrder   Int      @default(0) @map("sort_order")
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // Relations
  packs       Pack[]

  @@map("categories")
}

model Pack {
  id                String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  title             String
  slug              String    @unique
  description       String?
  shortDescription  String?   @map("short_description")
  contentType       String    @default("MIXED") @map("content_type")
  price             Decimal   @default(0) @db.Decimal(10, 2)
  originalPrice     Decimal?  @map("original_price") @db.Decimal(10, 2)
  currency          String    @default("EUR")
  coverImageUrl     String?   @map("cover_image_url")
  previewVideoUrl   String?   @map("preview_video_url")
  files             Json?
  categoryId        String?   @map("category_id") @db.Uuid
  difficultyLevel   String?   @map("difficulty_level")
  estimatedDuration Int?      @map("estimated_duration")
  status            String    @default("DRAFT")
  isFeatured        Boolean   @default(false) @map("is_featured")
  isFree            Boolean   @default(false) @map("is_free")
  metaTitle         String?   @map("meta_title")
  metaDescription   String?   @map("meta_description")
  publishedAt       DateTime? @map("published_at")
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")

  // Relations
  category          Category? @relation(fields: [categoryId], references: [id])
  userPacks         UserPack[]
  samples           Sample[]
  favorites         Favorite[]
  packTags          PackTag[]
  packStats         PackStats?
  aiTools           AiTool[]

  @@map("packs")
}

model UserPack {
  id                  String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId              String    @map("user_id") @db.Uuid
  packId              String    @map("pack_id") @db.Uuid
  transactionId       String?   @map("transaction_id")
  paymentMethod       String?   @map("payment_method")
  amountPaid          Decimal?  @map("amount_paid") @db.Decimal(10, 2)
  currency            String    @default("EUR")
  status              String    @default("ACTIVE")
  accessGrantedAt     DateTime  @default(now()) @map("access_granted_at")
  accessExpiresAt     DateTime? @map("access_expires_at")
  progressPercentage  Int       @default(0) @map("progress_percentage")
  lastAccessedAt      DateTime? @map("last_accessed_at")
  completionDate      DateTime? @map("completion_date")
  notes               String?
  createdAt           DateTime  @default(now()) @map("created_at")
  updatedAt           DateTime  @updatedAt @map("updated_at")

  // Relations
  user                User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  pack                Pack      @relation(fields: [packId], references: [id], onDelete: Cascade)

  @@unique([userId, packId])
  @@map("user_packs")
}

model Sample {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  packId      String   @map("pack_id") @db.Uuid
  title       String
  description String?
  fileUrl     String   @map("file_url")
  fileType    String   @map("file_type")
  fileSize    BigInt?  @map("file_size")
  duration    Int?
  sortOrder   Int      @default(0) @map("sort_order")
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // Relations
  pack        Pack     @relation(fields: [packId], references: [id], onDelete: Cascade)

  @@map("samples")
}

model Tag {
  id         String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name       String    @unique
  slug       String    @unique
  color      String?
  usageCount Int       @default(0) @map("usage_count")
  createdAt  DateTime  @default(now()) @map("created_at")

  // Relations
  packTags   PackTag[]

  @@map("tags")
}

model PackTag {
  packId    String   @map("pack_id") @db.Uuid
  tagId     String   @map("tag_id") @db.Uuid
  createdAt DateTime @default(now()) @map("created_at")

  // Relations
  pack      Pack     @relation(fields: [packId], references: [id], onDelete: Cascade)
  tag       Tag      @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([packId, tagId])
  @@map("pack_tags")
}

model Favorite {
  userId    String   @map("user_id") @db.Uuid
  packId    String   @map("pack_id") @db.Uuid
  createdAt DateTime @default(now()) @map("created_at")

  // Relations
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  pack      Pack     @relation(fields: [packId], references: [id], onDelete: Cascade)

  @@id([userId, packId])
  @@map("favorites")
}

model PackStats {
  packId            String    @id @map("pack_id") @db.Uuid
  viewsCount        Int       @default(0) @map("views_count")
  favoritesCount    Int       @default(0) @map("favorites_count")
  samplesDownloads  Int       @default(0) @map("samples_downloads")
  purchasesCount    Int       @default(0) @map("purchases_count")
  revenueTotal      Decimal   @default(0) @map("revenue_total") @db.Decimal(12, 2)
  averageRating     Decimal   @default(0) @map("average_rating") @db.Decimal(3, 2)
  ratingsCount      Int       @default(0) @map("ratings_count")
  lastViewedAt      DateTime? @map("last_viewed_at")
  updatedAt         DateTime  @default(now()) @updatedAt @map("updated_at")

  // Relations
  pack              Pack      @relation(fields: [packId], references: [id], onDelete: Cascade)

  @@map("pack_stats")
}

model AiTool {
  id                  String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name                String   @unique
  slug                String   @unique
  description         String?
  toolType            String   @map("tool_type")
  apiEndpoint         String?  @map("api_endpoint")
  config              Json?
  isActive            Boolean  @default(true) @map("is_active")
  requiresPackAccess  Boolean  @default(false) @map("requires_pack_access")
  packId              String?  @map("pack_id") @db.Uuid
  dailyLimit          Int?     @map("daily_limit")
  monthlyLimit        Int?     @map("monthly_limit")
  createdAt           DateTime @default(now()) @map("created_at")
  updatedAt           DateTime @updatedAt @map("updated_at")

  // Relations
  pack                Pack?    @relation(fields: [packId], references: [id])
  aiUsage             AiUsage[]

  @@map("ai_tools")
}

model AiUsage {
  id              String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId          String   @map("user_id") @db.Uuid
  toolId          String   @map("tool_id") @db.Uuid
  inputData       Json?    @map("input_data")
  outputData      Json?    @map("output_data")
  executionTimeMs Int?     @map("execution_time_ms")
  tokensUsed      Int?     @map("tokens_used")
  costCents       Int?     @map("cost_cents")
  status          String   @default("SUCCESS")
  errorMessage    String?  @map("error_message")
  ipAddress       String?  @map("ip_address")
  userAgent       String?  @map("user_agent")
  createdAt       DateTime @default(now()) @map("created_at")

  // Relations
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  tool            AiTool   @relation(fields: [toolId], references: [id], onDelete: Cascade)

  @@map("ai_usage")
}

model AdminLog {
  id           String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  adminId      String   @map("admin_id") @db.Uuid
  action       String
  resourceType String   @map("resource_type")
  resourceId   String?  @map("resource_id") @db.Uuid
  changes      Json?
  reason       String?
  ipAddress    String?  @map("ip_address")
  userAgent    String?  @map("user_agent")
  createdAt    DateTime @default(now()) @map("created_at")

  // Relations
  admin        User     @relation(fields: [adminId], references: [id], onDelete: Cascade)

  @@map("admin_logs")
}
```

### 3.2 Mise à jour des routes API
```typescript
// Exemple de mise à jour d'une route
// src/app/api/packs/route.ts
import { prisma } from '@/lib/prisma'

export async function GET() {
  const packs = await prisma.pack.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      category: true,
      packStats: true,
      samples: {
        where: { isActive: true },
        take: 3
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  
  return Response.json(packs)
}
```

## ✅ **ÉTAPE 4 : VALIDATION & TESTS**

### 4.1 Tests de cohérence des données
```sql
-- Vérifier que tous les utilisateurs ont été migrés
SELECT 
  (SELECT COUNT(*) FROM public.users) as old_count,
  (SELECT COUNT(*) FROM dropskills_v2.users) as new_count;

-- Vérifier les relations
SELECT 
  COUNT(*) as orphaned_user_packs
FROM dropskills_v2.user_packs up
LEFT JOIN dropskills_v2.users u ON up.user_id = u.id
LEFT JOIN dropskills_v2.packs p ON up.pack_id = p.id
WHERE u.id IS NULL OR p.id IS NULL;
```

### 4.2 Tests fonctionnels
- [ ] Connexion utilisateur
- [ ] Affichage des packs
- [ ] Système de favoris
- [ ] Outils IA
- [ ] Interface admin

## 🔄 **ÉTAPE 5 : BASCULEMENT**

### 5.1 Maintenance programmée
```sql
-- Renommer les tables
ALTER SCHEMA public RENAME TO dropskills_old;
ALTER SCHEMA dropskills_v2 RENAME TO public;
```

### 5.2 Mise à jour des variables d'environnement
```bash
# Mettre à jour DATABASE_URL si nécessaire
# Redéployer l'application
```

## 🗑️ **ÉTAPE 6 : NETTOYAGE**

### 6.1 Après validation (1 semaine)
```sql
-- Supprimer l'ancien schéma
DROP SCHEMA dropskills_old CASCADE;
```

## 🛡️ **RECOMMANDATIONS RGPD**

### Conformité RGPD
1. **Anonymisation des logs IA** : Supprimer les données personnelles des `input_data`
2. **Rétention des données** : Politique de suppression automatique après X mois
3. **Droit à l'oubli** : Procédure de suppression complète utilisateur
4. **Audit trail** : Logs d'accès et modifications dans `admin_logs`

### Script de suppression utilisateur (RGPD)
```sql
-- Procédure de suppression complète d'un utilisateur
CREATE OR REPLACE FUNCTION delete_user_gdpr(user_email text)
RETURNS void AS $$
DECLARE
    user_id_to_delete uuid;
BEGIN
    -- Récupérer l'ID utilisateur
    SELECT id INTO user_id_to_delete FROM users WHERE email = user_email;
    
    IF user_id_to_delete IS NULL THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    
    -- Anonymiser les logs IA (garder les stats mais supprimer les données perso)
    UPDATE ai_usage 
    SET input_data = '{"anonymized": true}', 
        output_data = '{"anonymized": true}',
        ip_address = NULL,
        user_agent = NULL
    WHERE user_id = user_id_to_delete;
    
    -- Supprimer les données personnelles
    DELETE FROM favorites WHERE user_id = user_id_to_delete;
    DELETE FROM user_packs WHERE user_id = user_id_to_delete;
    DELETE FROM users WHERE id = user_id_to_delete;
    
    -- Log de l'action
    INSERT INTO admin_logs (admin_id, action, resource_type, resource_id, reason)
    VALUES (user_id_to_delete, 'GDPR_DELETE', 'users', user_id_to_delete, 'GDPR deletion request');
END;
$$ LANGUAGE plpgsql;
```

## 🚀 **PLAN D'EXTENSION FUTURE**

### Fonctionnalités à ajouter
1. **Système de notation** : Table `ratings`
2. **Commentaires** : Table `reviews`
3. **Certificats** : Table `certificates`
4. **Parcours d'apprentissage** : Table `learning_paths`
5. **Notifications** : Table `notifications`

### Optimisations performance
1. **Partitioning** des logs par date
2. **Indexation** avancée selon les requêtes
3. **Caching** avec Redis
4. **CDN** pour les médias

---

**🎯 Ce plan garantit une migration sans perte de données et une base solide pour l'évolution de Dropskills !** 