'use client';

import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Bookmark, Star, ExternalLink, Trash2 } from 'lucide-react';

// Types
type SavedProduct = {
  id: string;
  title: string;
  type: string;
  price: number;
  rating: number;
  sales: number;
  dateAdded: string;
  image: string;
};

// Données de test
const savedProducts: SavedProduct[] = [
  {
    id: '1',
    title: 'Pack de Templates Instagram Pro',
    type: 'Templates',
    price: 29.99,
    rating: 4.8,
    sales: 1240,
    dateAdded: '2024-03-15',
    image: '/products/instagram-templates.jpg'
  },
  {
    id: '2',
    title: 'Guide Complet du Marketing Digital',
    type: 'E-books',
    price: 49.99,
    rating: 4.9,
    sales: 890,
    dateAdded: '2024-03-14',
    image: '/products/marketing-guide.jpg'
  },
  {
    id: '3',
    title: 'Formation Copywriting Avancé',
    type: 'Vidéos',
    price: 199.99,
    rating: 4.7,
    sales: 456,
    dateAdded: '2024-03-13',
    image: '/products/copywriting-course.jpg'
  }
];

export default function SauvegardesPage() {
  const [products, setProducts] = useState(savedProducts);
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'sales'>('date');

  // Fonction pour trier les produits
  const sortProducts = (type: typeof sortBy) => {
    setSortBy(type);
    const sorted = [...products].sort((a, b) => {
      switch (type) {
        case 'date':
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case 'price':
          return b.price - a.price;
        case 'sales':
          return b.sales - a.sales;
        default:
          return 0;
      }
    });
    setProducts(sorted);
  };

  // Fonction pour supprimer un produit
  const removeProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Bannière promotionnelle */}
      <div className="bg-[#ff0033] text-white text-center py-2 text-sm">
        🎉 Offre de lancement 2025 ➜ -50% sur le Plan Pro
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Contenu principal */}
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Produits Sauvegardés</h1>
          <p className="text-gray-400">Retrouvez tous les produits que vous avez mis de côté pour plus tard.</p>
        </div>

        {/* Options de tri */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => sortProducts('date')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              sortBy === 'date'
                ? 'bg-[#ff0033] text-white'
                : 'bg-[#111111] text-gray-300 hover:bg-[#1a1a1a] hover:text-white'
            }`}
          >
            Plus Récents
          </button>
          <button
            onClick={() => sortProducts('price')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              sortBy === 'price'
                ? 'bg-[#ff0033] text-white'
                : 'bg-[#111111] text-gray-300 hover:bg-[#1a1a1a] hover:text-white'
            }`}
          >
            Prix
          </button>
          <button
            onClick={() => sortProducts('sales')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              sortBy === 'sales'
                ? 'bg-[#ff0033] text-white'
                : 'bg-[#111111] text-gray-300 hover:bg-[#1a1a1a] hover:text-white'
            }`}
          >
            Popularité
          </button>
        </div>

        {/* Liste des produits */}
        <div className="space-y-4">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-[#111111] rounded-xl p-4 flex items-center gap-6 hover:bg-[#1a1a1a] transition-all duration-200"
            >
              {/* Image du produit */}
              <div className="w-48 h-32 bg-[#1a1a1a] rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute top-2 left-2 bg-[#ff0033] text-white text-xs px-2 py-1 rounded-full">
                  {product.type}
                </span>
              </div>

              {/* Informations du produit */}
              <div className="flex-grow">
                <h3 className="text-white font-semibold text-xl mb-2">{product.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{product.rating}</span>
                  </div>
                  <span>{product.sales} ventes</span>
                  <span>Ajouté le {new Date(product.dateAdded).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[#ff0033] font-semibold">{product.price.toFixed(2)} €</span>
                  <button className="bg-[#1a1a1a] hover:bg-[#ff0033] text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                    <ExternalLink size={16} />
                    Voir le Produit
                  </button>
                </div>
              </div>

              {/* Bouton de suppression */}
              <button 
                onClick={() => removeProduct(product.id)}
                className="p-2 hover:bg-[#ff0033] rounded-lg transition-colors group"
              >
                <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </button>
            </div>
          ))}

          {/* Message si aucun produit */}
          {products.length === 0 && (
            <div className="text-center py-16">
              <Bookmark className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">Aucun Produit Sauvegardé</h3>
              <p className="text-gray-400">Explorez notre catalogue et sauvegardez les produits qui vous intéressent.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 