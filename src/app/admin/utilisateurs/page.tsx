'use client';

import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';
import { Users, UserPlus, UserCheck, UserX } from 'lucide-react';

export default function UsersPage() {
  const statsData = [
    {
      title: "Total utilisateurs",
      value: "1,234",
      icon: <Users size={24} />
    },
    {
      title: "Nouveaux ce mois",
      value: "45",
      icon: <UserPlus size={24} />
    },
    {
      title: "Actifs",
      value: "1,189",
      icon: <UserCheck size={24} />
    },
    {
      title: "Suspendus",
      value: "45",
      icon: <UserX size={24} />
    }
  ];

  return (
    <AdminLayoutWithSidebar
      icon={<Users size={24} />}
      title="Gestion des utilisateurs"
      subtitle="Gérez les comptes utilisateurs de la plateforme"
      stats={statsData}
    >

      {/* Liste des utilisateurs */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow mb-8 overflow-x-auto">
        <h2 className="text-2xl font-semibold text-black mb-6">Liste des utilisateurs</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-700 font-semibold">Nom</th>
              <th className="text-left py-3 px-4 text-gray-700 font-semibold">Email</th>
              <th className="text-left py-3 px-4 text-gray-700 font-semibold">Rôle</th>
              <th className="text-left py-3 px-4 text-gray-700 font-semibold">Inscription</th>
              <th className="text-left py-3 px-4 text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 text-black font-medium">Cyril Iriebi</td>
              <td className="py-3 px-4 text-gray-600">cyril.iriebi@gmail.com</td>
              <td className="py-3 px-4"><span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">Admin</span></td>
              <td className="py-3 px-4 text-gray-600">15/03/2024</td>
              <td className="py-3 px-4">
                <button className="text-blue-600 hover:text-blue-800 mr-3 font-medium">Voir</button>
                <button className="text-yellow-600 hover:text-yellow-800 mr-3 font-medium">Modifier</button>
                <button className="text-red-600 hover:text-red-800 font-medium">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

        {/* Message en construction */}
        <div className="bg-yellow-900/20 border border-yellow-700 text-yellow-300 rounded-lg p-6 text-center">
          <p className="text-lg font-semibold mb-2">Section en construction</p>
          <p>La gestion avancée des utilisateurs arrive bientôt !</p>
        </div>
    </AdminLayoutWithSidebar>
  );
}