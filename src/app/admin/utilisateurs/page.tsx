"use client";
import { Users, UserPlus } from 'lucide-react';

export default function AdminUtilisateurs() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Users className="w-8 h-8 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">Gestion des utilisateurs</h1>
        <a href="/admin/utilisateurs/nouveau" className="ml-auto bg-[#ff0033] hover:bg-[#cc0029] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold">
          <UserPlus className="w-5 h-5" /> Nouvel utilisateur
        </a>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">Total inscrits</h3>
          <p className="text-3xl font-bold text-blue-400">1,234</p>
        </div>
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">Admins</h3>
          <p className="text-3xl font-bold text-green-400">2</p>
        </div>
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">Nouveaux ce mois</h3>
          <p className="text-3xl font-bold text-purple-400">12</p>
        </div>
      </div>

      {/* Tableau d'exemple */}
      <div className="bg-[#111] rounded-xl p-6 border border-[#232323] mb-8 overflow-x-auto">
        <h2 className="text-lg font-semibold text-white mb-4">Liste des utilisateurs</h2>
        <table className="min-w-full text-sm text-gray-300">
          <thead>
            <tr className="border-b border-[#232323]">
              <th className="py-2 px-4 text-left">Nom</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Rôle</th>
              <th className="py-2 px-4 text-left">Date d'inscription</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#232323]">
              <td className="py-2 px-4">Cyril Iriebi</td>
              <td className="py-2 px-4">cyril.iriebi@gmail.com</td>
              <td className="py-2 px-4">ADMIN</td>
              <td className="py-2 px-4">01/01/2024</td>
              <td className="py-2 px-4">
                <button className="text-blue-400 hover:underline">Voir</button>
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4">Jane Doe</td>
              <td className="py-2 px-4">jane.doe@email.com</td>
              <td className="py-2 px-4">USER</td>
              <td className="py-2 px-4">15/03/2024</td>
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
        <p>La gestion avancée des utilisateurs arrive bientôt !</p>
      </div>
    </div>
  );
} 