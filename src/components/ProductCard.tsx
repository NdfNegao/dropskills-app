"use client";
import { Bookmark, BookOpen, Headphones, Video, FileDown, Heart, ExternalLink, MessageSquare, Layout, CheckSquare, PenTool, Bot, FileText, Play, Crown, Package, Clock, Users } from "lucide-react";
import { useSavedProducts } from "@/context/SavedProductsContext";
import { useLikedProducts } from '@/context/LikedProductsContext';
import { Product } from "@/data/products";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProductActions from './ProductActions';
import Link from 'next/link';
import ImageWithFallback from './ImageWithFallback';

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

export default function ProductCard({ product, onOpen, onDownload, bookmarkDisabled, variant = 'grid' }: {
  product: Product;
  onOpen?: () => void;
  onDownload?: () => void;
  bookmarkDisabled?: boolean;
  variant?: 'grid' | 'list';
}) {
  const router = useRouter();
  const { savedProducts, toggleBookmark } = useSavedProducts();
  const { likedProducts, toggleLike } = useLikedProducts();
  const [likes, setLikes] = useState(product.likes);
  const bookmarked = savedProducts.includes(product.id);
  // const liked = likedProducts.includes(product.id);

  // const handleBookmark = () => {
  //   if (bookmarkDisabled) return;
  //   toggleBookmark(product.id);
  // };

  // const handleOpen = () => {
  //   if (onOpen) {
  //     onOpen();
  //   } else {
  //     router.push(`/produits/${product.id}`);
  //   }
  // };

  return (
    variant === 'grid' ? (
      <div className="block group">
        <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-[#ff0033] transition-colors group-hover:shadow-lg">
          <div className="relative">
            <ImageWithFallback
              src={product.image}
              alt={product.title}
              width={400}
              height={225}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            {product.isPremium && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                Premium
              </div>
            )}
          </div>
          <div className="p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{product.title}</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{product.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{product.students} étudiants</span>
        </div>
      </div>
            <div className="flex justify-end mt-2">
              <ProductActions product={product} />
            </div>
            <Link href={`/produits/${product.id}`} className="mt-3 w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary">
              <ExternalLink className="w-4 h-4" />
              Voir
            </Link>
          </div>
        </div>
      </div>
    ) : (
      <div className="block group">
        <div className="bg-card border border-border rounded-xl flex overflow-hidden hover:border-[#ff0033] transition-colors group-hover:shadow-lg">
          <div className="relative w-48 min-w-[12rem] h-32 flex-shrink-0">
            <ImageWithFallback
          src={product.image} 
          alt={product.title} 
              width={192}
              height={128}
              className="w-full h-full object-cover rounded-t-lg"
            />
            {product.isPremium && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                Premium
        </div>
            )}
          </div>
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground line-clamp-1">{product.title}</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-2 line-clamp-1">
                {product.description}
              </p>
            </div>
            <div className="flex items-center gap-6 text-xs">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{product.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{product.students} étudiants</span>
              </div>
              <div className="flex-1 flex justify-end">
                <ProductActions product={product} />
          </div>
      </div>
            <Link href={`/produits/${product.id}`} className="mt-3 w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary">
            <ExternalLink className="w-4 h-4" />
          Voir
            </Link>
          </div>
        </div>
      </div>
    )
  );
}