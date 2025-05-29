import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Crown } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-[#ff0033]/10 to-red-600/10 border border-[#ff0033]/20 rounded-2xl p-12">
          <div className="w-16 h-16 bg-gradient-to-br from-[#ff0033] to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-4">
            Prêt à Développer Votre Business ?
          </h2>
          
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté d'entrepreneurs et accédez à des formations 
            premium, des outils IA et un accompagnement personnalisé.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/catalogue"
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
              Voir les Formations
            </Link>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            ✨ Formations premium • 🚀 Outils IA • 📱 Support communautaire
          </div>
        </div>
      </div>
    </section>
  );
} 