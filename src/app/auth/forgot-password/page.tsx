"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, CheckCircle, Lock, Sparkles, Shield } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        
        <motion.div
          className="w-full max-w-md relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="backdrop-blur-sm bg-[#111111]/80 rounded-2xl p-8 border border-[#232323]/50 text-center shadow-2xl"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-400/10 rounded-full flex items-center justify-center mx-auto mb-6 relative"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-10 h-10 text-green-400" />
              <motion.div
                className="absolute inset-0 bg-green-400/20 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
            
            <motion.h2
              className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Email envoyé !
            </motion.h2>
            
            <motion.p
              className="text-gray-400 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Nous avons envoyé un lien de réinitialisation à <strong className="text-white">{email}</strong>.
              Vérifiez votre boîte de réception.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 text-[#ff0033] hover:text-[#cc0029] transition-colors relative group"
              >
                <motion.div
                  className="absolute inset-0 bg-[#ff0033]/10 rounded-lg -m-2"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.div
                  whileHover={{ x: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                </motion.div>
                <span className="relative z-10">Retour à la connexion</span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-[#ff0033]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      
      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="backdrop-blur-sm bg-[#111111]/80 rounded-2xl p-8 border border-[#232323]/50 shadow-2xl"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-2xl flex items-center justify-center relative overflow-hidden group cursor-pointer"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Shield className="w-8 h-8 text-white relative z-10" />
                <motion.div
                  className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <Sparkles className="w-4 h-4 text-yellow-400 absolute top-1 left-1 opacity-60" />
              </motion.div>
            </motion.div>
            
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Mot de passe oublié
            </motion.h1>
            
            <motion.p
              className="text-gray-400 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Réinitialisez votre mot de passe
            </motion.p>
          </motion.div>

          {/* Formulaire */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {error && (
              <motion.div
                className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}

            <motion.p
              className="text-gray-400 text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </motion.p>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <motion.input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1a1a1a]/80 border border-[#333]/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff0033]/50 focus:border-[#ff0033]/50 transition-all duration-300 backdrop-blur-sm"
                  placeholder="votre@email.com"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
            </motion.div>

            {/* Bouton d'envoi */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white py-4 rounded-xl font-semibold hover:from-[#cc0029] hover:to-[#990022] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              {isLoading ? (
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-3"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Envoi en cours...
                </motion.div>
              ) : (
                <span className="relative z-10">Envoyer le lien de réinitialisation</span>
              )}
            </motion.button>
          </motion.form>

          {/* Retour connexion */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 text-[#ff0033] hover:text-[#cc0029] transition-colors relative group"
            >
              <motion.div
                className="absolute inset-0 bg-[#ff0033]/10 rounded-lg -m-2"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.div
                whileHover={{ x: -4 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowLeft className="w-4 h-4" />
              </motion.div>
              <span className="relative z-10">Retour à la connexion</span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}