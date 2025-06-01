"use client";
import { MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';

export default function AdminProductRequests() {
  const statsData = [
    {
      title: "Total demandes",
      value: "87",
      icon: <MessageSquare size={24} />
    },
    {
      title: "En attente",
      value: "23",
      icon: <Clock size={24} />
    },
    {
      title: "Approuvées",
      value: "45",
      icon: <CheckCircle size={24} />
    },
    {
      title: "Rejetées",
      value: "19",
      icon: <XCircle size={24} />
    }
  ];

  return (
    <AdminLayoutWithSidebar
      icon={<MessageSquare size={24} />}
      title="Demandes de produits"
      subtitle="Gérez les demandes de produits des utilisateurs"
      stats={statsData}
    >

      {/* Liste des demandes */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow mb-8 overflow-x-auto">
        <h2 className="text-2xl font-semibold text-black mb-6">Demandes récentes</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-700 font-semibold">Utilisateur</th>
              <th className="text-left py-3 px-4 text-gray-700 font-semibold">Produit demandé</th>
              <th className="text-left py-3 px-4 text-gray-700 font-semibold">Catégorie</th>
              <th className="text-left py-3 px-4 text-gray-700 font-semibold">Statut</th>
              <th className="text-left py-3 px-4 text-gray-700 font-semibold">Date</th>
              <th className="text-left py-3 px-4 text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 text-black font-medium">john.doe@email.com</td>
              <td className="py-3 px-4 text-gray-600">Formation React Native</td>
              <td className="py-3 px-4 text-gray-600">Développement</td>
              <td className="py-3 px-4"><span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">En attente</span></td>
              <td className="py-3 px-4 text-gray-600">15/03/2024</td>
              <td className="py-3 px-4">
                <button className="text-green-600 hover:text-green-800 mr-3 font-medium">Approuver</button>
                <button className="text-red-600 hover:text-red-800 font-medium">Rejeter</button>
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
    </AdminLayoutWithSidebar>
  );
}