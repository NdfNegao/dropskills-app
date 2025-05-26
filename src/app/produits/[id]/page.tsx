"use client";
import { useRouter } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import { Bookmark } from "lucide-react";
import { useSavedProducts } from "@/context/SavedProductsContext";

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { savedProducts, toggleBookmark } = useSavedProducts();
  const product = PRODUCTS.find((p) => p.id === params.id);
  if (!product) return <div className="text-white p-10">Produit introuvable.</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-[#ff0033] mb-6 flex items-center gap-2 text-sm">&larr; Retour à la bibliothèque</button>
        <div className="flex flex-col md:flex-row gap-10">
          {/* Colonne principale */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags.map((tag) => (
                <span key={tag} className="bg-[#18181b] text-xs text-white px-3 py-1 rounded-full border border-[#232323]">{tag}</span>
              ))}
            </div>
            <p className="text-gray-300 mb-6 text-lg">{product.shortDescription}</p>
            {/* Infos clés */}
            <div className="flex gap-6 mb-8">
              <div className="flex flex-col items-center">
                <span className="text-white font-bold text-lg">{product.pages}</span>
                <span className="text-gray-400 text-xs">Pages</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-white font-bold text-lg">{product.words}</span>
                <span className="text-gray-400 text-xs">Mots</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-white font-bold text-lg">{product.size}</span>
                <span className="text-gray-400 text-xs">Taille</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-white font-bold text-lg">{product.fileType}</span>
                <span className="text-gray-400 text-xs">Format</span>
              </div>
            </div>
            {/* Galerie d'images */}
            <div className="mb-8">
              <img src={product.images[0]} alt={product.title} className="rounded-xl w-full max-h-96 object-contain bg-[#18181b] mb-4" />
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <img key={i} src={img} alt={product.title} className="w-20 h-20 object-contain rounded-lg bg-[#18181b] border border-[#232323]" />
                ))}
              </div>
            </div>
            {/* Description longue */}
            <div className="bg-white text-[#111] rounded-2xl p-6 shadow mb-8">
              <h2 className="font-bold text-xl mb-2">Description</h2>
              <p className="text-base">{product.longDescription}</p>
            </div>
          </div>
          {/* Sidebar droite */}
          <aside className="w-full md:w-[350px] flex flex-col gap-6">
            <div className="bg-[#18181b] rounded-2xl shadow-md p-6 border border-[#232323]">
              <button onClick={() => toggleBookmark(product.id)} className="absolute top-6 right-6 bg-[#0a0a0a] rounded-full p-2 border border-[#232323] hover:bg-[#ff0033] transition-colors">
                <Bookmark className={`w-6 h-6 ${savedProducts.includes(product.id) ? 'fill-white' : ''}`} />
              </button>
              <button className="w-full bg-[#ff0033] text-white py-3 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors text-base mb-4">Télécharger le produit</button>
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2 text-white">Ce produit contient</h3>
                <ul className="text-gray-300 text-sm list-disc pl-5">
                  {product.details.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </div>
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2 text-white">Vous êtes libre de</h3>
                <ul className="text-[#ff0033] text-sm list-disc pl-5">
                  {product.rights.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
} 