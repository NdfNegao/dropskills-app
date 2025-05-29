'use client';

import React from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Package, Users, TrendingUp, Star, Zap, Target, Mail, BarChart3 } from 'lucide-react';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Encore en chargement
    if (!session) {
      router.push('/auth/signin');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff0033]"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user as any;

  return (
    <LayoutWithSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <h1 className="text-3xl font-bold text-white mb-2">
            Bienvenue, {user?.firstName || user?.name || 'Utilisateur'} !
          </h1>
          <p className="text-gray-400">
            Votre tableau de bord DropSkills - Accédez à vos outils IA et suivez vos progrès
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-[#ff0033]/10 text-[#ff0033] px-3 py-1 rounded-full text-sm">
            <span className="w-2 h-2 bg-[#ff0033] rounded-full"></span>
            Statut: {user?.role === 'PREMIUM' ? 'Premium' : user?.role === 'SUPER_ADMIN' ? 'Admin' : 'Standard'}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            icon={<Zap className="w-8 h-8 text-blue-400" />}
            title="Outils IA"
            value="12"
            description="Outils disponibles"
            color="blue"
          />
          
          <StatsCard
            icon={<Target className="w-8 h-8 text-green-400" />}
            title="Générations"
            value="47"
            description="Ce mois-ci"
            color="green"
          />
          
          <StatsCard
            icon={<BarChart3 className="w-8 h-8 text-purple-400" />}
            title="Productivité"
            value="+127%"
            description="Amélioration"
            color="purple"
          />
          
          <StatsCard
            icon={<Star className="w-8 h-8 text-yellow-400" />}
            title="Favoris"
            value="8"
            description="Outils sauvegardés"
            color="yellow"
          />
        </div>

        {/* Outils Récents */}
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <h2 className="text-xl font-semibold text-white mb-4">
            Outils Récemment Utilisés
          </h2>
          <div className="space-y-3">
            <ActivityItem
              action="ICP Maker"
              item="Analyse de persona client"
              time="Il y a 2 heures"
              icon={<Target className="w-4 h-4 text-blue-400" />}
            />
            <ActivityItem
              action="Générateur d'Offre"
              item="Offre formation marketing"
              time="Il y a 1 jour"
              icon={<Zap className="w-4 h-4 text-green-400" />}
            />
            <ActivityItem
              action="CopyMoneyMail"
              item="Séquence email 5 jours"
              time="Il y a 3 jours"
              icon={<Mail className="w-4 h-4 text-purple-400" />}
            />
          </div>
        </div>

        {/* Actions Rapides */}
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <h2 className="text-xl font-semibold text-white mb-4">
            Actions Rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActionCard
              title="Créer un ICP"
              description="Analyser votre client idéal"
              href="/outils/icp-maker"
              color="blue"
              icon={<Target className="w-5 h-5" />}
            />
            <QuickActionCard
              title="Générer une Offre"
              description="Créer une offre irrésistible"
              href="/outils/generateur-offre"
              color="green"
              icon={<Zap className="w-5 h-5" />}
            />
            <QuickActionCard
              title="Tous les Outils"
              description="Explorer tous les outils IA"
              href="/outils"
              color="purple"
              icon={<BarChart3 className="w-5 h-5" />}
            />
          </div>
        </div>

        {/* Conseils du jour */}
        <div className="bg-gradient-to-r from-[#ff0033]/10 to-[#cc0029]/10 rounded-xl p-6 border border-[#ff0033]/20">
          <h2 className="text-xl font-semibold text-white mb-4">
            💡 Conseil du Jour
          </h2>
          <p className="text-gray-300 mb-4">
            Commencez toujours par définir votre ICP (Ideal Customer Persona) avant de créer votre offre. 
            Cela vous permettra de créer des messages plus percutants et d'augmenter vos conversions.
          </p>
          <a 
            href="/outils/icp-maker"
            className="inline-block bg-[#ff0033] hover:bg-[#cc0029] text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Créer mon ICP
          </a>
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
    blue: 'bg-blue-500/10 border-blue-500/20',
    yellow: 'bg-yellow-500/10 border-yellow-500/20',
    green: 'bg-green-500/10 border-green-500/20',
    purple: 'bg-purple-500/10 border-purple-500/20'
  };

  return (
    <div className={`${colorClasses[color]} rounded-xl p-6 border bg-[#111111]`}>
      <div className="flex items-center justify-between mb-4">
        {icon}
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <h3 className="font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}

interface ActivityItemProps {
  action: string;
  item: string;
  time: string;
  icon: React.ReactNode;
}

function ActivityItem({ action, item, time, icon }: ActivityItemProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#232323] last:border-0">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#1a1a1a] rounded-lg">
          {icon}
        </div>
        <div>
          <p className="font-medium text-white">{action}</p>
          <p className="text-sm text-gray-400">{item}</p>
        </div>
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
  icon: React.ReactNode;
}

function QuickActionCard({ title, description, href, color, icon }: QuickActionCardProps) {
  const colorClasses = {
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    green: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
  };

  return (
    <a
      href={href}
      className={`${colorClasses[color]} text-white p-4 rounded-lg transition-all duration-200 block hover:scale-105 hover:shadow-lg`}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm opacity-90">{description}</p>
    </a>
  );
}
