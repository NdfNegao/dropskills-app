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

    // Routes admin - accès libre (protection côté composant)
    if (pathname.startsWith('/admin')) {
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

      // Permettre l'accès à cyril.iriebi@gmail.com (admin)
      if (token.email === 'cyril.iriebi@gmail.com') {
        return NextResponse.next();
      }

      // Pour les autres utilisateurs, vérifier le statut premium (à implémenter)
      return NextResponse.redirect(new URL('/premium?upgrade=required', req.url));
    }

    // Protection des API routes premium
    if (pathname.startsWith('/api/premium') || pathname.startsWith('/api/ai')) {
      if (!token) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      // Permettre l'accès à cyril.iriebi@gmail.com (admin)
      if (token.email === 'cyril.iriebi@gmail.com') {
        return NextResponse.next();
      }

      // Pour les autres utilisateurs, vérifier le statut premium (à implémenter)
      return NextResponse.json({ error: 'Premium subscription required' }, { status: 403 });
    }

    // API routes admin - accès libre (protection côté API si nécessaire)
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.next();
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