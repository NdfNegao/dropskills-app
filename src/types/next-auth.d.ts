import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      isAdmin?: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    isAdmin?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
  }
}
