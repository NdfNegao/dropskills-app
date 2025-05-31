"use client";
import { UserCheck, UserPlus, DollarSign } from 'lucide-react';

export default function AdminAffiliates() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <UserCheck className="w-8 h-8 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">Gestion des affiliés</h1>
        <a href="/admin/affiliates/nouveau" className="ml-auto bg-[#ff0033] hover:bg-[#cc0029] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold">
          <UserPlus className="w-5 h-5" /> Nouvel affilié
        </a>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">Total affiliés</h3>
          <p className="text-3xl font-bold text-blue-400">45</p>
        </div>
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">Actifs ce mois</h3>
          <p className="text-3xl font-bold text-green-400">12</p>
        </div>
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">Commissions payées</h3>
          <p className="text-3xl font-bold text-purple-400">€2,450</p>
        </div>
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">En attente</h3>
          <p className="text-3xl font-bold text-yellow-400">€680</p>
        </div>
      </div>

      {/* Tableau des affiliés */}
      <div className="bg-[#111] rounded-xl p-6 border border-[#232323] mb-8 overflow-x-auto">
        <h2 className="text-lg font-semibold text-white mb-4">Liste des affiliés</h2>
        <table className="min-w-full text-sm text-gray-300">
          <thead>
            <tr className="border-b border-[#232323]">
              <th className="py-2 px-4 text-left">Nom</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Code affilié</th>
              <th className="py-2 px-4 text-left">Ventes</th>
              <th className="py-2 px-4 text-left">Commission</th>
              <th className="py-2 px-4 text-left">Statut</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#232323]">
              <td className="py-2 px-4">Marie Dubois</td>
              <td className="py-2 px-4">marie.dubois@email.com</td>
              <td className="py-2 px-4">AFF-MD123</td>
              <td className="py-2 px-4">24</td>
              <td className="py-2 px-4">€720</td>
              <td className="py-2 px-4"><span className="text-green-400">Actif</span></td>
              <td className="py-2 px-4">
                <button className="text-blue-400 hover:underline">Voir</button>
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4">Pierre Martin</td>
              <td className="py-2 px-4">pierre.martin@email.com</td>
              <td className="py-2 px-4">AFF-PM456</td>
              <td className="py-2 px-4">8</td>
              <td className="py-2 px-4">€240</td>
              <td className="py-2 px-4"><span className="text-yellow-400">En attente</span></td>
              <td className="py-2 px-4">
                <button className="text-blue-400 hover:underline">Voir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Message en construction */}
      <div className="bg-yellow-900/20 border border-yellow-700 text-yellow-300 rounded-lg p-6 text-center">
        <p className="text-lg font-semibold mb-2">Section en construction</p>
        <p>La gestion avancée des affiliés arrive bientôt !</p>
      </div>
    </div>
  );
} 