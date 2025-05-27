import React from "react";

export default function DropskillsDashboard() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 p-6 flex flex-col gap-4 border-r border-neutral-800">
        <h2 className="text-2xl font-bold mb-4">Dropskills</h2>
        <nav className="flex flex-col gap-2">
          <a className="hover:text-sky-400 transition" href="#">Accueil</a>
          <a className="hover:text-sky-400 transition" href="#">🔥 Populaires</a>
          <a className="hover:text-sky-400 transition" href="#">🎁 Packs gratuits</a>
          <a className="hover:text-sky-400 transition" href="#">🗂️ Catégories</a>
          <a className="hover:text-sky-400 transition" href="#">⭐ Favoris</a>
          <a className="hover:text-sky-400 transition" href="#">🆕 Nouveautés IA</a>
          <a className="hover:text-sky-400 transition" href="#">🛠️ Outils IA & Templates</a>
          <a className="hover:text-sky-400 transition" href="#">🎓 Learning</a>
          <a className="hover:text-sky-400 transition" href="#">💬 Communauté</a>
          <a className="hover:text-sky-400 transition" href="#">💡 Demandes de packs</a>
        </nav>
        <button className="mt-6 bg-gradient-to-r from-sky-500 to-indigo-500 py-2 rounded-xl shadow text-white font-semibold hover:scale-105 transition">🚀 Passer en Premium</button>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2">La bibliothèque ultime pour lancer un business IA-ready en 24h</h1>
          <p className="text-lg text-neutral-300 mb-4">Des packs business, des outils IA, des templates et un support humain – tout-en-un, accessible à tous.</p>
          <div className="flex gap-4">
            <button className="bg-sky-500 hover:bg-sky-600 transition rounded-xl px-6 py-3 font-bold text-lg">Essayer un pack gratuit</button>
            <button className="bg-neutral-800 hover:bg-neutral-700 transition rounded-xl px-6 py-3 font-bold text-lg border border-neutral-700">Accéder à la bibliothèque</button>
          </div>
        </header>
        {/* Trending Packs */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Ressources à la une</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[
              { title: "Funnel E-commerce IA", badge: "Nouveau", desc: "Tunnel, scripts et prompts IA prêts à vendre" },
              { title: "YouTube Accelerator", badge: "Best Seller", desc: "Tout pour lancer ta chaîne rentable" },
              { title: "Starter Diaspora Pack", badge: "Starter", desc: "Business model adapté diaspora/expat" },
              { title: "Script Copywriting Pro", badge: "", desc: "Templates copywriting & IA inclus" },
              { title: "Diagnostic Business Express", badge: "", desc: "Questionnaire + recommandation IA" }
            ].map((pack, idx) => (
              <div key={idx} className="bg-neutral-900 rounded-2xl p-6 shadow flex flex-col gap-2 border border-neutral-800 relative group hover:shadow-lg hover:border-sky-500/30 transition">
                <span className="absolute right-4 top-4 bg-sky-500 px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider">{pack.badge}</span>
                <h3 className="text-xl font-bold mb-1">{pack.title}</h3>
                <p className="text-neutral-300 mb-4">{pack.desc}</p>
                <div className="flex gap-3 mt-auto">
                  <button className="bg-sky-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-sky-600">Ouvrir</button>
                  <button className="bg-neutral-800 border border-neutral-700 px-4 py-2 rounded-lg text-white font-semibold hover:bg-neutral-700">Télécharger</button>
                  <button className="ml-auto text-sky-400 hover:text-sky-300"><span role="img" aria-label="Favoris">⭐</span></button>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Découvre Dropskills */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Découvre Dropskills</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800 shadow flex flex-col gap-2">
              <h4 className="text-lg font-semibold mb-2">Clé-en-main</h4>
              <p className="text-neutral-300">Tunnel, emails, prompts IA et pages de vente inclus avec chaque pack.</p>
            </div>
            <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800 shadow flex flex-col gap-2">
              <h4 className="text-lg font-semibold mb-2">Simple & accessible</h4>
              <p className="text-neutral-300">Aucune compétence technique requise : tout est prêt, même pour les débutants.</p>
            </div>
            <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800 shadow flex flex-col gap-2">
              <h4 className="text-lg font-semibold mb-2">Accompagnement humain</h4>
              <p className="text-neutral-300">Support WhatsApp, lives, communauté active et mises à jour régulières.</p>
            </div>
          </div>
        </section>
        {/* Comment ça marche ? */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Comment ça marche ?</h2>
          <ol className="list-decimal ml-8 text-neutral-300 flex flex-col gap-2">
            <li>Crée ton compte en 30 secondes</li>
            <li>Choisis, filtre et télécharge ton pack business</li>
            <li>Lance ton business ou upgrade-le (support IA & humain inclus)</li>
          </ol>
        </section>
        {/* Comparatif */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Pourquoi choisir Dropskills ?</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-neutral-800 rounded-xl text-left bg-neutral-900">
              <thead>
                <tr className="bg-neutral-800">
                  <th className="p-3">&nbsp;</th>
                  <th className="p-3">Dropskills</th>
                  <th className="p-3">Autres MRR/PLR</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Packs IA-ready', '✅', '❌'],
                  ['Support humain', '✅', '❌'],
                  ['Mises à jour mensuelles', '✅', '❌'],
                  ['Communauté active', '✅', '❌'],
                  ['Templates exclusifs', '✅', '❌'],
                  ['Packs diaspora/thématiques', '✅', '❌'],
                  ["Facilité d'usage", '✅', '❌'],
                  ['Zéro bullshit', '✅', '❌']
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="p-3 border-b border-neutral-800">{row[0]}</td>
                    <td className="p-3 border-b border-neutral-800">{row[1]}</td>
                    <td className="p-3 border-b border-neutral-800">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        {/* Testimonials & Community */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Ils ont lancé leur business avec Dropskills</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <blockquote className="bg-neutral-900 rounded-xl p-6 border-l-4 border-sky-500 text-neutral-200 shadow">"Dropskills m'a permis de vendre ma première formation en 48h, sans galère !"</blockquote>
            <blockquote className="bg-neutral-900 rounded-xl p-6 border-l-4 border-sky-500 text-neutral-200 shadow">"Le support WhatsApp m'a vraiment aidé à débloquer mes premiers clients."</blockquote>
            <blockquote className="bg-neutral-900 rounded-xl p-6 border-l-4 border-sky-500 text-neutral-200 shadow">"Enfin une vraie communauté, pas juste des vendeurs de rêve !"</blockquote>
          </div>
        </section>
        {/* FAQ & Support */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">FAQ & Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ul className="text-neutral-300 flex flex-col gap-2">
              <li>• Puis-je utiliser Dropskills même si je débute ?</li>
              <li>• Quelle différence entre un pack gratuit et premium ?</li>
              <li>• Les packs sont-ils mis à jour ?</li>
              <li>• Comment contacter le support humain ?</li>
              <li>• Puis-je personnaliser les templates IA ?</li>
            </ul>
            <div className="flex flex-col gap-3">
              <button className="bg-sky-500 px-4 py-3 rounded-xl text-white font-bold hover:bg-sky-600">Parler à un expert</button>
              <button className="bg-neutral-800 px-4 py-3 rounded-xl text-white font-bold border border-neutral-700 hover:bg-neutral-700">Envoyer un email</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
