import { Users, Package, Bot, Activity } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Admin</h1>
        <p className="text-gray-400 mt-2">Vue d'ensemble de la plateforme DropSkills</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Utilisateurs"
          value="1,234"
          change="+12%"
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="Packs Vendus"
          value="567"
          change="+8%"
          icon={<Package className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          title="Outils IA"
          value="6"
          change="0%"
          icon={<Bot className="w-6 h-6" />}
          color="purple"
        />
        <StatCard
          title="Activité"
          value="89%"
          change="+5%"
          icon={<Activity className="w-6 h-6" />}
          color="red"
        />
      </div>

      {/* Activité récente */}
      <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
        <h2 className="text-xl font-semibold text-white mb-4">Activité Récente</h2>
        <div className="space-y-3">
          <ActivityItem
            action="Nouvel utilisateur inscrit"
            user="john.doe@example.com"
            time="Il y a 5 minutes"
          />
          <ActivityItem
            action="Pack acheté"
            user="jane.smith@example.com"
            time="Il y a 15 minutes"
          />
          <ActivityItem
            action="Outil IA utilisé"
            user="bob.wilson@example.com"
            time="Il y a 30 minutes"
          />
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
        <h2 className="text-xl font-semibold text-white mb-4">Actions Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickAction
            title="Créer un utilisateur"
            description="Ajouter un nouvel utilisateur"
            href="/admin/utilisateurs/nouveau"
          />
          <QuickAction
            title="Nouveau pack"
            description="Créer un nouveau pack"
            href="/admin/packs/nouveau"
          />
          <QuickAction
            title="Voir les logs"
            description="Consulter l'activité système"
            href="/admin/logs"
          />
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'red';
}

function StatCard({ title, value, change, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'text-blue-400 bg-blue-400/10',
    green: 'text-green-400 bg-green-400/10',
    purple: 'text-purple-400 bg-purple-400/10',
    red: 'text-[#ff0033] bg-[#ff0033]/10'
  };

  return (
    <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <span className="text-green-400 text-sm font-medium">{change}</span>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        <p className="text-gray-400 text-sm">{title}</p>
      </div>
    </div>
  );
}

interface ActivityItemProps {
  action: string;
  user: string;
  time: string;
}

function ActivityItem({ action, user, time }: ActivityItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-white text-sm">{action}</p>
        <p className="text-gray-400 text-xs">{user}</p>
      </div>
      <span className="text-gray-400 text-xs">{time}</span>
    </div>
  );
}

interface QuickActionProps {
  title: string;
  description: string;
  href: string;
}

function QuickAction({ title, description, href }: QuickActionProps) {
  return (
    <a
      href={href}
      className="block p-4 bg-[#1a1a1a] rounded-lg border border-[#232323] hover:border-[#ff0033] transition-colors"
    >
      <h3 className="text-white font-medium">{title}</h3>
      <p className="text-gray-400 text-sm mt-1">{description}</p>
    </a>
  );
} 