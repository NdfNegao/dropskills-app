import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Routes publiques - pas de protection
    const publicRoutes = [
      '/',
      '/auth',
      '/catalogue',
      '/premium',
      '/api/auth',
      '/api/public'
    ];

    // Vérifier si la route est publique
    const isPublicRoute = publicRoutes.some(route => 
      pathname.startsWith(route) || pathname === route
    );

    if (isPublicRoute) {
      return NextResponse.next();
    }

    // Protection des routes admin
    if (pathname.startsWith('/admin')) {
      if (!token) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }

      const userRole = token.role as string;
      const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

      if (!isAdmin) {
        return NextResponse.redirect(new URL('/admin/login?error=unauthorized', req.url));
      }

      // Protection spéciale pour les routes super admin
      if (pathname.startsWith('/admin/system') || pathname.startsWith('/admin/super')) {
        if (userRole !== 'SUPER_ADMIN') {
          return NextResponse.redirect(new URL('/admin?error=insufficient_permissions', req.url));
        }
      }

      return NextResponse.next();
    }

    // Protection des routes premium (outils IA)
    const premiumRoutes = [
      '/outils/icp-maker',
      '/outils/generateur-offre',
      '/outils/tunnel-maker',
      '/outils/copymoneymail',
      '/outils/content-system',
      '/outils/lead-magnet'
    ];

    const isPremiumRoute = premiumRoutes.some(route => pathname.startsWith(route));

    if (isPremiumRoute) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin?callbackUrl=' + encodeURIComponent(pathname), req.url));
      }

      const userRole = token.role as string;
      const canAccessPremium = userRole === 'PREMIUM' || userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

      if (!canAccessPremium) {
        return NextResponse.redirect(new URL('/premium?upgrade=required', req.url));
      }
    }

    // Protection des API routes premium
    if (pathname.startsWith('/api/premium') || pathname.startsWith('/api/ai')) {
      if (!token) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      const userRole = token.role as string;
      const canAccessPremium = userRole === 'PREMIUM' || userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

      if (!canAccessPremium) {
        return NextResponse.json({ error: 'Premium subscription required' }, { status: 403 });
      }
    }

    // Protection des API routes admin
    if (pathname.startsWith('/api/admin')) {
      if (!token) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      const userRole = token.role as string;
      const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

      if (!isAdmin) {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Permettre l'accès si on a un token ou si c'est une route publique
        const { pathname } = req.nextUrl;
        
        const publicRoutes = [
          '/',
          '/auth',
          '/catalogue',
          '/premium',
          '/api/auth',
          '/api/public'
        ];

        const isPublicRoute = publicRoutes.some(route => 
          pathname.startsWith(route) || pathname === route
        );

        return !!token || isPublicRoute;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 