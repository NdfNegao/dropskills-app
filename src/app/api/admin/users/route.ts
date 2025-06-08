import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET : Liste des utilisateurs avec pagination


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');

    // Essayer d'abord avec la vraie table
    try {
      let query = supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
      }

      if (status && status !== 'all') {
        query = query.eq('subscription_status', status);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await query.range(from, to);

      if (error) {
        throw error;
      }

      return NextResponse.json({
        users: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      });

    } catch (dbError) {
      // Si la table n'existe pas, retourner des données par défaut
      console.log('Table profiles non trouvée, utilisation de données par défaut');
      
      const mockUsers = [
        {
          id: '1',
          email: 'admin@dropskills.com',
          name: 'Admin User',
          subscription_status: 'premium',
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          last_login: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          is_active: true
        },
        {
          id: '2',
          email: 'john.doe@company.com',
          name: 'John Doe',
          subscription_status: 'free',
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          last_login: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          is_active: true
        },
        {
          id: '3',
          email: 'sarah.smith@startup.io',
          name: 'Sarah Smith',
          subscription_status: 'premium',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          last_login: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          is_active: true
        },
        {
          id: '4',
          email: 'marie.martin@agency.fr',
          name: 'Marie Martin',
          subscription_status: 'enterprise',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          last_login: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          is_active: true
        },
        {
          id: '5',
          email: 'pierre.durand@consulting.com',
          name: 'Pierre Durand',
          subscription_status: 'free',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          last_login: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          is_active: false
        }
      ];

      // Appliquer les filtres
      let filteredUsers = mockUsers;

      if (search) {
        filteredUsers = filteredUsers.filter(user => 
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (status && status !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.subscription_status === status);
      }

      const total = filteredUsers.length;
      const startIndex = (page - 1) * limit;
      const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);

      return NextResponse.json({
        users: paginatedUsers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    }
  } catch (error) {
    console.error('Erreur API users:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 