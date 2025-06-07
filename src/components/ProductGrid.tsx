"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSavedProducts } from "@/context/SavedProductsContext";
import { PRODUCTS } from "@/data/products";

const FORMATS = [
  'ebook',
  'video',
  'audio',
  'template',
  'tool',
];

const CATEGORIES = [
  'Marketing Digital',
  'Entrepreneuriat',
  'Productivité',
  'Intelligence Artificielle',
  'Vente & Négociation',
];

export default function ProductGrid() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const { savedProducts, toggleBookmark } = useSavedProducts();

  const filtered = PRODUCTS.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFormat = !selectedFormats.length || selectedFormats.includes(p.format);
    // Simplification : on utilise les tags existants comme catégories temporairement
    const matchCategory = !selectedCategory || p.tags.some(tag => 
      tag.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      selectedCategory.toLowerCase().includes(tag.toLowerCase())
    );
    return matchSearch && matchFormat && matchCategory;
  });

  const handleOpenProduct = (productId: string) => {
    router.push(`/produits/${productId}`);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          className="bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none flex-1"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Toutes les catégories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          className="bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none"
          value={selectedFormats.join(',')}
          onChange={(e) => setSelectedFormats(e.target.value ? e.target.value.split(',') : [])}
        >
          <option value="">Tous les formats</option>
          {FORMATS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <div key={p.id} className="bg-[#111111] rounded-xl p-4 flex flex-col shadow-md border border-[#232323] relative">
            <button
              onClick={() => toggleBookmark(p.id)}
              className="absolute top-4 right-4 bg-[#18181b] border border-[#232323] text-white p-2 rounded-full hover:bg-[#232323] transition-colors z-10"
            >
              <Bookmark className={`w-4 h-4 ${savedProducts.includes(p.id) ? 'fill-white' : ''}`} />
            </button>
            
            <div className="aspect-video bg-[#1a1a1a] rounded-lg mb-4 flex items-center justify-center overflow-hidden">
              <Image src={p.image} alt={p.title} className="object-contain" fill />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2 truncate">{p.title}</h3>
            <p className="text-gray-400 text-sm mb-4 truncate">{p.subtitle}</p>
            <div className="flex-1" />
            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => handleOpenProduct(p.id)}
                className="flex-1 bg-white text-[#111111] py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Ouvrir
              </button>
              <button className="bg-[#18181b] border border-[#232323] text-white px-3 rounded-lg hover:bg-[#232323] transition-colors flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-12">Aucun produit trouvé.</div>
        )}
      </div>
    </div>
  );
} 