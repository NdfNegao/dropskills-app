import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Nettoyer et valider les variables
const safeSupabaseUrl = (supabaseUrl || '').trim()
const safeSupabaseAnonKey = (supabaseAnonKey || '').trim()

if (!safeSupabaseUrl || !safeSupabaseAnonKey) {
  throw new Error(`Variables Supabase manquantes: URL=${!!safeSupabaseUrl}, KEY=${!!safeSupabaseAnonKey}`)
}

// Initialisation lazy pour éviter les problèmes de timing
let supabaseClient: any = null

export const getSupabase = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(safeSupabaseUrl, safeSupabaseAnonKey)
  }
  return supabaseClient
}

// Export pour compatibilité avec le code existant
export const supabase = getSupabase()

// Client avec service role pour les opérations admin
export const supabaseAdmin = createClient(
  safeSupabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Types pour TypeScript
export interface Profile {
  id: string
  user_id: string
  role: 'USER' | 'PREMIUM' | 'ADMIN' | 'SUPER_ADMIN'
  first_name?: string
  last_name?: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Pack {
  id: string
  title: string
  slug: string
  description?: string
  price?: number
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  creator_id: string
  category_id?: string
  created_at: string
  updated_at: string
}

export interface Sample {
  id: string
  title: string
  description?: string
  file_url?: string
  pack_id: string
  created_at: string
  updated_at: string
}

export interface UserPack {
  id: string
  user_id: string
  pack_id: string
  created_at: string
}

export interface Favorite {
  id: string
  user_id: string
  pack_id: string
  created_at: string
}

export interface PackStats {
  id: string
  pack_id: string
  views_count: number
  favorites_count: number
  purchases_count: number
  updated_at: string
}

export interface AiTool {
  id: string
  name: string
  description?: string
  tool_type: 'ICP_MAKER' | 'OFFER_GENERATOR' | 'TITLE_GENERATOR' | 'CONTENT_SYSTEM' | 'TUNNEL_BUILDER' | 'EMAIL_SEQUENCE' | 'LEAD_MAGNET' | 'VEILLE_STRATEGIQUE'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AiUsage {
  id: string
  user_id: string
  tool_id: string
  status: 'SUCCESS' | 'ERROR' | 'PENDING'
  created_at: string
}

export interface AdminLog {
  id: string
  admin_id: string
  action: string
  resource_type?: string
  resource_id?: string
  created_at: string
}

// Helpers pour remplacer les opérations Prisma courantes
export class SupabaseHelper {
  
  // Profiles (remplace Users)
  static async findProfileById(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  static async findProfileByUserId(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  static async createProfile(profileData: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateProfile(userId: string, profileData: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Categories
  static async findCategoryById(id: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findCategoryBySlug(slug: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  // Packs avec relations
  static async findManyPacks(options: {
    where?: any
    include?: any
    orderBy?: any
    take?: number
    skip?: number
  } = {}) {
    let query = supabase.from('packs').select('*')
    
    // Ajouter les relations si demandées
    if (options.include?.category) {
      query = supabase.from('packs').select(`
        *,
        category:categories(*)
      `)
    }
    
    if (options.include?.samples) {
      query = supabase.from('packs').select(`
        *,
        category:categories(*),
        samples:samples(*)
      `)
    }
    
    if (options.include?.stats) {
      query = supabase.from('packs').select(`
        *,
        category:categories(*),
        samples:samples(*),
        stats:pack_stats(*)
      `)
    }
    
    // Filtres where
    if (options.where?.status) {
      query = query.eq('status', options.where.status)
    }
    
    // Tri
    if (options.orderBy?.created_at) {
      query = query.order('created_at', { ascending: options.orderBy.created_at === 'asc' })
    }
    
    // Limite
    if (options.take) {
      query = query.limit(options.take)
    }
    
    // Offset
    if (options.skip) {
      query = query.range(options.skip, options.skip + (options.take || 10) - 1)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  }

  static async createPack(packData: Partial<Pack>) {
    const { data, error } = await supabase
      .from('packs')
      .insert(packData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async createSample(sampleData: Partial<Sample>) {
    const { data, error } = await supabase
      .from('samples')
      .insert(sampleData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async createPackStats(statsData: Partial<PackStats>) {
    const { data, error } = await supabase
      .from('pack_stats')
      .insert(statsData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async findManyCategories(options: { where?: any } = {}) {
    let query = supabase.from('categories').select('*')
    
    if (options.where?.is_active !== undefined) {
      query = query.eq('is_active', options.where.is_active)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  }

  static async createCategory(categoryData: Partial<Category>) {
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async findManyAiTools(options: { where?: any } = {}) {
    let query = supabase.from('ai_tools').select('*')
    
    if (options.where?.is_active !== undefined) {
      query = query.eq('is_active', options.where.is_active)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  }

  static async createAiTool(toolData: Partial<AiTool>) {
    const { data, error } = await supabase
      .from('ai_tools')
      .insert(toolData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Méthodes de comptage
  static async countProfiles() {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    return count || 0
  }

  static async countPacks() {
    const { count, error } = await supabase
      .from('packs')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    return count || 0
  }

  static async countCategories() {
    const { count, error } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    return count || 0
  }

  static async countSamples() {
    const { count, error } = await supabase
      .from('samples')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    return count || 0
  }

  static async countFavorites() {
    const { count, error } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    return count || 0
  }

  static async countUserPacks() {
    const { count, error } = await supabase
      .from('user_packs')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    return count || 0
  }

  static async countAiTools() {
    const { count, error } = await supabase
      .from('ai_tools')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    return count || 0
  }

  static async countPackStats() {
    const { count, error } = await supabase
      .from('pack_stats')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    return count || 0
  }

  static async countAdminLogs() {
    const { count, error } = await supabase
      .from('admin_logs')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    return count || 0
  }

  static async countAiUsage() {
    const { count, error } = await supabase
      .from('ai_usage')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    return count || 0
  }
} 