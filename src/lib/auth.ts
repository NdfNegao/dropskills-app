import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
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
        token.role = (user as any).role || 'USER';
        token.firstName = (user as any).firstName || user.name?.split(' ')[0] || '';
        token.lastName = (user as any).lastName || user.name?.split(' ').slice(1).join(' ') || '';
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