import Sidebar from '../../components/Sidebar';

export default function PopulairePage() {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Produits Populaires</h1>
          <p className="text-gray-400">Découvrez nos produits les plus plébiscités par la communauté.</p>
        </div>

        {/* Grille de produits */}
        <div className="grid grid-cols-3 gap-8">
          {[
            {
              title: 'Growth Hacking Pro',
              rating: 4.9,
              sales: 1240,
              price: 97,
              category: 'Marketing Digital'
            },
            {
              title: 'Tunnels de Vente Master',
              rating: 4.8,
              sales: 890,
              price: 147,
              category: 'Business'
            },
            {
              title: 'TikTok Ads Expert',
              rating: 4.9,
              sales: 750,
              price: 197,
              category: 'Marketing Digital'
            },
            // Ajoutez plus de produits ici
          ].map((product) => (
            <div key={product.title} className="bg-[#111111] rounded-xl p-6 hover:bg-[#1a1a1a] transition-all duration-200">
              <div className="aspect-video bg-[#1a1a1a] rounded-lg mb-4"></div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">{product.category}</span>
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="text-white">{product.rating}</span>
                </div>
              </div>
              <h3 className="text-white font-semibold text-xl mb-2">{product.title}</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">{product.sales} ventes</span>
                <span className="text-[#ff0033] font-bold">{product.price}€</span>
              </div>
              <button className="w-full bg-[#ff0033] text-white py-2 rounded-lg hover:bg-[#cc0029] transition-colors">
                Voir le produit
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 