"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou mot de passe incorrect");
      } else {
        // Vérifier la session pour rediriger selon le rôle
        const session = await getSession();
        if (session?.user) {
          const userRole = (session.user as any).role;
          
          // Redirection selon le rôle
          if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
            router.push("/admin");
          } else {
            router.push("/");
          }
        }
      }
    } catch (error) {
      setError("Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const testAccounts = [
    {
      email: "admin@dropskills.com",
      password: "admin123",
      role: "Super Admin",
      description: "Accès complet admin + premium"
    },
    {
      email: "premium@dropskills.com",
      password: "premium123",
      role: "Premium",
      description: "Accès aux outils IA premium"
    },
    {
      email: "user@dropskills.com",
      password: "user123",
      role: "Utilisateur",
      description: "Accès limité, doit upgrader"
    }
  ];

  const quickLogin = (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            DROP<span className="text-[#ff0033]">SKILLS</span>
          </h1>
          <h2 className="text-xl text-gray-300 mb-8">
            Connexion à votre compte
          </h2>
        </div>

        {/* Formulaire */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#111111] border border-[#232323] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff0033] focus:border-transparent"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-[#111111] border border-[#232323] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff0033] focus:border-transparent"
                placeholder="Votre mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white py-3 px-4 rounded-lg font-semibold hover:from-[#cc0029] hover:to-[#990022] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* Comptes de test */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">
            Comptes de test disponibles
          </h3>
          <div className="space-y-3">
            {testAccounts.map((account, index) => (
              <div 
                key={index}
                className="bg-[#111111] border border-[#232323] rounded-lg p-4 hover:border-[#ff0033]/30 transition-colors cursor-pointer"
                onClick={() => quickLogin(account.email, account.password)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-[#ff0033]" />
                      <span className="font-medium text-white">{account.role}</span>
                    </div>
                    <p className="text-sm text-gray-400">{account.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{account.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      quickLogin(account.email, account.password);
                    }}
                    className="text-[#ff0033] hover:text-[#cc0029] text-sm font-medium"
                  >
                    Utiliser
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400">
          <p>Pas encore de compte ? <span className="text-[#ff0033]">Créer un compte</span></p>
        </div>
      </div>
    </div>
  );
} 