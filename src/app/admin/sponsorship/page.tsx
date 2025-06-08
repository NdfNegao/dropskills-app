"use client";

import { useState } from "react";
import { Gift, Users, TrendingUp, Euro, Mail, Eye, Edit, Trash2 } from "lucide-react";
import AdminLayoutWithSidebar from "@/components/admin/AdminLayoutWithSidebar";

interface SponsorshipData {
  id: string;
  sponsorName: string;
  sponsorEmail: string;
  sponsoredName: string;
  sponsoredEmail: string;
  status: 'pending' | 'active' | 'completed';
  commission: number;
  dateCreated: string;
  dateCompleted?: string;
}

function SponsorshipManagement() {
  const [sponsorships] = useState<SponsorshipData[]>([
    {
      id: "1",
      sponsorName: "Jean Dupont",
      sponsorEmail: "jean.dupont@email.com",
      sponsoredName: "Marie Martin",
      sponsoredEmail: "marie.martin@email.com",
      status: "completed",
      commission: 20,
      dateCreated: "2024-01-15",
      dateCompleted: "2024-01-20"
    },
    {
      id: "2",
      sponsorName: "Pierre Durand",
      sponsorEmail: "pierre.durand@email.com",
      sponsoredName: "Sophie Leroy",
      sponsoredEmail: "sophie.leroy@email.com",
      status: "active",
      commission: 20,
      dateCreated: "2024-01-18"
    },
    {
      id: "3",
      sponsorName: "Alice Bernard",
      sponsorEmail: "alice.bernard@email.com",
      sponsoredName: "Thomas Petit",
      sponsoredEmail: "thomas.petit@email.com",
      status: "pending",
      commission: 20,
      dateCreated: "2024-01-22"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'active': return 'Actif';
      case 'pending': return 'En attente';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total parrainages</p>
              <p className="text-2xl font-bold">156</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Commissions payées</p>
              <p className="text-2xl font-bold">€3,120</p>
            </div>
            <Euro className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Taux de conversion</p>
              <p className="text-2xl font-bold">18%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ce mois</p>
              <p className="text-2xl font-bold">23</p>
            </div>
            <Gift className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Liste des parrainages */}
      <div className="bg-card rounded-lg border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Gestion des parrainages</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez tous les parrainages et leurs statuts
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Parrain</th>
                <th className="text-left p-4 font-medium">Parrainé</th>
                <th className="text-left p-4 font-medium">Statut</th>
                <th className="text-left p-4 font-medium">Commission</th>
                <th className="text-left p-4 font-medium">Date création</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sponsorships.map((sponsorship) => (
                <tr key={sponsorship.id} className="border-b hover:bg-muted/20">
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{sponsorship.sponsorName}</div>
                      <div className="text-sm text-muted-foreground">{sponsorship.sponsorEmail}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{sponsorship.sponsoredName}</div>
                      <div className="text-sm text-muted-foreground">{sponsorship.sponsoredEmail}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sponsorship.status)}`}>
                      {getStatusLabel(sponsorship.status)}
                    </span>
                  </td>
                  <td className="p-4 font-medium">€{sponsorship.commission}</td>
                  <td className="p-4 text-sm">{sponsorship.dateCreated}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-muted rounded" title="Voir détails">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-muted rounded" title="Modifier">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-muted rounded text-red-600" title="Supprimer">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Configuration du programme */}
      <div className="bg-card rounded-lg border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Configuration du programme</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Paramètres du programme de parrainage
          </p>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Commission par parrainage (€)</label>
              <input 
                type="number" 
                defaultValue="20" 
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Durée de validité (jours)</label>
              <input 
                type="number" 
                defaultValue="30" 
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Message de parrainage</label>
            <textarea 
              rows={3}
              defaultValue="Rejoignez DropSkills grâce à mon invitation et bénéficiez d'avantages exclusifs !"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Sauvegarder les modifications
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SponsorshipPage() {
  const statsData = [
    {
      title: "Parrainages actifs",
      value: "156",
      change: "+12 ce mois",
      trend: "up" as const
    },
    {
      title: "Commissions totales",
      value: "€3,120",
      change: "+€240 ce mois",
      trend: "up" as const
    },
    {
      title: "Taux de conversion",
      value: "18%",
      change: "+3% vs mois dernier",
      trend: "up" as const
    },
    {
      title: "Nouveaux ce mois",
      value: "23",
      change: "vs 18 mois dernier",
      trend: "up" as const
    }
  ];

  const actions = [
    {
      label: "Exporter données",
      href: "#export",
      variant: "primary" as const
    },
    {
      label: "Envoyer rappels",
      href: "#remind",
      variant: "secondary" as const
    }
  ];

  return (
    <AdminLayoutWithSidebar
      icon={<Gift className="w-5 h-5" />}
      title="Gestion du parrainage"
      subtitle="Administration du programme de parrainage"
      stats={statsData}
      actions={actions.map(action => ({
        ...action,
        onClick: () => window.location.href = action.href
      }))}
    >
      <SponsorshipManagement />
    </AdminLayoutWithSidebar>
  );
}