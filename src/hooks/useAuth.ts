import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: 'USER' | 'PREMIUM' | 'ADMIN' | 'SUPER_ADMIN';
  isDevAccount?: boolean;
}

export function useAuth() {
  const { data: session, status } = useSession();
  const [devUser, setDevUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier s'il y a un utilisateur de développement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const devUserData = localStorage.getItem('dev-user');
      const devSession = localStorage.getItem('dev-session');
      
      if (devUserData && devSession) {
        try {
          const userData = JSON.parse(devUserData);
          setDevUser(userData);
        } catch (error) {
          console.error('Erreur parsing dev user:', error);
          localStorage.removeItem('dev-user');
          localStorage.removeItem('dev-session');
        }
      }
    }
    setIsLoading(false);
  }, []);

  // Utiliser l'utilisateur de dev si disponible, sinon l'utilisateur de session
  const user = devUser || (session?.user as User) || null;
  
  // Déterminer si l'utilisateur peut accéder au contenu premium
  const canAccessPremium = user?.role === 'PREMIUM' || 
                          user?.role === 'ADMIN' || 
                          user?.role === 'SUPER_ADMIN';

  // Déterminer si l'utilisateur est admin
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  // État de chargement global
  const loading = devUser ? false : (status === 'loading' || isLoading);

  return {
    user,
    isLoading: loading,
    isAuthenticated: !!user,
    canAccessPremium,
    isAdmin,
    isSuperAdmin,
    session: devUser ? { user: devUser } : session,
    status: devUser ? 'authenticated' : status
  };
} 