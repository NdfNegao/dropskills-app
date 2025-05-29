import React from 'react';
import { GraduationCap, FolderOpen, Sparkles, Users } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Université",
      description: "Centre de formation avec tous les cours et formations",
      color: "text-blue-400"
    },
    {
      icon: <FolderOpen className="w-8 h-8" />,
      title: "Mon Coffre",
      description: "Vos ressources personnelles, favoris et outputs IA",
      color: "text-purple-400"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Outils IA",
      description: "Générateurs et assistants IA pour votre business",
      color: "text-yellow-400"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Communauté",
      description: "Programme d'affiliation et support communautaire",
      color: "text-green-400"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Navigation Simplifiée
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Quatre sections principales pour une expérience claire et intuitive
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-[#111111] border border-[#232323] rounded-xl p-6 hover:border-[#333] transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`${feature.color} mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 