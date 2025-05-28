"use client";
import { Bookmark, BookOpen, Headphones, Video, FileDown, Heart, ExternalLink } from "lucide-react";
import { useSavedProducts } from "@/context/SavedProductsContext";
import { Product } from "@/data/products";
import { useState } from "react";
import { useRouter } from "next/navigation";

function getFormatIcon(format: string) {
  switch (format) {
    case "ebook":
      return <BookOpen className="w-5 h-5 text-blue-400" />;
    case "audio":
      return <Headphones className="w-5 h-5 text-purple-400" />;
    case "video":
      return <Video className="w-5 h-5 text-green-400" />;
    case "template":
      return <FileDown className="w-5 h-5 text-orange-400" />;
    case "tool":
      return <FileDown className="w-5 h-5 text-pink-400" />;
    default:
      return <BookOpen className="w-5 h-5 text-blue-400" />;
  }
}

function getFormatColor(format: string) {
  switch (format) {
    case "ebook":
      return "from-blue-500 to-blue-600";
    case "audio":
      return "from-purple-500 to-purple-600";
    case "video":
      return "from-green-500 to-green-600";
    case "template":
      return "from-orange-500 to-orange-600";
    case "tool":
      return "from-pink-500 to-pink-600";
    default:
      return "from-blue-500 to-blue-600";
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
  const [likes, setLikes] = useState(product.likes);
  const [liked, setLiked] = useState(false);
  const bookmarked = savedProducts.includes(product.id);

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
      {/* Badge format (coin sup gauche) */}
      <div className="absolute top-3 left-3 z-10">
        <div className={`bg-gradient-to-r ${getFormatColor(product.format)} rounded-lg p-2 shadow-md flex items-center justify-center`}>
          {getFormatIcon(product.format)}
        </div>
      </div>

      {/* Actions en haut à droite */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        {/* Like */}
        <button
          onClick={() => { setLiked(!liked); setLikes(likes + (liked ? -1 : 1)); }}
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

      {/* Image de fond */}
      <div className="w-full aspect-video bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
        <img 
          src={product.image} 
          alt={product.title} 
          className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300" 
        />
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
            <span className="flex items-center gap-1">
              <Bookmark className="w-3 h-3" />
              {savedProducts.includes(product.id) ? 'Sauvé' : 'Sauver'}
            </span>
          </div>
          <span className="capitalize text-gray-500">
            {product.format}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleOpen}
            className="flex-1 bg-[#ff0033] text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Ouvrir
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