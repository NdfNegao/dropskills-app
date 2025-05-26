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
        if (credentials.email === 'admin@dropskills.com' && credentials.password === 'admin123') {
          return {
            id: '1',
            email: credentials.email,
            name: 'Admin DropSkills',
            role: 'ADMIN'
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
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.sub;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-key',
  session: {
    strategy: 'jwt',
  },
}; 