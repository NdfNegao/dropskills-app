"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, CheckCircle, Lock } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // TODO: Implémenter l'appel API pour envoyer l'email de réinitialisation
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } catch (err) {
      setError("Impossible d'envoyer l'email. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-[#111111] rounded-xl p-8 border border-[#232323] text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Email envoyé !</h2>
            <p className="text-gray-400 mb-6">
              Nous avons envoyé un lien de réinitialisation à <strong className="text-white">{email}</strong>.
              Vérifiez votre boîte de réception.
            </p>
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 text-[#ff0033] hover:text-[#cc0029] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#111111] rounded-xl p-8 border border-[#232323]">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-4 mb-4">
              <div className="p-2 bg-[#ff0033]/10 rounded-lg">
                <Lock className="w-6 h-6 text-[#ff0033]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Mot de passe oublié
                </h1>
                <p className="text-gray-400">
                  Réinitialisez votre mot de passe
                </p>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <p className="text-gray-400 text-sm">
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00D2FF] transition-colors"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            {/* Bouton d'envoi */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white py-3 rounded-lg font-semibold hover:from-[#cc0029] hover:to-[#990022] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
            </button>
          </form>

          {/* Retour connexion */}
          <div className="mt-6 text-center">
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 text-[#ff0033] hover:text-[#cc0029] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 