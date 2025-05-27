import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client Supabase avec clé de service pour accéder aux tables auth
export const supabaseAuth = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Fonction helper pour récupérer un utilisateur par email depuis auth.users
export async function getAuthUserByEmail(email: string) {
  const { data, error } = await supabaseAuth
    .from('users')
    .select('id, email, created_at, updated_at')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur auth:', error);
    return null;
  }

  return data;
}

// Fonction helper pour récupérer un utilisateur par ID depuis auth.users
export async function getAuthUserById(id: string) {
  const { data, error } = await supabaseAuth
    .from('users')
    .select('id, email, created_at, updated_at')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur auth:', error);
    return null;
  }

  return data;
} 