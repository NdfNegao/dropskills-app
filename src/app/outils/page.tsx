'use client';

import Sidebar from '../../components/Sidebar';
import { FileCode, BrainCircuit, Lightbulb, Book, Calculator } from 'lucide-react';
import Link from 'next/link';

// Types
type Tool = {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  path: string;
  isNew?: boolean;
};

// Liste des outils
const tools: Tool[] = [
  {
    id: 'pdf-rebrander',
    title: 'PDF Rebrander',
    description: 'Personnalisez vos PDFs avec votre marque et créez des versions uniques pour chaque client.',
    icon: <FileCode className="w-6 h-6" />,
    path: '/outils/pdf-rebrander',
    isNew: true
  },
  {
    id: 'product-descriptions',
    title: 'Product Descriptions',
    description: 'Générez des descriptions de produits persuasives et optimisées pour la vente.',
    icon: <BrainCircuit className="w-6 h-6" />,
    path: '/outils/descriptions',
    isNew: true
  },
  {
    id: 'product-ideas',
    title: 'Product Ideas',
    description: 'Trouvez des idées de produits digitaux innovants basés sur les tendances du marché.',
    icon: <Lightbulb className="w-6 h-6" />,
    path: '/outils/idees'
  },
  {
    id: 'book-title-generator',
    title: 'Book Title Generator',
    description: 'Créez des titres accrocheurs pour vos ebooks et guides digitaux.',
    icon: <Book className="w-6 h-6" />,
    path: '/outils/titres'
  },
  {
    id: 'revenue-calculator',
    title: 'Revenue Calculator',
    description: 'Calculez vos revenus potentiels et planifiez votre stratégie de prix.',
    icon: <Calculator className="w-6 h-6" />,
    path: '/outils/calculateur'
  }
];

export default function OutilsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="ml-0 md:ml-64 px-4 py-8">
        {/* Bannière promotionnelle */}
        <div className="bg-[#ff0033] text-white text-center py-2 text-sm">
          🎉 Offre de lancement 2025 ➜ -50% sur le Plan Pro
        </div>

        {/* En-tête */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Outils DropSkills</h1>
          <p className="text-xl text-gray-400">Une suite complète d'outils pour optimiser votre business de produits digitaux</p>
        </div>

        {/* Liste des outils */}
        <div className="space-y-4">
          {tools.map((tool) => (
            <Link 
              href={tool.path}
              key={tool.id}
              className="block"
            >
              <div className="bg-[#111111] rounded-xl p-6 hover:bg-[#1a1a1a] transition-all duration-200 group">
                <div className="flex items-start gap-6">
                  {/* Icône */}
                  <div className="p-4 bg-[#1a1a1a] group-hover:bg-[#242424] rounded-lg text-[#ff0033]">
                    {tool.icon}
                  </div>

                  {/* Contenu */}
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white text-xl font-semibold">{tool.title}</h3>
                      {tool.isNew && (
                        <span className="px-2 py-1 bg-[#ff0033]/10 text-[#ff0033] text-xs font-semibold rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400">{tool.description}</p>
                  </div>

                  {/* Flèche */}
                  <div className="text-gray-600 group-hover:text-[#ff0033] group-hover:transform group-hover:translate-x-1 transition-all">
                    →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Section Pro */}
        <div className="mt-12 bg-gradient-to-r from-[#ff0033] to-[#cc0029] rounded-xl p-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Débloquez Tous les Outils Pro</h2>
              <p className="text-white/80">Accédez à tous les outils premium et leurs futures mises à jour.</p>
            </div>
            <button className="bg-white text-[#ff0033] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Passer au Plan Pro
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 