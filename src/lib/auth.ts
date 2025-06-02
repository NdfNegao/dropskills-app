import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        // Auth PARETO : email et mot de passe hardcodés
        if (
          credentials.email === 'cyril.iriebi@gmail.com' &&
          credentials.password === 'jjbMMA200587@'
        ) {
          return {
            id: 'admin',
            email: credentials.email,
            name: 'Cyril Iriebi',
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Autoriser toutes les connexions valides
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.email = user.email;
        token.id = user.id;
        token.firstName = (user as any).firstName || user.name?.split(' ')[0] || '';
        token.lastName = (user as any).lastName || user.name?.split(' ').slice(1).join(' ') || '';
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.email = token.email;
        session.user.id = token.id;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        
        // Assigner le rôle ADMIN à cyril.iriebi@gmail.com
        if (session.user.email === 'cyril.iriebi@gmail.com') {
          (session.user as any).role = 'ADMIN';
        } else {
          (session.user as any).role = 'FREE';
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirection sécurisée
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  debug: process.env.NODE_ENV === 'development',
};