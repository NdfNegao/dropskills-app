'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Lock, Crown, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PremiumGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
  feature?: string;
  className?: string;
}

export default function PremiumGuard({ 
  children, 
  fallback, 
  showUpgrade = true,
  feature = "cette fonctionnalité",
  className = ""
}: PremiumGuardProps) {
  const { canAccessPremium, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff0033]"></div>
        <span className="ml-2 text-gray-300">Vérification des permissions...</span>
      </div>
    );
  }

  if (canAccessPremium) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  return (
    <div className={`bg-gradient-to-br from-[#111111] to-[#1a1a1a] border border-[#232323] rounded-xl p-8 text-center ${className}`}>
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-full flex items-center justify-center">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-white mb-4">
        Contenu Premium Requis
      </h3>
      
      <p className="text-gray-300 mb-6 max-w-md mx-auto">
        Pour accéder à {feature}, vous devez disposer d'un compte Premium ou être administrateur.
      </p>

      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-center gap-3 text-sm text-gray-400">
          <Lock className="w-4 h-4" />
          <span>Accès exclusif aux outils IA avancés</span>
        </div>
        <div className="flex items-center justify-center gap-3 text-sm text-gray-400">
          <Sparkles className="w-4 h-4" />
          <span>Contenu premium illimité</span>
        </div>
        <div className="flex items-center justify-center gap-3 text-sm text-gray-400">
          <Crown className="w-4 h-4" />
          <span>Support prioritaire</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/premium"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#cc0029] hover:to-[#990022] transition-all duration-200 transform hover:scale-105"
        >
          <Crown className="w-5 h-5" />
          Passer Premium
          <ArrowRight className="w-4 h-4" />
        </Link>
        
        {user ? (
          <Link
            href="/universite"
            className="flex items-center justify-center gap-2 bg-[#232323] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#333333] transition-colors"
          >
            Voir le centre de formation
          </Link>
        ) : (
          <Link
            href="/auth/signin"
            className="flex items-center justify-center gap-2 bg-[#232323] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#333333] transition-colors"
          >
            Se connecter
          </Link>
        )}
      </div>

      {user && (
        <p className="text-xs text-gray-500 mt-4">
          Connecté en tant que {user.email}
        </p>
      )}
    </div>
  );
} 