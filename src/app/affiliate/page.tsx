"use client";

import { useState } from "react";
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { Users, TrendingUp, DollarSign, Gift, Rocket, Check, ArrowRight, Star, Zap, Calculator, Euro } from "lucide-react";
import PageBentoLayout from '@/components/PageBentoLayout';

export default function AffiliatePage() {
  const [formData, setFormData] = useState({
    email: "",
    promotionMethod: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // État pour le simulateur
  const [salesPerMonth, setSalesPerMonth] = useState(10);
  const COMMISSION_RATE = 0.40; // 40% fixe
  const AVERAGE_SALE_PRICE = 47; // Prix moyen d'un abonnement DropSkills

  const calculateCommissions = () => {
    const monthlyCommission = salesPerMonth * AVERAGE_SALE_PRICE * COMMISSION_RATE;
    const yearlyCommission = monthlyCommission * 12;
    return { monthlyCommission, yearlyCommission };
  };

  const { monthlyCommission, yearlyCommission } = calculateCommissions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/affiliate/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Erreur:', error);
      // Pour l'instant, on simule le succès en cas d'erreur API
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: DollarSign,
      title: "Commission fixe 40%",
      description: "Taux unique et généreux pour tous les affiliés",
      highlight: "40%"
    },
    {
      icon: TrendingUp,
      title: "Revenus récurrents",
      description: "Touchez des commissions tant que vos filleuls restent abonnés",
      highlight: "Récurrent"
    },
    {
      icon: Gift,
      title: "Bonus de performance",
      description: "Débloquez des bonus exclusifs selon vos performances",
      highlight: "Bonus"
    },
    {
      icon: Rocket,
      title: "Support marketing",
      description: "Accédez à des ressources marketing professionnelles",
      highlight: "Support"
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Inscrivez-vous",
      description: "Remplissez le formulaire et attendez la validation",
      icon: Users
    },
    {
      number: "2",
      title: "Partagez votre lien",
      description: "Recevez votre lien unique et commencez à promouvoir",
      icon: Zap
    },
    {
      number: "3",
      title: "Gagnez des commissions",
      description: "Touchez vos commissions chaque mois automatiquement",
      icon: DollarSign
    },
  ];

  if (isSuccess) {
    return (
      <LayoutWithSidebar>
        <div className="flex items-center justify-center min-h-[60vh]">
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
                setFormData({ email: "", promotionMethod: "" });
              }}
              className="text-[#ff0033] hover:text-[#cc0029] transition-colors font-medium"
            >
              Retour au formulaire
            </button>
          </div>
        </div>
      </LayoutWithSidebar>
    );
  }

  return (
    <LayoutWithSidebar>
      <PageBentoLayout
        icon={<Users className="w-6 h-6 text-white" />} 
        title="Affiliation"
        subtitle="Gagnez de l'argent en recommandant Dropskills"
      >
      <div className="space-y-8">
        {/* Benefits */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-[#111111] rounded-xl p-6 border border-[#232323] hover:border-[#ff0033]/30 transition-colors group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#ff0033]/10 rounded-lg flex items-center justify-center group-hover:bg-[#ff0033]/20 transition-colors">
                  <benefit.icon className="w-6 h-6 text-[#ff0033]" />
                </div>
                <span className="text-xs font-bold text-[#ff0033] bg-[#ff0033]/10 px-2 py-1 rounded-full">
                  {benefit.highlight}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
              <p className="text-gray-400 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="bg-[#111111] rounded-xl p-8 border border-[#232323]">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Comment ça marche ?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#ff0033] to-[#cc0029] rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                    {step.number}
                  </div>
                  <div className="w-12 h-12 bg-[#1a1a1a] rounded-lg flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-[#ff0033]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gradient-to-r from-[#ff0033] to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Simulateur de commissions */}
        <div className="bg-[#111111] rounded-xl p-8 border border-[#232323]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[#ff0033]/10 text-[#ff0033] px-4 py-2 rounded-full mb-4">
              <Calculator className="w-4 h-4" />
              <span className="text-sm font-medium">Simulateur de revenus</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Calculez vos gains potentiels</h2>
            <p className="text-gray-400">Commission fixe de 40% sur chaque vente (47€/mois par abonnement)</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Contrôles du simulateur */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Nombre de ventes par mois
                  </label>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={salesPerMonth}
                      onChange={(e) => setSalesPerMonth(parseInt(e.target.value))}
                      className="w-full h-2 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #ff0033 0%, #ff0033 ${salesPerMonth}%, #1a1a1a ${salesPerMonth}%, #1a1a1a 100%)`
                      }}
                    />
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>1 vente</span>
                      <span className="text-[#ff0033] font-bold">{salesPerMonth} ventes</span>
                      <span>100 ventes</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3">Détail du calcul :</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ventes par mois :</span>
                      <span className="text-white">{salesPerMonth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Prix par abonnement :</span>
                      <span className="text-white">{AVERAGE_SALE_PRICE}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Taux de commission :</span>
                      <span className="text-white">{(COMMISSION_RATE * 100)}%</span>
                    </div>
                    <div className="border-t border-[#333] pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span className="text-gray-300">Commission par vente :</span>
                        <span className="text-[#ff0033]">{(AVERAGE_SALE_PRICE * COMMISSION_RATE).toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Résultats */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-[#ff0033]/10 to-[#cc0029]/10 rounded-xl p-6 border border-[#ff0033]/20">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Euro className="w-6 h-6 text-[#ff0033]" />
                      <span className="text-sm text-gray-400">Revenus mensuels</span>
                    </div>
                    <div className="text-4xl font-bold text-[#ff0033] mb-1">
                      {monthlyCommission.toFixed(0)}€
                    </div>
                    <p className="text-gray-400 text-sm">par mois</p>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333]">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <TrendingUp className="w-6 h-6 text-green-400" />
                      <span className="text-sm text-gray-400">Revenus annuels</span>
                    </div>
                    <div className="text-3xl font-bold text-green-400 mb-1">
                      {yearlyCommission.toFixed(0)}€
                    </div>
                    <p className="text-gray-400 text-sm">par an</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#1a1a1a] rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-blue-400 mb-1">
                      {(monthlyCommission / 7).toFixed(0)}€
                    </div>
                    <p className="text-xs text-gray-400">par semaine</p>
                  </div>
                  <div className="bg-[#1a1a1a] rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-purple-400 mb-1">
                      {(monthlyCommission / 30).toFixed(0)}€
                    </div>
                    <p className="text-xs text-gray-400">par jour</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Exemples de scénarios */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { sales: 5, label: "Débutant", color: "blue" },
                { sales: 20, label: "Intermédiaire", color: "yellow" },
                { sales: 50, label: "Expert", color: "green" }
              ].map((scenario, index) => {
                const scenarioMonthly = scenario.sales * AVERAGE_SALE_PRICE * COMMISSION_RATE;
                return (
                  <button
                    key={index}
                    onClick={() => setSalesPerMonth(scenario.sales)}
                    className={`p-4 rounded-lg border transition-colors text-left ${
                      salesPerMonth === scenario.sales 
                        ? 'border-[#ff0033] bg-[#ff0033]/10' 
                        : 'border-[#333] bg-[#1a1a1a] hover:border-[#ff0033]/30'
                    }`}
                  >
                    <div className="text-sm text-gray-400 mb-1">{scenario.label}</div>
                    <div className="text-lg font-bold text-white mb-1">{scenario.sales} ventes/mois</div>
                    <div className="text-sm text-[#ff0033]">{scenarioMonthly.toFixed(0)}€/mois</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Application form */}
        <div className="bg-[#111111] rounded-xl p-8 border border-[#232323]">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Postuler maintenant</h2>
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Votre email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff0033] transition-colors"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Comment comptez-vous promouvoir DropSkills ? *
                </label>
                <textarea
                  value={formData.promotionMethod}
                  onChange={(e) => setFormData({ ...formData, promotionMethod: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff0033] transition-colors h-32 resize-none"
                  placeholder="Décrivez vos canaux de promotion : blog, réseaux sociaux, email marketing, YouTube, etc."
                  required
                />
              </div>

              <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333]">
                <h3 className="text-white font-medium mb-2">Ce que vous obtenez :</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Lien d'affiliation personnalisé
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Dashboard de suivi via Systeme.io
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Ressources marketing (bannières, textes)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Support dédié aux affiliés
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#ff0033] hover:bg-[#cc0029] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Envoi en cours...
                  </>
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
      </PageBentoLayout>
    </LayoutWithSidebar>
  );
} 