'use client';

import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { Bookmark, Heart, Download, Trash2, Search } from 'lucide-react';
import { useState } from 'react';

export default function SauvegardesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [savedProducts] = useState([
    {
      id: 1,
      title: "Pack Business IA Complet",
      description: "Templates et prompts IA pour business",
      category: "Business",
      savedDate: "2024-01-15",
      type: "premium"
    },
    {
      id: 2,
      title: "Scripts Copywriting Pro",
      description: "Collection de scripts haute conversion",
      category: "Marketing",
      savedDate: "2024-01-10",
      type: "premium"
    },
    {
      id: 3,
      title: "Guide IA Gratuit",
      description: "Introduction aux outils IA",
      category: "Guide",
      savedDate: "2024-01-08",
      type: "free"
    }
  ]);

  const filteredProducts = savedProducts.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <LayoutWithSidebar>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Bookmark className="w-8 h-8 text-[#ff0033]" />
            <h1 className="text-3xl font-bold text-white">Mes Sauvegardes</h1>
          </div>
          <p className="text-neutral-400 text-lg">
            Retrouvez tous vos produits favoris sauvegardés
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher dans vos sauvegardes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl pl-10 pr-4 py-3 text-white placeholder-neutral-400 focus:border-[#ff0033] focus:outline-none"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333]">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-[#ff0033]" />
              <div>
                <p className="text-2xl font-bold text-white">{savedProducts.length}</p>
                <p className="text-neutral-400">Produits sauvegardés</p>
              </div>
            </div>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333]">
            <div className="flex items-center gap-3">
              <Download className="w-6 h-6 text-[#ff0033]" />
              <div>
                <p className="text-2xl font-bold text-white">{savedProducts.filter(p => p.type === 'premium').length}</p>
                <p className="text-neutral-400">Produits Premium</p>
              </div>
            </div>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333]">
            <div className="flex items-center gap-3">
              <Bookmark className="w-6 h-6 text-[#ff0033]" />
              <div>
                <p className="text-2xl font-bold text-white">{savedProducts.filter(p => p.type === 'free').length}</p>
                <p className="text-neutral-400">Produits Gratuits</p>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Products */}
        {filteredProducts.length > 0 ? (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333] hover:border-[#ff0033]/30 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{product.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.type === 'premium' 
                          ? 'bg-[#ff0033]/10 text-[#ff0033]' 
                          : 'bg-green-500/10 text-green-400'
                      }`}>
                        {product.type === 'premium' ? '💎 Premium' : '🎁 Gratuit'}
                      </span>
                    </div>
                    <p className="text-neutral-400 mb-3">{product.description}</p>
                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                      <span>Catégorie: {product.category}</span>
                      <span>Sauvegardé le: {new Date(product.savedDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Télécharger
                    </button>
                    <button className="bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-red-400 p-2 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bookmark className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm ? 'Aucun résultat trouvé' : 'Aucune sauvegarde'}
            </h3>
            <p className="text-neutral-400 mb-6">
              {searchTerm 
                ? 'Essayez avec d\'autres mots-clés'
                : 'Commencez à sauvegarder vos produits favoris pour les retrouver ici'
              }
            </p>
            {!searchTerm && (
              <button className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Découvrir les produits
              </button>
            )}
          </div>
        )}
      </div>
    </LayoutWithSidebar>
  );
} 