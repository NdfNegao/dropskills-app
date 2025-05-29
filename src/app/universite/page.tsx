"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LayoutWithSidebar from "@/components/LayoutWithSidebar";
import { 
  GraduationCap, 
  Lock, 
  Play, 
  Clock, 
  Users, 
  Star,
  CheckCircle,
  Crown,
  Zap,
  Filter,
  Search,
  BookOpen,
  Award,
  TrendingUp,
  Package
} from "lucide-react";

// Types pour les cours
interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  price: number;
  isPremium: boolean;
  isNew: boolean;
  thumbnail: string;
  instructor: string;
  tags: string[];
}

// Données de cours simulées
const COURSES: Course[] = [
  {
    id: "1",
    title: "Marketing Digital Complet",
    description: "Maîtrisez tous les aspects du marketing digital moderne : SEO, réseaux sociaux, publicité payante et analytics.",
    category: "Marketing",
    level: "Débutant",
    duration: "8h 30min",
    lessons: 45,
    students: 1250,
    rating: 4.8,
    price: 0,
    isPremium: false,
    isNew: false,
    thumbnail: "/api/placeholder/400/250",
    instructor: "Sarah Martin",
    tags: ["SEO", "Social Media", "Analytics"]
  },
  {
    id: "2",
    title: "Copywriting Persuasif Avancé",
    description: "Apprenez à écrire des textes qui convertissent : emails, pages de vente, publicités et contenus web.",
    category: "Copywriting",
    level: "Intermédiaire",
    duration: "12h 15min",
    lessons: 68,
    students: 890,
    rating: 4.9,
    price: 97,
    isPremium: true,
    isNew: true,
    thumbnail: "/api/placeholder/400/250",
    instructor: "Marc Dubois",
    tags: ["Vente", "Persuasion", "Email"]
  },
  {
    id: "3",
    title: "Intelligence Artificielle pour Business",
    description: "Découvrez comment intégrer l'IA dans votre business : automatisation, outils, stratégies et ROI.",
    category: "IA & Tech",
    level: "Avancé",
    duration: "15h 45min",
    lessons: 92,
    students: 567,
    rating: 4.7,
    price: 197,
    isPremium: true,
    isNew: true,
    thumbnail: "/api/placeholder/400/250",
    instructor: "Dr. Julie Chen",
    tags: ["IA", "Automatisation", "Innovation"]
  },
  {
    id: "4",
    title: "Création de Contenu Viral",
    description: "Les secrets pour créer du contenu qui engage et se partage massivement sur toutes les plateformes.",
    category: "Contenu",
    level: "Intermédiaire",
    duration: "6h 20min",
    lessons: 32,
    students: 2100,
    rating: 4.6,
    price: 0,
    isPremium: false,
    isNew: false,
    thumbnail: "/api/placeholder/400/250",
    instructor: "Alex Rivera",
    tags: ["Viral", "Réseaux", "Engagement"]
  },
  {
    id: "5",
    title: "E-commerce & Dropshipping Pro",
    description: "Construisez un empire e-commerce rentable : sélection produits, marketing, logistique et scaling.",
    category: "E-commerce",
    level: "Avancé",
    duration: "20h 10min",
    lessons: 115,
    students: 445,
    rating: 4.9,
    price: 297,
    isPremium: true,
    isNew: false,
    thumbnail: "/api/placeholder/400/250",
    instructor: "Thomas Laurent",
    tags: ["E-commerce", "Dropshipping", "Scaling"]
  },
  {
    id: "6",
    title: "Personal Branding & Influence",
    description: "Développez votre marque personnelle et devenez une autorité reconnue dans votre domaine.",
    category: "Branding",
    level: "Débutant",
    duration: "4h 45min",
    lessons: 28,
    students: 1680,
    rating: 4.5,
    price: 0,
    isPremium: false,
    isNew: false,
    thumbnail: "/api/placeholder/400/250",
    instructor: "Emma Wilson",
    tags: ["Branding", "Influence", "LinkedIn"]
  }
];

const CATEGORIES = ["Tous", "Marketing", "Copywriting", "IA & Tech", "Contenu", "E-commerce", "Branding"];
const LEVELS = ["Tous", "Débutant", "Intermédiaire", "Avancé"];

export default function UniversitePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(COURSES);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedLevel, setSelectedLevel] = useState("Tous");
  const [searchTerm, setSearchTerm] = useState("");

  // Simuler le statut utilisateur
  const userPlan = session?.user ? ((session.user as any).role === 'PREMIUM' ? 'PREMIUM' : 'FREE') : 'VISITOR';
  const canAccessPremium = userPlan === 'PREMIUM';

  // Filtrage des cours
  useEffect(() => {
    let filtered = courses;

    if (selectedCategory !== "Tous") {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    if (selectedLevel !== "Tous") {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredCourses(filtered);
  }, [courses, selectedCategory, selectedLevel, searchTerm]);

  const handleCourseClick = (course: Course) => {
    if (!session && course.isPremium) {
      router.push('/auth/signin');
      return;
    }

    if (course.isPremium && !canAccessPremium) {
      router.push('/premium');
      return;
    }

    // Rediriger vers le cours
    router.push(`/universite/cours/${course.id}`);
  };

  const stats = {
    totalCourses: courses.length,
    freeCourses: courses.filter(c => !c.isPremium).length,
    premiumCourses: courses.filter(c => c.isPremium).length,
    totalStudents: courses.reduce((sum, c) => sum + c.students, 0)
  };

  return (
    <LayoutWithSidebar>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Université DropSkills</h1>
              <p className="text-gray-400">Centre de formation - Maîtrisez les compétences qui comptent</p>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm font-medium">Cours Total</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.totalCourses}</div>
              <div className="text-xs text-gray-400">formations disponibles</div>
            </div>
            
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Gratuits</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.freeCourses}</div>
              <div className="text-xs text-gray-400">accès libre</div>
            </div>
            
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-400 mb-1">
                <Crown className="w-4 h-4" />
                <span className="text-sm font-medium">Premium</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.premiumCourses}</div>
              <div className="text-xs text-gray-400">formations premium</div>
            </div>
            
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Étudiants</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.totalStudents.toLocaleString()}</div>
              <div className="text-xs text-gray-400">apprenants actifs</div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-[#111111] border border-[#232323] rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#ff0033]" />
            <h2 className="text-lg font-semibold text-white">Filtres et Recherche</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un cours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff0033] transition-colors"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033] transition-colors"
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033] transition-colors"
            >
              {LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grille de cours */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            {searchTerm || selectedCategory !== 'Tous' || selectedLevel !== 'Tous' 
              ? 'Résultats de recherche' 
              : 'Tous les Cours'
            }
          </h2>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Aucun cours trouvé</h3>
              <p className="text-gray-400 mb-4">
                Essayez de modifier vos critères de recherche ou vos filtres.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('Tous');
                  setSelectedLevel('Tous');
                }}
                className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  canAccess={!course.isPremium || canAccessPremium}
                  userPlan={userPlan}
                  onClick={() => handleCourseClick(course)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Call to action */}
        <div className="mt-12 bg-gradient-to-r from-[#ff0033]/10 to-[#cc0029]/10 rounded-xl p-8 border border-[#ff0033]/20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Prêt à développer vos compétences ?
            </h2>
            <p className="text-gray-400 mb-6">
              Accédez à notre catalogue complet de formations premium et devenez un expert
            </p>
            <button className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Voir toutes les formations
            </button>
          </div>
        </div>
      </div>
    </LayoutWithSidebar>
  );
}

interface CourseCardProps {
  course: Course;
  canAccess: boolean;
  userPlan: string;
  onClick: () => void;
}

function CourseCard({ course, canAccess, userPlan, onClick }: CourseCardProps) {
  return (
    <div
      className={`bg-[#111111] border border-[#232323] rounded-xl overflow-hidden transition-all cursor-pointer hover:border-[#333] hover:shadow-lg ${
        !canAccess ? 'opacity-75' : ''
      }`}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-[#ff0033]/20 to-[#cc0029]/20 flex items-center justify-center">
        <div className="text-6xl opacity-20">📚</div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {course.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              NOUVEAU
            </span>
          )}
          {course.isPremium && (
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
              <Crown className="w-3 h-3" />
              PREMIUM
            </span>
          )}
        </div>

        {/* Lock overlay */}
        {!canAccess && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center">
              <Lock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <span className="text-white text-sm font-medium">Premium Requis</span>
            </div>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#ff0033] font-medium uppercase tracking-wide">
            {course.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm text-gray-400">{course.rating}</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
          {course.title}
        </h3>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Métadonnées */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            <span>{course.lessons} leçons</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{course.students}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {course.tags.slice(0, 3).map(tag => (
            <span key={tag} className="bg-[#1a1a1a] text-gray-400 text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-[#ff0033] to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {course.instructor[0]}
            </div>
            <span className="text-sm text-gray-400">{course.instructor}</span>
          </div>
          
          <div className="text-right">
            {course.price === 0 ? (
              <span className="text-green-400 font-bold">GRATUIT</span>
            ) : (
              <span className="text-white font-bold">{course.price}€</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 