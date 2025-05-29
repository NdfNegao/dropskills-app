'use client';

import { useState } from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import Link from 'next/link';
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
  Download,
  ExternalLink,
  PlayCircle,
  FileText
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
  url?: string; // URL vers le tutoriel ou produit
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
    tags: ['dropshipping', 'débutant', 'plateforme'],
    url: '/universite'
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
    tags: ['IA', 'outils', 'premium', 'marketing'],
    url: '/outils'
  },
  {
    id: '3',
    title: 'The 6-Day YouTube Accelerator',
    description: 'Email course designed to help you provide expert guidance on YouTube ads while upselling your services.',
    category: 'Marketing',
    level: 'Avancé',
    duration: '1h 15min',
    format: 'Guide PDF',
    thumbnail: '/api/placeholder/400/225',
    instructor: 'Sophie Martin',
    rating: 4.7,
    studentsCount: 634,
    isPremium: true,
    tags: ['youtube', 'ads', 'email', 'marketing'],
    url: '/produits/youtube-accelerator'
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
    tags: ['tunnel', 'conversion', 'vente'],
    url: '/outils/tunnel-maker'
  },
  {
    id: '5',
    title: 'Email Marketing Mastery Course',
    description: 'Formation complète pour maîtriser l\'email marketing et créer des campagnes qui convertissent.',
    category: 'Automatisation',
    level: 'Avancé',
    duration: '3h 00min',
    format: 'Vidéo',
    thumbnail: '/api/placeholder/400/225',
    instructor: 'Julie Rousseau',
    rating: 4.8,
    studentsCount: 743,
    isPremium: true,
    tags: ['email', 'marketing', 'automation'],
    url: '/produits/email-marketing-mastery'
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
    tags: ['analytics', 'KPI', 'performance'],
    url: '/outils/calculateur'
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

        {/* Filtres */}
        <div className="bg-[#111111] border border-[#232323] rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#ff0033]" />
            <h2 className="text-lg font-semibold text-white">Filtres</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ff0033] transition-colors"
              />
            </div>

            {/* Catégorie */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ff0033] transition-colors"
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Niveau */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ff0033] transition-colors"
            >
              {LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            {/* Format */}
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ff0033] transition-colors"
            >
              {FORMATS.map(format => (
                <option key={format} value={format}>{format}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Parcours d'apprentissage recommandés */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Parcours Recommandés</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LearningPath
              title="Débutant Complet"
              description="Commencez votre aventure dropshipping digital"
              duration="8h"
              courses={4}
              icon={<Target className="w-6 h-6" />}
              color="green"
              url="/universite"
            />
            <LearningPath
              title="Maître des Outils IA"
              description="Devenez expert en automatisation IA"
              duration="15h"
              courses={8}
              icon={<Zap className="w-6 h-6" />}
              color="blue"
              url="/outils"
            />
            <LearningPath
              title="Expert Marketing"
              description="Stratégies avancées de conversion"
              duration="24h"
              courses={12}
              icon={<Award className="w-6 h-6" />}
              color="purple"
              url="/premium"
            />
          </div>
        </div>

        {/* Liste des tutoriels */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Tous les Tutoriels ({filteredTutorials.length})
            </h2>
          </div>

          {filteredTutorials.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Aucun tutoriel trouvé</h3>
              <p className="text-gray-400">Essayez de modifier vos filtres de recherche.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutorials.map((tutorial) => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
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
  url: string;
}

function LearningPath({ title, description, duration, courses, icon, color, url }: LearningPathProps) {
  const colorClasses = {
    green: 'from-green-500 to-emerald-500',
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500'
  };

  return (
    <Link href={url}>
      <div className="bg-[#111111] border border-[#232323] rounded-xl p-6 hover:border-[#ff0033]/30 transition-all duration-200 hover:scale-105 cursor-pointer">
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center text-white mb-4`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-4">{description}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300">{courses} cours</span>
          <span className="text-gray-300">{duration}</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-[#ff0033] font-medium">Commencer →</span>
          <ChevronRight className="w-4 h-4 text-[#ff0033]" />
        </div>
      </div>
    </Link>
  );
}

interface TutorialCardProps {
  tutorial: Tutorial;
}

function TutorialCard({ tutorial }: TutorialCardProps) {
  const formatIcon = {
    'Vidéo': <PlayCircle className="w-4 h-4" />,
    'Article': <FileText className="w-4 h-4" />,
    'Guide PDF': <Download className="w-4 h-4" />,
    'Webinaire': <Users className="w-4 h-4" />
  };

  const levelColor = {
    'Débutant': 'text-green-400 bg-green-500/10',
    'Intermédiaire': 'text-yellow-400 bg-yellow-500/10',
    'Avancé': 'text-red-400 bg-red-500/10'
  };

  const handleCardClick = () => {
    if (tutorial.url) {
      window.location.href = tutorial.url;
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-[#111111] border border-[#232323] rounded-xl overflow-hidden hover:border-[#ff0033]/30 transition-all duration-200 hover:scale-105 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900">
        <img 
          src={tutorial.thumbnail} 
          alt={tutorial.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColor[tutorial.level]}`}>
            {tutorial.level}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          {tutorial.isPremium && (
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
              👑 Premium
            </span>
          )}
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="px-2 py-1 bg-black/60 text-white rounded text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {tutorial.duration}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#ff0033]">
            {formatIcon[tutorial.format]}
          </span>
          <span className="text-xs text-gray-400 uppercase tracking-wide">
            {tutorial.format}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {tutorial.title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {tutorial.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-white font-medium">{tutorial.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <Users className="w-4 h-4" />
            {tutorial.studentsCount.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Par {tutorial.instructor}</span>
          <div className="flex items-center gap-1 text-[#ff0033]">
            <span className="text-sm font-medium">Voir</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
} 