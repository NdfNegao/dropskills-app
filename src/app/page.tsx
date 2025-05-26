'use client';
import Image from 'next/image';
import Sidebar from '../components/Sidebar';
import { useState } from 'react';
import ProductCard from "@/components/ProductCard";
import { SavedProductsProvider } from "@/context/SavedProductsContext";
import { PRODUCTS } from '@/data/products';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Bannière promotionnelle */}
      <div className="bg-[#ff0033] text-white text-center py-2 text-sm">
        🎉 Offre de lancement 2025 ➜ -50% sur le Plan Pro
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Contenu principal */}
      <main className="ml-0 md:ml-64">
        {/* Hero Section */}
        <section className="text-center px-4 sm:px-8 py-8 sm:py-16">
          {/* <p className="text-gray-400 mb-4">DropSkills, Leader du Digital Dropshipping en France 🇫🇷</p> */}
          <h2 className="text-2xl sm:text-5xl font-bold text-white mb-4">
            Revendez des Produits Digitaux
          </h2>
          <h3 className="text-xl sm:text-4xl font-bold text-[#ff0033] mb-8">
            Sans Devoir les Créer
          </h3>
          <p className="text-gray-300 max-w-3xl mx-auto mb-8">
            Imaginez disposer <span className="text-white font-semibold">instantanément</span> de vos propres produits digitaux : e-books, cours vidéo, templates et bien plus encore.
            Rebrandez-les, revendez-les ou utilisez-les comme bon vous semble, sans gros investissements ni mois de création.
          </p>

          {/* Features */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-12 mb-12">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#ff0033] rounded-full mr-2"></div>
              <span className="text-gray-300">Ressources premium</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#ff0033] rounded-full mr-2"></div>
              <span className="text-gray-300">Mises à jour à vie</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#ff0033] rounded-full mr-2"></div>
              <span className="text-gray-300">100 % de profit pour vous</span>
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row justify-center items-center mb-12 gap-4 sm:gap-0">
            <div className="flex -space-x-4 justify-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-gray-600 border-2 border-[#0a0a0a]"></div>
              ))}
            </div>
            <div className="sm:ml-4 mt-4 sm:mt-0">
              <div className="flex text-yellow-400">
                {'★'.repeat(5)}
              </div>
              <p className="text-gray-300">Validé par +300 entrepreneurs</p>
            </div>
          </div>

          {/* CTA Button */}
          <button className="bg-[#ff0033] text-white px-8 py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-red-600 transition-colors">
            Commander Maintenant
          </button>
        </section>

        {/* Bannière échantillons */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="bg-[#18181b] rounded-2xl flex flex-col sm:flex-row items-center justify-between px-8 py-6 shadow-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#ff0033] text-2xl">★</span>
                <span className="text-white text-lg font-semibold">Curieux de la qualité de nos produits&nbsp;?</span>
              </div>
              <p className="text-gray-300 text-base">Découvre nos échantillons gratuits pour tester la qualité premium des ressources DropSkills.</p>
            </div>
            <a
              href="/echantillons"
              className="mt-4 sm:mt-0 sm:ml-8 bg-[#ff0033] hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-base shadow-md flex items-center gap-2"
            >
              Voir les échantillons
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L21 12m0 0l-3.75 5.25M21 12H3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Resource Grid - style maquette */}
        <section className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-16">
          <h2 className="text-3xl font-bold text-white mb-8">Tous les produits</h2>

          {/* Filtres et recherche */}
          <ProductGridMock />
        </section>
      </main>
    </div>
  );
}

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

const TAGS = [
  'Digital Marketing',
  'Business & Entrepreneurship',
  'Content Marketing',
  'Personal Development',
  'Branding',
  'Mindset',
  'Social Media Marketing',
  'Startups',
  'Voice',
  'Prompt',
  'Pack',
  'Checklist',
  'Guide',
  'Book',
  'Audio',
  'Video',
  'Template',
  'Notion Template',
  'Toolstack',
  'Workbook',
];

function ProductGridMock() {
  const [search, setSearch] = useState('');
  const [format, setFormat] = useState('');
  const [tag, setTag] = useState('');

  const filtered = PRODUCTS.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchFormat = !format || p.format === format;
    const matchTag = !tag || p.tags.includes(tag);
    return matchSearch && matchFormat && matchTag;
  });

  return (
    <SavedProductsProvider>
      <div>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
          <select
            className="bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none"
            value={tag}
            onChange={e => setTag(e.target.value)}
          >
            <option value="">Filtrer par tags</option>
            {TAGS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            className="bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none"
            value={format}
            onChange={e => setFormat(e.target.value)}
          >
            <option value="">Filtrer par format</option>
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
