'use client';

import { useEffect, useState } from 'react';

type DashboardStats = {
  totalUsers: number;
  totalProducts: number;
  totalSales: number;
  activeUsers: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalSales: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    // Simuler le chargement des données
    setStats({
      totalUsers: 1250,
      totalProducts: 45,
      totalSales: 3200,
      activeUsers: 780,
    });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Tableau de bord</h1>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-[#111111] p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm mb-2">Utilisateurs totaux</h3>
          <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
        </div>

        <div className="bg-[#111111] p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm mb-2">Produits actifs</h3>
          <p className="text-3xl font-bold text-white">{stats.totalProducts}</p>
        </div>

        <div className="bg-[#111111] p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm mb-2">Ventes totales</h3>
          <p className="text-3xl font-bold text-white">{stats.totalSales}€</p>
        </div>

        <div className="bg-[#111111] p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm mb-2">Utilisateurs actifs</h3>
          <p className="text-3xl font-bold text-white">{stats.activeUsers}</p>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-[#111111] p-6 rounded-xl mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-[#1a1a1a] text-white p-4 rounded-lg hover:bg-[#222222] transition-colors">
            Ajouter un produit
          </button>
          <button className="bg-[#1a1a1a] text-white p-4 rounded-lg hover:bg-[#222222] transition-colors">
            Gérer les utilisateurs
          </button>
          <button className="bg-[#1a1a1a] text-white p-4 rounded-lg hover:bg-[#222222] transition-colors">
            Voir les rapports
          </button>
        </div>
      </div>

      {/* Dernières activités */}
      <div className="bg-[#111111] p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-white mb-4">Dernières activités</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
            <div>
              <p className="text-white">Nouvelle inscription</p>
              <p className="text-sm text-gray-400">Il y a 5 minutes</p>
            </div>
            <span className="text-[#ff0033]">→</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
            <div>
              <p className="text-white">Nouveau produit ajouté</p>
              <p className="text-sm text-gray-400">Il y a 15 minutes</p>
            </div>
            <span className="text-[#ff0033]">→</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
            <div>
              <p className="text-white">Vente effectuée</p>
              <p className="text-sm text-gray-400">Il y a 30 minutes</p>
            </div>
            <span className="text-[#ff0033]">→</span>
          </div>
        </div>
      </div>
    </div>
  );
} 