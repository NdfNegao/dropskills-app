'use client';

import React from 'react';
import LayoutWithSidebar, { useCurrentUser } from '@/components/LayoutWithSidebar';
import { Package, Users, TrendingUp, Star } from 'lucide-react';

export default function DashboardPage() {
  const userId = useCurrentUser();

  return (
    <LayoutWithSidebar userId={userId}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de Bord Dropskills
          </h1>
          <p className="text-gray-600">
            Vue d'ensemble de votre activité sur la plateforme V2 ultra-simplifiée
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            icon={<Package className="w-8 h-8 text-blue-600" />}
            title="Mes Packs"
            value="3"
            description="Produits achetés"
            color="blue"
          />
          
          <StatsCard
            icon={<Star className="w-8 h-8 text-yellow-600" />}
            title="Favoris"
            value="7"
            description="Packs favoris"
            color="yellow"
          />
          
          <StatsCard
            icon={<TrendingUp className="w-8 h-8 text-green-600" />}
            title="Progression"
            value="85%"
            description="Contenu consulté"
            color="green"
          />
          
          <StatsCard
            icon={<Users className="w-8 h-8 text-purple-600" />}
            title="Statut"
            value="Premium"
            description="Accès complet"
            color="purple"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Activité Récente
          </h2>
          <div className="space-y-3">
            <ActivityItem
              action="Nouveau pack acheté"
              item="Formation Marketing Digital"
              time="Il y a 2 heures"
            />
            <ActivityItem
              action="Outil IA utilisé"
              item="Générateur d'Offre"
              time="Il y a 1 jour"
            />
            <ActivityItem
              action="Favori ajouté"
              item="Pack Tunnel de Vente"
              time="Il y a 3 jours"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Actions Rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActionCard
              title="Explorer le Catalogue"
              description="Découvrir de nouveaux packs"
              href="/catalogue"
              color="blue"
            />
            <QuickActionCard
              title="Utiliser l'IA"
              description="Accéder aux outils premium"
              href="/outils"
              color="purple"
            />
            <QuickActionCard
              title="Voir mes Tutoriels"
              description="Guides et formations"
              href="/tutoriels"
              color="green"
            />
          </div>
        </div>
      </div>
    </LayoutWithSidebar>
  );
}

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  color: 'blue' | 'yellow' | 'green' | 'purple';
}

function StatsCard({ icon, title, value, description, color }: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200'
  };

  return (
    <div className={`${colorClasses[color]} rounded-xl p-6 border`}>
      <div className="flex items-center justify-between mb-4">
        {icon}
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

interface ActivityItemProps {
  action: string;
  item: string;
  time: string;
}

function ActivityItem({ action, item, time }: ActivityItemProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="font-medium text-gray-900">{action}</p>
        <p className="text-sm text-gray-600">{item}</p>
      </div>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  color: 'blue' | 'purple' | 'green';
}

function QuickActionCard({ title, description, href, color }: QuickActionCardProps) {
  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    green: 'bg-green-600 hover:bg-green-700'
  };

  return (
    <a
      href={href}
      className={`${colorClasses[color]} text-white p-4 rounded-lg transition-colors block`}
    >
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </a>
  );
} 