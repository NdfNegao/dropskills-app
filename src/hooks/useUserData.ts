import { useState, useEffect } from 'react';
import { prisma } from '@/lib/prisma';

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

      // Récupérer les données utilisateur avec relations V2
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          userPacks: {
            include: {
              pack: {
                select: {
                  price: true,
                  status: true
                }
              }
            }
          },
          favorites: true,
          _count: {
            select: {
              userPacks: true,
              favorites: true
            }
          }
        }
      });

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Déterminer le statut premium
      // Un utilisateur est premium s'il a acheté au moins un pack payant
      const isPremium = user.userPacks.some(
        userPack => userPack.pack.price && userPack.pack.price > 0
      );

      const userData: UserData = {
        id: user.id,
        email: user.email,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        isPremium,
        userPacksCount: user._count.userPacks,
        favoritesCount: user._count.favorites
      };

      setUserData(userData);
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

// Hook alternatif pour récupérer via API (si pas d'accès direct à Prisma)
export function useUserDataAPI(userId?: string): UseUserDataReturn {
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

      const response = await fetch(`/api/v2/users/${userId}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }

      const data = await response.json();
      
      if (data.status === 'SUCCESS') {
        setUserData(data.data);
      } else {
        throw new Error(data.message || 'Erreur inconnue');
      }
    } catch (err) {
      console.error('Erreur API utilisateur:', err);
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