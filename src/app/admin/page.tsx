'use client';

import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';
import { Users, Package, Bot, Activity, BarChart3, Settings, FileText } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <AdminLayoutWithSidebar
      icon={<BarChart3 />}
      title="Dashboard Admin"
      subtitle="Vue d'ensemble de la plateforme DropSkills"
    >
      {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
              <Users className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold text-white">1,234</h3>
              <p className="text-gray-400 text-sm">Utilisateurs</p>
            </div>
            <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
              <Package className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-2xl font-bold text-white">567</h3>
              <p className="text-gray-400 text-sm">Packs Vendus</p>
            </div>
            <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
              <Bot className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold text-white">6</h3>
              <p className="text-gray-400 text-sm">Outils IA</p>
            </div>
            <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
              <Activity className="w-8 h-8 text-[#ff0033] mb-4" />
              <h3 className="text-2xl font-bold text-white">89%</h3>
              <p className="text-gray-400 text-sm">Activité</p>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-[#111] rounded-xl p-6 border border-[#232323]">
            <h2 className="text-xl font-semibold text-white mb-4">Actions Rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/admin/utilisateurs/nouveau" className="block p-4 bg-[#1a1a1a] rounded-lg border border-[#232323] hover:border-[#ff0033] transition-colors">
                <h3 className="text-white font-medium">Créer un utilisateur</h3>
                <p className="text-gray-400 text-sm mt-1">Ajouter un nouvel utilisateur</p>
              </a>
              <a href="/admin/outils/nouveau" className="block p-4 bg-[#1a1a1a] rounded-lg border border-[#232323] hover:border-[#ff0033] transition-colors">
                <h3 className="text-white font-medium">Nouvel outil IA</h3>
                <p className="text-gray-400 text-sm mt-1">Ajouter un outil IA</p>
              </a>
              <a href="/admin/logs" className="block p-4 bg-[#1a1a1a] rounded-lg border border-[#232323] hover:border-[#ff0033] transition-colors">
                <h3 className="text-white font-medium">Voir les logs</h3>
                <p className="text-gray-400 text-sm mt-1">Consulter l'activité système</p>
              </a>
            </div>
          </div>
      </AdminLayoutWithSidebar>
    );
  }