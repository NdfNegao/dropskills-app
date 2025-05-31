"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import LayoutWithSidebar from "@/components/LayoutWithSidebar";
import { 
  FolderOpen, 
  Heart, 
  Download, 
  FileText, 
  Sparkles, 
  Clock,
  Star,
  Trash2,
  Eye,
  Copy,
  ExternalLink,
  Filter,
  Search,
  Calendar,
  Tag,
  Archive,
  BookOpen,
  Zap,
  Crown,
  Bookmark
} from "lucide-react";
import { useSavedProducts, SavedProductsProvider } from '@/context/SavedProductsContext';
import { useLikedProducts, LikedProductsProvider } from '@/context/LikedProductsContext';
import { PRODUCTS } from '@/data/products';

export const dynamic = 'force-dynamic';

// Types pour les ressources
interface Resource {
  id: string;
  title: string;
  type: 'favorite' | 'ai_output' | 'download' | 'document';
  content?: string;
  url?: string;
  category: string;
  tags: string[];
  createdAt: string;
  size?: string;
  source: string;
  isStarred: boolean;
}

// Données simulées
const MOCK_RESOURCES: Resource[] = [
  {
    id: "1",
    title: "Stratégie Marketing Digital 2025",
    type: "ai_output",
    content: "Plan marketing complet généré par l'IA pour une startup tech...",
    category: "Marketing",
    tags: ["IA", "Stratégie", "Digital"],
    createdAt: "2024-01-15T10:30:00Z",
    source: "ICP Maker",
    isStarred: true
  },
  {
    id: "2",
    title: "Copywriting Persuasif Avancé",
    type: "favorite",
    url: "/universite/cours/copywriting-avance",
    category: "Formation",
    tags: ["Copywriting", "Vente"],
    createdAt: "2024-01-14T15:20:00Z",
    source: "Université",
    isStarred: false
  },
  {
    id: "3",
    title: "Template Email Sequence",
    type: "download",
    url: "/downloads/email-template.pdf",
    category: "Template",
    tags: ["Email", "Template", "Marketing"],
    createdAt: "2024-01-13T09:15:00Z",
    size: "2.3 MB",
    source: "CopyMoneyMail",
    isStarred: true
  },
  {
    id: "4",
    title: "Analyse Concurrentielle IA",
    type: "ai_output",
    content: "Rapport détaillé sur 15 concurrents principaux avec recommandations...",
    category: "Analyse",
    tags: ["Concurrence", "IA", "Rapport"],
    createdAt: "2024-01-12T14:45:00Z",
    source: "Veille Stratégique",
    isStarred: false
  },
  {
    id: "5",
    title: "Guide Personal Branding",
    type: "document",
    content: "Document personnel sur le développement de marque personnelle...",
    category: "Branding",
    tags: ["Branding", "Personnel", "Guide"],
    createdAt: "2024-01-11T11:30:00Z",
    source: "Notes personnelles",
    isStarred: true
  }
];

const CATEGORIES = ["Tous", "Marketing", "Formation", "Template", "Analyse", "Branding"];
const TYPES = ["Tous", "Favoris", "Outputs IA", "Téléchargements", "Documents"];

export default function CoffrePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES);
  const [filteredResources, setFilteredResources] = useState<Resource[]>(MOCK_RESOURCES);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedType, setSelectedType] = useState("Tous");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { savedProducts } = useSavedProducts();
  const { likedProducts } = useLikedProducts();

  // Récupérer les produits favoris (bookmarkés)
  const bookmarkedProducts = PRODUCTS.filter(p => savedProducts.includes(p.id));
  // Récupérer les produits likés
  const likedProductsList = PRODUCTS.filter(p => likedProducts.includes(p.id));
  // Éviter les doublons avec les ressources déjà présentes
  const resourceUrls = resources.map(r => r.url).filter(Boolean);
  const uniqueBookmarked = bookmarkedProducts.filter(p => !resourceUrls.includes(`/produits/${p.id}`));
  // Éviter les doublons entre favoris et likes
  const uniqueLiked = likedProductsList.filter(p => !savedProducts.includes(p.id) && !resourceUrls.includes(`/produits/${p.id}`));

  // Redirection si non connecté
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/dev-login');
    }
  }, [isAuthenticated, router]);

  // Filtrage des ressources
  useEffect(() => {
    let filtered = resources;

    if (selectedCategory !== "Tous") {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    if (selectedType !== "Tous") {
      const typeMap = {
        "Favoris": "favorite",
        "Outputs IA": "ai_output", 
        "Téléchargements": "download",
        "Documents": "document"
      };
      filtered = filtered.filter(resource => resource.type === typeMap[selectedType as keyof typeof typeMap]);
    }

    if (searchTerm) {
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        resource.source.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredResources(filtered);
  }, [resources, selectedCategory, selectedType, searchTerm]);

  const handleStarToggle = (resourceId: string) => {
    setResources(prev => 
      prev.map(resource => 
        resource.id === resourceId 
          ? { ...resource, isStarred: !resource.isStarred }
          : resource
      )
    );
  };

  const handleDelete = (resourceId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette ressource ?')) {
      setResources(prev => prev.filter(resource => resource.id !== resourceId));
    }
  };

  const stats = {
    total: resources.length,
    favorites: resources.filter(r => r.type === 'favorite').length,
    aiOutputs: resources.filter(r => r.type === 'ai_output').length,
    downloads: resources.filter(r => r.type === 'download').length,
    starred: resources.filter(r => r.isStarred).length
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <LikedProductsProvider>
      <SavedProductsProvider>
        <LayoutWithSidebar>
          <div className="max-w-3xl mx-auto py-8 px-2 md:px-0">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Coffre</h1>
                  <p className="text-gray-400">Vos ressources et favoris</p>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-400 mb-1">
                  <FolderOpen className="w-4 h-4" />
                  <span className="text-sm font-medium">Total</span>
                </div>
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-xs text-gray-400">ressources</div>
              </div>
              <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-400 mb-1">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-medium">Étoilés</span>
                </div>
                <div className="text-2xl font-bold text-white">{stats.starred}</div>
                <div className="text-xs text-gray-400">favoris</div>
              </div>
              <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-400 mb-1">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm font-medium">Favoris</span>
                </div>
                <div className="text-2xl font-bold text-white">{stats.favorites}</div>
                <div className="text-xs text-gray-400">produits</div>
              </div>
              <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
                <div className="flex items-center gap-2 text-purple-400 mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Outputs IA</span>
                </div>
                <div className="text-2xl font-bold text-white">{stats.aiOutputs}</div>
                <div className="text-xs text-gray-400">générés</div>
              </div>
            </div>

            {/* Section Favoris (produits bookmarkés) */}
            {uniqueBookmarked.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Bookmark className="w-6 h-6 text-yellow-400" /> Favoris
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {uniqueBookmarked.map(product => (
                    <div key={product.id} className="relative bg-[#111111] border border-[#232323] rounded-xl overflow-hidden group transition-all hover:border-[#333] hover:shadow-lg">
                      <img
                        src={(!product.image || product.image.includes('/api/placeholder')) ?
                          (product.format === 'ebook' || product.format === 'Book' ? 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80'
                          : product.format === 'audio' || product.format === 'Audio' ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80'
                          : product.format === 'video' || product.format === 'Video' || product.format === 'Formation' || product.format === 'Course' ? 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80'
                          : 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80')
                          : product.image}
                        alt={product.title}
                        className="object-cover h-40 w-full"
                      />
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-3 py-1 rounded-full text-xs font-bold shadow bg-yellow-500/20 text-yellow-400">Favori</span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-white mb-1 line-clamp-2 leading-tight">{product.title}</h3>
                        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{product.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section Produits Likés */}
            {uniqueLiked.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-red-400" /> Produits Likés
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {uniqueLiked.map(product => (
                    <div key={product.id} className="relative bg-[#111111] border border-[#232323] rounded-xl overflow-hidden group transition-all hover:border-[#333] hover:shadow-lg">
                      <img
                        src={(!product.image || product.image.includes('/api/placeholder')) ?
                          (product.format === 'ebook' || product.format === 'Book' ? 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80'
                          : product.format === 'audio' || product.format === 'Audio' ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80'
                          : product.format === 'video' || product.format === 'Video' || product.format === 'Formation' || product.format === 'Course' ? 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80'
                          : 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80')
                          : product.image}
                        alt={product.title}
                        className="object-cover h-40 w-full"
                      />
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-3 py-1 rounded-full text-xs font-bold shadow bg-red-500/20 text-red-400">Liké</span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-white mb-1 line-clamp-2 leading-tight">{product.title}</h3>
                        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{product.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Badge Premium avec animation */}
            <div className="flex items-center gap-4 mb-6">
              <div className="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400">
                <Crown className="w-4 h-4" />
                <span>Espace Personnel Sécurisé</span>
              </div>
              
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="bg-[#111111] border border-[#333] text-white px-4 py-2 rounded-lg hover:border-[#ff0033] transition-all duration-200"
              >
                {viewMode === 'grid' ? 'Vue Liste' : 'Vue Grille'}
              </button>
            </div>

            {/* Filtres avec animations */}
            <div className="bg-[#111111] border border-[#232323] rounded-xl p-6 mb-8 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher dans vos ressources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff0033] transition-all duration-200 focus:scale-105"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033] transition-all duration-200 hover:scale-105"
                >
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033] transition-all duration-200 hover:scale-105"
                >
                  {TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grille/Liste de ressources */}
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {filteredResources.map((resource, index) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  viewMode={viewMode}
                  onStarToggle={() => handleStarToggle(resource.id)}
                  onDelete={() => handleDelete(resource.id)}
                  index={index}
                />
              ))}
            </div>

            {filteredResources.length === 0 && (
              <div className="text-center py-12 animate-fade-in">
                <FolderOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Aucune ressource trouvée</h3>
                <p className="text-gray-400 mb-6">Commencez à utiliser les outils IA pour générer du contenu</p>
                <button
                  onClick={() => router.push('/outils')}
                  className="bg-gradient-to-r from-[#ff0033] to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
                >
                  <Sparkles className="w-4 h-4" />
                  Découvrir les Outils IA
                </button>
              </div>
            )}
          </div>
        </LayoutWithSidebar>
      </SavedProductsProvider>
    </LikedProductsProvider>
  );
}

interface ResourceCardProps {
  resource: Resource;
  viewMode: 'grid' | 'list';
  onStarToggle: () => void;
  onDelete: () => void;
  index: number;
}

function ResourceCard({ resource, viewMode, onStarToggle, onDelete, index }: ResourceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'favorite': return <Heart className="w-4 h-4" />;
      case 'ai_output': return <Sparkles className="w-4 h-4" />;
      case 'download': return <Download className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'favorite': return 'text-red-400 bg-red-500/10';
      case 'ai_output': return 'text-purple-400 bg-purple-500/10';
      case 'download': return 'text-green-400 bg-green-500/10';
      case 'document': return 'text-blue-400 bg-blue-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleCopy = async () => {
    if (resource.content) {
      await navigator.clipboard.writeText(resource.content);
      // Feedback visuel
    }
  };

  if (viewMode === 'list') {
    return (
      <div
        className="bg-[#111111] border border-[#232323] rounded-xl p-4 hover:border-[#333] transition-all duration-200 hover:scale-[1.02]"
        style={{ animationDelay: `${index * 50}ms` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-4">
          {/* Type Icon */}
          <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
            {getTypeIcon(resource.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-white truncate">{resource.title}</h3>
              {resource.isStarred && (
                <Star className="w-4 h-4 text-yellow-500 fill-current animate-pulse" />
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{resource.source}</span>
              <span>{formatDate(resource.createdAt)}</span>
              <span>{resource.category}</span>
            </div>
          </div>

          {/* Actions */}
          <div className={`flex items-center gap-2 transition-all duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <button
              onClick={onStarToggle}
              className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
            >
              <Star className={`w-4 h-4 ${resource.isStarred ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
            </button>
            
            {resource.content && (
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4 text-gray-400" />
              </button>
            )}
            
            <button
              onClick={onDelete}
              className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-[#111111] border border-[#232323] rounded-xl overflow-hidden transition-all duration-300 hover:border-[#333] hover:scale-105 hover:shadow-xl"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center gap-4">
        {/* Type Icon */}
        <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
          {getTypeIcon(resource.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white truncate">{resource.title}</h3>
            {resource.isStarred && (
              <Star className="w-4 h-4 text-yellow-500 fill-current animate-pulse" />
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{resource.source}</span>
            <span>{formatDate(resource.createdAt)}</span>
            <span>{resource.category}</span>
          </div>
        </div>

        {/* Actions */}
        <div className={`flex items-center gap-2 transition-all duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={onStarToggle}
            className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
          >
            <Star className={`w-4 h-4 ${resource.isStarred ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
          </button>
          
          {resource.content && (
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4 text-gray-400" />
            </button>
          )}
          
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}