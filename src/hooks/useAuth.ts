'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

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
  const [devUser, setDevUser] = useState<ExtendedUser | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let stored = localStorage.getItem('dev-user');
    const devSession = localStorage.getItem('dev-session');

    // Crée automatiquement une session admin si absente
    if (!stored || !devSession) {
      const admin: ExtendedUser = {
        id: 'admin-auto',
        email: 'admin@dropskills.com',
        name: 'Admin Auto',
        firstName: 'Admin',
        lastName: 'Auto',
        role: 'ADMIN',
        isPremium: true
      };
      localStorage.setItem('dev-user', JSON.stringify(admin));
      localStorage.setItem('dev-session', 'true');
      stored = JSON.stringify(admin);
    }

    if (stored) {
      try {
        setDevUser(JSON.parse(stored));
      } catch {
        setDevUser(null);
      }
    }
  }, [session]);

  const user = (session?.user as ExtendedUser | null) ?? devUser;

  // Vérifications basées sur les données du token JWT ou de la session dev
  const isAdmin = user?.role === 'ADMIN';
  // TEMPORAIRE: Accès premium ouvert à tous pour le lancement
  const canAccessPremium = true; // user?.isPremium || isAdmin;
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
