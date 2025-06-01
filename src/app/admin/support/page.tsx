"use client";
import { MessageSquare, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';

export default function AdminSupport() {
  return (
    <AdminLayoutWithSidebar>
      <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <MessageSquare className="w-8 h-8 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">Support client</h1>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">Total tickets</h3>
          <p className="text-3xl font-bold text-blue-400">234</p>
        </div>
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">Ouverts</h3>
          <p className="text-3xl font-bold text-red-400">12</p>
        </div>
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">En cours</h3>
          <p className="text-3xl font-bold text-yellow-400">8</p>
        </div>
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">Résolus</h3>
          <p className="text-3xl font-bold text-green-400">214</p>
        </div>
      </div>

      {/* Tableau des tickets */}
      <div className="bg-[#111] rounded-xl p-6 border border-[#232323] mb-8 overflow-x-auto">
        <h2 className="text-lg font-semibold text-white mb-4">Tickets récents</h2>
        <table className="min-w-full text-sm text-gray-300">
          <thead>
            <tr className="border-b border-[#232323]">
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Sujet</th>
              <th className="py-2 px-4 text-left">Utilisateur</th>
              <th className="py-2 px-4 text-left">Priorité</th>
              <th className="py-2 px-4 text-left">Statut</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#232323]">
              <td className="py-2 px-4">#1234</td>
              <td className="py-2 px-4">Problème de connexion</td>
              <td className="py-2 px-4">jean.dupont@email.com</td>
              <td className="py-2 px-4">
                <span className="flex items-center gap-1 text-red-400">
                  <AlertCircle className="w-4 h-4" /> Haute
                </span>
              </td>
              <td className="py-2 px-4">
                <span className="flex items-center gap-1 text-yellow-400">
                  <Clock className="w-4 h-4" /> En cours
                </span>
              </td>
              <td className="py-2 px-4">15/03/2024</td>
              <td className="py-2 px-4">
                <button className="text-blue-400 hover:underline">Répondre</button>
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4">#1233</td>
              <td className="py-2 px-4">Question sur facturation</td>
              <td className="py-2 px-4">marie.martin@email.com</td>
              <td className="py-2 px-4">
                <span className="text-green-400">Normale</span>
              </td>
              <td className="py-2 px-4">
                <span className="flex items-center gap-1 text-green-400">
                  <CheckCircle className="w-4 h-4" /> Résolu
                </span>
              </td>
              <td className="py-2 px-4">14/03/2024</td>
              <td className="py-2 px-4">
                <button className="text-blue-400 hover:underline">Voir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Métriques de performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-semibold text-white mb-4">Temps de réponse moyen</h3>
          <p className="text-2xl font-bold text-blue-400">2h 15min</p>
          <p className="text-sm text-gray-400 mt-2">↓ 15% vs mois dernier</p>
        </div>
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-semibold text-white mb-4">Satisfaction client</h3>
          <p className="text-2xl font-bold text-green-400">94%</p>
          <p className="text-sm text-gray-400 mt-2">↑ 3% vs mois dernier</p>
        </div>
      </div>

      {/* Message en construction */}
      <div className="bg-yellow-900/20 border border-yellow-700 text-yellow-300 rounded-lg p-6 text-center">
        <p className="text-lg font-semibold mb-2">Section en construction</p>
        <p>La gestion avancée du support arrive bientôt !</p>
      </div>
      </div>
    </AdminLayoutWithSidebar>
  );
}