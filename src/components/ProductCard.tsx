"use client";
import { Bookmark, BookOpen, Headphones, Video, FileDown, Heart, ExternalLink, MessageSquare, Layout, CheckSquare, PenTool, Bot, FileText, Play, Crown } from "lucide-react";
import { useSavedProducts } from "@/context/SavedProductsContext";
import { useLikedProducts } from '@/context/LikedProductsContext';
import { Product } from "@/data/products";
import { useState } from "react";
import { useRouter } from "next/navigation";

function getFormatIcon(format: string) {
  switch (format) {
    case "ebook":
    case "Book":
      return <BookOpen className="w-5 h-5 text-blue-400" />;
    case "audio":
    case "Audio":
      return <Headphones className="w-5 h-5 text-purple-400" />;
    case "video":
    case "Video":
    case "Formation":
    case "Course":
      return <Video className="w-5 h-5 text-green-400" />;
    case "template":
    case "Template":
      return <FileDown className="w-5 h-5 text-orange-400" />;
    case "tool":
      return <FileDown className="w-5 h-5 text-pink-400" />;
    case "Prompt Pack":
      return <MessageSquare className="w-5 h-5 text-cyan-400" />;
    case "Notion Template":
      return <Layout className="w-5 h-5 text-indigo-400" />;
    case "Checklist":
      return <CheckSquare className="w-5 h-5 text-emerald-400" />;
    case "Workbook":
      return <PenTool className="w-5 h-5 text-amber-400" />;
    case "GPT":
      return <Bot className="w-5 h-5 text-violet-400" />;
    case "Guide":
      return <FileText className="w-5 h-5 text-slate-400" />;
    default:
      return <BookOpen className="w-5 h-5 text-blue-400" />;
  }
}

function getFormatColor(format: string) {
  switch (format) {
    case "ebook":
    case "Book":
      return "from-blue-500 to-blue-600";
    case "audio":
    case "Audio":
      return "from-purple-500 to-purple-600";
    case "video":
    case "Video":
    case "Formation":
    case "Course":
      return "from-green-500 to-green-600";
    case "template":
    case "Template":
      return "from-orange-500 to-orange-600";
    case "tool":
      return "from-pink-500 to-pink-600";
    case "Prompt Pack":
      return "from-cyan-500 to-cyan-600";
    case "Notion Template":
      return "from-indigo-500 to-indigo-600";
    case "Checklist":
      return "from-emerald-500 to-emerald-600";
    case "Workbook":
      return "from-amber-500 to-amber-600";
    case "GPT":
      return "from-violet-500 to-violet-600";
    case "Guide":
      return "from-slate-500 to-slate-600";
    default:
      return "from-blue-500 to-blue-600";
  }
}

function getFormatBadge(format: string) {
  switch (format) {
    case "ebook":
    case "Book":
      return { label: "Ebook", color: "bg-blue-500/20 text-blue-400" };
    case "audio":
    case "Audio":
      return { label: "Audio", color: "bg-purple-500/20 text-purple-400" };
    case "video":
    case "Video":
    case "Formation":
    case "Course":
      return { label: "Vidéo", color: "bg-green-500/20 text-green-400" };
    case "template":
    case "Template":
      return { label: "Template", color: "bg-orange-500/20 text-orange-400" };
    case "tool":
      return { label: "Outil", color: "bg-pink-500/20 text-pink-400" };
    case "Prompt Pack":
      return { label: "Prompts", color: "bg-cyan-500/20 text-cyan-400" };
    case "Notion Template":
      return { label: "Notion", color: "bg-indigo-500/20 text-indigo-400" };
    case "Checklist":
      return { label: "Checklist", color: "bg-emerald-500/20 text-emerald-400" };
    case "Workbook":
      return { label: "Workbook", color: "bg-amber-500/20 text-amber-400" };
    case "GPT":
      return { label: "GPT", color: "bg-violet-500/20 text-violet-400" };
    case "Guide":
      return { label: "Guide", color: "bg-slate-500/20 text-slate-400" };
    default:
      return { label: "Ebook", color: "bg-blue-500/20 text-blue-400" };
  }
}

function getDefaultImage(format: string) {
  switch (format) {
    case "ebook":
    case "Book":
      return "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80";
    case "audio":
    case "Audio":
      return "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80";
    case "video":
    case "Video":
    case "Formation":
    case "Course":
      return "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80";
    case "template":
    case "Template":
      return "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80";
    case "tool":
      return "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80";
    case "Prompt Pack":
      return "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80";
    case "Notion Template":
      return "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80";
    case "Checklist":
      return "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80";
    case "Workbook":
      return "https://images.unsplash.com/photo-1515168833906-d2a3b82b302b?auto=format&fit=crop&w=400&q=80";
    case "GPT":
      return "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80";
    case "Guide":
      return "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80";
    default:
      return "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80";
  }
}

export default function ProductCard({ product, onOpen, onDownload, bookmarkDisabled }: {
  product: Product;
  onOpen?: () => void;
  onDownload?: () => void;
  bookmarkDisabled?: boolean;
}) {
  const router = useRouter();
  const { savedProducts, toggleBookmark } = useSavedProducts();
  const { likedProducts, toggleLike } = useLikedProducts();
  const [likes, setLikes] = useState(product.likes);
  const bookmarked = savedProducts.includes(product.id);
  const liked = likedProducts.includes(product.id);

  const handleBookmark = () => {
    if (bookmarkDisabled) return;
    toggleBookmark(product.id);
  };

  const handleOpen = () => {
    if (onOpen) {
      onOpen();
    } else {
      router.push(`/produits/${product.id}`);
    }
  };

  return (
    <div className="relative bg-[#111111] border border-[#232323] rounded-xl overflow-hidden group transition-all hover:border-[#333] hover:shadow-lg">
      {/* Image de fond */}
      <div className="w-full aspect-video bg-[#1a1a1a] flex items-center justify-center overflow-hidden relative">
        {/* Badge Premium en bas à droite de l'image */}
        {product.isPremium && (
          <div className="absolute bottom-3 right-3 z-10">
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium flex items-center gap-1 shadow">
              <Crown className="w-4 h-4" /> Premium
            </span>
          </div>
        )}
        {/* Badge format texte en haut à gauche de l'image */}
        <div className="absolute top-3 left-3 z-10">
          {(() => {
            const badge = getFormatBadge(product.format);
            return (
              <span className={`px-3 py-1 rounded-full text-xs font-bold shadow ${badge.color}`}>
                {badge.label}
              </span>
            );
          })()}
        </div>
        {(!product.image || product.image.includes('/api/placeholder')) ? (
          <img
            src={getDefaultImage(product.format)}
            alt={product.title}
            className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <img 
            src={product.image} 
            alt={product.title} 
            className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300" 
          />
        )}
      </div>

      {/* Actions en haut à droite */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        {/* Like */}
        <button
          onClick={() => toggleLike(product.id)}
          className="bg-[#1a1a1a] border border-[#333] rounded-lg p-2 hover:bg-[#232323] transition-colors flex items-center justify-center"
          aria-label="J'aime"
        >
          <Heart
            className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}`}
          />
        </button>
        
        {/* Bookmark */}
        <button
          onClick={handleBookmark}
          className="bg-[#1a1a1a] border border-[#333] rounded-lg p-2 hover:bg-[#232323] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Sauvegarder"
          disabled={!!bookmarkDisabled}
        >
          <Bookmark
            className={`w-4 h-4 ${bookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}
          />
        </button>
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Titre & sous-titre */}
        <div className="mb-4">
          <h3 className="font-bold text-lg text-white mb-1 line-clamp-2 leading-tight">
            {product.title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
            {product.subtitle}
          </p>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {product.tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index}
                className="text-xs bg-[#232323] text-gray-300 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {product.tags.length > 2 && (
              <span className="text-xs text-gray-500">
                +{product.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {likes}
            </span>
            {product.downloads && (
              <span className="flex items-center gap-1">
                <FileDown className="w-3 h-3" />
                {product.downloads}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
        <button
          onClick={handleOpen}
            className="flex-1 bg-[#ff0033] text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors flex items-center justify-center gap-2"
        >
            <ExternalLink className="w-4 h-4" />
          Voir
        </button>
          
          {onDownload && (
        <button
          onClick={onDownload}
              className="bg-[#1a1a1a] border border-[#333] text-gray-300 p-2.5 rounded-lg hover:bg-[#232323] hover:text-white transition-colors flex items-center justify-center"
              aria-label="Télécharger"
        >
              <FileDown className="w-4 h-4" />
        </button>
          )}
        </div>
      </div>
    </div>
  );
}