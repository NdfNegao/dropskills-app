import Image from 'next/image';
import Sidebar from '../components/Sidebar';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Bannière promotionnelle */}
      <div className="bg-[#ff0033] text-white text-center py-2 text-sm">
        🎉 Offre de lancement 2025 ➜ -50% sur le Plan Pro
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Contenu principal */}
      <main className="ml-0 md:ml-64">
        {/* Hero Section */}
        <section className="text-center px-4 sm:px-8 py-8 sm:py-16">
          <p className="text-gray-400 mb-4">DropSkills, Leader du Digital Dropshipping en France 🇫🇷</p>
          <h2 className="text-2xl sm:text-5xl font-bold text-white mb-4">
            Revendez des Produits Digitaux
          </h2>
          <h3 className="text-xl sm:text-4xl font-bold text-[#ff0033] mb-8">
            Sans Devoir les Créer
          </h3>
          <p className="text-gray-300 max-w-3xl mx-auto mb-8">
            Imaginez disposer <span className="text-white font-semibold">instantanément</span> de vos propres produits digitaux : e-books, cours vidéo, templates et bien plus encore.
            Rebrandez-les, revendez-les ou utilisez-les comme bon vous semble, sans gros investissements ni mois de création.
          </p>

          {/* Features */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-12 mb-12">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#ff0033] rounded-full mr-2"></div>
              <span className="text-gray-300">Ressources premium</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#ff0033] rounded-full mr-2"></div>
              <span className="text-gray-300">Mises à jour à vie</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#ff0033] rounded-full mr-2"></div>
              <span className="text-gray-300">100 % de profit pour vous</span>
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row justify-center items-center mb-12 gap-4 sm:gap-0">
            <div className="flex -space-x-4 justify-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-gray-600 border-2 border-[#0a0a0a]"></div>
              ))}
            </div>
            <div className="sm:ml-4 mt-4 sm:mt-0">
              <div className="flex text-yellow-400">
                {'★'.repeat(5)}
              </div>
              <p className="text-gray-300">Validé par +300 entrepreneurs</p>
            </div>
          </div>

          {/* CTA Button */}
          <button className="bg-[#ff0033] text-white px-8 py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-red-600 transition-colors">
            Commander Maintenant
          </button>
        </section>

        {/* Resource Grid */}
        <section className="px-4 sm:px-8 py-8 sm:py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            'Growth Hacking',
            'Tunnels de Vente 2.0',
            'Canva 2025',
            'TikTok Ads',
            'Coaching High Ticket',
            'Amazon KDP',
          ].map((title) => (
            <div key={title} className="bg-[#111111] rounded-xl p-6 hover:bg-[#1a1a1a] transition-colors">
              <div className="aspect-video bg-[#1a1a1a] rounded-lg mb-4"></div>
              <h3 className="text-white font-semibold text-xl mb-2">{title}</h3>
              <p className="text-gray-400 text-sm mb-4">
                Description du produit digital avec ses principaux avantages et caractéristiques.
              </p>
              <button className="w-full bg-[#ff0033] text-white py-2 rounded-lg hover:bg-red-600 transition-colors">
                En savoir plus
              </button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
