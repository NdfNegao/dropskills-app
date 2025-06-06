import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    // Vérifier la session d'abord
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({
        error: 'Non authentifié',
        session: null
      }, { status: 401 });
    }

    // Configuration Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        error: 'Configuration Supabase manquante',
        config: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey
        }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test de connexion basique
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
      .single();

    // Rechercher l'utilisateur actuel
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', session.user.email.toLowerCase())
      .single();

    // Rechercher spécifiquement l'admin
    const { data: adminData, error: adminError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'cyril.iriebi@gmail.com')
      .single();

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      
      session_email: session.user.email,
      
      supabase_config: {
        url: supabaseUrl,
        hasServiceKey: !!supabaseKey,
        keyLength: supabaseKey ? supabaseKey.length : 0
      },
      
      connection_test: {
        success: !testError,
        error: testError?.message
      },
      
      current_user: {
        found: !userError && !!userData,
        error: userError?.message,
        data: userData ? {
          id: userData.id,
          email: userData.email,
          role: userData.role,
          is_premium: userData.is_premium,
          created_at: userData.created_at
        } : null
      },
      
      admin_user: {
        found: !adminError && !!adminData,
        error: adminError?.message,
        data: adminData ? {
          id: adminData.id,
          email: adminData.email,
          role: adminData.role,
          is_premium: adminData.is_premium,
          created_at: adminData.created_at
        } : null
      },

      fallback_admin: {
        isAdminEmail: session.user.email === 'cyril.iriebi@gmail.com',
        shouldHaveAccess: session.user.email === 'cyril.iriebi@gmail.com'
      }
    });

  } catch (error) {
    console.error('Erreur debug database:', error);
    return NextResponse.json({
      error: 'Erreur lors du debug de la base de données',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
} 