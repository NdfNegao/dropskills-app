"use client";
import { Bot, Plus, Zap, Activity } from 'lucide-react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';

export default function AdminOutilsIA() {
  const statsData = [
    {
      title: "Total outils IA",
      value: "28",
      icon: <Bot size={24} />
    },
    {
      title: "Actifs",
      value: "25",
      icon: <Zap size={24} />
    },
    {
      title: "Utilisations/jour",
      value: "456",
      icon: <Activity size={24} />
    },
    {
      title: "Premium",
      value: "12",
      icon: <Plus size={24} />
    }
  ];

  return (
    <AdminLayoutWithSidebar
      icon={<Bot size={24} />}
      title="Gestion des outils IA"
      subtitle="Gérez les outils d'intelligence artificielle de la plateforme"
      stats={statsData}
    >

      {/* Liste des outils IA */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow mb-8 overflow-x-auto">
        <h2 className="text-2xl font-semibold text-black mb-6">Gestion des outils IA</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-700 font-semibold">Nom</th>
              <th className="text-left py-3 px-4 text-gray-700 font-semibold">Catégorie</th>
              <th className="text-left py-3 px-4 text-gray-700 font-semibold">Modèle IA</th>
              <th className="text-left py-3 px-4 text-gray-700 font-semibold">Statut</th>
              <th className="text-left py-3 px-4 text-gray-700 font-semibold">Utilisations</th>
              <th className="text-left py-3 px-4 text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 text-black font-medium">Générateur de contenu</td>
              <td className="py-3 px-4 text-gray-600">Marketing</td>
              <td className="py-3 px-4 text-gray-600">GPT-4</td>
              <td className="py-3 px-4"><span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">Actif</span></td>
              <td className="py-3 px-4 text-gray-600">1,234</td>
              <td className="py-3 px-4">
                <button className="text-blue-600 hover:text-blue-800 mr-3 font-medium">Modifier</button>
                <button className="text-red-600 hover:text-red-800 font-medium">Désactiver</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Outils populaires */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          Outils les plus utilisés
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-gray-700 font-medium">Générateur de Code</span>
            <span className="text-yellow-600 font-semibold">1.2k utilisations</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-gray-700 font-medium">Assistant Marketing</span>
            <span className="text-yellow-600 font-semibold">856 utilisations</span>
          </div>
        </div>
      </div>

        {/* Message en construction */}
        <div className="bg-yellow-900/20 border border-yellow-700 text-yellow-300 rounded-lg p-6 text-center">
          <p className="text-lg font-semibold mb-2">Section en construction</p>
          <p>La gestion avancée des outils IA arrive bientôt !</p>
        </div>
    </AdminLayoutWithSidebar>
  );
}