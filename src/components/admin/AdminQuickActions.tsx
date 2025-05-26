import Link from 'next/link';
import { Plus, Users, Package, Bot, BarChart3, Settings } from 'lucide-react';

const quickActions = [
  {
    title: 'Ajouter un pack',
    description: 'Créer un nouveau pack digital',
    href: '/admin/packs/nouveau',
    icon: Plus,
    color: 'bg-[#ff0033]'
  },
  {
    title: 'Gérer les utilisateurs',
    description: 'Voir et modifier les utilisateurs',
    href: '/admin/utilisateurs',
    icon: Users,
    color: 'bg-blue-600'
  },
  {
    title: 'Configurer outil IA',
    description: 'Ajouter un nouvel outil IA',
    href: '/admin/outils-ia/nouveau',
    icon: Bot,
    color: 'bg-purple-600'
  },
  {
    title: 'Voir analytics',
    description: 'Consulter les rapports détaillés',
    href: '/admin/analytics',
    icon: BarChart3,
    color: 'bg-green-600'
  },
  {
    title: 'Paramètres système',
    description: 'Configuration de la plateforme',
    href: '/admin/parametres',
    icon: Settings,
    color: 'bg-gray-600'
  },
  {
    title: 'Gestion des packs',
    description: 'Voir tous les packs existants',
    href: '/admin/packs',
    icon: Package,
    color: 'bg-orange-600'
  }
];

export default function AdminQuickActions() {
  return (
    <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
      <h3 className="text-lg font-semibold text-white mb-4">Actions rapides</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="group p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#232323] transition-colors border border-[#232323] hover:border-[#333]"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium mb-1 group-hover:text-[#ff0033] transition-colors">
                  {action.title}
                </h4>
                <p className="text-sm text-gray-400">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 