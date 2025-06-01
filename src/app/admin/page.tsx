'use client';

import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';
import { Users, Package, Bot, Activity, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const statsData = [
    {
      icon: <Users className="w-5 h-5" />,
      label: "Utilisateurs",
      value: "1,234",
      color: "text-blue-400"
    },
    {
      icon: <Package className="w-5 h-5" />,
      label: "Packs Vendus",
      value: "567",
      color: "text-green-400"
    },
    {
      icon: <Bot className="w-5 h-5" />,
      label: "Outils IA",
      value: "6",
      color: "text-purple-400"
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: "Activité",
      value: "89%",
      color: "text-red-400"
    }
  ];

  return (
    <AdminLayoutWithSidebar
      icon={<BarChart3 className="w-5 h-5" />}
      title="Dashboard Admin"
      subtitle="Vue d'ensemble de la plateforme DropSkills"
      statsData={statsData}
    >

      {/* Actions rapides */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-black mb-6">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Users className="w-5 h-5 text-blue-600 mr-3" />
            <span className="text-blue-700 font-medium">Gérer les utilisateurs</span>
          </button>
          <button className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Package className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-green-700 font-medium">Ajouter un pack</span>
          </button>
          <button className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <Bot className="w-5 h-5 text-purple-600 mr-3" />
            <span className="text-purple-700 font-medium">Configurer IA</span>
          </button>
        </div>
      </div>
    </AdminLayoutWithSidebar>
  );
}