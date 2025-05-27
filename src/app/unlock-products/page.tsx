"use client";

import { useState } from "react";
import { Sparkles, Check, Lock, Zap, Crown, Star } from "lucide-react";
import Link from "next/link";

export default function UnlockProductsPage() {
  const [selectedPlan, setSelectedPlan] = useState("pro");

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "29€",
      period: "/mois",
      description: "Pour débuter avec les outils essentiels",
      features: [
        "Accès à 10 outils IA",
        "100 générations par mois",
        "Support par email",
        "Mises à jour mensuelles",
      ],
      color: "from-gray-600 to-gray-800",
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: "79€",
      period: "/mois",
      description: "Pour les entrepreneurs ambitieux",
      features: [
        "Accès à tous les outils IA",
        "Générations illimitées",
        "Support prioritaire 24/7",
        "Nouvelles fonctionnalités en avant-première",
        "Formation exclusive",
        "Communauté privée",
      ],
      color: "from-[#00D2FF] to-[#3A7BD5]",
      popular: true,
    },
    {
      id: "lifetime",
      name: "Lifetime",
      price: "497€",
      period: "une fois",
      description: "Accès à vie, meilleur investissement",
      features: [
        "Tout du plan Pro",
        "Accès à vie",
        "Tous les futurs outils inclus",
        "Coaching personnalisé (3 sessions)",
        "Badge VIP exclusif",
        "Accès anticipé aux bêtas",
      ],
      color: "from-yellow-500 to-orange-600",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Offre limitée</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Débloquez tout le potentiel de
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5]"> DropSkills</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Accédez à tous nos outils IA premium et transformez votre business. 
            Plus de 50 outils pour automatiser, créer et scaler.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-[#111111] rounded-2xl border ${
                selectedPlan === plan.id ? "border-[#00D2FF]" : "border-[#232323]"
              } p-8 cursor-pointer transition-all hover:border-[#00D2FF]/50`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] text-white px-4 py-1 rounded-full text-sm font-medium">
                    Plus populaire
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <p className="text-gray-400 mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  selectedPlan === plan.id
                    ? `bg-gradient-to-r ${plan.color} text-white hover:opacity-90`
                    : "bg-[#1a1a1a] text-gray-400 hover:bg-[#232323]"
                }`}
              >
                {selectedPlan === plan.id ? "Sélectionné" : "Choisir ce plan"}
              </button>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Débloquer maintenant
          </button>
          <p className="text-gray-400 mt-4">
            Paiement sécurisé • Annulation à tout moment • Garantie 30 jours
          </p>
        </div>

        {/* Testimonials */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
            <p className="text-gray-300 mb-4">
              "Les outils IA de DropSkills ont transformé ma productivité. Je gagne 10h par semaine !"
            </p>
            <p className="text-white font-medium">Marie L.</p>
            <p className="text-gray-400 text-sm">Entrepreneure</p>
          </div>

          <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
            <p className="text-gray-300 mb-4">
              "Le meilleur investissement pour mon business. ROI en moins d'un mois !"
            </p>
            <p className="text-white font-medium">Thomas D.</p>
            <p className="text-gray-400 text-sm">Consultant</p>
          </div>

          <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
            <p className="text-gray-300 mb-4">
              "Support incroyable et outils constamment mis à jour. Je recommande !"
            </p>
            <p className="text-white font-medium">Sophie R.</p>
            <p className="text-gray-400 text-sm">Marketeuse</p>
          </div>
        </div>
      </div>
    </div>
  );
} 