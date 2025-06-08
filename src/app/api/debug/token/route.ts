import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getToken } from 'next-auth/jwt';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Récupérer la session via getServerSession
    const session = await getServerSession(authOptions);
    
    // Récupérer le token JWT directement
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      
      session: {
        exists: !!session,
        user: session?.user ? {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: (session.user as any).role,
          isPremium: (session.user as any).isPremium
        } : null
      },
      
      token: {
        exists: !!token,
        data: token ? {
          id: token.id,
          email: token.email,
          name: token.name,
          role: token.role,
          isPremium: token.isPremium,
          iat: token.iat,
          exp: token.exp,
          jti: token.jti
        } : null
      },

      middleware_conditions: {
        token_isPremium: token?.isPremium,
        token_role: token?.role,
        hasAdminRole: token?.role === 'ADMIN',
        hasAccess: token?.isPremium === true || token?.role === 'ADMIN'
      },

      environment_vars: {
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        nodeEnv: process.env.NODE_ENV
      }
    });

  } catch (error) {
    console.error('Erreur debug token:', error);
    return NextResponse.json({
      error: 'Erreur lors du debug du token',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
} 