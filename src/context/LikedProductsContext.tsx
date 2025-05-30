"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LikedProductsContextType {
  likedProducts: string[];
  toggleLike: (productId: string) => void;
}

const LikedProductsContext = createContext<LikedProductsContextType | undefined>(undefined);

export function LikedProductsProvider({ children }: { children: ReactNode }) {
  const [likedProducts, setLikedProducts] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('likedProducts');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
  }, [likedProducts]);

  const toggleLike = (productId: string) => {
    setLikedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <LikedProductsContext.Provider value={{ likedProducts, toggleLike }}>
      {children}
    </LikedProductsContext.Provider>
  );
}

export function useLikedProducts() {
  const context = useContext(LikedProductsContext);
  if (context === undefined) {
    throw new Error('useLikedProducts must be used within a LikedProductsProvider');
  }
  return context;
} 