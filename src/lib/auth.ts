import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

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

        // Authentification simplifiée pour le développement
        // TODO: Remplacer par une vraie authentification en production
        
        // Admin principal
        if (credentials.email === 'admin@dropskills.com' && credentials.password === 'admin123') {
          return {
            id: '1',
            email: credentials.email,
            name: 'Admin DropSkills',
            role: 'SUPER_ADMIN',
            firstName: 'Admin',
            lastName: 'DropSkills'
          };
        }

        // Utilisateur premium de test
        if (credentials.email === 'premium@dropskills.com' && credentials.password === 'premium123') {
          return {
            id: '2',
            email: credentials.email,
            name: 'Premium User',
            role: 'PREMIUM',
            firstName: 'Premium',
            lastName: 'User'
          };
        }

        // Utilisateur standard de test
        if (credentials.email === 'user@dropskills.com' && credentials.password === 'user123') {
          return {
            id: '3',
            email: credentials.email,
            name: 'Standard User',
            role: 'USER',
            firstName: 'Standard',
            lastName: 'User'
          };
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.sub;
        (session.user as any).firstName = token.firstName;
        (session.user as any).lastName = token.lastName;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.VERCEL_URL || 'dropskills-v2-secret-key-2024',
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
}; 