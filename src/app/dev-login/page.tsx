"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { 
  User, 
  Crown, 
  Shield, 
  Zap, 
  LogIn,
  Code,
  TestTube
} from "lucide-react";

// Comptes de test pour le développement
const DEV_ACCOUNTS = [
  {
    id: "dev-user-1",
    email: "user@dropskills.dev",
    name: "Utilisateur Test",
    role: "USER",
    icon: <User className="w-5 h-5" />,
    color: "text-green-400",
    description: "Compte utilisateur standard"
  },
  {
    id: "dev-premium-1", 
    email: "premium@dropskills.dev",
    name: "Premium Test",
    role: "PREMIUM",
    icon: <Crown className="w-5 h-5" />,
    color: "text-yellow-400",
    description: "Compte Premium avec accès complet"
  },
  {
    id: "dev-admin-1",
    email: "admin@dropskills.dev", 
    name: "Admin Test",
    role: "ADMIN",
    icon: <Shield className="w-5 h-5" />,
    color: "text-blue-400",
    description: "Compte administrateur"
  },
  {
    id: "dev-super-1",
    email: "super@dropskills.dev",
    name: "Super Admin Test", 
    role: "SUPER_ADMIN",
    icon: <Zap className="w-5 h-5" />,
    color: "text-purple-400",
    description: "Compte super administrateur"
  }
];

export default function DevLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const router = useRouter();

  const handleDevLogin = async (account: typeof DEV_ACCOUNTS[0]) => {
    setIsLoading(true);
    setSelectedAccount(account.id);

    try {
      // Simuler une connexion en stockant les données dans localStorage
      const userData = {
        id: account.id,
        email: account.email,
        name: account.name,
        role: account.role,
        firstName: account.name.split(' ')[0],
        lastName: account.name.split(' ')[1] || '',
        isDevAccount: true,
        loginTime: new Date().toISOString()
      };

      // Stocker dans localStorage pour simulation
      localStorage.setItem('dev-user', JSON.stringify(userData));
      localStorage.setItem('dev-session', 'true');

      // Rediriger vers l'accueil
      setTimeout(() => {
        router.push('/');
        window.location.reload(); // Force le rechargement pour prendre en compte la session
      }, 1000);

    } catch (error) {
      console.error('Erreur de connexion dev:', error);
      setIsLoading(false);
      setSelectedAccount(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dev-user');
    localStorage.removeItem('dev-session');
    window.location.reload();
  };

  // Vérifier si déjà connecté
  const currentUser = typeof window !== 'undefined' ? 
    JSON.parse(localStorage.getItem('dev-user') || 'null') : null;

  if (currentUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-[#111111] border border-[#232323] rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Connecté en tant que</h2>
            <p className="text-gray-400 mb-1">{currentUser.name}</p>
            <p className="text-sm text-gray-500 mb-4">{currentUser.email}</p>
            
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-6 ${
              currentUser.role === 'SUPER_ADMIN' ? 'bg-purple-500/20 text-purple-400' :
              currentUser.role === 'ADMIN' ? 'bg-blue-500/20 text-blue-400' :
              currentUser.role === 'PREMIUM' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-green-500/20 text-green-400'
            }`}>
              {currentUser.role === 'SUPER_ADMIN' && <Zap className="w-4 h-4" />}
              {currentUser.role === 'ADMIN' && <Shield className="w-4 h-4" />}
              {currentUser.role === 'PREMIUM' && <Crown className="w-4 h-4" />}
              {currentUser.role === 'USER' && <User className="w-4 h-4" />}
              {currentUser.role}
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/')}
                className="w-full bg-[#ff0033] text-white py-3 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors"
              >
                Aller à l'application
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-xl flex items-center justify-center mx-auto mb-4">
            <Code className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Connexion Développement
          </h1>
          <p className="text-gray-400">
            Choisissez un compte de test pour explorer l'application
          </p>
        </div>

        {/* Warning */}
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-2 text-orange-400 mb-2">
            <TestTube className="w-4 h-4" />
            <span className="font-semibold">Mode Développement</span>
          </div>
          <p className="text-orange-300 text-sm">
            Cette page est uniquement pour les tests en local. Les données sont simulées et stockées temporairement.
          </p>
        </div>

        {/* Comptes de test */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEV_ACCOUNTS.map((account) => (
            <button
              key={account.id}
              onClick={() => handleDevLogin(account)}
              disabled={isLoading}
              className={`bg-[#111111] border border-[#232323] rounded-xl p-6 text-left hover:border-[#333] transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedAccount === account.id ? 'border-[#ff0033] bg-[#ff0033]/5' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${account.color} bg-current/10`}>
                  {account.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{account.name}</h3>
                  <p className="text-sm text-gray-400">{account.email}</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mb-3">{account.description}</p>
              
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                account.role === 'SUPER_ADMIN' ? 'bg-purple-500/20 text-purple-400' :
                account.role === 'ADMIN' ? 'bg-blue-500/20 text-blue-400' :
                account.role === 'PREMIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {account.icon}
                <span>{account.role}</span>
              </div>

              {isLoading && selectedAccount === account.id && (
                <div className="mt-3 flex items-center gap-2 text-[#ff0033]">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#ff0033]"></div>
                  <span className="text-sm">Connexion...</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Développé avec ❤️ pour tester la nouvelle UX DropSkills
          </p>
        </div>
      </div>
    </div>
  );
} 