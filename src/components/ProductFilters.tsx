import React from "react";
import { Search, Filter, Grid3X3, List } from "lucide-react";

interface ProductFiltersProps {
  search: string;
  setSearch: (v: string) => void;
  format: string;
  setFormat: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
  showPremiumOnly: boolean;
  setShowPremiumOnly: (v: boolean) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (v: 'grid' | 'list') => void;
  formats: string[];
  categories: string[];
  sortOptions: { value: string; label: string }[];
  placeholder?: string;
  labels?: {
    premiumOnly?: string;
    filtersTitle?: string;
  };
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  search,
  setSearch,
  format,
  setFormat,
  category,
  setCategory,
  sortBy,
  setSortBy,
  showPremiumOnly,
  setShowPremiumOnly,
  viewMode,
  setViewMode,
  formats,
  categories,
  sortOptions,
  placeholder = "Rechercher...",
  labels = {},
}) => {
  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-[#ff0033]" />
        <h2 className="text-lg font-semibold text-foreground">{labels.filtersTitle || "Filtres et Recherche"}</h2>
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            className={`p-2 rounded-lg border border-border ${viewMode === 'grid' ? 'bg-[#ff0033] text-white' : 'bg-card text-foreground'}`}
            onClick={() => setViewMode('grid')}
            aria-label="Affichage grille"
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button
            type="button"
            className={`p-2 rounded-lg border border-border ${viewMode === 'list' ? 'bg-[#ff0033] text-white' : 'bg-card text-foreground'}`}
            onClick={() => setViewMode('list')}
            aria-label="Affichage liste"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>
      {/* Première ligne : Recherche et tri */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder={placeholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#ff0033] transition-colors"
          />
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-[#ff0033] transition-colors"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      {/* Deuxième ligne : Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-[#ff0033] transition-colors"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={format}
          onChange={e => setFormat(e.target.value)}
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-[#ff0033] transition-colors"
        >
          {formats.map(fmt => (
            <option key={fmt} value={fmt}>{fmt}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-3 cursor-pointer hover:border-[#ff0033]">
          <input
            type="checkbox"
            checked={showPremiumOnly}
            onChange={e => setShowPremiumOnly(e.target.checked)}
            className="w-4 h-4 text-[#ff0033] bg-transparent border-gray-300 rounded focus:ring-[#ff0033]"
          />
          <span className="text-foreground text-sm">{labels.premiumOnly || "Premium uniquement"}</span>
        </label>
      </div>
    </div>
  );
};

export default ProductFilters; 