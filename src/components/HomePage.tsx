'use client';

import React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import ProductCard from "@/components/ProductCard";
import { SavedProductsProvider } from "@/context/SavedProductsContext";
import { PRODUCTS } from '@/data/products';
import { 
  Sparkles, 
  Star, 
  TrendingUp, 
  Users, 
  Zap,
  ArrowRight,
  CheckCircle,
  Crown,
  Target,
  Rocket,
  FolderKanban,
  Mail,
  Eye,
  Lightbulb,
  Code
} from 'lucide-react';
import LayoutWithSidebar from './LayoutWithSidebar';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import TestimonialsSection from './TestimonialsSection';
import CTASection from './CTASection';

const FORMATS = [
  'Book',
  'Video',
  'Audio',
  'Prompt Pack',
  'Template',
  'Notion Template',
  'Checklist',
  'Toolstack',
  'Workbook',
  'Guide',
];

const CATEGORIES = [
  'Marketing Digital',
  'Entrepreneuriat',
  'Productivité',
  'Intelligence Artificielle',
  'Vente & Négociation',
];

function ProductGridSimplified() {
  const [search, setSearch] = useState('');
  const [format, setFormat] = useState('');
  const [category, setCategory] = useState('');

  const filtered = PRODUCTS.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchFormat = !format || p.format === format;
    const matchCategory = !category || p.tags.some(tag => 
      tag.toLowerCase().includes(category.toLowerCase()) ||
      category.toLowerCase().includes(tag.toLowerCase())
    );
    return matchSearch && matchFormat && matchCategory;
  });

  return (
    <SavedProductsProvider>
      <div>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
          <select
            className="bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            className="bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none"
            value={format}
            onChange={e => setFormat(e.target.value)}
          >
            <option value="">Tous les formats</option>
            {FORMATS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Rechercher un produit..."
            className="flex-1 bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-12">Aucun produit trouvé.</div>
          )}
        </div>
      </div>
    </SavedProductsProvider>
  );
}

export default function HomePage() {
  return (
    <LayoutWithSidebar>
      <div className="min-h-screen">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
        

      </div>
    </LayoutWithSidebar>
  );
}