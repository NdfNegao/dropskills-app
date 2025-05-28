'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Shield, AlertTriangle, Home } from 'lucide-react';
import Link from 'next/link';

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireSuperAdmin?: boolean;
  className?: string;
}

export default function AdminGuard({ 
  children, 
  fallback, 
  requireSuperAdmin = false,
  className = ""
}: AdminGuardProps) {
  const { canAccessAdmin, isSuperAdmin, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff0033]"></div>
        <span className="ml-2 text-gray-300">Vérification des permissions administrateur...</span>
      </div>
    );
  }

  const hasRequiredPermission = requireSuperAdmin ? isSuperAdmin : canAccessAdmin;

  if (hasRequiredPermission) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className={`bg-gradient-to-br from-[#111111] to-[#1a1a1a] border border-red-900/50 rounded-xl p-8 text-center ${className}`}>
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-white" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-white mb-4">
        Accès Administrateur Requis
      </h3>
      
      <p className="text-gray-300 mb-6 max-w-md mx-auto">
        Cette section est réservée aux {requireSuperAdmin ? 'super-administrateurs' : 'administrateurs'}. 
        Vous n'avez pas les permissions nécessaires pour accéder à ce contenu.
      </p>

      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-center gap-3 text-sm text-gray-400">
          <Shield className="w-4 h-4" />
          <span>Niveau d'autorisation insuffisant</span>
        </div>
        {user && (
          <div className="flex items-center justify-center gap-3 text-sm text-gray-400">
            <span>Rôle actuel: {user.role}</span>
          </div>
        )}
        <div className="flex items-center justify-center gap-3 text-sm text-gray-400">
          <span>Requis: {requireSuperAdmin ? 'SUPER_ADMIN' : 'ADMIN ou SUPER_ADMIN'}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 bg-[#232323] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#333333] transition-colors"
        >
          <Home className="w-5 h-5" />
          Retour à l'accueil
        </Link>
        
        {user && (
          <Link
            href="/compte"
            className="flex items-center justify-center gap-2 bg-[#ff0033] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#cc0029] transition-colors"
          >
            Mon compte
          </Link>
        )}
      </div>

      {user && (
        <p className="text-xs text-gray-500 mt-4">
          Connecté en tant que {user.email} ({user.role})
        </p>
      )}
    </div>
  );
} 