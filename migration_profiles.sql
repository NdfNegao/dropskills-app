-- Migration pour créer la table profiles et migrer les données
-- À exécuter dans Supabase SQL Editor

-- 1. Créer la table profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'USER' NOT NULL,
  first_name text,
  last_name text,
  avatar_url text,
  status text DEFAULT 'ACTIVE' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Créer un index sur le rôle pour les requêtes d'autorisation
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 3. Créer un trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Migrer les données existantes de public.users vers public.profiles (si la table users existe)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
        INSERT INTO public.profiles (id, role, first_name, last_name, avatar_url, status, created_at, updated_at)
        SELECT 
            u.id,
            COALESCE(u.role, 'USER') as role,
            u.first_name,
            u.last_name,
            u.avatar_url,
            COALESCE(u.status, 'ACTIVE') as status,
            COALESCE(u.created_at, now()) as created_at,
            COALESCE(u.updated_at, now()) as updated_at
        FROM public.users u
        WHERE u.id IN (SELECT id FROM auth.users)
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;

-- 5. Créer un trigger pour synchroniser automatiquement les nouveaux utilisateurs
CREATE OR REPLACE FUNCTION create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, role, status)
    VALUES (NEW.id, 'USER', 'ACTIVE')
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Créer le trigger sur auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_profile_for_new_user();

-- 6. Activer RLS (Row Level Security) sur la table profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 7. Créer des politiques RLS basiques
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 8. Politique pour les admins (peuvent tout voir/modifier)
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('ADMIN', 'SUPER_ADMIN')
        )
    );

CREATE POLICY "Admins can update all profiles" ON public.profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('ADMIN', 'SUPER_ADMIN')
        )
    );

-- 9. Mettre à jour les contraintes de clés étrangères existantes
-- Note: Ces commandes peuvent échouer si les tables n'existent pas encore
-- Elles seront appliquées lors du db push de Prisma

-- Afficher un résumé de la migration
SELECT 
    'Migration terminée' as status,
    COUNT(*) as profiles_created
FROM public.profiles; 