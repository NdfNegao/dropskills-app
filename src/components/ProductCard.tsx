"use client";
import { Bookmark, BookOpen, Headphones, Video, FileDown, Heart } from "lucide-react";
import { useSavedProducts } from "@/context/SavedProductsContext";
import { Product } from "@/data/products";
import { useState } from "react";

function getFormatIcon(format: string) {
  switch (format) {
    case "ebook":
      return <BookOpen className="w-6 h-6 text-black" />;
    case "audio":
      return <Headphones className="w-6 h-6 text-black" />;
    case "video":
      return <Video className="w-6 h-6 text-black" />;
    case "template":
      return <FileDown className="w-6 h-6 text-black" />;
    case "tool":
      return <FileDown className="w-6 h-6 text-black" />;
    default:
      return <BookOpen className="w-6 h-6 text-black" />;
  }
}

export default function ProductCard({ product, onOpen, onDownload, bookmarkDisabled }: {
  product: Product;
  onOpen?: () => void;
  onDownload?: () => void;
  bookmarkDisabled?: boolean;
}) {
  const { savedProducts, toggleBookmark } = useSavedProducts();
  const [likes, setLikes] = useState(product.likes);
  const [liked, setLiked] = useState(false);
  const bookmarked = savedProducts.includes(product.id);

  const handleBookmark = () => {
    if (bookmarkDisabled) return;
    toggleBookmark(product.id);
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-[#232323] group transition-all hover:shadow-2xl">
      {/* Icône format (coin sup gauche) */}
      <div className="absolute top-4 left-4 z-10 bg-[#f3f3f3] rounded-full p-2 shadow border border-gray-200 flex items-center justify-center">
        {getFormatIcon(product.format)}
      </div>
      {/* Actions en haut à droite */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {/* Like */}
        <button
          onClick={() => { setLiked(!liked); setLikes(likes + (liked ? -1 : 1)); }}
          className="bg-white rounded-full p-2 shadow border border-gray-200 hover:bg-gray-100 transition-colors flex items-center justify-center"
          aria-label="J'aime"
        >
          <Heart
            className={`w-6 h-6 ${liked ? 'fill-red-500 text-red-500' : 'text-black'}`}
          />
        </button>
        {/* Bookmark */}
        <button
          onClick={handleBookmark}
          className="bg-white rounded-full p-2 shadow border border-gray-200 hover:bg-gray-100 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Sauvegarder"
          disabled={!!bookmarkDisabled}
        >
          <Bookmark
            className={`w-6 h-6 ${bookmarked ? 'fill-black text-black' : 'text-black'}`}
          />
        </button>
      </div>
      {/* Image de fond */}
      <div className="w-full aspect-video bg-[#18181b] flex items-center justify-center">
        <img src={product.image} alt={product.title} className="object-contain h-full w-full" />
      </div>
      {/* Titre & sous-titre */}
      <div className="p-6 pb-4">
        <h3 className="font-bold text-xl text-[#111] mb-1 truncate">{product.title}</h3>
        <p className="text-gray-500 text-sm truncate mb-2">{product.subtitle}</p>
      </div>
      {/* Bas du bloc */}
      <div className="flex items-center border-t border-gray-100">
        {/* Ouvrir */}
        <button
          onClick={onOpen}
          className="flex-1 py-3 border-x border-gray-100 font-semibold text-[#111] hover:bg-gray-50 transition-colors"
        >
          Ouvrir
        </button>
        {/* Download */}
        <button
          onClick={onDownload}
          className="flex-1 flex items-center justify-center py-3 rounded-br-2xl text-[#111] hover:text-[#ff0033] transition-colors"
        >
          <FileDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}