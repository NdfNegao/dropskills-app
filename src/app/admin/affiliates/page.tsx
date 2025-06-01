"use client";
import { UserCheck, UserPlus, DollarSign, TrendingUp } from 'lucide-react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';

export default function AdminAffiliates() {
  const statsData = [
    {
      title: "Total affiliés",
      value: "45",
      icon: <UserCheck size={24} />
    },
    {
      title: "Commissions payées",
      value: "€2,340",
      icon: <DollarSign size={24} />
    },
    {
      title: "Ventes ce mois",
      value: "127",
      icon: <TrendingUp size={24} />
    },
    {
      title: "Taux conversion",
      value: "3.2%",
      icon: <TrendingUp size={24} />
    }
  ];

  return (
    <AdminLayoutWithSidebar
      icon={<UserCheck size={24} />}
      title="Gestion des affiliés"
      subtitle="Gérez vos partenaires affiliés et suivez leurs performances"
      stats={statsData}
    >
        <div className="flex justify-end mb-6">
          <a href="/admin/affiliates/nouveau" className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold">
            <UserPlus className="w-5 h-5" /> Nouvel affilié
          </a>
        </div>

        {/* Liste des affiliés */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8 overflow-x-auto">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Liste des affiliés</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Nom</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Email</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Code affilié</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Ventes</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Commission</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Statut</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 text-black font-medium">Marie Dubois</td>
              <td className="py-3 px-4 text-gray-600">marie.dubois@email.com</td>
              <td className="py-3 px-4 text-gray-600">AFF-MD123</td>
              <td className="py-3 px-4 text-black font-medium">24</td>
              <td className="py-3 px-4 text-green-600 font-semibold">€720</td>
              <td className="py-3 px-4"><span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">Actif</span></td>
              <td className="py-3 px-4">
                <button className="text-blue-600 hover:text-blue-800 mr-3 font-medium">Voir</button>
                <button className="text-red-600 hover:text-red-800 font-medium">Suspendre</button>
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="py-3 px-4 text-black font-medium">Pierre Martin</td>
              <td className="py-3 px-4 text-gray-600">pierre.martin@email.com</td>
              <td className="py-3 px-4 text-gray-600">AFF-PM456</td>
              <td className="py-3 px-4 text-black font-medium">8</td>
              <td className="py-3 px-4 text-green-600 font-semibold">€240</td>
              <td className="py-3 px-4"><span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">En attente</span></td>
              <td className="py-3 px-4">
                <button className="text-blue-600 hover:text-blue-800 mr-3 font-medium">Voir</button>
                <button className="text-red-600 hover:text-red-800 font-medium">Suspendre</button>
              </td>
            </tr>
          </tbody>
        </table>
        </div>

        {/* Actions rapides */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">Actions rapides</h3>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">Exporter la liste</button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">Payer les commissions</button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium">Rapport mensuel</button>
          </div>
        </div>
    </AdminLayoutWithSidebar>
  );
}