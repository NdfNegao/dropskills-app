'use client';

import React from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { GraduationCap, BookOpen, Video, FileText, Clock, Star, Users, TrendingUp } from 'lucide-react';

export default function UniversitePage() {
  const courses = [
    {
      id: 1,
      title: "Maîtriser les Outils IA DropSkills",
      description: "Formation complète pour exploiter au maximum tous les outils IA",
      duration: "2h 30min",
      lessons: 12,
      level: "Débutant",
      rating: 4.9,
      students: 1247,
      image: "🤖",
      category: "IA & Automation"
    },
    {
      id: 2,
      title: "Stratégie Marketing Digital Avancée",
      description: "Développez une stratégie marketing complète avec les outils DropSkills",
      duration: "3h 45min",
      lessons: 18,
      level: "Intermédiaire",
      rating: 4.8,
      students: 892,
      image: "📈",
      category: "Marketing"
    },
    {
      id: 3,
      title: "Copywriting & Conversion",
      description: "Rédigez des copies qui convertissent avec l'aide de l'IA",
      duration: "2h 15min",
      lessons: 10,
      level: "Intermédiaire",
      rating: 4.9,
      students: 1156,
      image: "✍️",
      category: "Copywriting"
    },
    {
      id: 4,
      title: "Automatisation des Tunnels de Vente",
      description: "Créez des tunnels de vente automatisés et performants",
      duration: "4h 20min",
      lessons: 22,
      level: "Avancé",
      rating: 4.7,
      students: 634,
      image: "🚀",
      category: "Automation"
    }
  ];

  const stats = [
    { label: "Étudiants", value: "12,847", icon: <Users className="w-5 h-5" /> },
    { label: "Formations", value: "24", icon: <BookOpen className="w-5 h-5" /> },
    { label: "Heures de contenu", value: "156h", icon: <Clock className="w-5 h-5" /> },
    { label: "Note moyenne", value: "4.8/5", icon: <Star className="w-5 h-5" /> }
  ];

  return (
    <LayoutWithSidebar>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#111111] to-[#1a1a1a] rounded-xl p-8 border border-[#232323]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-xl flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Université des Produits DropSkills
              </h1>
              <p className="text-gray-400 text-lg">
                Formations exclusives pour maîtriser l'entrepreneuriat digital
              </p>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333]">
                <div className="flex items-center gap-2 text-[#ff0033] mb-2">
                  {stat.icon}
                  <span className="text-sm font-medium">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Formations */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Formations Disponibles</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <TrendingUp className="w-4 h-4" />
              Mises à jour régulières
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-[#111111] rounded-xl p-6 border border-[#232323] hover:border-[#ff0033]/30 transition-all duration-200 hover:scale-105">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{course.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-[#ff0033]/10 text-[#ff0033] px-2 py-1 rounded-full text-xs font-medium">
                        {course.category}
                      </span>
                      <span className="bg-[#333] text-gray-300 px-2 py-1 rounded-full text-xs">
                        {course.level}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{course.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{course.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Video className="w-4 h-4" />
                      {course.lessons} leçons
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    {course.rating}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{course.students.toLocaleString()} étudiants</span>
                  <button className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Commencer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[#ff0033]/10 to-[#cc0029]/10 rounded-xl p-8 border border-[#ff0033]/20 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            🎓 Accès Premium Requis
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Débloquez l'accès à toutes les formations exclusives, les ressources téléchargeables 
            et le support prioritaire pour accélérer votre réussite entrepreneuriale.
          </p>
          <button className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Upgrader vers Premium
          </button>
        </div>
      </div>
    </LayoutWithSidebar>
  );
} 