import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase avec fallback pour éviter les erreurs de build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

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

        // Fallback admin si Supabase n'est pas configuré
        if (!supabase) {
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
            };
          }
          return null;
        }

        try {
          // Récupérer l'utilisateur depuis Supabase
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', credentials.email.toLowerCase())
            .single();

          if (error || !userData) {
            return null;
          }

          // Vérifier le mot de passe
          if (!userData.password_hash) {
            return null;
          }

          const passwordValid = await bcrypt.compare(credentials.password, userData.password_hash);
          if (!passwordValid) {
            return null;
          }

          // Retourner les données utilisateur
          return {
            id: userData.id,
            email: userData.email,
            name: userData.name || `${userData.first_name} ${userData.last_name}`.trim(),
            firstName: userData.first_name,
            lastName: userData.last_name,
            role: userData.role,
            isPremium: userData.is_premium
          };
        } catch (error) {
          console.error('Erreur lors de l\'authentification:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Lors de la première connexion, ajouter les données au token
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
        token.role = (user as any).role;
        token.isPremium = (user as any).isPremium;
      } else if (token.email && supabase) {
        // À chaque requête, rafraîchir les données depuis la BDD
        try {
          const { data: userData } = await supabase
            .from('users')
            .select('id, email, name, first_name, last_name, role, is_premium')
            .eq('email', token.email as string)
            .single();

          if (userData) {
            token.id = userData.id;
            token.firstName = userData.first_name;
            token.lastName = userData.last_name;
            token.role = userData.role;
            token.isPremium = userData.is_premium;
            token.name = userData.name || `${userData.first_name} ${userData.last_name}`.trim();
          }
        } catch (error) {
          console.error('Erreur lors du rafraîchissement du token:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token) {
        // Ajouter toutes les données du token à la session
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        (session.user as any).firstName = token.firstName;
        (session.user as any).lastName = token.lastName;
        (session.user as any).role = token.role;
        (session.user as any).isPremium = token.isPremium;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirection sécurisée
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
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