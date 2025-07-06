'use client';

import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import PremiumGuard from '@/components/auth/PremiumGuard';
import StepWizard from '@/components/StepWizard';
import {
  Sparkles,
  FileText,
  Calendar,
  Target,
  Copy,
  RefreshCw,
  Download,
  CheckCircle,
  HelpCircle,
  Building2,
  Users,
  Megaphone,
  Palette,
  BarChart3,
  TrendingUp,
  Clock,
  Eye
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
  const [showWizard, setShowWizard] = useState(true);
  const [lastFormData, setLastFormData] = useState<ContentSystemData | null>(null);

  // Charger les données sauvegardées au démarrage
  useEffect(() => {
    const savedContentPlan = localStorage.getItem('dropskills_content_system_data');
    const savedFormData = localStorage.getItem('dropskills_content_system_form_data');
    
    if (savedContentPlan && savedFormData) {
      try {
        setContentPlan(JSON.parse(savedContentPlan));
        setFormData(JSON.parse(savedFormData));
        setLastFormData(JSON.parse(savedFormData));
        setShowWizard(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données sauvegardées:', error);
        localStorage.removeItem('dropskills_content_system_data');
        localStorage.removeItem('dropskills_content_system_form_data');
      }
    }
  }, []);


  // Options pour les objectifs
  const GOALS_OPTIONS = [
    { id: 'notoriete', label: 'Notoriété', description: 'Faire connaître votre marque' },
    { id: 'engagement', label: 'Engagement', description: 'Créer de l\'interaction' },
    { id: 'leads', label: 'Leads', description: 'Générer des prospects' },
    { id: 'ventes', label: 'Ventes', description: 'Convertir en clients' },
    { id: 'fidelisation', label: 'Fidélisation', description: 'Retenir vos clients' },
    { id: 'trafic', label: 'Trafic', description: 'Augmenter les visites' }
  ];

  // Options pour les plateformes
  const PLATFORMS_OPTIONS = [
    { id: 'instagram', label: 'Instagram', description: 'Contenu visuel et stories' },
    { id: 'linkedin', label: 'LinkedIn', description: 'Contenu professionnel' },
    { id: 'facebook', label: 'Facebook', description: 'Communauté et partage' },
    { id: 'tiktok', label: 'TikTok', description: 'Vidéos courtes et tendances' },
    { id: 'youtube', label: 'YouTube', description: 'Vidéos longues et tutoriels' },
    { id: 'twitter', label: 'Twitter', description: 'Actualités et discussions' },
    { id: 'blog', label: 'Blog', description: 'Articles de fond' },
    { id: 'email', label: 'Email', description: 'Newsletter et séquences' }
  ];

  // Options pour la tonalité
  const TONE_OPTIONS = [
    { 
      id: 'professional', 
      label: 'Professionnel', 
      description: 'Ton sérieux et expert',
      example: '"Découvrez les 5 stratégies marketing qui transformeront votre business..."'
    },
    { 
      id: 'friendly', 
      label: 'Amical', 
      description: 'Ton chaleureux et accessible',
      example: '"Salut ! Aujourd\'hui, je partage avec toi mes astuces préférées..."'
    },
    { 
      id: 'inspiring', 
      label: 'Inspirant', 
      description: 'Ton motivant et énergique',
      example: '"Il est temps de passer à l\'action ! Voici comment transformer vos rêves..."'
    },
    { 
      id: 'educational', 
      label: 'Éducatif', 
      description: 'Ton pédagogue et informatif',
      example: '"Étape 1 : Comprendre votre audience cible. Voici pourquoi c\'est crucial..."'
    },
    { 
      id: 'casual', 
      label: 'Décontracté', 
      description: 'Ton relax et naturel',
      example: '"Hey ! Petite question : vous galérez aussi avec votre contenu ?"'
    }
  ];

  // Fonction de génération du système de contenu
  const generateContentSystem = async () => {
    setIsLoading(true);

    setContentPlan([]);
    
    try {
      const response = await fetch('/api/ai/content-system/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business: formData.business,
          audience: formData.audience,
          goals: formData.goals,
          platforms: formData.platforms,
          frequency: formData.frequency,
          tone: formData.tone
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        setIsLoading(false);
        return;
      }
      
      // Délai pour laisser les logs se terminer
      setTimeout(() => {
        setContentPlan(data.contentPlan);
        setLastFormData(formData);
        
        // Sauvegarder les données dans localStorage
        localStorage.setItem('dropskills_content_system_data', JSON.stringify(data.contentPlan));
        localStorage.setItem('dropskills_content_system_form_data', JSON.stringify(formData));
        
        setIsLoading(false);
        setShowWizard(false);
      }, 1000);
      
    } catch (error) {
      setIsLoading(false);
    }
  };

  // Fonction de régénération
  const regenerateSystem = async () => {
    setShowWizard(false);
    await generateContentSystem();
  };

  // Fonction de reset
  const resetForm = () => {
    setFormData({
      business: '',
      audience: '',
      goals: [],
      platforms: [],
      frequency: 'daily',
      tone: 'professional'
    });
    setContentPlan([]);
    setLastFormData(null);
    setShowWizard(true);
    
    // Nettoyer le localStorage
    localStorage.removeItem('dropskills_content_system_data');
    localStorage.removeItem('dropskills_content_system_form_data');
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
        `Description: ${item.description}\n\n`
      ).join('')
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-system-${formData.business.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Composant Étape 1 : Entreprise
  const EntrepriseStep = ({ formData, onUpdate }: { formData: ContentSystemData; onUpdate: (data: Partial<ContentSystemData>) => void }) => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Building2 className="w-12 h-12 text-[#ff0033] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Votre Entreprise</h2>
        <p className="text-gray-400">Décrivez votre activité pour personnaliser votre système de contenu</p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="block text-sm font-medium text-gray-300">
              Type d'entreprise
            </label>
            <div className="relative group">
              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                Ex: Coach en développement personnel, E-commerce mode, Agence marketing...
              </div>
            </div>
          </div>
          <input
            type="text"
            value={formData.business}
            onChange={(e) => onUpdate({ business: e.target.value })}
            placeholder="Ex: Coach en développement personnel, E-commerce mode..."
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
          />
        </div>

        {/* Bloc Conseil Dropskills AI */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="text-blue-400 font-medium mb-2">💡 Conseil Dropskills AI</h4>
              <p className="text-blue-300 text-sm leading-relaxed">
                Soyez spécifique sur votre secteur d'activité. Plus vous êtes précis, plus le système de contenu sera adapté à votre audience et vos objectifs business.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Composant Étape 2 : Audience
  const AudienceStep = ({ formData, onUpdate }: { formData: ContentSystemData; onUpdate: (data: Partial<ContentSystemData>) => void }) => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Users className="w-12 h-12 text-[#ff0033] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Votre Audience</h2>
        <p className="text-gray-400">Définissez qui vous voulez atteindre avec votre contenu</p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="block text-sm font-medium text-gray-300">
              Audience cible
            </label>
            <div className="relative group">
              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                Ex: Entrepreneurs débutants, Femmes 25-40 ans, Dirigeants PME...
              </div>
            </div>
          </div>
          <input
            type="text"
            value={formData.audience}
            onChange={(e) => onUpdate({ audience: e.target.value })}
            placeholder="Ex: Entrepreneurs débutants, Femmes 25-40 ans..."
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
          />
        </div>

        {/* Bloc Conseil Dropskills AI */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="text-blue-400 font-medium mb-2">🎯 Conseil Dropskills AI</h4>
              <p className="text-blue-300 text-sm leading-relaxed">
                Pensez démographie (âge, genre), psychographie (valeurs, intérêts) et comportements (habitudes d'achat, plateformes utilisées). Plus votre persona est précis, plus votre contenu sera engageant.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Composant Étape 3 : Objectifs et Plateformes
  const ObjectifsStep = ({ formData, onUpdate }: { formData: ContentSystemData; onUpdate: (data: Partial<ContentSystemData>) => void }) => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Megaphone className="w-12 h-12 text-[#ff0033] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Objectifs & Plateformes</h2>
        <p className="text-gray-400">Choisissez vos objectifs marketing et vos canaux de diffusion</p>
      </div>

      <div className="space-y-8">
        {/* Objectifs Marketing */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <label className="block text-sm font-medium text-gray-300">
              Objectifs marketing (sélectionnez plusieurs)
            </label>
            <div className="relative group">
              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                Choisissez 2-3 objectifs principaux pour votre stratégie de contenu
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {GOALS_OPTIONS.map((goal) => (
              <button
                key={goal.id}
                type="button"
                onClick={() => {
                  const newGoals = formData.goals.includes(goal.id)
                    ? formData.goals.filter(g => g !== goal.id)
                    : [...formData.goals, goal.id];
                  onUpdate({ goals: newGoals });
                }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  formData.goals.includes(goal.id)
                    ? 'border-[#ff0033] bg-[#ff0033]/10 text-white'
                    : 'border-[#333] bg-[#1a1a1a] text-gray-300 hover:border-[#555]'
                }`}
              >
                <div className="font-medium text-sm">{goal.label}</div>
                <div className="text-xs text-gray-400 mt-1">{goal.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Plateformes */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <label className="block text-sm font-medium text-gray-300">
              Plateformes (sélectionnez plusieurs)
            </label>
            <div className="relative group">
              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                Choisissez les plateformes où votre audience est active
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PLATFORMS_OPTIONS.map((platform) => (
              <button
                key={platform.id}
                type="button"
                onClick={() => {
                  const newPlatforms = formData.platforms.includes(platform.id)
                    ? formData.platforms.filter(p => p !== platform.id)
                    : [...formData.platforms, platform.id];
                  onUpdate({ platforms: newPlatforms });
                }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  formData.platforms.includes(platform.id)
                    ? 'border-[#ff0033] bg-[#ff0033]/10 text-white'
                    : 'border-[#333] bg-[#1a1a1a] text-gray-300 hover:border-[#555]'
                }`}
              >
                <div className="font-medium text-sm">{platform.label}</div>
                <div className="text-xs text-gray-400 mt-1">{platform.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Bloc Conseil Dropskills AI */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="text-blue-400 font-medium mb-2">📊 Conseil Dropskills AI</h4>
              <p className="text-blue-300 text-sm leading-relaxed">
                Commencez par 2-3 plateformes maximum pour maintenir la qualité. Mieux vaut être excellent sur peu de canaux que médiocre partout. Adaptez votre contenu aux spécificités de chaque plateforme.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Composant Étape 4 : Style et Fréquence
  const StyleStep = ({ formData, onUpdate }: { formData: ContentSystemData; onUpdate: (data: Partial<ContentSystemData>) => void }) => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Palette className="w-12 h-12 text-[#ff0033] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Style & Fréquence</h2>
        <p className="text-gray-400">Définissez le ton et la fréquence de votre contenu</p>
      </div>

      <div className="space-y-8">
        {/* Fréquence de publication */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <label className="block text-sm font-medium text-gray-300">
              Fréquence de publication
            </label>
            <div className="relative group">
              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                Choisissez une fréquence que vous pouvez maintenir dans le temps
              </div>
            </div>
          </div>
          <select
            value={formData.frequency}
            onChange={(e) => onUpdate({ frequency: e.target.value })}
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
          >
            <option value="daily">Quotidienne</option>
            <option value="3times">3x par semaine</option>
            <option value="weekly">Hebdomadaire</option>
            <option value="biweekly">Bi-hebdomadaire</option>
          </select>
        </div>

        {/* Tonalité */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <label className="block text-sm font-medium text-gray-300">
              Tonalité et style
            </label>
            <div className="relative group">
              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                Choisissez le ton qui correspond à votre marque et votre audience
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {TONE_OPTIONS.map((tone) => (
              <button
                key={tone.id}
                type="button"
                onClick={() => onUpdate({ tone: tone.id })}
                className={`w-full p-4 rounded-lg border text-left transition-all ${
                  formData.tone === tone.id
                    ? 'border-[#ff0033] bg-[#ff0033]/10'
                    : 'border-[#333] bg-[#1a1a1a] hover:border-[#555]'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="font-medium text-white">{tone.label}</div>
                </div>
                <div className="text-sm text-gray-400 mb-3">{tone.description}</div>
                <div className="bg-[#0a0a0a] rounded border-l-4 border-blue-400 p-3">
                  <p className="text-sm italic text-blue-300">{tone.example}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bloc Conseil Dropskills AI */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="text-blue-400 font-medium mb-2">🎨 Conseil Dropskills AI</h4>
              <p className="text-blue-300 text-sm leading-relaxed">
                La cohérence est clé ! Gardez le même ton sur toutes vos plateformes pour renforcer votre identité de marque. Adaptez seulement le format selon les spécificités de chaque canal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Composant Étape 5 : Récapitulatif
  const RecapitulatifStep = ({ formData, onGenerate }: { formData: ContentSystemData; onGenerate: () => void }) => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <CheckCircle className="w-12 h-12 text-[#ff0033] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Récapitulatif</h2>
        <p className="text-gray-400">Vérifiez vos paramètres avant la génération</p>
      </div>

      <div className="bg-[#111111] border border-[#232323] rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-400">Type d'entreprise :</label>
            <p className="text-white">{formData.business || 'Non défini'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400">Audience cible :</label>
            <p className="text-white">{formData.audience || 'Non définie'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400">Objectifs :</label>
            <p className="text-white">
              {formData.goals.length > 0 
                ? GOALS_OPTIONS.filter(g => formData.goals.includes(g.id)).map(g => g.label).join(', ')
                : 'Aucun objectif sélectionné'
              }
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400">Plateformes :</label>
            <p className="text-white">
              {formData.platforms.length > 0 
                ? PLATFORMS_OPTIONS.filter(p => formData.platforms.includes(p.id)).map(p => p.label).join(', ')
                : 'Aucune plateforme sélectionnée'
              }
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400">Fréquence :</label>
            <p className="text-white">
              {formData.frequency === 'daily' ? 'Quotidienne' :
               formData.frequency === '3times' ? '3x par semaine' :
               formData.frequency === 'weekly' ? 'Hebdomadaire' : 'Bi-hebdomadaire'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400">Tonalité :</label>
            <p className="text-white">
              {TONE_OPTIONS.find(t => t.id === formData.tone)?.label || 'Professionnel'}
            </p>
          </div>
        </div>
      </div>

      {/* Bloc "Prêt pour la génération" */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="w-6 h-6 text-blue-400" />
          <h3 className="text-lg font-semibold text-blue-300">
            Prêt pour la génération Content System AI ?
          </h3>
        </div>
        <p className="text-blue-200 mb-4">
          Content System AI va analyser toutes ces informations pour créer votre système de contenu personnalisé sur 4 semaines, avec des idées adaptées à chaque plateforme.
        </p>
        <button 
          onClick={onGenerate}
          className="w-full bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white py-4 px-6 rounded-lg font-semibold hover:from-[#cc0029] hover:to-[#990022] transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Générer avec Content System AI
        </button>
      </div>
    </div>
  );

  // Composant des résultats
  const ResultStep = () => (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Votre Système de Contenu</h2>
          <p className="text-gray-400">Système personnalisé généré pour {formData.business}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={regenerateSystem}
            className="bg-[#232323] text-white px-4 py-2 rounded-lg hover:bg-[#333] transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Régénérer
          </button>
          <button
            onClick={resetForm}
            className="bg-[#232323] text-white px-4 py-2 rounded-lg hover:bg-[#333] transition-colors"
          >
            Nouveau système
          </button>
          {contentPlan.length > 0 && (
            <button
              onClick={exportPlan}
              className="bg-[#ff0033] text-white px-4 py-2 rounded-lg hover:bg-[#cc0029] transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exporter
            </button>
          )}
        </div>
      </div>

      {/* Informations générales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm font-medium">Contenu généré</span>
          </div>
          <div className="text-2xl font-bold text-white">{contentPlan.reduce((acc, week) => acc + week.content.length, 0)}</div>
          <div className="text-xs text-gray-400">idées sur 4 semaines</div>
        </div>
      </div>

      {/* Bloc Conseil Dropskills AI */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <h4 className="text-blue-400 font-medium mb-2">💡 Conseil Dropskills AI</h4>
            <p className="text-blue-300 text-sm leading-relaxed">
              Utilisez ce système comme base et adaptez selon les tendances actuelles. N'hésitez pas à tester différents formats et à analyser les performances pour optimiser votre stratégie.
            </p>
          </div>
        </div>
      </div>

      {/* Contenu du système */}
      {contentPlan.length > 0 ? (
        <div className="space-y-6">
          {contentPlan.map((week) => (
            <div key={week.week} className="bg-[#111111] border border-[#232323] rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#ff0033]" />
                Semaine {week.week}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {week.content.map((item, index) => (
                  <div key={index} className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#ff0033] text-white px-2 py-1 rounded text-xs font-medium">
                          {item.platform}
                        </span>
                        <span className="text-gray-400 text-xs">{item.type}</span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${item.title}\n\n${item.description}\n\n${item.hashtags.join(' ')}`);
                        }}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Copier le contenu"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="text-white font-medium text-sm mb-2">{item.title}</h4>
                    <p className="text-gray-400 text-xs mb-3 leading-relaxed">{item.description}</p>
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
        <div className="bg-[#111111] border border-[#232323] rounded-lg p-12 text-center">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">Votre système de contenu apparaîtra ici</p>
          <p className="text-gray-500 text-sm">
            Le contenu est en cours de génération...
          </p>
        </div>
      )}
    </div>
  );

  // Configuration des étapes du wizard
  const steps = [
    {
      id: 'entreprise',
      title: 'Entreprise',
      description: 'Votre activité',
      icon: Building2,
      component: () => <EntrepriseStep formData={formData} onUpdate={(data) => setFormData(prev => ({ ...prev, ...data }))} />,
      validation: (_data: unknown) => ({
        isValid: formData.business.trim().length >= 3,
        errors: formData.business.trim().length >= 3 ? {} : { business: 'Le nom de l\'entreprise est requis' }
      })
    },
    {
      id: 'audience',
      title: 'Audience',
      description: 'Votre cible',
      icon: Users,
      component: () => <AudienceStep formData={formData} onUpdate={(data) => setFormData(prev => ({ ...prev, ...data }))} />,
      validation: (_data: unknown) => ({
        isValid: formData.audience.trim().length >= 3,
        errors: formData.audience.trim().length >= 3 ? {} : { audience: 'La description de l\'audience est requise' }
      })
    },
    {
      id: 'objectifs',
      title: 'Objectifs',
      description: 'Buts & plateformes',
      icon: Megaphone,
      component: () => <ObjectifsStep formData={formData} onUpdate={(data) => setFormData(prev => ({ ...prev, ...data }))} />,
      validation: (_data: unknown) => ({
        isValid: formData.goals.length > 0 && formData.platforms.length > 0,
        errors: {
          ...(formData.goals.length === 0 ? { goals: 'Sélectionnez au moins un objectif' } : {}),
          ...(formData.platforms.length === 0 ? { platforms: 'Sélectionnez au moins une plateforme' } : {})
        }
      })
    },
    {
      id: 'style',
      title: 'Style',
      description: 'Ton & fréquence',
      icon: Palette,
      component: () => <StyleStep formData={formData} onUpdate={(data) => setFormData(prev => ({ ...prev, ...data }))} />,
      validation: (_data: unknown) => ({
        isValid: formData.tone.length > 0,
        errors: formData.tone.length > 0 ? {} : { tone: 'Sélectionnez un ton' }
      })
    },
    {
      id: 'recapitulatif',
      title: 'Récapitulatif',
      description: 'Validation finale',
      icon: CheckCircle,
      component: () => <RecapitulatifStep formData={formData} onGenerate={generateContentSystem} />,
      validation: (_data: unknown) => ({ isValid: true, errors: {} })
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6">
      {showWizard ? (
        <StepWizard
          steps={steps}
          title="Content System"
          description="Créez un système de contenu complet pour vos réseaux sociaux"
          onComplete={() => setShowWizard(false)}
          isLoading={isLoading}
          toolId="content-system"
        />
      ) : (
        <ResultStep />
      )}
    </div>
  );
}

export default function ContentSystemPage() {
  const stats = [
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Contenu généré",
      value: "2,847",
      color: "text-blue-400",
      description: "Posts créés ce mois"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Engagement",
      value: "+156%",
      color: "text-green-400",
      description: "Amélioration moyenne"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Temps économisé",
      value: "47h",
      color: "text-purple-400",
      description: "Par semaine en moyenne"
    },
    {
      icon: <Eye className="w-5 h-5" />,
      label: "Portée",
      value: "1.2M",
      color: "text-orange-400",
      description: "Impressions générées"
    }
  ];

  return (
    <ToolLayout toolId="content-system">
      <PremiumGuard feature="Système de Contenu IA">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className={`flex items-center gap-2 mb-1 ${stat.color}`}>
                {stat.icon}
                <span className="text-sm font-medium">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.description}</div>
            </div>
          ))}
        </div>
        <ContentSystemContent />
      </PremiumGuard>
    </ToolLayout>
  );
}