import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        {/* Titre principal */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          <div className="relative inline-block">
            DROP<span className="text-[#ff0033]">SKILLS</span>
            <span className="absolute -top-2 -right-8 text-xs text-gray-400 font-medium tracking-wider uppercase">
              beta
            </span>
          </div>
          <br />
          <span className="text-3xl md:text-5xl text-gray-400">Plateforme de Formation</span>
        </h1>

        {/* Sous-titre */}
        <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
          Accédez à des formations premium, des outils IA avancés et une communauté 
          d'entrepreneurs pour développer votre business.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            href="/universite"
            className="bg-gradient-to-r from-[#ff0033] to-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 flex items-center gap-2 shadow-lg"
          >
            <Zap className="w-5 h-5" />
            Commencer Maintenant
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <Link
            href="/universite"
            className="bg-transparent border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:border-[#ff0033] hover:bg-[#ff0033]/10 transition-all duration-200"
          >
            Explorer les Formations
          </Link>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#ff0033] mb-2">50+</div>
            <div className="text-gray-400">Formations disponibles</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#ff0033] mb-2">15+</div>
            <div className="text-gray-400">Outils IA intégrés</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#ff0033] mb-2">1000+</div>
            <div className="text-gray-400">Membres actifs</div>
          </div>
        </div>
      </div>
    </section>
  );
}