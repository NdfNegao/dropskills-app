'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, TestTube, Eye, Copy, Zap } from 'lucide-react';
import { TONE_DESCRIPTIONS, TONE_GUIDELINES } from '@/lib/prompts';

export default function NouveauPromptPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    type: 'user' as 'system' | 'user' | 'complex',
    tool: '',
    content: '',
    tone: '',
    parameters: JSON.stringify({
      temperature: 0.7,
      max_tokens: 1000,
      model: 'gpt-3.5-turbo'
    }, null, 2),
    isActive: true
  });

  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState('');
  const [isTestingPrompt, setIsTestingPrompt] = useState(false);

  const categories = ['Stratégie', 'Contenu', 'Vente', 'Marketing', 'Email', 'Analyse'];
  const tools = ['icp-maker', 'titles', 'descriptions', 'tunnel', 'emails', 'usp', 'veille'];
  const types = [
    { value: 'system', label: 'Prompt Système', description: 'Prompt de base pour définir le comportement de l\'IA' },
    { value: 'user', label: 'Prompt Utilisateur', description: 'Prompt pour les interactions utilisateur' },
    { value: 'complex', label: 'Prompt Complexe', description: 'Prompt avec structure JSON et logique avancée' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de création du prompt
    console.log('Création du prompt:', formData);
    router.push('/admin/prompts');
  };

  const handleTestPrompt = async () => {
    if (!formData.content || !testInput) return;
    
    setIsTestingPrompt(true);
    
    // Simulation du test (à remplacer par un vrai appel API)
    setTimeout(() => {
      setTestResult(`Résultat du test pour: "${testInput}"\n\nPrompt utilisé:\n${formData.content}\n\nRéponse simulée:\nCeci est une réponse de test générée par l'IA en utilisant votre prompt personnalisé.`);
      setIsTestingPrompt(false);
    }, 2000);
  };

  const insertToneGuideline = (tone: string) => {
    const guideline = TONE_GUIDELINES[tone as keyof typeof TONE_GUIDELINES];
    if (guideline) {
      setFormData({
        ...formData,
        content: formData.content + `\n\nSTYLE ${tone.toUpperCase()}:\n${guideline}`
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">Nouveau Prompt IA</h1>
          <p className="text-gray-400 mt-2">Créer un nouveau prompt pour optimiser vos outils IA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire principal */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations générales */}
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <h3 className="text-lg font-semibold text-white mb-4">Informations générales</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nom du prompt
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                    placeholder="Ex: Générateur de Titres Accrocheurs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Outil associé
                  </label>
                  <select
                    value={formData.tool}
                    onChange={(e) => setFormData({...formData, tool: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                    required
                  >
                    <option value="">Sélectionner un outil</option>
                    {tools.map(tool => (
                      <option key={tool} value={tool}>{tool}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type de prompt
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                    required
                  >
                    {types.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={2}
                  className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                  placeholder="Description du prompt et de son utilité..."
                />
              </div>
            </div>

            {/* Contenu du prompt */}
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Contenu du prompt</h3>
                <div className="flex items-center gap-2">
                  <select
                    value={formData.tone}
                    onChange={(e) => setFormData({...formData, tone: e.target.value})}
                    className="bg-[#1a1a1a] border border-[#232323] rounded-lg px-3 py-1 text-white text-sm focus:border-[#ff0033] focus:outline-none"
                  >
                    <option value="">Ajouter un ton</option>
                    {Object.keys(TONE_DESCRIPTIONS).map(tone => (
                      <option key={tone} value={tone}>{tone}</option>
                    ))}
                  </select>
                  {formData.tone && (
                    <button
                      type="button"
                      onClick={() => insertToneGuideline(formData.tone)}
                      className="bg-[#ff0033] text-white px-3 py-1 rounded-lg text-sm hover:bg-[#cc0029] transition-colors"
                    >
                      Insérer
                    </button>
                  )}
                </div>
              </div>
              
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={12}
                className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-[#ff0033] focus:outline-none"
                placeholder="Contenu du prompt..."
                required
              />
              
              <div className="mt-2 text-xs text-gray-400">
                Caractères: {formData.content.length} | Mots: {formData.content.split(' ').length}
              </div>
            </div>

            {/* Paramètres avancés */}
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <h3 className="text-lg font-semibold text-white mb-4">Paramètres OpenAI</h3>
              
              <textarea
                value={formData.parameters}
                onChange={(e) => setFormData({...formData, parameters: e.target.value})}
                rows={6}
                className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-[#ff0033] focus:outline-none"
                placeholder='{"temperature": 0.7, "max_tokens": 1000}'
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-4 h-4 text-[#ff0033] bg-[#1a1a1a] border-[#232323] rounded focus:ring-[#ff0033]"
                />
                Prompt actif
              </label>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-[#ff0033] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Créer le prompt
              </button>
            </div>
          </form>
        </div>

        {/* Zone de test */}
        <div className="space-y-6">
          {/* Aperçu du type */}
          <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
            <h3 className="text-lg font-semibold text-white mb-4">Type sélectionné</h3>
            {formData.type && (
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="font-medium text-white">
                    {types.find(t => t.value === formData.type)?.label}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  {types.find(t => t.value === formData.type)?.description}
                </p>
              </div>
            )}
          </div>

          {/* Test du prompt */}
          <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Tester le prompt
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Entrée de test
                </label>
                <textarea
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  rows={3}
                  className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white text-sm focus:border-[#ff0033] focus:outline-none"
                  placeholder="Saisissez votre texte de test..."
                />
              </div>
              
              <button
                type="button"
                onClick={handleTestPrompt}
                disabled={!formData.content || !testInput || isTestingPrompt}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isTestingPrompt ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Test en cours...
                  </>
                ) : (
                  <>
                    <TestTube className="w-4 h-4" />
                    Tester
                  </>
                )}
              </button>
              
              {testResult && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300">Résultat</label>
                    <button
                      onClick={() => navigator.clipboard.writeText(testResult)}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                      title="Copier"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="bg-[#1a1a1a] border border-[#232323] rounded-lg p-4 max-h-64 overflow-y-auto">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap">{testResult}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Aide rapide */}
          <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
            <h3 className="text-lg font-semibold text-white mb-4">💡 Conseils</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div>
                <strong className="text-white">Prompts efficaces :</strong>
                <ul className="mt-1 space-y-1 ml-4">
                  <li>• Soyez spécifique et clair</li>
                  <li>• Définissez le rôle de l'IA</li>
                  <li>• Donnez des exemples</li>
                  <li>• Spécifiez le format de sortie</li>
                </ul>
              </div>
              <div>
                <strong className="text-white">Variables utiles :</strong>
                <ul className="mt-1 space-y-1 ml-4">
                  <li>• {`{input}`} - Entrée utilisateur</li>
                  <li>• {`{tone}`} - Ton souhaité</li>
                  <li>• {`{format}`} - Format de sortie</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 