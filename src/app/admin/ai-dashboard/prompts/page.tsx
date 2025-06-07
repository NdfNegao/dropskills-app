'use client';

import { useState, useEffect } from 'react';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import { FileText, Plus, Edit, Save, RotateCcw, TestTube, Copy, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PromptVersion {
  id: string;
  version: number;
  content: string;
  createdAt: string;
  createdBy: string;
  isActive: boolean;
  testResults?: {
    success: boolean;
    response: string;
    executionTime: number;
  };
}

interface Prompt {
  id: string;
  name: string;
  description: string;
  category: 'master' | 'tool' | 'system';
  toolId?: string;
  currentVersion: number;
  versions: PromptVersion[];
  isActive: boolean;
  lastModified: string;
  usage: {
    totalCalls: number;
    successRate: number;
    avgExecutionTime: number;
  };
}

export default function PromptsManagementPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [editingVersion, setEditingVersion] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showNewPromptModal, setShowNewPromptModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'master' | 'tool' | 'system'>('all');

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      const response = await fetch('/api/admin/prompts');
      if (response.ok) {
        const data = await response.json();
        setPrompts(data.prompts);
        if (data.prompts.length > 0 && !selectedPrompt) {
          setSelectedPrompt(data.prompts[0]);
          setEditingVersion(data.prompts[0].versions.find(v => v.isActive)?.content || '');
        }
      }
    } catch (error) {
      console.error('Erreur chargement prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePrompt = async () => {
    if (!selectedPrompt || !editingVersion.trim()) return;
    
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/prompts/${selectedPrompt.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editingVersion,
          createNewVersion: true
        })
      });
      
      if (response.ok) {
        const updatedPrompt = await response.json();
        setPrompts(prev => prev.map(p => p.id === selectedPrompt.id ? updatedPrompt.prompt : p));
        setSelectedPrompt(updatedPrompt.prompt);
        alert('Prompt sauvegardé avec succès');
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const testPrompt = async () => {
    if (!selectedPrompt || !editingVersion.trim()) return;
    
    setTesting(true);
    try {
      const response = await fetch('/api/admin/prompts/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptId: selectedPrompt.id,
          content: editingVersion,
          testInput: 'Test de validation du prompt'
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`Test réussi!\nTemps d'exécution: ${result.executionTime}ms\nRéponse: ${result.response.substring(0, 100)}...`);
      } else {
        alert(`Test échoué: ${result.error}`);
      }
    } catch (error) {
      console.error('Erreur test:', error);
      alert('Erreur lors du test');
    } finally {
      setTesting(false);
    }
  };

  const revertToVersion = async (versionId: string) => {
    if (!selectedPrompt) return;
    
    const version = selectedPrompt.versions.find(v => v.id === versionId);
    if (!version) return;
    
    setEditingVersion(version.content);
  };

  const duplicatePrompt = async (promptId: string) => {
    try {
      const response = await fetch(`/api/admin/prompts/${promptId}/duplicate`, {
        method: 'POST'
      });
      
      if (response.ok) {
        loadPrompts();
        alert('Prompt dupliqué avec succès');
      }
    } catch (error) {
      console.error('Erreur duplication:', error);
    }
  };

  const deletePrompt = async (promptId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce prompt ?')) return;
    
    try {
      const response = await fetch(`/api/admin/prompts/${promptId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setPrompts(prev => prev.filter(p => p.id !== promptId));
        if (selectedPrompt?.id === promptId) {
          setSelectedPrompt(null);
          setEditingVersion('');
        }
        alert('Prompt supprimé avec succès');
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const filteredPrompts = prompts.filter(prompt => 
    filter === 'all' || prompt.category === filter
  );

  const stats = [
    {
      title: 'Total prompts',
      value: prompts.length,
      icon: <FileText className="w-5 h-5 text-blue-600" />
    },
    {
      title: 'Prompts actifs',
      value: prompts.filter(p => p.isActive).length,
      icon: <Eye className="w-5 h-5 text-green-600" />
    },
    {
      title: 'Taux de succès moyen',
      value: `${Math.round(prompts.reduce((acc, p) => acc + p.usage.successRate, 0) / prompts.length || 0)}%`,
      icon: <TestTube className="w-5 h-5 text-purple-600" />
    },
    {
      title: 'Temps d\'exécution moyen',
      value: `${Math.round(prompts.reduce((acc, p) => acc + p.usage.avgExecutionTime, 0) / prompts.length || 0)}ms`,
      icon: <RotateCcw className="w-5 h-5 text-orange-600" />
    }
  ];

  const actions = [
    {
      label: 'Nouveau prompt',
      onClick: () => setShowNewPromptModal(true),
      icon: <Plus className="w-4 h-4" />
    },
    {
      label: 'Sauvegarder',
      onClick: savePrompt,
      loading: saving,
      icon: <Save className="w-4 h-4" />
    },
    {
      label: 'Tester',
      onClick: testPrompt,
      loading: testing,
      icon: <TestTube className="w-4 h-4" />
    }
  ];

  if (loading) {
    return (
      <AdminPageLayout
        icon={<FileText className="w-6 h-6" />}
        title="Gestion des Prompts"
        subtitle="Édition et versioning des prompts IA"
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      icon={<FileText className="w-6 h-6" />}
      title="Gestion des Prompts"
      subtitle="Édition et versioning des prompts IA"
      stats={stats}
      actions={actions}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
        {/* Liste des prompts */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Prompts</h3>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">Tous</option>
              <option value="master">Master</option>
              <option value="tool">Outils</option>
              <option value="system">Système</option>
            </select>
          </div>
          
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredPrompts.map(prompt => (
              <div
                key={prompt.id}
                onClick={() => {
                  setSelectedPrompt(prompt);
                  setEditingVersion(prompt.versions.find(v => v.isActive)?.content || '');
                }}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedPrompt?.id === prompt.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900 text-sm">{prompt.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    prompt.category === 'master' ? 'bg-purple-100 text-purple-800' :
                    prompt.category === 'tool' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {prompt.category}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{prompt.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>v{prompt.currentVersion}</span>
                  <span>{prompt.usage.totalCalls} appels</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Éditeur de prompt */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4">
          {selectedPrompt ? (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedPrompt.name}</h3>
                  <p className="text-sm text-gray-600">{selectedPrompt.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => duplicatePrompt(selectedPrompt.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => deletePrompt(selectedPrompt.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Statistiques du prompt */}
              <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{selectedPrompt.usage.totalCalls}</div>
                  <div className="text-xs text-gray-600">Appels totaux</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{selectedPrompt.usage.successRate}%</div>
                  <div className="text-xs text-gray-600">Taux de succès</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{selectedPrompt.usage.avgExecutionTime}ms</div>
                  <div className="text-xs text-gray-600">Temps moyen</div>
                </div>
              </div>
              
              {/* Éditeur */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Contenu du prompt</label>
                  <div className="text-xs text-gray-500">
                    {editingVersion.length} caractères
                  </div>
                </div>
                <textarea
                  value={editingVersion}
                  onChange={(e) => setEditingVersion(e.target.value)}
                  className="flex-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="Entrez le contenu du prompt..."
                />
              </div>
              
              {/* Versions */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Versions précédentes</h4>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedPrompt.versions.slice().reverse().map(version => (
                    <button
                      key={version.id}
                      onClick={() => revertToVersion(version.id)}
                      className={`flex-shrink-0 px-3 py-2 text-xs rounded-md border ${
                        version.isActive
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium">v{version.version}</div>
                      <div className="text-gray-500">
                        {new Date(version.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                      {version.testResults && (
                        <div className={`text-xs ${
                          version.testResults.success ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {version.testResults.success ? '✓' : '✗'} Test
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Sélectionnez un prompt pour l'éditer</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminPageLayout>
  );
}