'use client';

import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { BookOpen, ArrowRight, Star, GraduationCap } from 'lucide-react';
import Link from 'next/link';

// Types
type Course = {
  id: string;
  title: string;
  description: string;
  lessons: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  image: string;
};

// Données des cours
const courses: Course[] = [
  {
    id: 'master-library',
    title: 'Comment utiliser la Master Library',
    description: 'Un guide complet pour naviguer dans la Master Library et transformer ses ressources en business rentable.',
    lessons: 8,
    level: 'Beginner',
    image: '/courses/master-library.jpg'
  },
  {
    id: 'business-plan',
    title: 'Business Plan Digital Complet',
    description: 'Un guide pratique pour lancer votre business en ligne avec clarté et confiance.',
    lessons: 9,
    level: 'Beginner',
    image: '/courses/business-plan.jpg'
  },
  {
    id: 'funnels',
    title: 'Tunnels de Vente pour Produits Digitaux',
    description: 'Apprenez à créer des tunnels de vente efficaces pour vos produits digitaux.',
    lessons: 14,
    level: 'Beginner',
    image: '/courses/funnels.jpg'
  },
  {
    id: 'marketplaces',
    title: 'Où Vendre vos Produits Digitaux',
    description: 'Guide complet des meilleures plateformes pour vendre vos produits digitaux.',
    lessons: 10,
    level: 'Intermediate',
    image: '/courses/marketplaces.jpg'
  }
];

export default function UniversitePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'all' | Course['level']>('all');

  // Filtrer les cours
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Bannière promotionnelle */}
      <div className="bg-[#ff0033] text-white text-center py-2 text-sm">
        🎉 Offre de lancement 2025 ➜ -50% sur le Plan Pro
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Contenu principal */}
      <main className="ml-64 p-8">
        {/* En-tête */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Université des Produits Digitaux</h1>
          <p className="text-xl text-gray-400">Apprenez à créer, marketer et vendre des produits digitaux avec nos formations complètes</p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex gap-4 mb-8">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Rechercher une formation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-[#111111] text-white rounded-lg border border-gray-700 focus:outline-none focus:border-[#ff0033] transition-colors"
            />
          </div>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as 'all' | Course['level'])}
            className="px-4 py-2 bg-[#111111] text-white rounded-lg border border-gray-700 focus:outline-none focus:border-[#ff0033] transition-colors"
          >
            <option value="all">Tous les niveaux</option>
            <option value="Beginner">Débutant</option>
            <option value="Intermediate">Intermédiaire</option>
            <option value="Advanced">Avancé</option>
          </select>
        </div>

        {/* Grille des guides */}
        <div className="grid grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <Link 
              href={`/universite/${course.id}`}
              key={course.id}
              className="bg-[#111111] rounded-xl overflow-hidden hover:bg-[#1a1a1a] transition-all duration-200 group"
            >
              {/* Image du cours */}
              <div className="aspect-video bg-[#1a1a1a] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute top-4 left-4 bg-[#ff0033] text-white text-sm px-3 py-1 rounded-full">
                  {course.level}
                </span>
              </div>

              {/* Contenu du cours */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                  <BookOpen size={16} />
                  <span>{course.lessons} leçons</span>
                </div>
                
                <h3 className="text-white text-xl font-semibold mb-3">{course.title}</h3>
                <p className="text-gray-400 text-sm mb-6">{course.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="text-[#ff0033]" size={20} />
                    <span className="text-white">Commencer</span>
                  </div>
                  <ArrowRight className="text-[#ff0033] transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Message si aucun résultat */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">Aucun cours trouvé</h3>
            <p className="text-gray-400">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </main>
    </div>
  );
} 