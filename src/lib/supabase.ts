import { createClient } from '@supabase/supabase-js'

// Initialisation lazy pour éviter les problèmes de timing
let supabaseClient: any = null
let supabaseAdminClient: any = null

export const getSupabase = () => {
  if (!supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Nettoyer et valider les variables
    const safeSupabaseUrl = (supabaseUrl || '').trim()
    const safeSupabaseAnonKey = (supabaseAnonKey || '').trim()

    if (!safeSupabaseUrl || !safeSupabaseAnonKey) {
      throw new Error(`Variables Supabase manquantes: URL=${!!safeSupabaseUrl}, KEY=${!!safeSupabaseAnonKey}`)
    }

    supabaseClient = createClient(safeSupabaseUrl, safeSupabaseAnonKey)
  }
  return supabaseClient
}

export const getSupabaseAdmin = () => {
  if (!supabaseAdminClient) {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    const safeSupabaseUrl = (supabaseUrl || '').trim()

    if (!safeSupabaseUrl) {
      throw new Error(`Variables Supabase Admin manquantes: URL=${!!safeSupabaseUrl}, SERVICE_KEY=${!!serviceRoleKey}`)
    }

    if (!serviceRoleKey) {
      // En mode build/production sans service key, retourner un mock
      if (process.env.NODE_ENV === 'production' || process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'development') {
        console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY manquante, utilisation d\'un mock pour le développement')
        return createMockSupabaseAdmin()
      }
      throw new Error(`Variables Supabase Admin manquantes: URL=${!!safeSupabaseUrl}, SERVICE_KEY=${!!serviceRoleKey}`)
    }

    supabaseAdminClient = createClient(
      safeSupabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  }
  return supabaseAdminClient
}

// Mock pour éviter les erreurs de build
function createMockSupabaseAdmin() {
  const mockProductRequests = [
    {
      id: '1',
      title: 'Outil de génération de scripts vidéo',
      description: 'Un outil IA pour créer des scripts de vidéos marketing engageants',
      status: 'pending',
      votes_count: 15,
      user_id: 'user1',
      user_email: 'user1@example.com',
      priority: 'high',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Template de landing page e-commerce',
      description: 'Des templates prêts à utiliser pour les boutiques en ligne',
      status: 'in_progress',
      votes_count: 23,
      user_id: 'user2',
      user_email: 'user2@example.com',
      priority: 'medium',
      admin_notes: 'En cours de développement',
      estimated_completion: '2024-02-15',
      created_at: '2024-01-10T14:30:00Z',
      updated_at: '2024-01-14T09:15:00Z'
    },
    {
      id: '3',
      title: 'Calculateur de ROI marketing',
      description: 'Un outil pour calculer le retour sur investissement des campagnes marketing',
      status: 'completed',
      votes_count: 8,
      user_id: 'user3',
      user_email: 'user3@example.com',
      priority: 'low',
      admin_notes: 'Terminé et disponible',
      created_at: '2024-01-05T11:20:00Z',
      updated_at: '2024-01-12T16:45:00Z'
    }
  ];

  return {
    from: (table: string) => ({
      select: (columns?: string) => ({
        single: () => Promise.resolve({ 
          data: table === 'product_requests' ? mockProductRequests[0] : null, 
          error: null 
        }),
        order: () => ({
          then: (callback: any) => callback({ data: mockProductRequests, error: null })
        }),
        then: (callback: any) => callback({ data: mockProductRequests, error: null })
      }),
      insert: (data: any) => ({
        select: () => ({
          single: () => Promise.resolve({ 
            data: { id: 'new-id', ...data, created_at: new Date().toISOString() }, 
            error: null 
          })
        })
      }),
      update: (data: any) => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ 
              data: { ...mockProductRequests[0], ...data, updated_at: new Date().toISOString() }, 
              error: null 
            })
          })
        })
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: null })
      }),
      upsert: (data: any) => ({
        select: () => ({
          single: () => Promise.resolve({ 
            data: { id: 'upsert-id', ...data }, 
            error: null 
          })
        })
      })
    }),
    rpc: (functionName: string) => {
      if (functionName === 'increment_request_votes') {
        return Promise.resolve({ data: null, error: null });
      }
      if (functionName === 'decrement_request_votes') {
        return Promise.resolve({ data: null, error: null });
      }
      return Promise.resolve({ data: null, error: null });
    },
    auth: {
      admin: {
        createUser: () => Promise.resolve({ data: { user: { id: 'mock-user' } }, error: null }),
        listUsers: () => Promise.resolve({ data: { users: [] }, error: null })
      }
    }
  }
}

// Export pour compatibilité avec le code existant
export const supabase = getSupabase()
export const supabaseAdmin = getSupabaseAdmin()

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

// Interfaces pour les demandes de produits
export interface ProductRequest {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'rejected'
  votes_count: number
  user_id: string
  user_email: string
  admin_notes?: string
  priority: 'low' | 'medium' | 'high'
  estimated_completion?: string
  created_at: string
  updated_at: string
}

export interface ProductRequestVote {
  id: string
  request_id: string
  user_id: string
  user_email: string
  created_at: string
}

// Helpers pour remplacer les opérations Prisma courantes
export class SupabaseHelper {
  
  // Profiles (remplace Users)
  static async findProfileById(id: string) {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  static async findProfileByUserId(userId: string) {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  static async createProfile(profileData: Partial<Profile>) {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateProfile(userId: string, profileData: Partial<Profile>) {
    const supabase = getSupabase()
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
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findCategoryBySlug(slug: string) {
    const supabase = getSupabase()
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
    const supabase = getSupabase()
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
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('packs')
      .insert(packData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async createSample(sampleData: Partial<Sample>) {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('samples')
      .insert(sampleData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async createPackStats(statsData: Partial<PackStats>) {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('pack_stats')
      .insert(statsData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async findManyCategories(options: { where?: any } = {}) {
    const supabase = getSupabase()
    let query = supabase.from('categories').select('*')
    
    if (options.where?.is_active !== undefined) {
      query = query.eq('is_active', options.where.is_active)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  }

  static async createCategory(categoryData: Partial<Category>) {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async findManyAiTools(options: { where?: any } = {}) {
    const supabase = getSupabase()
    let query = supabase.from('ai_tools').select('*')
    
    if (options.where?.is_active !== undefined) {
      query = query.eq('is_active', options.where.is_active)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  }

  static async createAiTool(toolData: Partial<AiTool>) {
    const supabase = getSupabase()
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
    const supabase = getSupabase()
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    return count || 0
  }

  static async countPacks() {
    const supabase = getSupabase()
    const { count, error } = await supabase
      .from('packs')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    return count || 0
  }

  static async countCategories() {
    const supabase = getSupabase()
    const { count, error } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    return count || 0
  }

  static async countSamples() {
    const supabase = getSupabase()
    const { count, error } = await supabase
      .from('samples')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    return count || 0
  }

  static async countFavorites() {
    const supabase = getSupabase()
    const { count, error } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    return count || 0
  }

  static async countUserPacks() {
    const supabase = getSupabase()
    const { count, error } = await supabase
      .from('user_packs')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    return count || 0
  }

  static async countAiTools() {
    const supabase = getSupabase()
    const { count, error } = await supabase
      .from('ai_tools')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    return count || 0
  }

  static async countPackStats() {
    const supabase = getSupabase()
    const { count, error } = await supabase
      .from('pack_stats')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    return count || 0
  }

  static async countAdminLogs() {
    const supabase = getSupabase()
    const { count, error } = await supabase
      .from('admin_logs')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    return count || 0
  }

  static async countAiUsage() {
    const supabase = getSupabase()
    const { count, error } = await supabase
      .from('ai_usage')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    return count || 0
  }

  // Admin Logs
  static async createAdminLog(logData: Partial<AdminLog>) {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('admin_logs')
      .insert(logData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getAdminLogs(limit = 50) {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('admin_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  }

  // Product Requests
  static async getAllProductRequests() {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('product_requests')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async getProductRequestsByStatus(status: string) {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('product_requests')
      .select('*')
      .eq('status', status)
      .order('votes_count', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async createProductRequest(requestData: Partial<ProductRequest>) {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('product_requests')
      .insert({
        ...requestData,
        votes_count: 0,
        priority: 'medium',
        status: 'pending'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateProductRequest(id: string, updates: Partial<ProductRequest>) {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('product_requests')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteProductRequest(id: string) {
    const supabase = getSupabase()
    const { error } = await supabase
      .from('product_requests')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }

  // Product Request Votes
  static async getUserVoteForRequest(requestId: string, userId: string) {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('product_request_votes')
      .select('*')
      .eq('request_id', requestId)
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  static async addVoteToRequest(requestId: string, userId: string, userEmail: string) {
    const supabase = getSupabase()
    
    // Vérifier si l'utilisateur a déjà voté
    const existingVote = await this.getUserVoteForRequest(requestId, userId)
    if (existingVote) {
      throw new Error('Vous avez déjà voté pour cette demande')
    }

    // Ajouter le vote
    const { data: voteData, error: voteError } = await supabase
      .from('product_request_votes')
      .insert({
        request_id: requestId,
        user_id: userId,
        user_email: userEmail
      })
      .select()
      .single()
    
    if (voteError) throw voteError

    // Incrémenter le compteur de votes
    const { data: requestData, error: updateError } = await supabase
      .rpc('increment_request_votes', { request_id: requestId })
    
    if (updateError) throw updateError

    return voteData
  }

  static async removeVoteFromRequest(requestId: string, userId: string) {
    const supabase = getSupabase()
    
    // Supprimer le vote
    const { error: deleteError } = await supabase
      .from('product_request_votes')
      .delete()
      .eq('request_id', requestId)
      .eq('user_id', userId)
    
    if (deleteError) throw deleteError

    // Décrémenter le compteur de votes
    const { data: requestData, error: updateError } = await supabase
      .rpc('decrement_request_votes', { request_id: requestId })
    
    if (updateError) throw updateError

    return true
  }

  static async getRequestVotes(requestId: string) {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('product_request_votes')
      .select('*')
      .eq('request_id', requestId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
} 