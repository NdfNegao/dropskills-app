'use client';

import { useState } from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { 
  BrainCog, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Target,
  Lightbulb,
  Zap,
  CheckCircle,
  Copy,
  RefreshCw,
  Download,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export interface ICPFormData {
  secteur: string;
  produitService: string;
  promesseUnique: string;
  budgetCible: string;
  canaux: string[];
  zoneGeographique: string;
  tonalite: string;
}

export interface ICPAnalysis {
  profilSociodemographique: {
    age: string;
    sexe: string;
    localisation: string;
    situationPro: string;
    niveauRevenus: string;
  };
  psychologieMotivations: {
    besoins: string[];
    desirs: string[];
    peurs: string[];
    objections: string[];
  };
  problemePrincipaux: string[];
  ouLeTrouver: {
    canaux: string[];
    plateformes: string[];
    groupes: string[];
    evenements: string[];
  };
  messagingImpactant: {
    expressions: string[];
    accroches: string[];
    styleDiscours: string;
  };
  budgetPouvoirAchat: {
    budgetTypique: string;
    frequenceAchat: string;
    facteursPrix: string[];
  };
  segments: {
    principal: {
      nom: string;
      description: string;
      pourcentage: string;
    };
    variantes: Array<{
      nom: string;
      description: string;
      pourcentage: string;
    }>;
  };
  ficheActionable: {
    resumeExecutif: string;
    prioritesMarketing: string[];
    prochainEtapes: string[];
    metriquesACles: string[];
  };
}

const CANAUX_OPTIONS = [
  'Facebook Ads', 'Google Ads', 'LinkedIn', 'Instagram', 'TikTok', 
  'YouTube', 'Email Marketing', 'SEO/Blog', 'Webinaires', 'Podcasts',
  'Événements', 'Partenariats', 'Bouche-à-oreille', 'Affiliation'
];

const TONALITE_OPTIONS = [
  'Professionnel et expert', 'Amical et accessible', 'Inspirant et motivant',
  'Direct et sans détour', 'Éducatif et pédagogue', 'Luxe et premium',
  'Jeune et dynamique', 'Rassurant et bienveillant'
];

function ICPMakerContent() {
  const [formData, setFormData] = useState<ICPFormData>({
    secteur: '',
    produitService: '',
    promesseUnique: '',
    budgetCible: '',
    canaux: [],
    zoneGeographique: '',
    tonalite: ''
  });

  const [icpResult, setIcpResult] = useState<ICPAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    secteur: true,
    produit: false,
    promesse: false,
    budget: false,
    canaux: false,
    geo: false,
    tonalite: false
  });

  const handleGenerate = async () => {
    if (!formData.secteur || !formData.produitService) {
      alert('Veuillez remplir au moins le secteur et le produit/service');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/icp/generate', {
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
      setIcpResult(data.analysis);
      
      // Sauvegarder les données
      localStorage.setItem('dropskills_icp_data', JSON.stringify(data.analysis));
      localStorage.setItem('dropskills_icp_form_data', JSON.stringify(formData));
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération de l\'ICP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ICPFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCanalToggle = (canal: string) => {
    const newCanaux = formData.canaux.includes(canal)
      ? formData.canaux.filter(c => c !== canal)
      : [...formData.canaux, canal];
    
    handleInputChange('canaux', newCanaux);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <LayoutWithSidebar>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <BrainCog className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">ICP Maker IA</h1>
              <p className="text-gray-400">Créez votre profil client idéal avec l'IA</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white font-semibold">4,892</p>
                  <p className="text-gray-400 text-sm">ICP générés</p>
                </div>
              </div>
            </div>
            <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white font-semibold">+89%</p>
                  <p className="text-gray-400 text-sm">Précision targeting</p>
                </div>
              </div>
            </div>
            <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-white font-semibold">2,347</p>
                  <p className="text-gray-400 text-sm">Entrepreneurs actifs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire */}
          <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Informations business
            </h2>

            <div className="space-y-4">
              {/* Secteur */}
              <div className="border border-[#232323] rounded-lg">
                <button
                  onClick={() => toggleSection('secteur')}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition-colors"
                >
                  <span className="text-white font-medium">Secteur d'activité *</span>
                  {expandedSections.secteur ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {expandedSections.secteur && (
                  <div className="p-4 pt-0">
                    <input
                      type="text"
                      value={formData.secteur}
                      onChange={(e) => handleInputChange('secteur', e.target.value)}
                      placeholder="Ex: Formation en ligne, E-commerce mode, Coaching business..."
                      className="w-full p-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Produit/Service */}
              <div className="border border-[#232323] rounded-lg">
                <button
                  onClick={() => toggleSection('produit')}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition-colors"
                >
                  <span className="text-white font-medium">Produit/Service *</span>
                  {expandedSections.produit ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {expandedSections.produit && (
                  <div className="p-4 pt-0">
                    <textarea
                      value={formData.produitService}
                      onChange={(e) => handleInputChange('produitService', e.target.value)}
                      placeholder="Décrivez votre produit ou service en détail..."
                      rows={3}
                      className="w-full p-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Promesse unique */}
              <div className="border border-[#232323] rounded-lg">
                <button
                  onClick={() => toggleSection('promesse')}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition-colors"
                >
                  <span className="text-white font-medium">Promesse unique</span>
                  {expandedSections.promesse ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {expandedSections.promesse && (
                  <div className="p-4 pt-0">
                    <textarea
                      value={formData.promesseUnique}
                      onChange={(e) => handleInputChange('promesseUnique', e.target.value)}
                      placeholder="Quelle est votre valeur ajoutée unique ?"
                      rows={2}
                      className="w-full p-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Budget cible */}
              <div className="border border-[#232323] rounded-lg">
                <button
                  onClick={() => toggleSection('budget')}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition-colors"
                >
                  <span className="text-white font-medium">Budget cible</span>
                  {expandedSections.budget ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {expandedSections.budget && (
                  <div className="p-4 pt-0">
                    <input
                      type="text"
                      value={formData.budgetCible}
                      onChange={(e) => handleInputChange('budgetCible', e.target.value)}
                      placeholder="Ex: 50-200€/mois, 500-2000€/an..."
                      className="w-full p-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Canaux */}
              <div className="border border-[#232323] rounded-lg">
                <button
                  onClick={() => toggleSection('canaux')}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition-colors"
                >
                  <span className="text-white font-medium">Canaux marketing</span>
                  {expandedSections.canaux ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {expandedSections.canaux && (
                  <div className="p-4 pt-0">
                    <div className="grid grid-cols-2 gap-2">
                      {CANAUX_OPTIONS.map((canal) => (
                        <button
                          key={canal}
                          onClick={() => handleCanalToggle(canal)}
                          className={`p-2 rounded-lg border text-sm transition-colors ${
                            formData.canaux.includes(canal)
                              ? 'bg-[#00D2FF] border-[#00D2FF] text-black'
                              : 'bg-[#1a1a1a] border-[#333] text-white hover:border-[#00D2FF]'
                          }`}
                        >
                          {canal}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Zone géographique */}
              <div className="border border-[#232323] rounded-lg">
                <button
                  onClick={() => toggleSection('geo')}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition-colors"
                >
                  <span className="text-white font-medium">Zone géographique</span>
                  {expandedSections.geo ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {expandedSections.geo && (
                  <div className="p-4 pt-0">
                    <input
                      type="text"
                      value={formData.zoneGeographique}
                      onChange={(e) => handleInputChange('zoneGeographique', e.target.value)}
                      placeholder="Ex: France, Europe, International..."
                      className="w-full p-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Tonalité */}
              <div className="border border-[#232323] rounded-lg">
                <button
                  onClick={() => toggleSection('tonalite')}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition-colors"
                >
                  <span className="text-white font-medium">Tonalité</span>
                  {expandedSections.tonalite ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {expandedSections.tonalite && (
                  <div className="p-4 pt-0">
                    <div className="grid grid-cols-1 gap-2">
                      {TONALITE_OPTIONS.map((tonalite) => (
                        <button
                          key={tonalite}
                          onClick={() => handleInputChange('tonalite', tonalite)}
                          className={`p-3 rounded-lg border text-sm transition-colors text-left ${
                            formData.tonalite === tonalite
                              ? 'bg-[#00D2FF] border-[#00D2FF] text-black'
                              : 'bg-[#1a1a1a] border-[#333] text-white hover:border-[#00D2FF]'
                          }`}
                        >
                          {tonalite}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || !formData.secteur || !formData.produitService}
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Générer mon ICP
                </>
              )}
            </button>
          </div>

          {/* Résultats */}
          <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Votre Client Idéal
            </h2>

            {!icpResult ? (
              <div className="text-center py-12">
                <BrainCog className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">Prêt à découvrir votre client idéal ?</p>
                <p className="text-gray-500 text-sm">Remplissez le formulaire et cliquez sur "Générer mon ICP"</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Profil sociodémographique */}
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-400" />
                    Profil sociodémographique
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-300"><span className="text-blue-400">Âge:</span> {icpResult.profilSociodemographique.age}</p>
                    <p className="text-gray-300"><span className="text-blue-400">Sexe:</span> {icpResult.profilSociodemographique.sexe}</p>
                    <p className="text-gray-300"><span className="text-blue-400">Localisation:</span> {icpResult.profilSociodemographique.localisation}</p>
                    <p className="text-gray-300"><span className="text-blue-400">Situation pro:</span> {icpResult.profilSociodemographique.situationPro}</p>
                    <p className="text-gray-300"><span className="text-blue-400">Revenus:</span> {icpResult.profilSociodemographique.niveauRevenus}</p>
                  </div>
                </div>

                {/* Psychologie & Motivations */}
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    Psychologie & Motivations
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-green-400 font-medium mb-1">Besoins</p>
                      <ul className="text-gray-300 space-y-1">
                        {icpResult.psychologieMotivations.besoins.map((besoin, index) => (
                          <li key={index}>• {besoin}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-purple-400 font-medium mb-1">Désirs</p>
                      <ul className="text-gray-300 space-y-1">
                        {icpResult.psychologieMotivations.desirs.map((desir, index) => (
                          <li key={index}>• {desir}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-red-400 font-medium mb-1">Peurs</p>
                      <ul className="text-gray-300 space-y-1">
                        {icpResult.psychologieMotivations.peurs.map((peur, index) => (
                          <li key={index}>• {peur}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-orange-400 font-medium mb-1">Objections</p>
                      <ul className="text-gray-300 space-y-1">
                        {icpResult.psychologieMotivations.objections.map((objection, index) => (
                          <li key={index}>• {objection}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Où le trouver */}
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    Où le trouver
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-cyan-400 font-medium mb-1">Canaux</p>
                      <ul className="text-gray-300 space-y-1">
                        {icpResult.ouLeTrouver.canaux.map((canal, index) => (
                          <li key={index}>• {canal}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-cyan-400 font-medium mb-1">Plateformes</p>
                      <ul className="text-gray-300 space-y-1">
                        {icpResult.ouLeTrouver.plateformes.map((plateforme, index) => (
                          <li key={index}>• {plateforme}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(icpResult, null, 2))}
                    className="flex-1 bg-[#1a1a1a] text-white py-2 px-4 rounded-lg hover:bg-[#232323] transition-colors flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copier
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="flex-1 bg-[#1a1a1a] text-white py-2 px-4 rounded-lg hover:bg-[#232323] transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Régénérer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conseils */}
        <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-blue-400 font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            💡 Conseils pour un ICP efficace
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-300 text-sm">
            <div>
              <h4 className="font-medium mb-3 text-blue-200">✨ Optimisation du profil</h4>
              <ul className="space-y-2 text-blue-300">
                <li>• <strong>Soyez spécifique :</strong> Plus votre secteur est précis, plus l'ICP sera pertinent</li>
                <li>• <strong>Détaillez votre offre :</strong> Incluez les bénéfices concrets de votre produit/service</li>
                <li>• <strong>Budget réaliste :</strong> Indiquez une fourchette cohérente avec votre marché</li>
                <li>• <strong>Canaux multiples :</strong> Sélectionnez 3-5 canaux pour une stratégie diversifiée</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-blue-200">🎯 Utilisation des résultats</h4>
              <ul className="space-y-2 text-blue-300">
                <li>• <strong>Créez vos personas :</strong> Utilisez le profil pour vos campagnes marketing</li>
                <li>• <strong>Adaptez votre message :</strong> Reprenez les expressions et peurs identifiées</li>
                <li>• <strong>Ciblez vos canaux :</strong> Concentrez-vous sur les plateformes recommandées</li>
                <li>• <strong>Testez et ajustez :</strong> Régénérez l'ICP selon vos retours terrain</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </LayoutWithSidebar>
  );
}

export default function ICPMakerPage() {
  return <ICPMakerContent />;
} 