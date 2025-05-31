"use client";

import { useState } from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import ProductCard from "@/components/ProductCard";
import { SavedProductsProvider } from "@/context/SavedProductsContext";
import { PRODUCTS } from '@/data/products';
import Link from 'next/link';
import { 
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  TrendingUp,
  Users,
  Package,
  Crown,
  Sparkles
} from 'lucide-react';
import ProductFilters from '@/components/ProductFilters';

const FORMATS = [
  'Tous les formats',
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
  'Toutes les catégories',
  'Marketing Digital',
  'Entrepreneuriat',
  'Productivité',
  'Intelligence Artificielle',
  'Vente & Négociation',
  'Design & Créativité',
  'Finance & Business',
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Plus récents' },
  { value: 'popular', label: 'Plus populaires' },
  { value: 'rating', label: 'Mieux notés' },
  { value: 'name', label: 'Nom A-Z' },
];

export default function UniversitePage() {
  const [search, setSearch] = useState('');
  const [format, setFormat] = useState('Tous');
  const [category, setCategory] = useState('Tous');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  // Filtrage des produits
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchSearch = product.title.toLowerCase().includes(search.toLowerCase()) ||
                       product.description?.toLowerCase().includes(search.toLowerCase()) ||
                       product.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    
    const matchFormat = format === 'Tous' || format === 'Tous les formats' || product.format === format;
    
    const matchCategory = category === 'Tous' || category === 'Toutes les catégories' ||
                         product.tags.some(tag => 
                           tag.toLowerCase().includes(category.toLowerCase()) ||
                           category.toLowerCase().includes(tag.toLowerCase())
                         );
    
    const matchPremium = !showPremiumOnly || product.isPremium;
    
    return matchSearch && matchFormat && matchCategory && matchPremium;
  });

  // Tri des produits
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.downloads || 0) - (a.downloads || 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'name':
        return a.title.localeCompare(b.title);
      case 'newest':
      default:
        return b.id.localeCompare(a.id);
    }
  });

  const stats = {
    total: PRODUCTS.length,
    premium: PRODUCTS.filter(p => p.isPremium).length,
    free: PRODUCTS.filter(p => !p.isPremium).length,
    filtered: filteredProducts.length
  };

  return (
    <SavedProductsProvider>
      <LayoutWithSidebar>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Centre de formation</h1>
                <p className="text-muted-foreground">Formez-vous sur les sujets qui comptent vraiment pour votre business</p>
              </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-400 mb-1">
                  <Package className="w-4 h-4" />
                  <span className="text-sm font-medium">Total</span>
                </div>
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                <div className="text-xs text-muted-foreground">formations disponibles</div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-400 mb-1">
                  <Crown className="w-4 h-4" />
                  <span className="text-sm font-medium">Premium</span>
                </div>
                <div className="text-2xl font-bold text-foreground">{stats.premium}</div>
                <div className="text-xs text-muted-foreground">formations premium</div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-400 mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Gratuites</span>
                </div>
                <div className="text-2xl font-bold text-foreground">{stats.free}</div>
                <div className="text-xs text-muted-foreground">accès libre</div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 text-purple-400 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Résultats</span>
                </div>
                <div className="text-2xl font-bold text-foreground">{stats.filtered}</div>
                <div className="text-xs text-muted-foreground">formations trouvées</div>
              </div>
            </div>
          </div>

          {/* Filtres et contrôles */}
          <ProductFilters
            search={search}
            setSearch={setSearch}
            format={format}
            setFormat={setFormat}
            category={category}
            setCategory={setCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            showPremiumOnly={showPremiumOnly}
            setShowPremiumOnly={setShowPremiumOnly}
            viewMode={viewMode}
            setViewMode={setViewMode}
            formats={FORMATS}
            categories={CATEGORIES}
            sortOptions={SORT_OPTIONS}
            placeholder="Rechercher une formation..."
            labels={{
              filtersTitle: "Filtres et Recherche",
              premiumOnly: "Premium uniquement"
            }}
          />

          {/* Résultats */}
          <div className="mb-8">
            {search || category !== 'Tous' || format !== 'Tous' || showPremiumOnly ? (
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Résultats de recherche
              </h2>
            ) : (
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Toutes les Formations
              </h2>
            )}

            {sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Aucune formation trouvée</h3>
                <p className="text-muted-foreground mb-4">
                  Essayez de modifier vos critères de recherche ou vos filtres.
                </p>
                <button
                  onClick={() => {
                    setSearch('');
                    setCategory('Tous');
                    setFormat('Tous');
                    setShowPremiumOnly(false);
                  }}
                  className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {sortedProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    variant={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </LayoutWithSidebar>
    </SavedProductsProvider>
  );
} 