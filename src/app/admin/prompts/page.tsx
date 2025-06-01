"use client";
import { BrainCircuit, Plus, Star, Copy } from 'lucide-react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';

export default function AdminPrompts() {
  return (
    <AdminLayoutWithSidebar>
      <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <BrainCircuit className="w-8 h-8 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">Gestion des prompts IA</h1>
        <a href="/admin/prompts/nouveau" className="ml-auto bg-[#ff0033] hover:bg-[#cc0029] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold">
          <Plus className="w-5 h-5" /> Nouveau prompt
        </a>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">Total prompts</h3>
          <p className="text-3xl font-bold text-blue-400">89</p>
        </div>
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">Prompts publics</h3>
          <p className="text-3xl font-bold text-green-400">67</p>
        </div>
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">Utilisations</h3>
          <p className="text-3xl font-bold text-purple-400">5.2k</p>
        </div>
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">Note moyenne</h3>
          <p className="text-3xl font-bold text-yellow-400">4.7</p>
        </div>
      </div>

      {/* Tableau des prompts */}
      <div className="bg-[#111] rounded-xl p-6 border border-[#232323] mb-8 overflow-x-auto">
        <h2 className="text-lg font-semibold text-white mb-4">Liste des prompts</h2>
        <table className="min-w-full text-sm text-gray-300">
          <thead>
            <tr className="border-b border-[#232323]">
              <th className="py-2 px-4 text-left">Titre</th>
              <th className="py-2 px-4 text-left">Catégorie</th>
              <th className="py-2 px-4 text-left">Auteur</th>
              <th className="py-2 px-4 text-left">Utilisations</th>
              <th className="py-2 px-4 text-left">Note</th>
              <th className="py-2 px-4 text-left">Statut</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#232323]">
              <td className="py-2 px-4">Assistant Code JavaScript</td>
              <td className="py-2 px-4">Développement</td>
              <td className="py-2 px-4">Admin</td>
              <td className="py-2 px-4">456</td>
              <td className="py-2 px-4">
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-4 h-4 fill-current" /> 4.8
                </span>
              </td>
              <td className="py-2 px-4"><span className="text-green-400">Public</span></td>
              <td className="py-2 px-4">
                <div className="flex gap-2">
                  <button className="text-blue-400 hover:underline">Modifier</button>
                  <button className="text-gray-400 hover:underline">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4">Générateur de contenu marketing</td>
              <td className="py-2 px-4">Marketing</td>
              <td className="py-2 px-4">Admin</td>
              <td className="py-2 px-4">324</td>
              <td className="py-2 px-4">
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-4 h-4 fill-current" /> 4.6
                </span>
              </td>
              <td className="py-2 px-4"><span className="text-green-400">Public</span></td>
              <td className="py-2 px-4">
                <div className="flex gap-2">
                  <button className="text-blue-400 hover:underline">Modifier</button>
                  <button className="text-gray-400 hover:underline">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Prompts populaires */}
      <div className="bg-[#111] rounded-xl p-6 border border-[#232323] mb-8">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          Prompts les plus populaires
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-[#0a0a0a] rounded-lg">
            <span className="text-gray-300">Assistant Code JavaScript</span>
            <span className="text-yellow-400 font-semibold">456 utilisations</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-[#0a0a0a] rounded-lg">
            <span className="text-gray-300">Générateur de contenu marketing</span>
            <span className="text-yellow-400 font-semibold">324 utilisations</span>
          </div>
        </div>
      </div>

      {/* Message en construction */}
      <div className="bg-yellow-900/20 border border-yellow-700 text-yellow-300 rounded-lg p-6 text-center">
        <p className="text-lg font-semibold mb-2">Section en construction</p>
        <p>La gestion avancée des prompts IA arrive bientôt !</p>
      </div>
      </div>
    </AdminLayoutWithSidebar>
  );
}