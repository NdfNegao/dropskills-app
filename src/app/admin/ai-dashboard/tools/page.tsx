'use client';

import { useState, useEffect } from 'react';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import { Wrench, Plus, Edit, Save, TestTube, Copy, Trash2, Eye, Settings, BarChart3, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  path: string;
  isActive: boolean;
  config: {
    model: string;
    temperature: number;
    maxTokens: number;
    systemPrompt: string;
    userPromptTemplate: string;
  };
  analytics: {
    totalUsage: number;
    successRate: number;
    avgResponseTime: number;
    lastUsed: string;
    popularityScore: number;
  };
  apiEndpoint: string;
  testCases: {
    id: string;
    name: string;
    input: any;
    expectedOutput?: string;
    lastResult?: {
      success: boolean;
      output: string;
      executionTime: number;
      timestamp: string;
    };
  }[];
  createdAt: string;
  updatedAt: string;
}

interface ToolFormData {
  name: string;
  description: string;
  category: string;
  icon: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  userPromptTemplate: string;
}

export default function ToolsManagementPage() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [editingTool, setEditingTool] = useState<ToolFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showNewToolModal, setShowNewToolModal] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [testInput, setTestInput] = useState('');
  const [testResults, setTestResults] = useState<any>(null);

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      const response = await fetch('/api/admin/ai-tools');
      if (response.ok) {
        const data = await response.json();
        setTools(data.tools);
        if (data.tools.length > 0 && !selectedTool) {
          setSelectedTool(data.tools[0]);
          setEditingTool({
            name: data.tools[0].name,
            description: data.tools[0].description,
            category: data.tools[0].category,
            icon: data.tools[0].icon,
            model: data.tools[0].config.model,
            temperature: data.tools[0].config.temperature,
            maxTokens: data.tools[0].config.maxTokens,
            systemPrompt: data.tools[0].config.systemPrompt,
            userPromptTemplate: data.tools[0].config.userPromptTemplate
          });
        }
      }
    } catch (error) {
      console.error('Erreur chargement outils:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTool = async () => {
    if (!selectedTool || !editingTool) return;
    
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/ai-tools/${selectedTool.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingTool,
          config: {
            model: editingTool.model,
            temperature: editingTool.temperature,
            maxTokens: editingTool.maxTokens,
            systemPrompt: editingTool.systemPrompt,
            userPromptTemplate: editingTool.userPromptTemplate
          }
        })
      });
      
      if (response.ok) {
        const updatedTool = await response.json();
        setTools(prev => prev.map(t => t.id === selectedTool.id ? updatedTool.tool : t));
        setSelectedTool(updatedTool.tool);
        alert('Outil sauvegardé avec succès');
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const testTool = async () => {
    if (!selectedTool || !testInput.trim()) {
      alert('Veuillez entrer des données de test');
      return;
    }
    
    setTesting(true);
    try {
      const response = await fetch(`/api/admin/ai-tools/${selectedTool.id}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: testInput,
          config: editingTool ? {
            model: editingTool.model,
            temperature: editingTool.temperature,
            maxTokens: editingTool.maxTokens,
            systemPrompt: editingTool.systemPrompt,
            userPromptTemplate: editingTool.userPromptTemplate
          } : selectedTool.config
        })
      });
      
      const result = await response.json();
      setTestResults(result);
      
      if (result.success) {
        alert(`Test réussi!\nTemps d'exécution: ${result.executionTime}ms`);
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

  const runAllTests = async (toolId: string) => {
    const tool = tools.find(t => t.id === toolId);
    if (!tool || tool.testCases.length === 0) return;
    
    setTesting(true);
    try {
      const response = await fetch(`/api/admin/ai-tools/${toolId}/test-all`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const results = await response.json();
        setTools(prev => prev.map(t => 
          t.id === toolId ? { ...t, testCases: results.testCases } : t
        ));
        alert(`Tests terminés: ${results.successCount}/${results.totalTests} réussis`);
      }
    } catch (error) {
      console.error('Erreur tests:', error);
    } finally {
      setTesting(false);
    }
  };

  const duplicateTool = async (toolId: string) => {
    try {
      const response = await fetch(`/api/admin/ai-tools/${toolId}/duplicate`, {
        method: 'POST'
      });
      
      if (response.ok) {
        loadTools();
        alert('Outil dupliqué avec succès');
      }
    } catch (error) {
      console.error('Erreur duplication:', error);
    }
  };

  const deleteTool = async (toolId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet outil ?')) return;
    
    try {
      const response = await fetch(`/api/admin/ai-tools/${toolId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setTools(prev => prev.filter(t => t.id !== toolId));
        if (selectedTool?.id === toolId) {
          setSelectedTool(null);
          setEditingTool(null);
        }
        alert('Outil supprimé avec succès');
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const toggleToolStatus = async (toolId: string) => {
    try {
      const response = await fetch(`/api/admin/ai-tools/${toolId}/toggle`, {
        method: 'PATCH'
      });
      
      if (response.ok) {
        const updatedTool = await response.json();
        setTools(prev => prev.map(t => t.id === toolId ? updatedTool.tool : t));
      }
    } catch (error) {
      console.error('Erreur changement statut:', error);
    }
  };

  const categories = [...new Set(tools.map(tool => tool.category))];
  const filteredTools = tools.filter(tool => 
    filter === 'all' || tool.category === filter
  );

  const stats = [
    {
      title: 'Total outils',
      value: tools.length,
      icon: <Wrench className="w-5 h-5 text-blue-600" />
    },
    {
      title: 'Outils actifs',
      value: tools.filter(t => t.isActive).length,
      icon: <Eye className="w-5 h-5 text-green-600" />
    },
    {
      title: 'Utilisation totale',
      value: tools.reduce((acc, t) => acc + t.analytics.totalUsage, 0),
      icon: <BarChart3 className="w-5 h-5 text-purple-600" />
    },
    {
      title: 'Taux de succès moyen',
      value: `${Math.round(tools.reduce((acc, t) => acc + t.analytics.successRate, 0) / tools.length || 0)}%`,
      icon: <TestTube className="w-5 h-5 text-orange-600" />
    }
  ];

  const actions = [
    {
      label: 'Nouvel outil',
      onClick: () => setShowNewToolModal(true),
      icon: <Plus className="w-4 h-4" />
    },
    {
      label: 'Sauvegarder',
      onClick: saveTool,
      loading: saving,
      disabled: !editingTool,
      icon: <Save className="w-4 h-4" />
    },
    {
      label: 'Tester',
      onClick: testTool,
      loading: testing,
      disabled: !selectedTool,
      icon: <TestTube className="w-4 h-4" />
    }
  ];

  if (loading) {
    return (
      <AdminPageLayout
        icon={<Wrench className="w-6 h-6" />}
        title="Gestion des Outils IA"
        subtitle="Configuration et test des outils IA"
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      icon={<Wrench className="w-6 h-6" />}
      title="Gestion des Outils IA"
      subtitle="Configuration et test des outils IA"
      stats={stats}
      actions={actions}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-300px)]">
        {/* Liste des outils */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Outils</h3>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">Tous</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredTools.map(tool => (
              <div
                key={tool.id}
                onClick={() => {
                  setSelectedTool(tool);
                  setEditingTool({
                    name: tool.name,
                    description: tool.description,
                    category: tool.category,
                    icon: tool.icon,
                    model: tool.config.model,
                    temperature: tool.config.temperature,
                    maxTokens: tool.config.maxTokens,
                    systemPrompt: tool.config.systemPrompt,
                    userPromptTemplate: tool.config.userPromptTemplate
                  });
                  setTestResults(null);
                }}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedTool?.id === tool.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{tool.icon}</span>
                    <h4 className="font-medium text-gray-900 text-sm">{tool.name}</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${
                      tool.isActive ? 'bg-green-500' : 'bg-gray-400'
                    }`}></span>
                    <Link
                      href={tool.path}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2">{tool.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{tool.category}</span>
                  <span>{tool.analytics.totalUsage} utilisations</span>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  <span>{tool.analytics.successRate}% succès</span>
                  <span className="mx-2">•</span>
                  <span>{tool.analytics.avgResponseTime}ms</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration de l'outil */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4">
          {selectedTool && editingTool ? (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedTool.icon}</span>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{selectedTool.name}</h3>
                    <p className="text-sm text-gray-600">{selectedTool.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => toggleToolStatus(selectedTool.id)}
                    variant="outline"
                    size="sm"
                    className={selectedTool.isActive ? 'text-red-600' : 'text-green-600'}
                  >
                    {selectedTool.isActive ? 'Désactiver' : 'Activer'}
                  </Button>
                  <Button
                    onClick={() => duplicateTool(selectedTool.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => deleteTool(selectedTool.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Formulaire de configuration */}
              <div className="flex-1 overflow-y-auto space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input
                      type="text"
                      value={editingTool.name}
                      onChange={(e) => setEditingTool({...editingTool, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                    <input
                      type="text"
                      value={editingTool.category}
                      onChange={(e) => setEditingTool({...editingTool, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editingTool.description}
                    onChange={(e) => setEditingTool({...editingTool, description: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
                    <select
                      value={editingTool.model}
                      onChange={(e) => setEditingTool({...editingTool, model: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                      <option value="claude-3-haiku">Claude 3 Haiku</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Température</label>
                    <input
                      type="number"
                      min="0"
                      max="2"
                      step="0.1"
                      value={editingTool.temperature}
                      onChange={(e) => setEditingTool({...editingTool, temperature: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
                    <input
                      type="number"
                      min="1"
                      max="4000"
                      value={editingTool.maxTokens}
                      onChange={(e) => setEditingTool({...editingTool, maxTokens: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prompt système</label>
                  <textarea
                    value={editingTool.systemPrompt}
                    onChange={(e) => setEditingTool({...editingTool, systemPrompt: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder="Instructions système pour l'IA..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Template prompt utilisateur</label>
                  <textarea
                    value={editingTool.userPromptTemplate}
                    onChange={(e) => setEditingTool({...editingTool, userPromptTemplate: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder="Template pour les requêtes utilisateur (utilisez {input} pour l'entrée)..."
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Wrench className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Sélectionnez un outil pour le configurer</p>
              </div>
            </div>
          )}
        </div>

        {/* Tests et analytics */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          {selectedTool ? (
            <div className="h-full flex flex-col">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tests & Analytics</h3>
              
              {/* Analytics */}
              <div className="space-y-3 mb-6">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Utilisation totale</div>
                  <div className="text-xl font-semibold text-gray-900">{selectedTool.analytics.totalUsage}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Taux de succès</div>
                  <div className="text-xl font-semibold text-gray-900">{selectedTool.analytics.successRate}%</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Temps de réponse</div>
                  <div className="text-xl font-semibold text-gray-900">{selectedTool.analytics.avgResponseTime}ms</div>
                </div>
              </div>
              
              {/* Test manuel */}
              <div className="flex-1 flex flex-col">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Test manuel</h4>
                <textarea
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="Entrez vos données de test..."
                  className="flex-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows={4}
                />
                
                {testResults && (
                  <div className={`mt-3 p-3 rounded-lg text-sm ${
                    testResults.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="font-medium mb-1">
                      {testResults.success ? '✓ Test réussi' : '✗ Test échoué'}
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      Temps: {testResults.executionTime}ms
                    </div>
                    <div className="max-h-20 overflow-y-auto">
                      {testResults.success ? testResults.output : testResults.error}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 space-y-2">
                  <Button
                    onClick={testTool}
                    disabled={testing || !testInput.trim()}
                    className="w-full"
                  >
                    {testing ? 'Test en cours...' : 'Tester'}
                  </Button>
                  
                  {selectedTool.testCases.length > 0 && (
                    <Button
                      onClick={() => runAllTests(selectedTool.id)}
                      disabled={testing}
                      variant="outline"
                      className="w-full"
                    >
                      Lancer tous les tests ({selectedTool.testCases.length})
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <TestTube className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Sélectionnez un outil pour voir les tests</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminPageLayout>
  );
}