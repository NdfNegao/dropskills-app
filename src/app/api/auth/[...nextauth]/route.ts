import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

// Configuration temporaire pour un compte admin unique
const ADMIN_EMAIL = 'admin@dropskills.com';
const ADMIN_PASSWORD = bcrypt.hashSync('admin123', 10);

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Vérification temporaire avec un compte admin unique
        if (credentials.email === ADMIN_EMAIL && 
            bcrypt.compareSync(credentials.password, ADMIN_PASSWORD)) {
          return {
            id: '1',
            email: ADMIN_EMAIL,
            name: 'Admin',
            role: 'admin'
          };
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 