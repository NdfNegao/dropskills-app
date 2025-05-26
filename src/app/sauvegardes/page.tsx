"use client";

import Sidebar from '../../components/Sidebar';
import { Bookmark } from 'lucide-react';
import { useSavedProducts } from '@/context/SavedProductsContext';
import { PRODUCTS } from '@/data/products';
import ProductCard from "@/components/ProductCard";

export default function SauvegardesPage() {
  const { savedProducts, toggleBookmark } = useSavedProducts();
  const saved = PRODUCTS.filter((p) => savedProducts.includes(p.id));

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="ml-0 md:ml-64 px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Produits Sauvegardés</h1>
          <p className="text-gray-400">Retrouvez tous les produits que vous avez mis de côté pour plus tard.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {saved.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {saved.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-12">
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