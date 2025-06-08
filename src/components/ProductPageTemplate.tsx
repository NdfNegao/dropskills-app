'use client';

import React, { useState } from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { 
  ArrowLeft,
  Download,
  Heart,
  Share2,
  FileText,
  Clock,
  Users,
  Star,
  CheckCircle,
  X,
  Copy,
  ExternalLink,
  Zap,
  Shield,
  Sparkles,
  Target,
  Mail,
  TrendingUp,
  Volume2,
  Layout,
  Calendar,
  BarChart,
  MessageSquare,
  FolderOpen,
  BookOpen,
  PenTool,
  CheckSquare,
  Layers,
  Printer,
  Bot,
  Play,
  Calculator,
  Presentation,
  Brain
} from 'lucide-react';
import Link from 'next/link';
import ProductActions from './ProductActions';
import { Product } from '@/data/products';

// Composant YouTubePlayer
interface YouTubePlayerProps {
  videoUrl: string;
  title: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoUrl, title }) => {
  // Extraire l'ID de la vidéo YouTube depuis l'URL
  const getYouTubeVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);

  if (!videoId) {
    return (
      <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">URL vidéo YouTube invalide</p>
      </div>
    );
  }

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`}
        title={title}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

// Fonction pour convertir les noms d'icônes en composants
function getIconComponent(iconName: string) {
  const iconMap: { [key: string]: React.ReactNode } = {
    FileText: <FileText className="w-5 h-5" />,
    Target: <Target className="w-5 h-5" />,
    Zap: <Zap className="w-5 h-5" />,
    Users: <Users className="w-5 h-5" />,
    Brain: <Brain className="w-5 h-5" />,
    TrendingUp: <TrendingUp className="w-5 h-5" />,
    CheckCircle: <CheckCircle className="w-5 h-5" />,
    Volume2: <Volume2 className="w-5 h-5" />,
    Clock: <Clock className="w-5 h-5" />,
    Mail: <Mail className="w-5 h-5" />,
    Sparkles: <Sparkles className="w-5 h-5" />,
    Shield: <Shield className="w-5 h-5" />,
    Layout: <Layout className="w-5 h-5" />,
    Calendar: <Calendar className="w-5 h-5" />,
    BarChart: <BarChart className="w-5 h-5" />,
    MessageSquare: <MessageSquare className="w-5 h-5" />,
    FolderOpen: <FolderOpen className="w-5 h-5" />,
    BookOpen: <BookOpen className="w-5 h-5" />,
    PenTool: <PenTool className="w-5 h-5" />,
    CheckSquare: <CheckSquare className="w-5 h-5" />,
    Layers: <Layers className="w-5 h-5" />,
    ExternalLink: <ExternalLink className="w-5 h-5" />,
    Printer: <Printer className="w-5 h-5" />,
    Bot: <Bot className="w-5 h-5" />,
    Play: <Play className="w-5 h-5" />,
    Download: <Download className="w-5 h-5" />,
    Calculator: <Calculator className="w-5 h-5" />,
    Presentation: <Presentation className="w-5 h-5" />
  };
  
  return iconMap[iconName] || <FileText className="w-5 h-5" />;
}



interface ProductPageTemplateProps {
  product: Product;
  backUrl?: string;
  backLabel?: string;
}

export default function ProductPageTemplate({ 
  product, 
  backUrl = "/", 
  backLabel = "Back to Library" 
}: ProductPageTemplateProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: Implémenter la sauvegarde
  };

  const handleDownload = () => {
    // TODO: Implémenter le téléchargement
    window.open(product.downloadUrl, '_blank');
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // TODO: Ajouter une notification de succès
  };

  return (
    <LayoutWithSidebar>
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link 
            href={backUrl}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                {product.title}
              </h1>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-[#1a1a1a] border border-[#333] rounded-full text-sm text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-gray-300 text-lg leading-relaxed max-w-4xl">
                {product.description}
              </p>

              {/* Informations instructeur et durée */}
              {(product.instructor || product.duration) && (
                <div className="flex items-center gap-6 mt-4 text-sm text-gray-400">
                  {product.instructor && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Par {product.instructor}</span>
                    </div>
                  )}
                  {product.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{product.duration}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <ProductActions product={product} onDownload={handleDownload} showPremium />
              <button
                onClick={handleSave}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  isSaved 
                    ? 'bg-[#ff0033] border-[#ff0033] text-white' 
                    : 'bg-[#111111] border-[#333] text-gray-400 hover:text-white hover:border-[#ff0033]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={handleShare}
                className="p-3 bg-[#111111] border border-[#333] rounded-lg text-gray-400 hover:text-white hover:border-[#ff0033] transition-all duration-200"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {product.pages && (
              <div className="flex items-center gap-3 p-4 bg-[#111111] border border-[#232323] rounded-lg">
                <FileText className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-sm text-gray-400">Pages</div>
                  <div className="text-xl font-bold text-white">{product.pages}</div>
                </div>
              </div>
            )}
            {product.words && (
              <div className="flex items-center gap-3 p-4 bg-[#111111] border border-[#232323] rounded-lg">
                <FileText className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-sm text-gray-400">Words</div>
                  <div className="text-xl font-bold text-white">{product.words.toLocaleString()}</div>
                </div>
              </div>
            )}
            {product.size && (
              <div className="flex items-center gap-3 p-4 bg-[#111111] border border-[#232323] rounded-lg">
                <Download className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-sm text-gray-400">Size</div>
                  <div className="text-xl font-bold text-white">{product.size}</div>
                </div>
              </div>
            )}
            {product.fileType && (
              <div className="flex items-center gap-3 p-4 bg-[#111111] border border-[#232323] rounded-lg">
                <FileText className="w-5 h-5 text-orange-400" />
                <div>
                  <div className="text-sm text-gray-400">File Type</div>
                  <div className="text-xl font-bold text-white">{product.fileType}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Aperçu */}
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <h2 className="text-xl font-semibold text-white mb-6">Aperçu du produit</h2>
              
              {/* Vidéo ou Image principale */}
              <div className="relative mb-6">
                {product.videoUrl ? (
                  <YouTubePlayer 
                    videoUrl={product.videoUrl} 
                    title={product.title}
                  />
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
                    <img 
                      src={product.previewImages?.[selectedPreview] || '/api/placeholder/800/450'}
                      alt={`Aperçu ${selectedPreview + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Miniatures */}
              {product.previewImages && product.previewImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.previewImages?.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPreview(index)}
                      className={`aspect-video rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedPreview === index 
                          ? 'border-[#ff0033]' 
                          : 'border-[#333] hover:border-[#555]'
                      }`}
                    >
                      <img 
                        src={image}
                        alt={`Miniature ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fonctionnalités */}
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <h2 className="text-xl font-semibold text-white mb-6">Ce que contient ce produit</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.features?.map((feature: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-[#1a1a1a] rounded-lg">
                    <div className="text-[#ff0033] mt-1">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Aperçu mobile */}
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 overflow-hidden">
                <img 
                  src={product.previewImages[0] || '/api/placeholder/300/300'}
                  alt="Aperçu mobile"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <button
                onClick={handleSave}
                className={`w-full mb-3 py-2 px-4 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 ${
                  isSaved 
                    ? 'bg-[#ff0033] border-[#ff0033] text-white' 
                    : 'bg-transparent border-[#333] text-gray-400 hover:text-white hover:border-[#ff0033]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Sauvegardé' : 'Sauvegarder'}
              </button>

              <button
                onClick={handleDownload}
                className="w-full bg-[#ff0033] hover:bg-[#cc0029] text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Télécharger le produit
              </button>
            </div>

            {/* Permissions */}
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <h3 className="text-lg font-semibold text-white mb-4">Vous êtes libre de</h3>
              
              <div className="space-y-3">
                {product.permissions.map((permission, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{permission}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistiques */}
            {(product.rating || product.downloads) && (
              <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
                <h3 className="text-lg font-semibold text-white mb-4">Statistiques</h3>
                
                <div className="space-y-4">
                  {product.rating && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Note moyenne</span>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white font-medium">{product.rating}/5</span>
                      </div>
                    </div>
                  )}
                  
                  {product.downloads && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Téléchargements</span>
                      <span className="text-white font-medium">{product.downloads.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de partage */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] rounded-xl p-6 border border-[#232323] max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Partager ce produit</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                <input
                  type="text"
                  value={window.location.href}
                  readOnly
                  className="flex-1 bg-transparent text-gray-300 text-sm"
                />
                <button
                  onClick={() => copyToClipboard(window.location.href)}
                  className="text-[#ff0033] hover:text-[#cc0029] transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 p-3 bg-[#1a1a1a] rounded-lg text-gray-300 hover:text-white transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  Twitter
                </button>
                <button className="flex items-center justify-center gap-2 p-3 bg-[#1a1a1a] rounded-lg text-gray-300 hover:text-white transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  LinkedIn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </LayoutWithSidebar>
  );
}