'use client';

import { useState, useEffect } from 'react';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import { Settings, Key, TestTube, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AIProvider {
  id: string;
  name: string;
  apiKey: string;
  isActive: boolean;
  status: 'connected' | 'error' | 'testing' | 'disconnected';
  lastTested?: string;
  errorMessage?: string;
  config: {
    temperature: number;
    maxTokens: number;
    model: string;
  };
}

interface AIConfig {
  defaultProvider: string;
  providers: AIProvider[];
  globalSettings: {
    timeout: number;
    retryAttempts: number;
    fallbackProvider: string;
  };
}

export default function AIConfigurationPage() {
  const [config, setConfig] = useState<AIConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingProvider, setTestingProvider] = useState<string | null>(null);

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      const response = await fetch('/api/admin/ai-config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data.config);
      }
    } catch (error) {
      console.error('Erreur chargement configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfiguration = async () => {
    if (!config) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/admin/ai-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config })
      });
      
      if (response.ok) {
        alert('Configuration sauvegardée avec succès');
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const testProvider = async (providerId: string) => {
    if (!config) return;
    
    setTestingProvider(providerId);
    
    // Mettre à jour le statut à "testing"
    setConfig(prev => ({
      ...prev!,
      providers: prev!.providers.map(p => 
        p.id === providerId ? { ...p, status: 'testing' } : p
      )
    }));

    try {
      const response = await fetch('/api/admin/test-ai-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId })
      });
      
      const result = await response.json();
      
      setConfig(prev => ({
        ...prev!,
        providers: prev!.providers.map(p => 
          p.id === providerId ? {
            ...p,
            status: result.success ? 'connected' : 'error',
            lastTested: new Date().toISOString(),
            errorMessage: result.error || undefined
          } : p
        )
      }));
    } catch (error) {
      setConfig(prev => ({
        ...prev!,
        providers: prev!.providers.map(p => 
          p.id === providerId ? {
            ...p,
            status: 'error',
            lastTested: new Date().toISOString(),
            errorMessage: 'Erreur de connexion'
          } : p
        )
      }));
    } finally {
      setTestingProvider(null);
    }
  };

  const updateProvider = (providerId: string, updates: Partial<AIProvider>) => {
    if (!config) return;
    
    setConfig(prev => ({
      ...prev!,
      providers: prev!.providers.map(p => 
        p.id === providerId ? { ...p, ...updates } : p
      )
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'testing': return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'testing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminPageLayout
        icon={<Settings className="w-6 h-6" />}
        title="Configuration IA"
        subtitle="Gestion des modèles et providers IA"
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </AdminPageLayout>
    );
  }

  if (!config) {
    return (
      <AdminPageLayout
        icon={<Settings className="w-6 h-6" />}
        title="Configuration IA"
        subtitle="Gestion des modèles et providers IA"
      >
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600">Impossible de charger la configuration IA</p>
          <Button onClick={loadConfiguration} className="mt-4">
            Réessayer
          </Button>
        </div>
      </AdminPageLayout>
    );
  }

  const stats = [
    {
      title: 'Providers actifs',
      value: config.providers.filter(p => p.isActive).length,
      icon: <CheckCircle className="w-5 h-5 text-green-600" />
    },
    {
      title: 'Providers connectés',
      value: config.providers.filter(p => p.status === 'connected').length,
      icon: <Key className="w-5 h-5 text-blue-600" />
    },
    {
      title: 'Provider par défaut',
      value: config.providers.find(p => p.id === config.defaultProvider)?.name || 'Aucun',
      icon: <Settings className="w-5 h-5 text-purple-600" />
    },
    {
      title: 'Timeout global',
      value: `${config.globalSettings.timeout}s`,
      icon: <TestTube className="w-5 h-5 text-orange-600" />
    }
  ];

  const actions = [
    {
      label: 'Sauvegarder',
      onClick: saveConfiguration,
      loading: saving,
      icon: <Settings className="w-4 h-4" />
    },
    {
      label: 'Tester tous',
      onClick: () => config.providers.forEach(p => testProvider(p.id)),
      icon: <TestTube className="w-4 h-4" />
    }
  ];

  return (
    <AdminPageLayout
      icon={<Settings className="w-6 h-6" />}
      title="Configuration IA"
      subtitle="Gestion des modèles et providers IA"
      stats={stats}
      actions={actions}
    >
      <div className="space-y-8">
        {/* Configuration globale */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration globale</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provider par défaut
              </label>
              <select
                value={config.defaultProvider}
                onChange={(e) => setConfig(prev => ({ ...prev!, defaultProvider: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {config.providers.filter(p => p.isActive).map(provider => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeout (secondes)
              </label>
              <input
                type="number"
                value={config.globalSettings.timeout}
                onChange={(e) => setConfig(prev => ({
                  ...prev!,
                  globalSettings: {
                    ...prev!.globalSettings,
                    timeout: parseInt(e.target.value)
                  }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tentatives de retry
              </label>
              <input
                type="number"
                value={config.globalSettings.retryAttempts}
                onChange={(e) => setConfig(prev => ({
                  ...prev!,
                  globalSettings: {
                    ...prev!.globalSettings,
                    retryAttempts: parseInt(e.target.value)
                  }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Providers IA */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Providers IA</h3>
          
          <div className="space-y-6">
            {config.providers.map(provider => (
              <div key={provider.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h4 className="text-lg font-medium text-gray-900">{provider.name}</h4>
                    {getStatusIcon(provider.status)}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(provider.status)}`}>
                      {provider.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={provider.isActive}
                        onChange={(e) => updateProvider(provider.id, { isActive: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Actif</span>
                    </label>
                    
                    <Button
                      onClick={() => testProvider(provider.id)}
                      disabled={testingProvider === provider.id}
                      variant="outline"
                      size="sm"
                    >
                      {testingProvider === provider.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <TestTube className="w-4 h-4" />
                      )}
                      Tester
                    </Button>
                  </div>
                </div>
                
                {provider.errorMessage && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-700">{provider.errorMessage}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Clé API
                    </label>
                    <input
                      type="password"
                      value={provider.apiKey}
                      onChange={(e) => updateProvider(provider.id, { apiKey: e.target.value })}
                      placeholder="Entrez la clé API"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Modèle
                    </label>
                    <input
                      type="text"
                      value={provider.config.model}
                      onChange={(e) => updateProvider(provider.id, {
                        config: { ...provider.config, model: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Température
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="2"
                      step="0.1"
                      value={provider.config.temperature}
                      onChange={(e) => updateProvider(provider.id, {
                        config: { ...provider.config, temperature: parseFloat(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Tokens
                    </label>
                    <input
                      type="number"
                      value={provider.config.maxTokens}
                      onChange={(e) => updateProvider(provider.id, {
                        config: { ...provider.config, maxTokens: parseInt(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                {provider.lastTested && (
                  <div className="mt-3 text-xs text-gray-500">
                    Dernier test: {new Date(provider.lastTested).toLocaleString('fr-FR')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
}