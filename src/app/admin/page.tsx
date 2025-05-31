'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Package, Bot, Activity, LogOut, BarChart3, Settings, FileText } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Vérifier le cookie côté client
    const adminCookie = document.cookie.split('; ').find(row => row.startsWith('admin='));
    if (!adminCookie || adminCookie.split('=')[1] !== 'ok') {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    document.cookie = 'admin=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar simple */}
      <aside className="w-64 bg-[#111] border-r border-[#232323] p-6">
        <h2 className="text-xl font-bold text-white mb-8">Admin Panel</h2>
        <nav className="space-y-2">
          <a href="/admin" className="flex items-center gap-3 p-3 rounded-lg bg-[#ff0033] text-white">
            <BarChart3 size={20} /> Dashboard
          </a>
          <a href="/admin/utilisateurs" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1a1a1a] text-gray-300">
            <Users size={20} /> Utilisateurs
          </a>
          <a href="/admin/outils" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1a1a1a] text-gray-300">
            <Bot size={20} /> Outils IA
          </a>
          <a href="/admin/logs" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1a1a1a] text-gray-300">
            <FileText size={20} /> Logs
          </a>
          <a href="/admin/parametres" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1a1a1a] text-gray-300">
            <Settings size={20} /> Paramètres
          </a>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1a1a1a] text-gray-300 mt-8 w-full">
          <LogOut size={20} /> Déconnexion
        </button>
      </aside>
      
      {/* Contenu principal */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Admin</h1>
          <p className="text-gray-400 mb-8">Vue d'ensemble de la plateforme DropSkills</p>

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
        </div>
      </main>
    </div>
  );
} 