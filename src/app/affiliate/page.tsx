"use client";

import { useState } from "react";
import { Users, TrendingUp, DollarSign, Gift, Rocket, Check, ArrowRight } from "lucide-react";

export default function AffiliatePage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Implémenter l'appel API
    setTimeout(() => {
      setIsSuccess(true);
      setIsSubmitting(false);
    }, 1500);
  };

  const benefits = [
    {
      icon: DollarSign,
      title: "Commissions généreuses",
      description: "Gagnez jusqu'à 40% de commission récurrente sur chaque vente",
    },
    {
      icon: TrendingUp,
      title: "Revenus récurrents",
      description: "Touchez des commissions tant que vos filleuls restent abonnés",
    },
    {
      icon: Gift,
      title: "Bonus de performance",
      description: "Débloquez des bonus exclusifs selon vos performances",
    },
    {
      icon: Rocket,
      title: "Support marketing",
      description: "Accédez à des ressources marketing professionnelles",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Inscrivez-vous",
      description: "Remplissez le formulaire et attendez la validation",
    },
    {
      number: "2",
      title: "Partagez votre lien",
      description: "Recevez votre lien unique et commencez à promouvoir",
    },
    {
      number: "3",
      title: "Gagnez des commissions",
      description: "Touchez vos commissions chaque mois automatiquement",
    },
  ];

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#111111] rounded-xl p-8 border border-[#232323] text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Demande envoyée !</h2>
          <p className="text-gray-400 mb-6">
            Nous avons bien reçu votre demande. Notre équipe va l'examiner et vous recevrez une réponse sous 24-48h.
          </p>
          <button
            onClick={() => {
              setIsSuccess(false);
              setEmail("");
            }}
            className="text-[#00D2FF] hover:text-[#00B8E6] transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#00D2FF]/10 text-[#00D2FF] px-4 py-2 rounded-full mb-4">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Programme d'affiliation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Gagnez de l'argent en recommandant
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5]"> DropSkills</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Rejoignez notre programme d'affiliation et touchez jusqu'à 40% de commission récurrente sur chaque vente.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <div className="w-12 h-12 bg-[#00D2FF]/10 rounded-lg flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-[#00D2FF]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
              <p className="text-gray-400">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Comment ça marche ?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[3.5rem] w-full h-0.5 bg-gradient-to-r from-[#00D2FF] to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Commission structure */}
        <div className="bg-[#111111] rounded-2xl p-8 border border-[#232323] mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Structure des commissions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#00D2FF] mb-2">20%</div>
              <p className="text-white font-medium mb-1">Commission de base</p>
              <p className="text-gray-400 text-sm">Sur toutes les ventes</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#00D2FF] mb-2">30%</div>
              <p className="text-white font-medium mb-1">Top performers</p>
              <p className="text-gray-400 text-sm">Plus de 10 ventes/mois</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#00D2FF] mb-2">40%</div>
              <p className="text-white font-medium mb-1">Partenaires VIP</p>
              <p className="text-gray-400 text-sm">Plus de 50 ventes/mois</p>
            </div>
          </div>
        </div>

        {/* Application form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#111111] rounded-xl p-8 border border-[#232323]">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Postuler maintenant</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Votre email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00D2FF] transition-colors"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Comment comptez-vous promouvoir DropSkills ?
                </label>
                <textarea
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00D2FF] transition-colors h-32 resize-none"
                  placeholder="Blog, réseaux sociaux, email marketing..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  "Envoi en cours..."
                ) : (
                  <>
                    Devenir affilié
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 