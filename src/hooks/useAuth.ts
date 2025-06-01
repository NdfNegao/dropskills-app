'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  isDevAccount?: boolean;
  isPremium?: boolean;
  subscriptionPlan?: string;
}

export function useAuth() {
  const { data: session, status } = useSession();
  const [devUser, setDevUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [premiumStatus, setPremiumStatus] = useState<boolean>(false);

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
  
  // Vérifier le statut premium depuis Supabase
  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (user?.email) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('is_premium')
            .eq('email', user.email)
            .single();
          
          if (data && !error) {
            setPremiumStatus(data.is_premium || false);
          }
        } catch (error) {
          console.error('Erreur vérification premium:', error);
        }
      }
    };

    checkPremiumStatus();
  }, [user?.email]);

  // Déterminer si l'utilisateur peut accéder au contenu premium
  const canAccessPremium = premiumStatus || isAdmin; // Admin a accès premium automatiquement

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