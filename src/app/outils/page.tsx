"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { 
  Sparkles, 
  FileText, 
  Palette, 
  Lightbulb, 
  Calculator, 
  Package,
  ArrowRight,
  Zap
} from "lucide-react";

const OUTILS = [
  {
    id: "pack-createur",
    title: "Pack Créateur IA",
    description: "Générez des packs de produits digitaux complets avec l'IA",
    icon: Package,
    color: "from-purple-500 to-pink-500",
    href: "/outils/pack-createur",
    features: ["Génération automatique", "Table des matières", "Stratégie de prix"]
  },
  {
    id: "generateur-titres",
    title: "Générateur de Titres",
    description: "Créez des titres accrocheurs qui convertissent",
    icon: Sparkles,
    color: "from-blue-500 to-cyan-500",
    href: "/outils/titres",
    features: ["Titres optimisés", "Score d'impact", "Différentes émotions"]
  },
  {
    id: "descriptions-ia",
    title: "Descriptions IA",
    description: "Rédigez des descriptions de produits persuasives",
    icon: FileText,
    color: "from-green-500 to-emerald-500",
    href: "/outils/descriptions",
    features: ["Copywriting optimisé", "Différents tons", "SEO-friendly"]
  },
  {
    id: "rebranding-pdf",
    title: "Rebranding PDF",
    description: "Personnalisez vos PDFs avec votre marque",
    icon: Palette,
    color: "from-orange-500 to-red-500",
    href: "/outils/pdf-rebrander",
    features: ["Changement de couleurs", "Logo personnalisé", "Automatisé"]
  },
  {
    id: "idees-produits",
    title: "Idées de Produits",
    description: "Découvrez des idées de produits rentables",
    icon: Lightbulb,
    color: "from-yellow-500 to-orange-500",
    href: "/outils/idees",
    features: ["Analyse de marché", "Estimation de revenus", "Tendances"]
  },
  {
    id: "calculateur-revenus",
    title: "Calculateur de Revenus",
    description: "Calculez et projetez vos revenus futurs",
    icon: Calculator,
    color: "from-indigo-500 to-purple-500",
    href: "/outils/calculateur",
    features: ["Projections précises", "Analyse de coûts", "Graphiques"]
  }
];

export default function OutilsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirection si non connecté
  if (status === "loading") {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-white">Chargement...</div>
    </div>;
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      
      <main className="ml-0 md:ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-[#ff0033] to-[#cc0029] rounded-xl">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Outils IA DropSkills</h1>
                <p className="text-xl text-gray-400 mt-2">
                  Boostez votre productivité avec nos outils d'intelligence artificielle
                </p>
              </div>
            </div>
            
            {/* Section de réassurance déplacée en haut */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#111111] rounded-xl p-6 border border-[#232323] text-center">
                <div className="w-12 h-12 bg-[#ff0033]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-[#ff0033]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Rapide</h3>
                <p className="text-gray-400 text-sm">
                  Résultats en quelques secondes grâce à nos workflows optimisés
                </p>
              </div>

              <div className="bg-[#111111] rounded-xl p-6 border border-[#232323] text-center">
                <div className="w-12 h-12 bg-[#ff0033]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-[#ff0033]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Intelligent</h3>
                <p className="text-gray-400 text-sm">
                  Alimenté par les derniers modèles d'IA pour des résultats de qualité
                </p>
              </div>

              <div className="bg-[#111111] rounded-xl p-6 border border-[#232323] text-center">
                <div className="w-12 h-12 bg-[#ff0033]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Package className="w-6 h-6 text-[#ff0033]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Complet</h3>
                <p className="text-gray-400 text-sm">
                  Tous les outils dont vous avez besoin pour votre business digital
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-[#ff0033]/10 to-[#cc0029]/10 border border-[#ff0033]/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-5 h-5 text-[#ff0033]" />
                <h3 className="text-lg font-semibold text-white">Powered by n8n</h3>
              </div>
              <p className="text-gray-300">
                Nos outils utilisent des workflows n8n avancés pour vous offrir des résultats 
                de qualité professionnelle en quelques secondes.
              </p>
            </div>
          </div>

          {/* Grille des outils */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {OUTILS.map((outil) => {
              const IconComponent = outil.icon;
              
              return (
                <div
                  key={outil.id}
                  className="group bg-[#111111] rounded-xl p-6 border border-[#232323] hover:border-[#ff0033]/30 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
                  onClick={() => router.push(outil.href)}
                >
                  {/* Header de la carte */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-r ${outil.color} rounded-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#ff0033] group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* Contenu */}
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#ff0033] transition-colors">
                    {outil.title}
                  </h3>
                  <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                    {outil.description}
                  </p>

                  {/* Features avec bullet points rouges */}
                  <div className="space-y-2">
                    {outil.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#ff0033] rounded-full"></div>
                        <span className="text-xs text-gray-500">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Badge "Nouveau" pour certains outils */}
                  {outil.id === "pack-createur" && (
                    <div className="mt-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#ff0033]/10 text-[#ff0033] border border-[#ff0033]/20">
                        Nouveau
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
} 