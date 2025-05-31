import { Heart, Download, Crown } from "lucide-react";
import { useSavedProducts } from "@/context/SavedProductsContext";
import { useLikedProducts } from '@/context/LikedProductsContext';
import { Product } from "@/data/products";
import React from "react";

interface ProductActionsProps {
  product: Product;
  onDownload?: () => void;
  showPremium?: boolean;
  className?: string;
}

const ProductActions: React.FC<ProductActionsProps> = ({ product, onDownload, showPremium = false, className = "" }) => {
  const { savedProducts, toggleBookmark } = useSavedProducts();
  const { likedProducts, toggleLike } = useLikedProducts();
  const bookmarked = savedProducts.includes(product.id);
  const liked = likedProducts.includes(product.id);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Like/Favori */}
      <button
        onClick={() => toggleLike(product.id)}
        className="p-2 rounded-lg border border-border bg-card hover:bg-[#ff0033]/10 transition-colors"
        aria-label={liked ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <Heart className={`w-5 h-5 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-400'}`} />
      </button>
      {/* Télécharger */}
      {onDownload && (
        <button
          onClick={onDownload}
          className="p-2 rounded-lg border border-border bg-card hover:bg-[#ff0033]/10 transition-colors"
          aria-label="Télécharger"
        >
          <Download className="w-5 h-5 text-muted-foreground" />
        </button>
      )}
      {/* Badge Premium */}
      {showPremium && product.isPremium && (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#ff0033] text-white rounded text-xs font-medium">
          <Crown className="w-4 h-4" /> Premium
        </span>
      )}
    </div>
  );
};

export default ProductActions; 