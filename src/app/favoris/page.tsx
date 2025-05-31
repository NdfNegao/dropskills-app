import React from 'react';
import { useLikedProducts, LikedProductsProvider } from '@/context/LikedProductsContext';
import { PRODUCTS } from '@/data/products';
import PageBentoLayout from '@/components/PageBentoLayout';
import { Heart, Star, BookOpen, Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export default function FavorisPage() {
  return (
    <LikedProductsProvider>
      <FavorisContent />
    </LikedProductsProvider>
  );
}

function FavorisContent() {
  const { likedProducts } = useLikedProducts();
  const favoris = PRODUCTS.filter(p => likedProducts.includes(p.id));

  const stats = [
    {
      icon: <Heart className="w-4 h-4" />, label: 'Favoris', value: favoris.length, color: 'text-red-400', description: 'formations likées'
    },
    {
      icon: <Star className="w-4 h-4" />, label: 'Premium', value: favoris.filter(f => f.isPremium).length, color: 'text-yellow-400', description: 'premium'
    },
    {
      icon: <BookOpen className="w-4 h-4" />, label: 'Gratuites', value: favoris.filter(f => !f.isPremium).length, color: 'text-green-400', description: 'gratuites'
    },
    {
      icon: <Sparkles className="w-4 h-4" />, label: 'Total', value: PRODUCTS.length, color: 'text-purple-400', description: 'formations dispo'
    },
  ];

  return (
    <PageBentoLayout
      icon={<Heart className="w-6 h-6 text-white" />} 
      title="Favoris"
      subtitle="Retrouvez ici toutes vos formations likées"
      stats={stats}
    >
      {favoris.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Aucun favori pour l'instant</h2>
          <p className="text-gray-400 mb-6">Likez une formation pour la retrouver ici !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {favoris.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </PageBentoLayout>
  );
} 