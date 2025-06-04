import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Récupérer l'utilisateur depuis Supabase
        const { data: userData, error } = await supabase
          .from('users')
          .select('id, email, name, first_name, last_name, password_hash, role, is_premium')
          .eq('email', credentials.email.toLowerCase())
          .single();

        if (error || !userData) {
          // Fallback Pareto pour l'admin si non présent en BDD
          if (
            credentials.email === 'cyril.iriebi@gmail.com' &&
            credentials.password === 'jjbMMA200587@'
          ) {
            return {
              id: 'admin',
              email: 'cyril.iriebi@gmail.com',
              name: 'Cyril Iriebi',
              firstName: 'Cyril',
              lastName: 'Iriebi',
              role: 'ADMIN',
              isPremium: true
            } as any;
          }
          return null;
        }

        // Vérifier le mot de passe hashé
        if (!userData.password_hash) return null;
        const passwordValid = await bcrypt.compare(credentials.password, userData.password_hash);
        if (!passwordValid) return null;

        return {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          firstName: userData.first_name,
          lastName: userData.last_name,
          role: userData.role || 'USER',
          isPremium: userData.is_premium || false
        } as any;
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.email = (user as any).email;
        token.firstName = (user as any).firstName || '';
        token.lastName = (user as any).lastName || '';
        token.role = (user as any).role || 'USER';
        token.isPremium = (user as any).isPremium || false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        (session.user as any).role = token.role;
        (session.user as any).isPremium = token.isPremium;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60
  },
  debug: process.env.NODE_ENV === 'development'
};
