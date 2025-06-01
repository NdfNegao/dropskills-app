"use client";
import { Package, Plus, TrendingUp, CheckCircle, Clock, Archive } from 'lucide-react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';

export default function AdminPacks() {
  const statsData = [
    {
      title: "Total packs",
      value: "24",
      icon: <Package size={24} />
    },
    {
      title: "Actifs",
      value: "18",
      icon: <CheckCircle size={24} />
    },
    {
      title: "En attente",
      value: "4",
      icon: <Clock size={24} />
    },
    {
      title: "Archivés",
      value: "2",
      icon: <Archive size={24} />
    }
  ];

  return (
    <AdminLayoutWithSidebar
      icon={<Package size={24} />}
      title="Gestion des packs"
      subtitle="Créez et gérez vos offres de formation groupées"
      stats={statsData}
    >
        <div className="flex justify-end mb-6">
          <a href="/admin/packs/nouveau" className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold">
            <Plus className="w-5 h-5" /> Nouveau pack
          </a>
        </div>

        {/* Liste des packs */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8 overflow-x-auto">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Gestion des packs</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Nom</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Prix</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Statut</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Ventes</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Date création</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 text-black font-medium">Pack Débutant</td>
              <td className="py-3 px-4 text-gray-600 font-semibold">€29</td>
              <td className="py-3 px-4"><span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">Actif</span></td>
              <td className="py-3 px-4 text-gray-600">45</td>
              <td className="py-3 px-4 text-gray-600">15/03/2024</td>
              <td className="py-3 px-4">
                <button className="text-blue-600 hover:text-blue-800 mr-3 font-medium">Modifier</button>
                <button className="text-red-600 hover:text-red-800 font-medium">Supprimer</button>
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

        {/* Actions rapides */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">Actions rapides</h3>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">Exporter la liste</button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">Créer un bundle</button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium">Rapport de ventes</button>
          </div>
        </div>
    </AdminLayoutWithSidebar>
  );
}