'use client';

import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { Gift, Download, Star, Eye } from 'lucide-react';

export default function EchantillonsPage() {
  const freeProducts = [
    {
      id: 1,
      title: "Pack Starter Business",
      description: "Templates de base pour démarrer votre business",
      type: "Templates",
      downloads: 1247,
      rating: 4.6,
      preview: true
    },
    {
      id: 2,
      title: "Guide IA pour Débutants",
      description: "Introduction complète aux outils IA",
      type: "Guide",
      downloads: 892,
      rating: 4.8,
      preview: true
    },
    {
      id: 3,
      title: "Scripts Email Gratuits",
      description: "5 templates d'emails haute conversion",
      type: "Scripts",
      downloads: 1534,
      rating: 4.5,
      preview: true
    }
  ];

  return (
    <LayoutWithSidebar>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Gift className="w-8 h-8 text-[#ff0033]" />
            <h1 className="text-3xl font-bold text-white">Échantillons Gratuits</h1>
          </div>
          <p className="text-neutral-400 text-lg">
            Découvrez nos produits avec ces échantillons gratuits de qualité premium
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20 mb-8">
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6 text-green-400" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">100% Gratuit, Aucune Inscription Requise</h3>
              <p className="text-neutral-400">Téléchargez immédiatement ces échantillons pour tester la qualité de nos produits</p>
            </div>
          </div>
        </div>

        {/* Free Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {freeProducts.map((product) => (
            <div key={product.id} className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333] hover:border-green-500/30 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full">
                  🎁 GRATUIT
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-white">{product.rating}</span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                {product.title}
              </h3>
              <p className="text-neutral-400 mb-4">{product.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-neutral-400" />
                  <span className="text-sm text-neutral-400">{product.downloads.toLocaleString()} téléchargements</span>
                </div>
                <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-1 rounded">
                  {product.type}
                </span>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Télécharger
                </button>
                <button className="bg-neutral-800 hover:bg-neutral-700 text-white p-2 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Upgrade CTA */}
        <div className="bg-gradient-to-r from-[#ff0033]/10 to-[#cc0029]/10 rounded-xl p-8 border border-[#ff0033]/20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Vous aimez ce que vous voyez ?
            </h2>
            <p className="text-neutral-400 mb-6">
              Accédez à notre bibliothèque complète de plus de 200 produits premium
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Voir tous les produits
              </button>
              <button className="bg-transparent border border-[#ff0033] text-[#ff0033] hover:bg-[#ff0033] hover:text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Passer Premium
              </button>
            </div>
          </div>
        </div>
      </div>
    </LayoutWithSidebar>
  );
} 