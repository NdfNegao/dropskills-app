'use client';
import { useSession } from 'next-auth/react';

interface ExtendedUser {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isPremium: boolean;
}

export function useAuth() {
  const { data: session, status } = useSession();

  // Utilisateur avec données étendues du token
  const user = session?.user as ExtendedUser | null;
  
  // Vérifications basées sur les données du token JWT
  const isAdmin = user?.role === 'ADMIN';
  const canAccessPremium = user?.isPremium || isAdmin;
  const isAuthenticated = !!user;
  const isLoading = status === 'loading';

  return {
    user,
    isLoading,
    isAuthenticated,
    canAccessPremium,
    isAdmin,
    session,
    status
  };
} 