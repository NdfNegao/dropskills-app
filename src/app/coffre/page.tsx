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
  Crown
} from "lucide-react";

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
    title: "Stratégie Marketing Digital 2024",
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
    <LayoutWithSidebar>
      <div className="max-w-7xl mx-auto">
        {/* Header avec animation */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-xl flex items-center justify-center shadow-lg">
              <FolderOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Mon Coffre
              </h1>
              <p className="text-gray-400 text-lg">
                Vos ressources personnelles, favoris et outputs IA
              </p>
            </div>
          </div>

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

          {/* Statistiques avec animations */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: "Total", value: stats.total, icon: FolderOpen, color: "text-blue-400" },
              { label: "Favoris", value: stats.favorites, icon: Heart, color: "text-red-400" },
              { label: "Outputs IA", value: stats.aiOutputs, icon: Sparkles, color: "text-purple-400" },
              { label: "Téléchargements", value: stats.downloads, icon: Download, color: "text-green-400" },
              { label: "Étoilés", value: stats.starred, icon: Star, color: "text-yellow-400" }
            ].map((stat, index) => (
              <div 
                key={stat.label}
                className="bg-[#111111] border border-[#232323] rounded-xl p-4 hover:border-[#333] transition-all duration-200"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`flex items-center gap-2 ${stat.color} mb-2`}>
                  <stat.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </div>
            ))}
          </div>
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="p-4 border-b border-[#232323]">
        <div className="flex items-center justify-between mb-2">
          <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
            {getTypeIcon(resource.type)}
            <span className="capitalize">{resource.type.replace('_', ' ')}</span>
          </div>
          
          <button
            onClick={onStarToggle}
            className="p-1 hover:scale-110 transition-transform duration-200"
          >
            <Star className={`w-4 h-4 ${resource.isStarred ? 'text-yellow-500 fill-current animate-pulse' : 'text-gray-400'}`} />
          </button>
        </div>

        <h3 className="font-bold text-white mb-2 line-clamp-2">{resource.title}</h3>
        
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(resource.createdAt)}</span>
          <span>•</span>
          <span>{resource.source}</span>
        </div>
      </div>

      {/* Content Preview */}
      {resource.content && (
        <div className="p-4">
          <p className="text-gray-400 text-sm line-clamp-3 mb-3">
            {resource.content}
          </p>
          
          {resource.content.length > 100 && (
            <button
              onClick={() => setShowContent(!showContent)}
              className="text-[#ff0033] text-xs hover:underline"
            >
              {showContent ? 'Voir moins' : 'Voir plus'}
            </button>
          )}
        </div>
      )}

      {/* Tags */}
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-1">
          {resource.tags.slice(0, 3).map(tag => (
            <span key={tag} className="bg-[#1a1a1a] text-gray-400 text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className={`p-4 border-t border-[#232323] flex items-center justify-between transition-all duration-200 ${
        isHovered ? 'bg-[#0a0a0a]' : ''
      }`}>
        <span className="text-xs text-gray-500">{resource.category}</span>
        
        <div className="flex items-center gap-2">
          {resource.content && (
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-all duration-200 hover:scale-110"
              title="Copier le contenu"
            >
              <Copy className="w-4 h-4 text-gray-400" />
            </button>
          )}
          
          {resource.url && (
            <button
              onClick={() => window.open(resource.url, '_blank')}
              className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-all duration-200 hover:scale-110"
              title="Ouvrir"
            >
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </button>
          )}
          
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-500/10 rounded-lg transition-all duration-200 hover:scale-110"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
} 