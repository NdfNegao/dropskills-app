'use client';

import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Download, Star } from 'lucide-react';
import ProductCard from "@/components/ProductCard";

// Définition du type pour un échantillon
type Sample = {
  title: string;
  type: string;
  downloads: number;
  rating: number;
  description: string;
  image: string;
};

// Données des échantillons
const sampleData: Sample[] = [
  {
    title: 'Mini Guide Growth Hacking',
    type: 'E-books',
    downloads: 1240,
    rating: 4.8,
    description: 'Découvrez 5 techniques de growth hacking testées et approuvées.',
    image: '/samples/growth-hacking-sample.jpg'
  },
  {
    title: 'Template Story Instagram',
    type: 'Templates',
    downloads: 890,
    rating: 4.9,
    description: 'Pack de 3 templates stories professionnels pour Instagram.',
    image: '/samples/instagram-template.jpg'
  },
  {
    title: 'Introduction au Dropshipping',
    type: 'Vidéos',
    downloads: 2100,
    rating: 4.7,
    description: 'Vidéo de 15 minutes sur les bases du dropshipping digital.',
    image: '/samples/dropshipping-video.jpg'
  },
  {
    title: 'Script Email Marketing',
    type: 'Scripts',
    downloads: 567,
    rating: 4.6,
    description: 'Template d\'email pour votre première séquence de nurturing.',
    image: '/samples/email-script.jpg'
  },
];

// Fonction utilitaire pour convertir le type en format valide
const typeToFormat = (type: string): import("@/data/products").Product["format"] => {
  switch (type) {
    case "E-books":
      return "ebook";
    case "Templates":
      return "template";
    case "Vidéos":
      return "video";
    case "Scripts":
      return "tool";
    default:
      return "ebook";
  }
};

export default function EchantillonsPage() {
  const [activeFilter, setActiveFilter] = useState('Tous');

  // Filtrer les échantillons en fonction du filtre actif
  const filteredSamples = activeFilter === 'Tous' 
    ? sampleData 
    : sampleData.filter(sample => sample.type === activeFilter);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="ml-0 md:ml-64 px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Échantillons Gratuits</h1>
          <p className="text-gray-400">Testez la qualité de nos produits avec ces ressources gratuites.</p>
        </div>

        {/* Filtres */}
        <div className="flex gap-4 mb-8">
          {['Tous', 'E-books', 'Templates', 'Vidéos', 'Scripts'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === activeFilter
                  ? 'bg-[#ff0033] text-white'
                  : 'bg-[#111111] text-gray-300 hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Grille d'échantillons */}
        <div className="grid grid-cols-3 gap-8">
          {filteredSamples.map((sample, idx) => (
            <ProductCard
              key={sample.title}
              product={{
                id: (idx + 1).toString(),
                title: sample.title,
                subtitle: sample.type,
                format: typeToFormat(sample.type),
                image: sample.image,
                description: sample.description,
                likes: Math.round(sample.rating * 10),
                fileUrl: "#",
                tags: [sample.type],
              }}
            />
          ))}
        </div>

        {/* Section Premium */}
        <div className="mt-16 bg-gradient-to-r from-[#ff0033] to-[#cc0029] rounded-xl p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Accédez à Tous les Échantillons Premium</h2>
              <p className="text-white/80">Débloquez l'accès à plus de 50 ressources premium et leurs mises à jour.</p>
            </div>
            <button className="bg-white text-[#ff0033] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Débloquer l'Accès Premium
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 