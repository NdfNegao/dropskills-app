import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
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
            role: 'ADMIN',
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
      // Permettre la connexion Google
      if (account?.provider === 'google') {
        // TODO: Créer ou mettre à jour l'utilisateur en base de données
        // const existingUser = await getUserByEmail(user.email);
        // if (!existingUser) {
        //   await createUser({
        //     email: user.email,
        //     name: user.name,
        //     firstName: user.name?.split(' ')[0] || '',
        //     lastName: user.name?.split(' ').slice(1).join(' ') || '',
        //     role: 'USER',
        //     provider: 'google',
        //     providerId: account.providerAccountId
        //   });
        // }
        return true;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.email = user.email;
        token.id = user.id;
        token.role = (user as any).role || 'USER';
        token.firstName = (user as any).firstName || user.name?.split(' ')[0] || '';
        token.lastName = (user as any).lastName || user.name?.split(' ').slice(1).join(' ') || '';
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.email = token.email;
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
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
  debug: process.env.NODE_ENV === 'development',
}; 