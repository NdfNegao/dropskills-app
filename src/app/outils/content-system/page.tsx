'use client';

import { useState } from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import PremiumGuard from '@/components/auth/PremiumGuard';
import { 
  Sparkles, 
  FileText, 
  Calendar, 
  Target, 
  TrendingUp, 
  Copy,
  RefreshCw,
  Download,
  CheckCircle
} from 'lucide-react';

interface ContentSystemData {
  business: string;
  audience: string;
  goals: string[];
  platforms: string[];
  frequency: string;
  tone: string;
}

interface ContentPlan {
  week: number;
  content: {
    platform: string;
    type: string;
    title: string;
    description: string;
    hashtags: string[];
  }[];
}

function ContentSystemContent() {
  const [formData, setFormData] = useState<ContentSystemData>({
    business: '',
    audience: '',
    goals: [],
    platforms: [],
    frequency: 'daily',
    tone: 'professional'
  });

  const [contentPlan, setContentPlan] = useState<ContentPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/content-system/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération');
      }

      const data = await response.json();
      setContentPlan(data.contentPlan);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération du système de contenu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoalChange = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handlePlatformChange = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const exportPlan = () => {
    const content = contentPlan.map(week => 
      `SEMAINE ${week.week}\n` +
      week.content.map(item => 
        `${item.platform} - ${item.type}\n` +
        `Titre: ${item.title}\n` +
        `Description: ${item.description}\n` +
        `Hashtags: ${item.hashtags.join(' ')}\n`
      ).join('\n') + '\n'
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-system-${formData.business.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Content System IA</h1>
            <p className="text-gray-400">Générez un système de contenu complet pour 4 semaines</p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-400 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Temps économisé</span>
            </div>
            <div className="text-2xl font-bold text-white">15h</div>
            <div className="text-xs text-gray-400">par mois de planification</div>
          </div>
          
          <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-400 mb-1">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">Engagement</span>
            </div>
            <div className="text-2xl font-bold text-white">+89%</div>
            <div className="text-xs text-gray-400">avec contenu planifié</div>
          </div>
          
          <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Systèmes créés</span>
            </div>
            <div className="text-2xl font-bold text-white">2,847</div>
            <div className="text-xs text-gray-400">ce mois-ci</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire */}
        <div className="bg-[#111111] border border-[#232323] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Configuration du système</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type d'entreprise
              </label>
              <input
                type="text"
                value={formData.business}
                onChange={(e) => setFormData({...formData, business: e.target.value})}
                placeholder="Ex: Coach en développement personnel, E-commerce mode..."
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Audience cible
              </label>
              <input
                type="text"
                value={formData.audience}
                onChange={(e) => setFormData({...formData, audience: e.target.value})}
                placeholder="Ex: Entrepreneurs débutants, Femmes 25-40 ans..."
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Objectifs marketing (sélectionnez plusieurs)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Notoriété', 'Engagement', 'Leads', 'Ventes', 'Fidélisation', 'Trafic'].map((goal) => (
                  <label key={goal} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.goals.includes(goal)}
                      onChange={() => handleGoalChange(goal)}
                      className="w-4 h-4 text-[#ff0033] bg-[#1a1a1a] border-[#333] rounded focus:ring-[#ff0033]"
                    />
                    <span className="text-gray-300 text-sm">{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Plateformes (sélectionnez plusieurs)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Instagram', 'LinkedIn', 'Facebook', 'TikTok', 'YouTube', 'Twitter', 'Blog', 'Email'].map((platform) => (
                  <label key={platform} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.platforms.includes(platform)}
                      onChange={() => handlePlatformChange(platform)}
                      className="w-4 h-4 text-[#ff0033] bg-[#1a1a1a] border-[#333] rounded focus:ring-[#ff0033]"
                    />
                    <span className="text-gray-300 text-sm">{platform}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fréquence de publication
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
                >
                  <option value="daily">Quotidienne</option>
                  <option value="3times">3x par semaine</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="biweekly">Bi-hebdomadaire</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ton de communication
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({...formData, tone: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
                >
                  <option value="professional">Professionnel</option>
                  <option value="friendly">Amical</option>
                  <option value="inspiring">Inspirant</option>
                  <option value="educational">Éducatif</option>
                  <option value="casual">Décontracté</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || formData.goals.length === 0 || formData.platforms.length === 0}
              className="w-full bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white py-4 rounded-lg font-semibold hover:from-[#cc0029] hover:to-[#990022] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Générer le système (4 semaines)
                </>
              )}
            </button>
          </form>
        </div>

        {/* Résultats */}
        <div className="bg-[#111111] border border-[#232323] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Votre système de contenu</h2>
            {contentPlan.length > 0 && (
              <button
                onClick={exportPlan}
                className="bg-[#232323] text-white px-3 py-2 rounded-lg hover:bg-[#333] transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exporter
              </button>
            )}
          </div>

          {contentPlan.length > 0 ? (
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {contentPlan.map((week) => (
                <div key={week.week} className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#ff0033]" />
                    Semaine {week.week}
                  </h3>
                  <div className="space-y-3">
                    {week.content.map((item, index) => (
                      <div key={index} className="bg-[#0a0a0a] rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-[#ff0033] text-white px-2 py-1 rounded text-xs font-medium">
                            {item.platform}
                          </span>
                          <span className="text-gray-400 text-xs">{item.type}</span>
                        </div>
                        <h4 className="text-white font-medium text-sm mb-1">{item.title}</h4>
                        <p className="text-gray-400 text-xs mb-2">{item.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {item.hashtags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="text-blue-400 text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-12 text-center">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">Votre système de contenu apparaîtra ici</p>
              <p className="text-gray-500 text-sm">
                Configurez vos paramètres et générez un plan de contenu pour 4 semaines
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Conseils */}
      <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-blue-400 font-semibold mb-4">💡 Conseils pour un système de contenu efficace</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-300 text-sm">
          <div>
            <h4 className="font-medium mb-2">📅 Planification</h4>
            <ul className="space-y-1 text-blue-200">
              <li>• Variez les types de contenu (éducatif, divertissant, promotionnel)</li>
              <li>• Respectez la règle 80/20 (80% valeur, 20% promotion)</li>
              <li>• Adaptez le contenu à chaque plateforme</li>
              <li>• Planifiez vos publications à l'avance</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">🎯 Optimisation</h4>
            <ul className="space-y-1 text-blue-200">
              <li>• Analysez les performances régulièrement</li>
              <li>• Engagez avec votre audience</li>
              <li>• Réutilisez le contenu performant</li>
              <li>• Testez différents formats et horaires</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContentSystemPage() {
  return (
    <LayoutWithSidebar>
      <PremiumGuard feature="Content System IA">
        <ContentSystemContent />
      </PremiumGuard>
    </LayoutWithSidebar>
  );
} 