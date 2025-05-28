'use client';

import { useState } from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { 
  Play, 
  BookOpen, 
  Clock, 
  Users, 
  Star,
  Filter,
  Search,
  ChevronRight,
  Award,
  Target,
  Zap,
  Download
} from 'lucide-react';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  duration: string;
  format: 'Vidéo' | 'Article' | 'Guide PDF' | 'Webinaire';
  thumbnail: string;
  instructor: string;
  rating: number;
  studentsCount: number;
  isPremium: boolean;
  tags: string[];
}

const TUTORIALS: Tutorial[] = [
  {
    id: '1',
    title: 'Démarrer avec Dropskills : Guide complet',
    description: 'Apprenez les bases de la plateforme et comment maximiser vos profits avec le dropshipping digital.',
    category: 'Démarrage',
    level: 'Débutant',
    duration: '45 min',
    format: 'Vidéo',
    thumbnail: '/api/placeholder/400/225',
    instructor: 'Équipe Dropskills',
    rating: 4.9,
    studentsCount: 1247,
    isPremium: false,
    tags: ['dropshipping', 'débutant', 'plateforme']
  },
  {
    id: '2',
    title: 'Maîtriser les Outils IA Premium',
    description: 'Formation complète sur tous les outils IA : générateur d\'offres, titres, content system et plus.',
    category: 'Outils IA',
    level: 'Intermédiaire',
    duration: '2h 30min',
    format: 'Vidéo',
    thumbnail: '/api/placeholder/400/225',
    instructor: 'Marc Dubois',
    rating: 4.8,
    studentsCount: 892,
    isPremium: true,
    tags: ['IA', 'outils', 'premium', 'marketing']
  },
  {
    id: '3',
    title: 'Stratégies de Rebranding Avancées',
    description: 'Techniques professionnelles pour personnaliser et adapter les produits à votre marque.',
    category: 'Marketing',
    level: 'Avancé',
    duration: '1h 15min',
    format: 'Guide PDF',
    thumbnail: '/api/placeholder/400/225',
    instructor: 'Sophie Martin',
    rating: 4.7,
    studentsCount: 634,
    isPremium: true,
    tags: ['rebranding', 'marque', 'design']
  },
  {
    id: '4',
    title: 'Optimiser ses Tunnels de Vente',
    description: 'Créez des tunnels de conversion qui transforment vos visiteurs en clients fidèles.',
    category: 'Conversion',
    level: 'Intermédiaire',
    duration: '1h 45min',
    format: 'Webinaire',
    thumbnail: '/api/placeholder/400/225',
    instructor: 'Thomas Leroy',
    rating: 4.9,
    studentsCount: 1156,
    isPremium: false,
    tags: ['tunnel', 'conversion', 'vente']
  },
  {
    id: '5',
    title: 'Automatisation Marketing avec l\'IA',
    description: 'Automatisez votre marketing digital grâce aux outils IA et gagnez du temps précieux.',
    category: 'Automatisation',
    level: 'Avancé',
    duration: '3h 00min',
    format: 'Vidéo',
    thumbnail: '/api/placeholder/400/225',
    instructor: 'Julie Rousseau',
    rating: 4.8,
    studentsCount: 743,
    isPremium: true,
    tags: ['automatisation', 'IA', 'marketing', 'productivité']
  },
  {
    id: '6',
    title: 'Analyse de Performance et KPIs',
    description: 'Mesurez et optimisez vos performances avec les bons indicateurs et outils d\'analyse.',
    category: 'Analytics',
    level: 'Intermédiaire',
    duration: '1h 30min',
    format: 'Article',
    thumbnail: '/api/placeholder/400/225',
    instructor: 'Pierre Durand',
    rating: 4.6,
    studentsCount: 567,
    isPremium: false,
    tags: ['analytics', 'KPI', 'performance']
  }
];

const CATEGORIES = ['Tous', 'Démarrage', 'Outils IA', 'Marketing', 'Conversion', 'Automatisation', 'Analytics'];
const LEVELS = ['Tous', 'Débutant', 'Intermédiaire', 'Avancé'];
const FORMATS = ['Tous', 'Vidéo', 'Article', 'Guide PDF', 'Webinaire'];

export default function TutorielsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedLevel, setSelectedLevel] = useState('Tous');
  const [selectedFormat, setSelectedFormat] = useState('Tous');

  const filteredTutorials = TUTORIALS.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'Tous' || tutorial.category === selectedCategory;
    const matchesLevel = selectedLevel === 'Tous' || tutorial.level === selectedLevel;
    const matchesFormat = selectedFormat === 'Tous' || tutorial.format === selectedFormat;
    
    return matchesSearch && matchesCategory && matchesLevel && matchesFormat;
  });

  return (
    <LayoutWithSidebar>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Centre de Formation</h1>
              <p className="text-gray-400">Maîtrisez Dropskills et boostez vos revenus</p>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <Play className="w-4 h-4" />
                <span className="text-sm font-medium">Tutoriels</span>
              </div>
              <div className="text-2xl font-bold text-white">24</div>
              <div className="text-xs text-gray-400">formations disponibles</div>
            </div>
            
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Étudiants</span>
              </div>
              <div className="text-2xl font-bold text-white">5,239</div>
              <div className="text-xs text-gray-400">apprenants actifs</div>
            </div>
            
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-400 mb-1">
                <Award className="w-4 h-4" />
                <span className="text-sm font-medium">Certification</span>
              </div>
              <div className="text-2xl font-bold text-white">89%</div>
              <div className="text-xs text-gray-400">taux de réussite</div>
            </div>
            
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Durée totale</span>
              </div>
              <div className="text-2xl font-bold text-white">47h</div>
              <div className="text-xs text-gray-400">de contenu premium</div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-[#111111] border border-[#232323] rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un tutoriel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ff0033]"
              />
            </div>

            {/* Filtres */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
              >
                {LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>

              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
              >
                {FORMATS.map(format => (
                  <option key={format} value={format}>{format}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Parcours recommandés */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Parcours recommandés</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LearningPath
              title="Débutant Complet"
              description="De zéro à vos premiers profits"
              duration="8h"
              courses={4}
              icon={<Target className="w-6 h-6" />}
              color="green"
            />
            <LearningPath
              title="Maître des Outils IA"
              description="Exploitez la puissance de l'IA"
              duration="12h"
              courses={6}
              icon={<Zap className="w-6 h-6" />}
              color="blue"
            />
            <LearningPath
              title="Expert Marketing"
              description="Stratégies avancées de conversion"
              duration="15h"
              courses={8}
              icon={<Award className="w-6 h-6" />}
              color="purple"
            />
          </div>
        </div>

        {/* Liste des tutoriels */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Tous les tutoriels ({filteredTutorials.length})
            </h2>
          </div>

          {filteredTutorials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutorials.map(tutorial => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>
          ) : (
            <div className="bg-[#111111] border border-[#232323] rounded-xl p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">Aucun tutoriel trouvé</p>
              <p className="text-gray-500 text-sm">
                Essayez de modifier vos filtres ou votre recherche
              </p>
            </div>
          )}
        </div>
      </div>
    </LayoutWithSidebar>
  );
}

interface LearningPathProps {
  title: string;
  description: string;
  duration: string;
  courses: number;
  icon: React.ReactNode;
  color: 'green' | 'blue' | 'purple';
}

function LearningPath({ title, description, duration, courses, icon, color }: LearningPathProps) {
  const colorClasses = {
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className="bg-[#111111] border border-[#232323] rounded-xl p-6 hover:border-[#ff0033]/30 transition-colors cursor-pointer">
      <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-300">{courses} cours</span>
        <span className="text-gray-300">{duration}</span>
      </div>
      <button className="w-full mt-4 bg-[#ff0033] text-white py-2 rounded-lg font-medium hover:bg-[#cc0029] transition-colors flex items-center justify-center gap-2">
        Commencer
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

interface TutorialCardProps {
  tutorial: Tutorial;
}

function TutorialCard({ tutorial }: TutorialCardProps) {
  const formatIcon = {
    'Vidéo': <Play className="w-4 h-4" />,
    'Article': <BookOpen className="w-4 h-4" />,
    'Guide PDF': <Download className="w-4 h-4" />,
    'Webinaire': <Users className="w-4 h-4" />
  };

  const levelColors = {
    'Débutant': 'text-green-400 bg-green-400/10',
    'Intermédiaire': 'text-yellow-400 bg-yellow-400/10',
    'Avancé': 'text-red-400 bg-red-400/10'
  };

  return (
    <div className="bg-[#111111] border border-[#232323] rounded-xl overflow-hidden hover:border-[#ff0033]/30 transition-colors cursor-pointer">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-[#ff0033]/20 to-[#cc0029]/20 flex items-center justify-center">
        <div className="w-16 h-16 bg-[#ff0033] rounded-full flex items-center justify-center">
          {formatIcon[tutorial.format]}
        </div>
        {tutorial.isPremium && (
          <div className="absolute top-3 right-3 bg-[#ff0033] text-white px-2 py-1 rounded-full text-xs font-medium">
            Premium
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColors[tutorial.level]}`}>
              {tutorial.level}
            </span>
            <span className="text-gray-400 text-xs">{tutorial.category}</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-xs">{tutorial.rating}</span>
          </div>
        </div>

        {/* Titre et description */}
        <h3 className="text-white font-semibold mb-2 line-clamp-2">{tutorial.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{tutorial.description}</p>

        {/* Métadonnées */}
        <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {tutorial.duration}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {tutorial.studentsCount.toLocaleString()}
          </div>
        </div>

        {/* Instructeur */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Par {tutorial.instructor}</span>
          <button className="bg-[#ff0033] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#cc0029] transition-colors">
            Commencer
          </button>
        </div>
      </div>
    </div>
  );
} 