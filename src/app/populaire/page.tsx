"use client";
import { Metadata } from "next";
import Sidebar from '../../components/Sidebar';
import { ThumbsUp } from 'lucide-react';
import { useState } from 'react';

const mockProducts = [
  { id: 1, name: "Pack Créateur IA", description: "Le pack ultime pour lancer ton business digital.", likes: 12 },
  { id: 2, name: "PDF Rebrander", description: "Personnalise et revend des ebooks en 1 clic.", likes: 8 },
  { id: 3, name: "Générateur de Titres", description: "Des titres accrocheurs pour booster tes ventes.", likes: 5 },
];

export default function PopulairePage() {
  const [products, setProducts] = useState(() => {
    // On récupère les likes de localStorage pour la démo
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("popularLikes");
      if (stored) return JSON.parse(stored);
    }
    return mockProducts;
  });
  const [voted, setVoted] = useState(() => {
    if (typeof window !== "undefined") {
      const v = localStorage.getItem("popularVoted");
      return v ? JSON.parse(v) : [];
    }
    return [];
  });

  const handleLike = (id: number) => {
    if (voted.includes(id)) return;
    const updated = products.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p);
    setProducts(updated);
    const newVoted = [...voted, id];
    setVoted(newVoted);
    if (typeof window !== "undefined") {
      localStorage.setItem("popularLikes", JSON.stringify(updated));
      localStorage.setItem("popularVoted", JSON.stringify(newVoted));
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="ml-0 md:ml-64 px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Produits Populaires</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-[#181818] rounded-xl p-6 shadow flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">{product.name}</h2>
                <p className="text-gray-400 mb-4">{product.description}</p>
              </div>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg mt-2 font-semibold transition-colors ${voted.includes(product.id) ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-[#ff0033] text-white hover:bg-[#cc0029]'}`}
                onClick={() => handleLike(product.id)}
                disabled={voted.includes(product.id)}
              >
                <ThumbsUp size={18} /> {product.likes} Like{product.likes > 1 ? 's' : ''}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 