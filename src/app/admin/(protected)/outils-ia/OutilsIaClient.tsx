"use client";
import React, { useState, useEffect } from 'react';
import { Bot, Plus, Activity, Zap, Eye, Settings, Edit, Trash2, Search, Filter } from 'lucide-react';
import IaToolAdminModal from './IaToolAdminModal';
import { listActiveIaTools } from '@/lib/ia-tools';

export default function OutilsIaClient({ initialTools, initialStats }: { initialTools: any[]; initialStats: any }) {
  const [tools, setTools] = useState(initialTools);
  const [stats, setStats] = useState(initialStats);
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Rafraîchir la liste des outils (ex: après changement de statut)
  const refreshTools = async () => {
    setLoading(true);
    try {
      const refreshed = await listActiveIaTools();
      setTools(refreshed);
      // Optionnel: recalculer stats ici si besoin
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (tool: any) => {
    setSelectedTool(tool);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTool(null);
  };

  return (
    <div className="space-y-6">
      {/* Tableau des outils IA */}
      <div className="bg-[#111111] rounded-xl border border-[#232323] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#18181b]">
              <tr>
                <th className="text-left text-gray-400 p-4 font-medium">Outil</th>
                <th className="text-left text-gray-400 p-4 font-medium">Catégorie</th>
                <th className="text-left text-gray-400 p-4 font-medium">Statut</th>
                <th className="text-left text-gray-400 p-4 font-medium">Utilisations</th>
                <th className="text-left text-gray-400 p-4 font-medium">Coût/Usage</th>
                <th className="text-left text-gray-400 p-4 font-medium">Limite/Jour</th>
                <th className="text-left text-gray-400 p-4 font-medium">Date</th>
                <th className="text-left text-gray-400 p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool) => (
                <tr key={tool.id} className="border-b border-[#232323] hover:bg-[#18181b]/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#232323] rounded-lg flex items-center justify-center">
                        <Bot className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{tool.name}</p>
                        <p className="text-gray-400 text-sm line-clamp-1">{tool.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-300">{tool.category || 'Non définie'}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tool.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {tool.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{tool._count.usage}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-white">
                      {tool.costPerUse ? `€${tool.costPerUse}` : 'Gratuit'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-300">
                      {tool.maxUsagePerDay || 'Illimité'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-400">
                      {new Date(tool.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 text-gray-400 hover:text-white hover:bg-[#232323] rounded-lg transition-colors"
                        onClick={() => handleOpenModal(tool)}
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-[#232323] rounded-lg transition-colors">
                        <Settings className="w-4 h-4" />
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
            </tbody>
          </table>
        </div>
        {tools.length === 0 && (
          <div className="text-center py-12">
            <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Aucun outil IA configuré</p>
            <p className="text-gray-500 text-sm">Ajoutez votre premier outil IA pour commencer</p>
          </div>
        )}
      </div>
      {showModal && selectedTool && (
        <IaToolAdminModal
          tool={selectedTool}
          onClose={handleCloseModal}
          onStatusChange={refreshTools}
        />
      )}
    </div>
  );
} 