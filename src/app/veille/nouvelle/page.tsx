'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface VeilleFormData {
  keywords: string[];
  sources: string[];
  sectors: string[];
  maxResults: number;
  dateRange: string;
  priority: string;
}

const SOURCES_OPTIONS = [
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', description: 'Entreprises, jobs, posts professionnels' },
  { id: 'news', name: 'News & Presse', icon: '📰', description: 'Articles, communiqués, actualités' },
  { id: 'twitter', name: 'Twitter/X', icon: '🐦', description: 'Tweets, tendances, conversations' },
  { id: 'websites', name: 'Websites', icon: '🌐', description: 'Sites web, blogs, forums' }
];

const SECTORS_OPTIONS = [
  'Fintech', 'HealthTech', 'EdTech', 'GreenTech', 'E-commerce', 
  'SaaS', 'IA & Machine Learning', 'Blockchain', 'IoT', 'Cybersécurité',
  'Mobilité', 'Immobilier', 'Énergie', 'Retail', 'Média & Divertissement'
];

const KEYWORDS_SUGGESTIONS = {
  'Fintech': ['fintech', 'payment', 'blockchain', 'crypto', 'neobank', 'insurtech'],
  'HealthTech': ['healthtech', 'medtech', 'telemedicine', 'digital health', 'biotech'],
  'EdTech': ['edtech', 'e-learning', 'formation', 'mooc', 'education'],
  'SaaS': ['saas', 'software', 'cloud', 'api', 'platform', 'automation']
};

export default function NouvelleVeillePage() {
  const [formData, setFormData] = useState<VeilleFormData>({
    keywords: [],
    sources: ['linkedin', 'news'],
    sectors: [],
    maxResults: 50,
    dateRange: 'week',
    priority: 'medium'
  });
  
  const [keywordInput, setKeywordInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(0.05);
  
  const router = useRouter();
  const supabase = createClientComponentClient();

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
      updateEstimatedCost();
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
    updateEstimatedCost();
  };

  const toggleSource = (sourceId: string) => {
    setFormData(prev => ({
      ...prev,
      sources: prev.sources.includes(sourceId)
        ? prev.sources.filter(s => s !== sourceId)
        : [...prev.sources, sourceId]
    }));
    updateEstimatedCost();
  };

  const updateEstimatedCost = () => {
    const baseCost = 0.02;
    const keywordMultiplier = Math.max(1, formData.keywords.length * 0.5);
    const sourceMultiplier = formData.sources.length;
    const resultsMultiplier = formData.maxResults / 100;
    
    const cost = baseCost * keywordMultiplier * sourceMultiplier * resultsMultiplier;
    setEstimatedCost(Math.round(cost * 100) / 100);
  };

  const addSuggestedKeywords = (sector: string) => {
    const suggestions = KEYWORDS_SUGGESTIONS[sector] || [];
    const newKeywords = suggestions.filter(k => !formData.keywords.includes(k));
    
    setFormData(prev => ({
      ...prev,
      keywords: [...prev.keywords, ...newKeywords.slice(0, 3)],
      sectors: prev.sectors.includes(sector) ? prev.sectors : [...prev.sectors, sector]
    }));
    updateEstimatedCost();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.keywords.length === 0) {
      alert('Veuillez ajouter au moins un mot-clé');
      return;
    }
    
    if (formData.sources.length === 0) {
      alert('Veuillez sélectionner au moins une source');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/apify/scrape/veille', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        // Rediriger vers la page de suivi du job
        router.push(`/veille/${result.jobId}`);
      } else {
        alert(`Erreur: ${result.error}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du lancement de la veille');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🚀 Nouvelle Veille Automatisée
          </h1>
          <p className="text-gray-600">
            Configurez votre veille intelligente et découvrez des opportunités business en temps réel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section Mots-clés */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">🎯 Mots-clés de recherche</h2>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Ajouter un mot-clé (ex: startup, fintech)"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                className="flex-1 border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Ajouter
              </button>
            </div>

            {/* Mots-clés ajoutés */}
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(keyword)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Suggestions par secteur */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Suggestions par secteur :</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(KEYWORDS_SUGGESTIONS).map((sector) => (
                  <button
                    key={sector}
                    type="button"
                    onClick={() => addSuggestedKeywords(sector)}
                    className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
                  >
                    + {sector}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section Sources */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">📊 Sources de données</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SOURCES_OPTIONS.map((source) => (
                <div
                  key={source.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    formData.sources.includes(source.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleSource(source.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{source.icon}</span>
                    <div>
                      <h3 className="font-medium">{source.name}</h3>
                      <p className="text-sm text-gray-600">{source.description}</p>
                    </div>
                    <div className="ml-auto">
                      {formData.sources.includes(source.id) && (
                        <span className="text-blue-600">✓</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Configuration */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">⚙️ Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre de résultats */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de résultats max
                </label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="10"
                  value={formData.maxResults}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, maxResults: parseInt(e.target.value) }));
                    updateEstimatedCost();
                  }}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>10</span>
                  <span className="font-medium">{formData.maxResults}</span>
                  <span>200</span>
                </div>
              </div>

              {/* Période */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Période de recherche
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'today', label: 'Aujourd\'hui' },
                    { value: 'week', label: 'Cette semaine' },
                    { value: 'month', label: 'Ce mois' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="dateRange"
                        value={option.value}
                        checked={formData.dateRange === option.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, dateRange: e.target.value }))}
                        className="mr-2"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Estimation coût */}
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">💰 Estimation du coût</h3>
                <p className="text-gray-600">
                  {formData.keywords.length} mots-clés × {formData.sources.length} sources × {formData.maxResults} résultats
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">
                  €{estimatedCost.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600">par veille</p>
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || formData.keywords.length === 0 || formData.sources.length === 0}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Lancement en cours...
                </>
              ) : (
                <>
                  🚀 Lancer la Veille
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>⚡ Résultats disponibles en 2-5 minutes • 🤖 Analyse IA automatique • 📊 Export PDF/CSV inclus</p>
        </div>
      </div>
    </div>
  );
} 