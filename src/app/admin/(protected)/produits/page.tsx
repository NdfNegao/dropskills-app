import React from 'react';

export default function ProduitsAdmin() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Gestion des produits</h1>
      <button className="mb-4 px-4 py-2 bg-[#ff0033] text-white rounded hover:bg-[#cc0029] transition-colors">Ajouter un produit</button>
      <div className="bg-[#111111] rounded-xl p-6">
        <table className="w-full text-left text-white">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2">Nom</th>
              <th className="py-2">Type</th>
              <th className="py-2">Statut</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-800">
              <td>Ebook Instagram</td>
              <td>PDF</td>
              <td><span className="text-green-400">Actif</span></td>
              <td><button className="text-[#ff0033] hover:underline">Voir</button></td>
            </tr>
            <tr>
              <td>Formation Dropshipping</td>
              <td>Vidéo</td>
              <td><span className="text-yellow-400">Brouillon</span></td>
              <td><button className="text-[#ff0033] hover:underline">Voir</button></td>
            </tr>
          </tbody>
        </table>
        <p className="text-gray-400 mt-6">(Affichage fictif, à connecter à la base de données)</p>
      </div>
    </div>
  );
} 