"use client";
import { MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function AdminProductRequests() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <MessageSquare className="w-8 h-8 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">Demandes de produits</h1>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">Total demandes</h3>
          <p className="text-3xl font-bold text-blue-400">127</p>
        </div>
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">En attente</h3>
          <p className="text-3xl font-bold text-yellow-400">18</p>
        </div>
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">Approuvées</h3>
          <p className="text-3xl font-bold text-green-400">89</p>
        </div>
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">Refusées</h3>
          <p className="text-3xl font-bold text-red-400">20</p>
        </div>
      </div>

      {/* Tableau des demandes */}
      <div className="bg-[#111] rounded-xl p-6 border border-[#232323] mb-8 overflow-x-auto">
        <h2 className="text-lg font-semibold text-white mb-4">Dernières demandes</h2>
        <table className="min-w-full text-sm text-gray-300">
          <thead>
            <tr className="border-b border-[#232323]">
              <th className="py-2 px-4 text-left">Produit demandé</th>
              <th className="py-2 px-4 text-left">Utilisateur</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Priorité</th>
              <th className="py-2 px-4 text-left">Statut</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#232323]">
              <td className="py-2 px-4">Formation Flutter Avancé</td>
              <td className="py-2 px-4">jean.dupont@email.com</td>
              <td className="py-2 px-4">15/03/2024</td>
              <td className="py-2 px-4"><span className="text-red-400">Haute</span></td>
              <td className="py-2 px-4">
                <span className="flex items-center gap-1 text-yellow-400">
                  <Clock className="w-4 h-4" /> En attente
                </span>
              </td>
              <td className="py-2 px-4">
                <div className="flex gap-2">
                  <button className="text-green-400 hover:underline">Approuver</button>
                  <button className="text-red-400 hover:underline">Refuser</button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4">Pack Design UI/UX</td>
              <td className="py-2 px-4">marie.martin@email.com</td>
              <td className="py-2 px-4">12/03/2024</td>
              <td className="py-2 px-4"><span className="text-green-400">Moyenne</span></td>
              <td className="py-2 px-4">
                <span className="flex items-center gap-1 text-green-400">
                  <CheckCircle className="w-4 h-4" /> Approuvée
                </span>
              </td>
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
        <p>La gestion avancée des demandes arrive bientôt !</p>
      </div>
    </div>
  );
} 