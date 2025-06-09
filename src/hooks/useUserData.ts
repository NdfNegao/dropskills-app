import { useState, useEffect } from 'react';

interface UserData {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isPremium: boolean;
  userPacksCount: number;
  favoritesCount: number;
}

interface UseUserDataReturn {
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Hook principal utilisant l'API Supabase
export function useUserData(userId?: string): UseUserDataReturn {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Utiliser l'API route au lieu d'accès direct à Prisma
      const response = await fetch(`/api/v2/users/${userId}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }

      const data = await response.json();
      
      if (data.status === 'SUCCESS') {
        // Transformer les données pour correspondre à l'interface UserData
        const profile = data.data;
        
        // Déterminer le statut premium
        const isPremium = false || // À implémenter selon vos besoins
                         (profile.packsPurchased?.some((pack: any) => pack.price && pack.price > 0));

        const userData: UserData = {
          id: profile.id,
          email: profile.user?.email || profile.email,
          firstName: profile.first_name,
          lastName: profile.last_name,
          isPremium,
          userPacksCount: profile.packsPurchased?.length || 0,
          favoritesCount: profile.favorites?.length || 0
        };

        setUserData(userData);
      } else {
        throw new Error(data.message || 'Erreur inconnue');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des données utilisateur:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  return {
    userData,
    loading,
    error,
    refetch: fetchUserData
  };
}

// Hook alternatif pour récupérer via API (maintenant identique au principal)
export function useUserDataAPI(userId?: string): UseUserDataReturn {
  return useUserData(userId);
}