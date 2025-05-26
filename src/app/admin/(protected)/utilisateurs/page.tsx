import React from 'react';

export default function UtilisateursAdmin() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Gestion des utilisateurs</h1>
      <button className="mb-4 px-4 py-2 bg-[#ff0033] text-white rounded hover:bg-[#cc0029] transition-colors">Ajouter un utilisateur</button>
      <div className="bg-[#111111] rounded-xl p-6">
        <table className="w-full text-left text-white">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2">Nom</th>
              <th className="py-2">Email</th>
              <th className="py-2">Rôle</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-800">
              <td>Jean Dupont</td>
              <td>jean@exemple.com</td>
              <td>Admin</td>
              <td><button className="text-[#ff0033] hover:underline">Voir</button></td>
            </tr>
            <tr>
              <td>Marie Martin</td>
              <td>marie@exemple.com</td>
              <td>Utilisateur</td>
              <td><button className="text-[#ff0033] hover:underline">Voir</button></td>
            </tr>
          </tbody>
        </table>
        <p className="text-gray-400 mt-6">(Affichage fictif, à connecter à la base de données)</p>
      </div>
    </div>
  );
} 