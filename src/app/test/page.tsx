"use client";

import { PRODUCTS } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { SavedProductsProvider } from "@/context/SavedProductsContext";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <SavedProductsProvider>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Page de Test - Rendu des Produits</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpen={() => console.log("Ouvrir", product.id)}
                onDownload={() => console.log("Télécharger", product.id)}
              />
            ))}
          </div>
        </div>
      </SavedProductsProvider>
    </div>
  );
} 