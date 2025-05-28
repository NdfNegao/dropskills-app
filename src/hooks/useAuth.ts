import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

export type UserRole = 'USER' | 'PREMIUM' | 'ADMIN' | 'SUPER_ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  isPremium: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

export interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isPremium: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  canAccessPremium: boolean;
  canAccessAdmin: boolean;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();

  const user = useMemo((): AuthUser | null => {
    if (!session?.user) return null;

    const sessionUser = session.user as any;
    const role = sessionUser.role || 'USER';
    
    return {
      id: sessionUser.id,
      email: sessionUser.email,
      firstName: sessionUser.firstName,
      lastName: sessionUser.lastName,
      role,
      isPremium: role === 'PREMIUM' || role === 'ADMIN' || role === 'SUPER_ADMIN',
      isAdmin: role === 'ADMIN' || role === 'SUPER_ADMIN',
      isSuperAdmin: role === 'SUPER_ADMIN'
    };
  }, [session]);

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const canAccessPremium = useMemo(() => {
    return user?.isPremium || user?.isAdmin || false;
  }, [user]);

  const canAccessAdmin = useMemo(() => {
    return user?.isAdmin || false;
  }, [user]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading: status === 'loading',
    isPremium: user?.isPremium || false,
    isAdmin: user?.isAdmin || false,
    isSuperAdmin: user?.isSuperAdmin || false,
    hasRole,
    hasAnyRole,
    canAccessPremium,
    canAccessAdmin
  };
} 