import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
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
      } else {
        // Auto-créer une session admin si pas de session
        const autoAdminUser = {
          id: 'admin-auto',
          email: 'cyril.iriebi@gmail.com',
          name: 'Cyril Iriebi',
          firstName: 'Cyril',
          lastName: 'Iriebi',
          isDevAccount: true
        };
        setDevUser(autoAdminUser);
        localStorage.setItem('dev-user', JSON.stringify(autoAdminUser));
        localStorage.setItem('dev-session', 'true');
      }
    }
    setIsLoading(false);
  }, []);

  // Utiliser l'utilisateur de dev si disponible, sinon l'utilisateur de session
  const user = devUser || (session?.user as User) || null;
  
  // Déterminer si l'utilisateur peut accéder au contenu premium
  const canAccessPremium = false; // À implémenter selon vos besoins

  // Accès admin : uniquement pour cyril.iriebi@gmail.com
  const isAdmin = user?.email === 'cyril.iriebi@gmail.com';

  // État de chargement global
  const loading = devUser ? false : (status === 'loading' || isLoading);

  return {
    user,
    isLoading: loading,
    isAuthenticated: !!user,
    canAccessPremium,
    isAdmin,
    session: devUser ? { user: devUser } : session,
    status: devUser ? 'authenticated' : status
  };
}