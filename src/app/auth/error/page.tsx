"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'CredentialsSignin':
        return 'Email ou mot de passe incorrect';
      case 'EmailCreateAccount':
        return 'Impossible de créer un compte avec cet email';
      case 'OAuthCreateAccount':
        return 'Impossible de créer un compte avec ce fournisseur';
      case 'EmailSignin':
        return 'Impossible d\'envoyer l\'email de connexion';
      case 'OAuthSignin':
        return 'Erreur lors de la connexion avec le fournisseur';
      case 'OAuthCallback':
        return 'Erreur lors du retour du fournisseur';
      case 'OAuthAccountNotLinked':
        return 'Ce compte est déjà associé à un autre fournisseur';
      case 'SessionRequired':
        return 'Vous devez être connecté pour accéder à cette page';
      case 'Callback':
        return 'Erreur lors de la connexion';
      default:
        return 'Une erreur inattendue s\'est produite';
    }
  };

  return (
    <div className="max-w-md w-full text-center">
      <div className="bg-[#111111] border border-[#232323] rounded-xl p-8">
        {/* Icône d'erreur */}
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold text-white mb-2">
          Erreur de connexion
        </h1>
        
        {/* Message d'erreur */}
        <p className="text-gray-400 mb-6">
          {getErrorMessage(error)}
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/auth/signin"
            className="w-full bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white py-3 px-4 rounded-lg font-semibold hover:from-[#cc0029] hover:to-[#990022] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la connexion
          </Link>
          
          <Link
            href="/auth/signup"
            className="w-full bg-transparent border border-[#ff0033] text-[#ff0033] py-3 px-4 rounded-lg font-semibold hover:bg-[#ff0033] hover:text-white transition-all duration-200 flex items-center justify-center"
          >
            Créer un compte
          </Link>
          
          <Link
            href="/"
            className="block text-gray-400 hover:text-white transition-colors text-sm"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center py-12 px-4">
      <Suspense fallback={
        <div className="max-w-md w-full text-center">
          <div className="bg-[#111111] border border-[#232323] rounded-xl p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff0033] mx-auto mb-4"></div>
            <p className="text-gray-400">Chargement...</p>
          </div>
        </div>
      }>
        <AuthErrorContent />
      </Suspense>
    </div>
  );
} 