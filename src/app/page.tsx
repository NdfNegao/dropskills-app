'use client';
import { useState } from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
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
  Lightbulb
} from 'lucide-react';

export default function Home() {
  return (
    <LayoutWithSidebar>
      <div className="max-w-7xl mx-auto">
      {/* Bannière promotionnelle */}
        <div className="bg-gradient-to-r from-[#ff0033] to-[#cc0029] rounded-xl p-4 mb-8 text-center">
          <div className="flex items-center justify-center gap-2 text-white">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">🎉 Offre de lancement 2025 ➜ -50% sur le Plan Pro</span>
          </div>
      </div>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-xl flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
            Revendez des Produits Digitaux
              </h1>
              <h2 className="text-2xl font-bold text-[#ff0033]">
                Sans Devoir les Créer
          </h2>
            </div>
          </div>

          <p className="text-gray-300 text-lg max-w-4xl mb-8">
            Imaginez disposer <span className="text-white font-semibold">instantanément</span> de vos propres produits digitaux : e-books, cours vidéo, templates et bien plus encore.
            Rebrandez-les, revendez-les ou utilisez-les comme bon vous semble, sans gros investissements ni mois de création.
          </p>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Ressources premium</span>
              </div>
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-xs text-gray-400">produits disponibles</div>
            </div>
            
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Mises à jour</span>
              </div>
              <div className="text-2xl font-bold text-white">À vie</div>
              <div className="text-xs text-gray-400">contenu toujours frais</div>
            </div>
            
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <Crown className="w-4 h-4" />
                <span className="text-sm font-medium">Profit</span>
              </div>
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-xs text-gray-400">pour vous</div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="bg-[#111111] border border-[#232323] rounded-xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-[#111111] flex items-center justify-center text-white text-sm font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex text-yellow-400 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
                  <p className="text-gray-300 text-sm">Validé par +300 entrepreneurs</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <Users className="w-5 h-5" />
                <span className="font-semibold">Communauté active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bannière outils IA - Flow Stratégique */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl p-8 mb-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-white text-2xl font-bold">12 Outils IA Stratégiques</span>
                  <p className="text-white/80 text-sm">Flow entrepreneurial complet</p>
                </div>
              </div>
              <p className="text-white/90 text-base mb-4">
                Suivez notre <strong>parcours entrepreneurial structuré</strong> : de la définition de votre cible jusqu'à la croissance continue.
                Chaque outil démultiplie l'efficacité du précédent.
              </p>
              
              {/* Mini flow visuel */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="flex items-center gap-1 bg-white/10 rounded-lg px-3 py-1">
                  <Target className="w-4 h-4 text-blue-300" />
                  <span className="text-white text-xs font-medium">CIBLE</span>
                </div>
                <ArrowRight className="w-3 h-3 text-white/60" />
                <div className="flex items-center gap-1 bg-white/10 rounded-lg px-3 py-1">
                  <Rocket className="w-4 h-4 text-purple-300" />
                  <span className="text-white text-xs font-medium">OFFRE</span>
                </div>
                <ArrowRight className="w-3 h-3 text-white/60" />
                <div className="flex items-center gap-1 bg-white/10 rounded-lg px-3 py-1">
                  <FolderKanban className="w-4 h-4 text-orange-300" />
                  <span className="text-white text-xs font-medium">CONVERSION</span>
                </div>
                <ArrowRight className="w-3 h-3 text-white/60" />
                <div className="flex items-center gap-1 bg-white/10 rounded-lg px-3 py-1">
                  <Mail className="w-4 h-4 text-pink-300" />
                  <span className="text-white text-xs font-medium">ACTIVATION</span>
                </div>
                <ArrowRight className="w-3 h-3 text-white/60" />
                <div className="flex items-center gap-1 bg-white/10 rounded-lg px-3 py-1">
                  <Eye className="w-4 h-4 text-red-300" />
                  <span className="text-white text-xs font-medium">CROISSANCE</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href="/outils"
                className="bg-white text-purple-600 font-semibold px-8 py-4 rounded-lg transition-colors text-base shadow-md flex items-center gap-2 hover:bg-gray-100"
              >
                Découvrir le Flow IA
                <ArrowRight className="w-5 h-5" />
              </a>
              <p className="text-white/70 text-xs text-center">12,847 créations IA générées</p>
            </div>
          </div>
        </div>

        {/* Section Produits */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Tous les produits</h2>
              <p className="text-gray-400">Découvrez notre bibliothèque complète de ressources digitales</p>
            </div>
            <a
              href="/catalogue"
              className="bg-[#ff0033] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors flex items-center gap-2"
            >
              Voir tout
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Grille de produits */}
          <ProductGridSimplified />
        </section>
    </div>
    </LayoutWithSidebar>
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
    // Simplification : on utilise les tags existants comme catégories temporairement
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
