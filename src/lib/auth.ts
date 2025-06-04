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
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Vérifier l'utilisateur dans Supabase
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email.toLowerCase())
          .single();

        if (error || !userData) {
          // Auth PARETO pour l'admin en cas d'absence en BDD
          if (
            credentials.email === 'cyril.iriebi@gmail.com' &&
            credentials.password === 'jjbMMA200587@'
          ) {
            return {
              id: 'admin',
              email: credentials.email,
              name: 'Cyril Iriebi',
              firstName: 'Cyril',
              lastName: 'Iriebi'
            };
          }
          return null;
        }

        // Vérifier le mot de passe (simulé pour l'instant car on a pas encore de hashed password en BDD)
        // TODO: Implémenter la vérification du mot de passe hashé
        // const passwordValid = await bcrypt.compare(credentials.password, userData.password_hash);
        // if (!passwordValid) return null;

        return {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          firstName: userData.first_name,
          lastName: userData.last_name
        };
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Synchroniser avec Supabase pour tous les utilisateurs
      if (user?.email) {
        try {
          const firstName = user.firstName || user.name?.split(' ')[0] || '';
          const lastName = user.lastName || user.name?.split(' ').slice(1).join(' ') || '';
          
          // Vérifier si l'utilisateur existe déjà
          const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single();

          if (!existingUser) {
            // Créer l'utilisateur s'il n'existe pas
            await supabase
              .from('users')
              .insert({
                email: user.email,
                name: user.name || '',
                first_name: firstName,
                last_name: lastName,
                is_premium: user.email === 'cyril.iriebi@gmail.com', // Admin Premium par défaut
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
          } else if (!existingUser.first_name && firstName) {
            // Mettre à jour les noms s'ils manquent
            await supabase
              .from('users')
              .update({
                first_name: firstName,
                last_name: lastName,
                name: user.name || '',
                updated_at: new Date().toISOString()
              })
              .eq('email', user.email);
          }
        } catch (error) {
          console.error('Erreur lors de la synchronisation utilisateur:', error);
        }
      }
      
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