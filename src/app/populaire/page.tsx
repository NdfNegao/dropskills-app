'use client';

import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { TrendingUp, Star, Users, Download } from 'lucide-react';

export default function PopulairePage() {
  const popularProducts = [
    {
      id: 1,
      title: "Pack Business IA Complet",
      description: "Le pack le plus téléchargé avec 50+ templates IA",
      downloads: 2847,
      rating: 4.9,
      category: "Business",
      badge: "🔥 Trending"
    },
    {
      id: 2,
      title: "Tunnel de Vente E-commerce",
      description: "Templates complets pour vendre en ligne",
      downloads: 1923,
      rating: 4.8,
      category: "E-commerce",
      badge: "⭐ Best Seller"
    },
    {
      id: 3,
      title: "Scripts Copywriting Pro",
      description: "Collection de scripts haute conversion",
      downloads: 1654,
      rating: 4.7,
      category: "Marketing",
      badge: "💎 Premium"
    }
  ];

  return (
    <LayoutWithSidebar>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-[#ff0033]" />
            <h1 className="text-3xl font-bold text-white">Produits Populaires</h1>
          </div>
          <p className="text-neutral-400 text-lg">
            Découvrez les produits les plus téléchargés et les mieux notés par notre communauté
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333]">
            <div className="flex items-center gap-3">
              <Download className="w-6 h-6 text-[#ff0033]" />
              <div>
                <p className="text-2xl font-bold text-white">12,847</p>
                <p className="text-neutral-400">Téléchargements ce mois</p>
              </div>
            </div>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333]">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-[#ff0033]" />
              <div>
                <p className="text-2xl font-bold text-white">4.8</p>
                <p className="text-neutral-400">Note moyenne</p>
              </div>
            </div>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333]">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-[#ff0033]" />
              <div>
                <p className="text-2xl font-bold text-white">3,421</p>
                <p className="text-neutral-400">Utilisateurs actifs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularProducts.map((product) => (
            <div key={product.id} className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333] hover:border-[#ff0033]/30 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs bg-[#ff0033]/10 text-[#ff0033] px-2 py-1 rounded-full">
                  {product.badge}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-white">{product.rating}</span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#ff0033] transition-colors">
                {product.title}
              </h3>
              <p className="text-neutral-400 mb-4">{product.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-neutral-400" />
                  <span className="text-sm text-neutral-400">{product.downloads.toLocaleString()} téléchargements</span>
                </div>
                <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>
              
              <button className="w-full mt-4 bg-[#ff0033] hover:bg-[#cc0029] text-white py-2 rounded-lg font-medium transition-colors">
                Télécharger
              </button>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-[#ff0033]/10 to-[#cc0029]/10 rounded-xl p-8 border border-[#ff0033]/20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Vous voulez accéder à tous les produits ?
            </h2>
            <p className="text-neutral-400 mb-6">
              Débloquez l'accès illimité à notre bibliothèque complète de plus de 200 produits
            </p>
            <button className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Passer Premium
            </button>
          </div>
        </div>
      </div>
    </LayoutWithSidebar>
  );
} 