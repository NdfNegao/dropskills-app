"use client";
import { MessageSquare, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';

export default function AdminSupport() {
  const statsData = [
    {
      title: "Total tickets",
      value: "156",
      icon: <MessageSquare size={24} />
    },
    {
      title: "En attente",
      value: "23",
      icon: <Clock size={24} />
    },
    {
      title: "Résolus",
      value: "128",
      icon: <CheckCircle size={24} />
    },
    {
      title: "Fermés",
      value: "5",
      icon: <AlertCircle size={24} />
    }
  ];

  return (
    <AdminLayoutWithSidebar
      icon={<MessageSquare size={24} />}
      title="Support client"
      subtitle="Gérez les tickets de support et l'assistance client"
      stats={statsData}
    >

      {/* Liste des tickets */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow mb-8 overflow-x-auto">
        <h2 className="text-2xl font-semibold text-black mb-6">Tickets récents</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-700 font-semibold">ID</th>
              <th className="text-left py-3 px-4 text-gray-700 font-semibold">Utilisateur</th>
              <th className="text-left py-3 px-4 text-gray-700 font-semibold">Sujet</th>
              <th className="text-left py-3 px-4 text-gray-700 font-semibold">Statut</th>
              <th className="text-left py-3 px-4 text-gray-700 font-semibold">Date</th>
              <th className="text-left py-3 px-4 text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 text-black font-medium">#001</td>
              <td className="py-3 px-4 text-gray-600">john.doe@email.com</td>
              <td className="py-3 px-4 text-gray-600">Problème de connexion</td>
              <td className="py-3 px-4"><span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">Ouvert</span></td>
              <td className="py-3 px-4 text-gray-600">15/03/2024</td>
              <td className="py-3 px-4">
                <button className="text-blue-600 hover:text-blue-800 mr-3 font-medium">Voir</button>
                <button className="text-green-600 hover:text-green-800 font-medium">Répondre</button>
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
    </AdminLayoutWithSidebar>
  );
}