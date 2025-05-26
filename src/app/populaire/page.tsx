'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';

const products = [
  {
    id: 1,
    title: "The 6-Day YouTube Accelerator",
    image: "/mock/youtube-accelerator.jpg",
    description: "Boostez votre chaîne YouTube en 6 jours avec ce plan d'action.",
    likes: 0
  },
  {
    id: 2,
    title: "Interview Success Blueprint",
    image: "/mock/interview-success.jpg",
    description: "Préparez-vous à réussir tous vos entretiens d'embauche.",
    likes: 0
  },
  {
    id: 3,
    title: "The Multi-Bucket Savings System",
    image: "/mock/savings-system.jpg",
    description: "Optimisez votre épargne avec la méthode des multi-buckets.",
    likes: 0
  },
  {
    id: 4,
    title: "The Advertising Funnel Blueprint Strategies",
    image: "/mock/ad-funnel.jpg",
    description: "Maîtrisez les tunnels de vente publicitaires.",
    likes: 0
  },
  {
    id: 5,
    title: "Keep Them Coming Back",
    image: "/mock/keep-coming-back.jpg",
    description: "Fidélisez vos clients avec des stratégies avancées.",
    likes: 0
  },
  {
    id: 6,
    title: "Headline Construction Framework",
    image: "/mock/headline-framework.jpg",
    description: "Créez des titres irrésistibles pour vos contenus.",
    likes: 0
  },
  {
    id: 7,
    title: "Click-Worthy Advertising Copywriting",
    image: "/mock/advertising-copywriting.jpg",
    description: "Rédigez des textes publicitaires qui convertissent.",
    likes: 0
  },
  {
    id: 8,
    title: "How to Build a Website",
    image: "/mock/build-website.jpg",
    description: "Apprenez à créer un site web de A à Z.",
    likes: 0
  },
  {
    id: 9,
    title: "Confidently Close Every Call",
    image: "/mock/close-call.jpg",
    description: "Devenez un pro de la vente par téléphone.",
    likes: 0
  },
];

export default function PopulairePage() {
  const [productsWithLikes, setProductsWithLikes] = useState(products);
  const [likedProducts, setLikedProducts] = useState<number[]>([]);

  useEffect(() => {
    // Charger les likes depuis le localStorage
    const savedLikes = localStorage.getItem('productLikes');
    if (savedLikes) {
      const parsedLikes = JSON.parse(savedLikes);
      setProductsWithLikes(prev => prev.map(product => ({
        ...product,
        likes: parsedLikes[product.id] || 0
      })));
    }

    // Charger les produits likés par l'utilisateur
    const savedLikedProducts = localStorage.getItem('likedProducts');
    if (savedLikedProducts) {
      setLikedProducts(JSON.parse(savedLikedProducts));
    }
  }, []);

  const handleLike = (productId: number) => {
    setProductsWithLikes(prev => {
      const newProducts = prev.map(product => {
        if (product.id === productId) {
          const newLikes = likedProducts.includes(productId) ? product.likes - 1 : product.likes + 1;
          return { ...product, likes: newLikes };
        }
        return product;
      });

      // Sauvegarder les likes dans le localStorage
      const likesToSave = newProducts.reduce((acc, product) => ({
        ...acc,
        [product.id]: product.likes
      }), {});
      localStorage.setItem('productLikes', JSON.stringify(likesToSave));

      return newProducts;
    });

    // Mettre à jour les produits likés par l'utilisateur
    setLikedProducts(prev => {
      const newLikedProducts = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('likedProducts', JSON.stringify(newLikedProducts));
      return newLikedProducts;
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="ml-0 md:ml-64 px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-white">Produits Populaires</h1>
        <p className="text-gray-400 mb-8">Découvrez nos produits digitaux les plus populaires.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsWithLikes.map((product) => (
            <div key={product.id} className="bg-[#181818] rounded-xl shadow-lg overflow-hidden flex flex-col border border-[#232323]">
              <div className="aspect-[4/3] bg-[#111] flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.title}
                  className="object-contain w-full h-full max-h-48"
                  loading="lazy"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-lg font-semibold text-white mb-2">{product.title}</h2>
                <p className="text-gray-400 text-sm mb-4 flex-1">{product.description}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleLike(product.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      likedProducts.includes(product.id)
                        ? 'bg-[#ff0033] text-white hover:bg-[#cc0029]'
                        : 'bg-[#232323] text-gray-400 hover:bg-[#2a2a2a]'
                    }`}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      fill={likedProducts.includes(product.id) ? "currentColor" : "none"} 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                      />
                    </svg>
                    {product.likes}
                  </button>
                  <button className="flex-1 bg-[#ff0033] text-white py-2 rounded-lg font-semibold hover:bg-[#cc0029] transition-all duration-200">
                    Ouvrir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 