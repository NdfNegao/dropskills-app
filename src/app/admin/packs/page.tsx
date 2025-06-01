"use client";
import { Package, Plus, TrendingUp } from 'lucide-react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';

export default function AdminPacks() {
  return (
    <AdminLayoutWithSidebar>
      <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Package className="w-8 h-8 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">Gestion des packs</h1>
        <a href="/admin/packs/nouveau" className="ml-auto bg-[#ff0033] hover:bg-[#cc0029] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold">
          <Plus className="w-5 h-5" /> Nouveau pack
        </a>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">Total packs</h3>
          <p className="text-3xl font-bold text-blue-400">24</p>
        </div>
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">Packs actifs</h3>
          <p className="text-3xl font-bold text-green-400">18</p>
        </div>
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">Ventes ce mois</h3>
          <p className="text-3xl font-bold text-purple-400">156</p>
        </div>
        <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-bold text-white mb-2">Revenus totaux</h3>
          <p className="text-3xl font-bold text-yellow-400">€15,240</p>
        </div>
      </div>

      {/* Tableau des packs */}
      <div className="bg-[#111] rounded-xl p-6 border border-[#232323] mb-8 overflow-x-auto">
        <h2 className="text-lg font-semibold text-white mb-4">Liste des packs</h2>
        <table className="min-w-full text-sm text-gray-300">
          <thead>
            <tr className="border-b border-[#232323]">
              <th className="py-2 px-4 text-left">Nom du pack</th>
              <th className="py-2 px-4 text-left">Prix</th>
              <th className="py-2 px-4 text-left">Formations incluses</th>
              <th className="py-2 px-4 text-left">Ventes</th>
              <th className="py-2 px-4 text-left">Statut</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#232323]">
              <td className="py-2 px-4">Pack Développeur Full-Stack</td>
              <td className="py-2 px-4">€297</td>
              <td className="py-2 px-4">12</td>
              <td className="py-2 px-4">45</td>
              <td className="py-2 px-4"><span className="text-green-400">Actif</span></td>
              <td className="py-2 px-4">
                <div className="flex gap-2">
                  <button className="text-blue-400 hover:underline">Modifier</button>
                  <button className="text-red-400 hover:underline">Désactiver</button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4">Pack Design & UX</td>
              <td className="py-2 px-4">€197</td>
              <td className="py-2 px-4">8</td>
              <td className="py-2 px-4">32</td>
              <td className="py-2 px-4"><span className="text-green-400">Actif</span></td>
              <td className="py-2 px-4">
                <div className="flex gap-2">
                  <button className="text-blue-400 hover:underline">Modifier</button>
                  <button className="text-red-400 hover:underline">Désactiver</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Top performers */}
      <div className="bg-[#111] rounded-xl p-6 border border-[#232323] mb-8">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Packs les plus vendus
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-[#0a0a0a] rounded-lg">
            <span className="text-gray-300">Pack Développeur Full-Stack</span>
            <span className="text-green-400 font-semibold">45 ventes</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-[#0a0a0a] rounded-lg">
            <span className="text-gray-300">Pack Design & UX</span>
            <span className="text-green-400 font-semibold">32 ventes</span>
          </div>
        </div>
      </div>

      {/* Message en construction */}
      <div className="bg-yellow-900/20 border border-yellow-700 text-yellow-300 rounded-lg p-6 text-center">
        <p className="text-lg font-semibold mb-2">Section en construction</p>
        <p>La gestion avancée des packs arrive bientôt !</p>
      </div>
      </div>
    </AdminLayoutWithSidebar>
  );
}