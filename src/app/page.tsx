'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
import HomePage from '@/components/HomePage';

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Si l'utilisateur est connecté, rediriger vers le dashboard
    if (status === 'authenticated' && session?.user) {
      const userRole = (session.user as any).role;
      
      // Redirection selon le rôle
      if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [session, status, router]);

  // Afficher la page d'accueil si pas connecté ou en cours de chargement
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff0033]"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <HomePage />;
  }

  // Pendant la redirection
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff0033] mx-auto mb-4"></div>
        <p className="text-gray-400">Redirection en cours...</p>
      </div>
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
