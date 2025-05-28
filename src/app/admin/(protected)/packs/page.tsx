'use client';

import { useState } from 'react';
import { Plus, Search, Eye, Edit, Trash2, Package } from 'lucide-react';

// Données de démonstration
const mockPacks = [
  {
    id: '1',
    title: 'Pack Marketing Digital Complet',
    description: 'Formation complète en marketing digital',
    price: 297,
    status: 'ACTIVE',
    createdAt: new Date('2024-01-15'),
    creator: {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com'
    },
    category: {
      name: 'Marketing'
    }
  },
  {
    id: '2',
    title: 'Formation E-commerce Avancée',
    description: 'Créer et optimiser sa boutique en ligne',
    price: 497,
    status: 'ACTIVE',
    createdAt: new Date('2024-01-10'),
    creator: {
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie.martin@example.com'
    },
    category: {
      name: 'E-commerce'
    }
  },
  {
    id: '3',
    title: 'Pack Réseaux Sociaux Pro',
    description: 'Stratégies avancées pour les réseaux sociaux',
    price: 197,
    status: 'DRAFT',
    createdAt: new Date('2024-01-05'),
    creator: {
      firstName: 'Pierre',
      lastName: 'Durand',
      email: 'pierre.durand@example.com'
    },
    category: {
      name: 'Social Media'
    }
  },
  {
    id: '4',
    title: 'Formation Copywriting Persuasif',
    description: 'Maîtriser l\'art de la persuasion écrite',
    price: 0,
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    creator: {
      firstName: 'Sophie',
      lastName: 'Bernard',
      email: 'sophie.bernard@example.com'
    },
    category: {
      name: 'Copywriting'
    }
  }
];

export default function PacksPage() {
  const [packs] = useState(mockPacks);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredPacks = packs.filter(pack => {
    const matchesSearch = !searchTerm || 
      pack.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pack.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || pack.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: packs.length,
    active: packs.filter(p => p.status === 'ACTIVE').length,
    draft: packs.filter(p => p.status === 'DRAFT').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Gestion des Packs</h1>
        <button className="bg-[#ff0033] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouveau Pack
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Packs</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <Package className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Actifs</p>
              <p className="text-2xl font-bold text-white">{stats.active}</p>
            </div>
            <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-green-400 rounded-full" />
            </div>
          </div>
        </div>

        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Brouillons</p>
              <p className="text-2xl font-bold text-white">{stats.draft}</p>
            </div>
            <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-orange-400 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un pack..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1a1a] text-white pl-10 pr-4 py-2 rounded-lg border border-[#232323] focus:outline-none focus:border-[#ff0033]"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#232323] focus:outline-none focus:border-[#ff0033]"
          >
            <option value="">Tous les statuts</option>
            <option value="ACTIVE">Actif</option>
            <option value="DRAFT">Brouillon</option>
            <option value="ARCHIVED">Archivé</option>
          </select>
        </div>
      </div>

      {/* Liste des packs */}
      <div className="bg-[#111111] rounded-xl border border-[#232323] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#18181b]">
              <tr>
                <th className="text-left text-gray-400 p-4 font-medium">Pack</th>
                <th className="text-left text-gray-400 p-4 font-medium">Créateur</th>
                <th className="text-left text-gray-400 p-4 font-medium">Statut</th>
                <th className="text-left text-gray-400 p-4 font-medium">Prix</th>
                <th className="text-left text-gray-400 p-4 font-medium">Date</th>
                <th className="text-left text-gray-400 p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPacks.map((pack) => (
                <tr key={pack.id} className="border-b border-[#232323] hover:bg-[#18181b]/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#232323] rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{pack.title}</p>
                        <p className="text-gray-400 text-sm">{pack.category?.name || 'Sans catégorie'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-white">
                        {pack.creator.firstName} {pack.creator.lastName}
                      </p>
                      <p className="text-gray-400 text-sm">{pack.creator.email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pack.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400' :
                      pack.status === 'DRAFT' ? 'bg-orange-500/10 text-orange-400' :
                      pack.status === 'ARCHIVED' ? 'bg-gray-500/10 text-gray-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {pack.status === 'ACTIVE' ? 'Actif' :
                       pack.status === 'DRAFT' ? 'Brouillon' :
                       pack.status === 'ARCHIVED' ? 'Archivé' : 'Suspendu'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-white">
                      {pack.price ? `€${pack.price}` : 'Gratuit'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-400">
                      {new Date(pack.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-[#232323] rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-[#232323] rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPacks.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 py-8">
                    {searchTerm || statusFilter ? 'Aucun pack ne correspond à vos critères' : 'Aucun pack trouvé'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 