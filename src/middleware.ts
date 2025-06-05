import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Routes admin - accessible uniquement aux ADMIN
    if (pathname.startsWith('/admin')) {
      if (token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Routes premium - accessible aux utilisateurs premium ou admin
    if (pathname.startsWith('/premium-') || 
        (pathname.startsWith('/outils/') && !pathname.includes('/icp-maker'))) {
      
      const hasAccess = token?.isPremium === true || token?.role === 'ADMIN';
      
      if (!hasAccess) {
        return NextResponse.redirect(new URL('/premium', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Pages publiques (pas besoin d'authentification)
        const publicPaths = [
          '/',
          '/auth/signin',
          '/auth/signup',
          '/auth/error',
          '/api/auth',
          '/premium',
          '/home_cursor',
          '/home_cursorV2',
          '/home_cursorV3'
        ];

        if (publicPaths.some(path => pathname.startsWith(path))) {
          return true;
        }

        // Toutes les autres routes nécessitent une authentification
        return !!token;
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