"use client";
import { useRouter } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import { Bookmark, ArrowLeft, Download, Eye, FileText, Clock, HardDrive, FileType, Check } from "lucide-react";
import { useSavedProducts } from "@/context/SavedProductsContext";
import Sidebar from "@/components/Sidebar";

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { savedProducts, toggleBookmark } = useSavedProducts();
  const product = PRODUCTS.find((p) => p.id === params.id);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="ml-0 md:ml-64 p-8">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Produit introuvable</h1>
            <button 
              onClick={() => router.back()}
              className="bg-[#ff0033] text-white px-6 py-3 rounded-lg hover:bg-[#cc0029] transition-colors"
            >
              Retour
            </button>
          </div>
        </main>
      </div>
    );
  }

  const isBookmarked = savedProducts.includes(product.id);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      
      <main className="ml-0 md:ml-64">
        {/* Header avec navigation */}
        <div className="bg-[#111111] border-b border-[#232323] px-6 py-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-[#00D2FF] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la bibliothèque
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{product.title}</h1>
              <p className="text-gray-400 text-lg">{product.subtitle}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleBookmark(product.id)}
                className={`p-3 rounded-lg border transition-colors ${
                  isBookmarked 
                    ? 'bg-[#00D2FF] border-[#00D2FF] text-black' 
                    : 'bg-[#1a1a1a] border-[#232323] text-white hover:border-[#00D2FF]'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
              
              <button className="bg-[#ff0033] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors flex items-center gap-2">
                <Download className="w-5 h-5" />
                Télécharger
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Colonne principale */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Image principale */}
                <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
                  <div className="aspect-video bg-[#1a1a1a] rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  
                  {/* Galerie d'images miniatures */}
                  {product.images && product.images.length > 1 && (
                    <div className="flex gap-3 mt-4">
                      {product.images.map((img, i) => (
                        <div key={i} className="w-20 h-20 bg-[#1a1a1a] rounded-lg border border-[#232323] overflow-hidden">
                          <img 
                            src={img} 
                            alt={`${product.title} preview ${i + 1}`} 
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Statistiques du produit */}
                <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
                  <h2 className="text-xl font-bold text-white mb-4">Informations du produit</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {product.pages && (
                      <div className="text-center">
                        <div className="bg-[#1a1a1a] rounded-lg p-4 mb-2">
                          <FileText className="w-6 h-6 text-[#00D2FF] mx-auto" />
                        </div>
                        <div className="text-2xl font-bold text-white">{product.pages}</div>
                        <div className="text-gray-400 text-sm">Pages</div>
                      </div>
                    )}
                    
                    {product.words && (
                      <div className="text-center">
                        <div className="bg-[#1a1a1a] rounded-lg p-4 mb-2">
                          <Clock className="w-6 h-6 text-[#00D2FF] mx-auto" />
                        </div>
                        <div className="text-2xl font-bold text-white">{product.words.toLocaleString()}</div>
                        <div className="text-gray-400 text-sm">Mots</div>
                      </div>
                    )}
                    
                    {product.size && (
                      <div className="text-center">
                        <div className="bg-[#1a1a1a] rounded-lg p-4 mb-2">
                          <HardDrive className="w-6 h-6 text-[#00D2FF] mx-auto" />
                        </div>
                        <div className="text-2xl font-bold text-white">{product.size}</div>
                        <div className="text-gray-400 text-sm">Taille</div>
                      </div>
                    )}
                    
                    {product.fileType && (
                      <div className="text-center">
                        <div className="bg-[#1a1a1a] rounded-lg p-4 mb-2">
                          <FileType className="w-6 h-6 text-[#00D2FF] mx-auto" />
                        </div>
                        <div className="text-2xl font-bold text-white">{product.fileType}</div>
                        <div className="text-gray-400 text-sm">Format</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
                  <h2 className="text-xl font-bold text-white mb-4">Description</h2>
                  <p className="text-gray-300 leading-relaxed">
                    {product.longDescription || product.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
                  <h2 className="text-xl font-bold text-white mb-4">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="bg-[#1a1a1a] text-[#00D2FF] px-3 py-1 rounded-full text-sm border border-[#232323]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar droite */}
              <div className="space-y-6">
                
                {/* Actions principales */}
                <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
                  <div className="space-y-4">
                    <button className="w-full bg-[#ff0033] text-white py-4 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors flex items-center justify-center gap-2 text-lg">
                      <Download className="w-5 h-5" />
                      Télécharger le produit
                    </button>
                    
                    <button className="w-full bg-[#1a1a1a] text-white py-3 rounded-lg font-semibold hover:bg-[#232323] transition-colors flex items-center justify-center gap-2 border border-[#232323]">
                      <Eye className="w-5 h-5" />
                      Aperçu
                    </button>
                  </div>
                </div>

                {/* Ce que contient le produit */}
                {product.details && product.details.length > 0 && (
                  <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
                    <h3 className="text-lg font-bold text-white mb-4">Ce produit contient</h3>
                    <ul className="space-y-2">
                      {product.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-300">
                          <Check className="w-5 h-5 text-[#00D2FF] mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Droits d'utilisation */}
                {product.rights && product.rights.length > 0 && (
                  <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
                    <h3 className="text-lg font-bold text-white mb-4">Vous êtes libre de</h3>
                    <ul className="space-y-2">
                      {product.rights.map((right, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-300">
                          <Check className="w-5 h-5 text-[#ff0033] mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{right}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Informations supplémentaires */}
                <div className="bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-2">Produit Premium</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Ce produit fait partie de notre collection premium avec droits de revente inclus.
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4" />
                    <span>Téléchargement immédiat</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 