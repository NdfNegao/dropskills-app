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

        // TODO: Remplacer par une vraie authentification avec base de données
        // const user = await getUserByEmail(credentials.email);
        // if (!user || !await bcrypt.compare(credentials.password, user.password)) {
        //   return null;
        // }

        // Comptes de test sécurisés (uniquement en développement)
        if (process.env.NODE_ENV === 'development') {
          const testAccounts = [
            {
              email: process.env.TEST_ADMIN_EMAIL || 'admin@dropskills.com',
              password: process.env.TEST_ADMIN_PASSWORD || 'admin123',
              user: {
                id: '1',
                email: process.env.TEST_ADMIN_EMAIL || 'admin@dropskills.com',
                name: 'Admin DropSkills',
                role: 'SUPER_ADMIN',
                firstName: 'Admin',
                lastName: 'DropSkills'
              }
            },
            {
              email: process.env.TEST_PREMIUM_EMAIL || 'premium@dropskills.com',
              password: process.env.TEST_PREMIUM_PASSWORD || 'premium123',
              user: {
                id: '2',
                email: process.env.TEST_PREMIUM_EMAIL || 'premium@dropskills.com',
                name: 'Premium User',
                role: 'PREMIUM',
                firstName: 'Premium',
                lastName: 'User'
              }
            },
            {
              email: process.env.TEST_USER_EMAIL || 'user@dropskills.com',
              password: process.env.TEST_USER_PASSWORD || 'user123',
              user: {
                id: '3',
                email: process.env.TEST_USER_EMAIL || 'user@dropskills.com',
                name: 'Standard User',
                role: 'USER',
                firstName: 'Standard',
                lastName: 'User'
              }
            }
          ];

          const testAccount = testAccounts.find(
            account => account.email === credentials.email && account.password === credentials.password
          );

          if (testAccount) {
            return testAccount.user;
          }
        }

        // En production, seule l'authentification par base de données est autorisée
        return null;
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