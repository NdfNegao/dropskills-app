'use client';

import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import PremiumGuard from '@/components/auth/PremiumGuard';
import { 
  FolderKanban, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Target,
  Lightbulb,
  Zap,
  CheckCircle,
  Copy,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  BarChart3
} from 'lucide-react';

export interface TunnelFormData {
  offreProduitService: string;
  objectifTunnel: string;
  maturiteAudience: string;
  budgetCible: string;
  canauxEntree: string[];
  actifsExistants: string;
  automatisationDesiree: string;
  tonaliteStyle: string;
  longueurTunnel: string;
  inclureUpsell: boolean;
}

export interface TunnelEtape {
  nom: string;
  objectif: string;
  messageCle: string;
  callToAction: string;
  objectionALever: string;
  conseilsCopywriting: string[];
  automatisationSuggestions: string[];
}

export interface TunnelAnalysis {
  schemaTunnel: {
    etapes: string[];
    description: string;
    dureeEstimee: string;
  };
  etapesDetaillees: TunnelEtape[];
  conseilsGeneraux: {
    copywriting: string[];
    automatisation: string[];
    optimisation: string[];
  };
  sequenceEmail: {
    description: string;
    emails: Array<{
      jour: number;
      sujet: string;
      objectif: string;
      contenuCle: string;
    }>;
  };
  metriques: {
    tauxConversionEstime: number;
    complexite: number;
    potentielROI: number;
  };
  outilsRecommandes: string[];
}

const OBJECTIFS_OPTIONS = [
  'Vendre un produit/service',
  'Générer des leads qualifiés',
  'Lancer un nouveau produit',
  'Augmenter la valeur panier',
  'Fidéliser les clients',
  'Éduquer l\'audience'
];

const MATURITE_OPTIONS = [
  'Froide (ne connaît pas le problème)',
  'Tiède (connaît le problème)',
  'Chaude (cherche une solution)',
  'Très chaude (prête à acheter)'
];

const CANAUX_OPTIONS = [
  'Facebook Ads',
  'Google Ads',
  'LinkedIn',
  'Instagram',
  'TikTok',
  'YouTube',
  'Email Marketing',
  'SEO/Blog',
  'Webinaires',
  'Podcasts',
  'Partenariats',
  'Affiliation'
];

const LONGUEUR_OPTIONS = [
  'Court (2-3 étapes)',
  'Moyen (4-5 étapes)',
  'Long (6+ étapes)'
];

const TONALITE_OPTIONS = [
  'Professionnel et expert',
  'Amical et accessible',
  'Urgent et persuasif',
  'Éducatif et pédagogue',
  'Luxe et premium'
];

function TunnelMakerContent() {
  const [formData, setFormData] = useState<TunnelFormData>({
    offreProduitService: '',
    objectifTunnel: '',
    maturiteAudience: '',
    budgetCible: '',
    canauxEntree: [],
    actifsExistants: '',
    automatisationDesiree: '',
    tonaliteStyle: '',
    longueurTunnel: '',
    inclureUpsell: false
  });

  const [tunnelResult, setTunnelResult] = useState<TunnelAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [icpData, setIcpData] = useState<any>(null);
  const [uspData, setUspData] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState({
    offre: true,
    objectif: false,
    audience: false,
    budget: false,
    canaux: false,
    actifs: false,
    automatisation: false,
    tonalite: false,
    longueur: false,
    upsell: false
  });

  // Récupération des données ICP et USP si disponibles
  useEffect(() => {
    const savedICP = localStorage.getItem('dropskills_icp_data');
    const savedUSP = localStorage.getItem('dropskills_usp_data');
    
    if (savedICP) {
      try {
        const parsedICP = JSON.parse(savedICP);
        setIcpData(parsedICP);
        // Pré-remplir avec les données ICP
        setFormData(prev => ({
          ...prev,
          budgetCible: parsedICP.budgetPouvoirAchat?.budgetTypique || ''
        }));
      } catch (error) {
        console.error('Erreur lors du parsing des données ICP:', error);
      }
    }
    
    if (savedUSP) {
      try {
        const parsedUSP = JSON.parse(savedUSP);
        setUspData(parsedUSP);
      } catch (error) {
        console.error('Erreur lors du parsing des données USP:', error);
      }
    }
  }, []);

  const handleGenerate = async () => {
    if (!formData.offreProduitService || !formData.objectifTunnel) {
      alert('Veuillez remplir au moins l\'offre et l\'objectif');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulation de génération IA
      setTimeout(() => {
        const etapesBasiques = ['Landing Page', 'Page de Capture', 'Page de Vente', 'Page de Commande', 'Page de Confirmation'];
        const etapesAvecUpsell = [...etapesBasiques.slice(0, -1), 'Upsell', 'Page de Confirmation'];
        const etapes = formData.inclureUpsell ? etapesAvecUpsell : etapesBasiques;

        const mockResult: TunnelAnalysis = {
          schemaTunnel: {
            etapes: etapes,
            description: `Tunnel ${formData.longueurTunnel.toLowerCase()} pour ${formData.objectifTunnel.toLowerCase()}`,
            dureeEstimee: formData.longueurTunnel.includes('Court') ? '2-3 jours' : formData.longueurTunnel.includes('Moyen') ? '1 semaine' : '2 semaines'
          },
          etapesDetaillees: etapes.map((etape, index) => ({
            nom: etape,
            objectif: index === 0 ? 'Attirer l\'attention' : index === etapes.length - 1 ? 'Confirmer l\'achat' : 'Convertir le prospect',
            messageCle: `Message clé pour ${etape.toLowerCase()} adapté à votre ${formData.tonaliteStyle.toLowerCase()}`,
            callToAction: index === 0 ? 'Découvrir maintenant' : index === etapes.length - 1 ? 'Merci pour votre achat' : 'Continuer',
            objectionALever: index === 0 ? 'Scepticisme initial' : index === etapes.length - 1 ? 'Aucune' : 'Prix, confiance, urgence',
            conseilsCopywriting: [`Conseil 1 pour ${etape}`, `Conseil 2 pour ${etape}`],
            automatisationSuggestions: [`Automatisation 1 pour ${etape}`, `Automatisation 2 pour ${etape}`]
          })),
          conseilsGeneraux: {
            copywriting: ['Utilisez la preuve sociale', 'Créez de l\'urgence', 'Adressez les objections'],
            automatisation: ['Configurez le pixel de tracking', 'Mettez en place les emails de suivi'],
            optimisation: ['Testez les headlines', 'Optimisez les CTA', 'Analysez les métriques']
          },
          sequenceEmail: {
            description: 'Séquence de suivi automatique',
            emails: [
              { jour: 1, sujet: 'Bienvenue dans votre parcours', objectif: 'Accueil', contenuCle: 'Présentation et première valeur' },
              { jour: 3, sujet: 'Votre transformation commence ici', objectif: 'Engagement', contenuCle: 'Cas d\'usage et témoignages' },
              { jour: 7, sujet: 'Dernière chance de profiter de l\'offre', objectif: 'Conversion', contenuCle: 'Urgence et call-to-action' }
            ]
          },
          metriques: {
            tauxConversionEstime: Math.floor(Math.random() * 15) + 5, // 5-20%
            complexite: formData.longueurTunnel.includes('Court') ? 3 : formData.longueurTunnel.includes('Moyen') ? 5 : 8,
            potentielROI: Math.floor(Math.random() * 300) + 200 // 200-500%
          },
          outilsRecommandes: ['ClickFunnels', 'Leadpages', 'Unbounce', 'Systeme.io']
        };
        
        setTunnelResult(mockResult);
        setIsLoading(false);
        
        // Sauvegarder le tunnel généré
        localStorage.setItem('dropskills_tunnel_data', JSON.stringify(mockResult));
        localStorage.setItem('dropskills_tunnel_form_data', JSON.stringify(formData));
      }, 3000);
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération du tunnel');
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof TunnelFormData, value: string | string[] | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCanalToggle = (canal: string) => {
    const newCanaux = formData.canauxEntree.includes(canal)
      ? formData.canauxEntree.filter(c => c !== canal)
      : [...formData.canauxEntree, canal];
    
    handleInputChange('canauxEntree', newCanaux);
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
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
            <FolderKanban className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Tunnel Maker IA</h1>
            <p className="text-gray-400">Créez des tunnels de vente optimisés</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-orange-400" />
              <div>
                <p className="text-white font-semibold">2,847</p>
                <p className="text-gray-400 text-sm">Tunnels générés</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-white font-semibold">+67%</p>
                <p className="text-gray-400 text-sm">Taux de conversion moyen</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-white font-semibold">1,234</p>
                <p className="text-gray-400 text-sm">Entrepreneurs actifs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Données détectées */}
        {(icpData || uspData) && (
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323] mb-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">Données détectées pour optimisation</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {icpData && (
                <div className="inline-flex items-center px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-sm border border-blue-500/20">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  ICP détecté
                </div>
              )}
              {uspData && (
                <div className="inline-flex items-center px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-sm border border-purple-500/20">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  USP détectée
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire */}
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-400" />
            Configuration du tunnel
          </h2>

          <div className="space-y-4">
            {/* Offre */}
            <div className="border border-[#232323] rounded-lg">
              <button
                onClick={() => toggleSection('offre')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition-colors"
              >
                <span className="text-white font-medium">Offre/Produit/Service *</span>
                {expandedSections.offre ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {expandedSections.offre && (
                <div className="p-4 pt-0">
                  <textarea
                    value={formData.offreProduitService}
                    onChange={(e) => handleInputChange('offreProduitService', e.target.value)}
                    placeholder="Décrivez votre offre, produit ou service..."
                    rows={3}
                    className="w-full p-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Objectif */}
            <div className="border border-[#232323] rounded-lg">
              <button
                onClick={() => toggleSection('objectif')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition-colors"
              >
                <span className="text-white font-medium">Objectif du tunnel *</span>
                {expandedSections.objectif ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {expandedSections.objectif && (
                <div className="p-4 pt-0">
                  <div className="grid grid-cols-1 gap-2">
                    {OBJECTIFS_OPTIONS.map((objectif) => (
                      <button
                        key={objectif}
                        onClick={() => handleInputChange('objectifTunnel', objectif)}
                        className={`p-3 rounded-lg border text-sm transition-colors text-left ${
                          formData.objectifTunnel === objectif
                            ? 'bg-[#00D2FF] border-[#00D2FF] text-black'
                            : 'bg-[#1a1a1a] border-[#333] text-white hover:border-[#00D2FF]'
                        }`}
                      >
                        {objectif}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Maturité audience */}
            <div className="border border-[#232323] rounded-lg">
              <button
                onClick={() => toggleSection('audience')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition-colors"
              >
                <span className="text-white font-medium">Maturité de l'audience</span>
                {expandedSections.audience ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {expandedSections.audience && (
                <div className="p-4 pt-0">
                  <div className="grid grid-cols-1 gap-2">
                    {MATURITE_OPTIONS.map((maturite) => (
                      <button
                        key={maturite}
                        onClick={() => handleInputChange('maturiteAudience', maturite)}
                        className={`p-3 rounded-lg border text-sm transition-colors text-left ${
                          formData.maturiteAudience === maturite
                            ? 'bg-[#00D2FF] border-[#00D2FF] text-black'
                            : 'bg-[#1a1a1a] border-[#333] text-white hover:border-[#00D2FF]'
                        }`}
                      >
                        {maturite}
                      </button>
                    ))}
                  </div>
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
                    placeholder="Ex: 50-200€, 500-2000€..."
                    className="w-full p-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Canaux d'entrée */}
            <div className="border border-[#232323] rounded-lg">
              <button
                onClick={() => toggleSection('canaux')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition-colors"
              >
                <span className="text-white font-medium">Canaux d'entrée</span>
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
                          formData.canauxEntree.includes(canal)
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

            {/* Longueur tunnel */}
            <div className="border border-[#232323] rounded-lg">
              <button
                onClick={() => toggleSection('longueur')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition-colors"
              >
                <span className="text-white font-medium">Longueur du tunnel</span>
                {expandedSections.longueur ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {expandedSections.longueur && (
                <div className="p-4 pt-0">
                  <div className="grid grid-cols-1 gap-2">
                    {LONGUEUR_OPTIONS.map((longueur) => (
                      <button
                        key={longueur}
                        onClick={() => handleInputChange('longueurTunnel', longueur)}
                        className={`p-3 rounded-lg border text-sm transition-colors text-left ${
                          formData.longueurTunnel === longueur
                            ? 'bg-[#00D2FF] border-[#00D2FF] text-black'
                            : 'bg-[#1a1a1a] border-[#333] text-white hover:border-[#00D2FF]'
                        }`}
                      >
                        {longueur}
                      </button>
                    ))}
                  </div>
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
                        onClick={() => handleInputChange('tonaliteStyle', tonalite)}
                        className={`p-3 rounded-lg border text-sm transition-colors text-left ${
                          formData.tonaliteStyle === tonalite
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

            {/* Upsell */}
            <div className="border border-[#232323] rounded-lg">
              <button
                onClick={() => toggleSection('upsell')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition-colors"
              >
                <span className="text-white font-medium">Inclure un upsell</span>
                {expandedSections.upsell ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {expandedSections.upsell && (
                <div className="p-4 pt-0">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.inclureUpsell}
                      onChange={(e) => handleInputChange('inclureUpsell', e.target.checked)}
                      className="w-4 h-4 text-[#00D2FF] bg-[#1a1a1a] border-[#333] rounded focus:ring-[#00D2FF] focus:ring-2"
                    />
                    <span className="text-white">Ajouter une page d'upsell pour augmenter la valeur panier</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !formData.offreProduitService || !formData.objectifTunnel}
            className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Générer mon tunnel
              </>
            )}
          </button>
        </div>

        {/* Résultats */}
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-orange-400" />
            Votre Tunnel de Vente
          </h2>

          {!tunnelResult ? (
            <div className="text-center py-12">
              <FolderKanban className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">Prêt à créer votre tunnel de vente ?</p>
              <p className="text-gray-500 text-sm">Remplissez le formulaire et cliquez sur "Générer mon tunnel"</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Schéma du tunnel */}
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-400" />
                  Schéma du tunnel
                </h3>
                <div className="space-y-2 text-sm mb-4">
                  <p className="text-gray-300"><span className="text-orange-400">Description:</span> {tunnelResult.schemaTunnel.description}</p>
                  <p className="text-gray-300"><span className="text-orange-400">Durée estimée:</span> {tunnelResult.schemaTunnel.dureeEstimee}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {tunnelResult.schemaTunnel.etapes.map((etape, index) => (
                    <div key={index} className="flex items-center">
                      <div className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-lg text-xs font-medium border border-orange-500/30">
                        {etape}
                      </div>
                      {index < tunnelResult.schemaTunnel.etapes.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-gray-500 mx-1" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Métriques */}
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-green-400" />
                  Métriques estimées
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-green-400 font-medium">Conversion</p>
                    <p className="text-white text-lg">{tunnelResult.metriques.tauxConversionEstime}%</p>
                  </div>
                  <div>
                    <p className="text-blue-400 font-medium">Complexité</p>
                    <p className="text-white text-lg">{tunnelResult.metriques.complexite}/10</p>
                  </div>
                  <div>
                    <p className="text-purple-400 font-medium">ROI potentiel</p>
                    <p className="text-white text-lg">{tunnelResult.metriques.potentielROI}%</p>
                  </div>
                </div>
              </div>

              {/* Étapes détaillées */}
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  Étapes détaillées
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {tunnelResult.etapesDetaillees.map((etape, index) => (
                    <div key={index} className="bg-[#111111] p-3 rounded border border-[#333]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-400 font-medium text-sm">{etape.nom}</span>
                        <button
                          onClick={() => copyToClipboard(etape.messageCle)}
                          className="text-gray-500 hover:text-[#00D2FF] transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-white text-sm font-medium mb-1">{etape.objectif}</p>
                      <p className="text-gray-400 text-xs">{etape.callToAction}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outils recommandés */}
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Outils recommandés
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tunnelResult.outilsRecommandes.map((outil, index) => (
                    <span key={index} className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs border border-green-500/30">
                      {outil}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(JSON.stringify(tunnelResult, null, 2))}
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
      <div className="mt-8 bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-6">
        <h3 className="text-cyan-400 font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          💡 Conseils pour des tunnels efficaces
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-cyan-300 text-sm">
          <div>
            <h4 className="font-medium mb-3 text-cyan-200">✨ Optimisation du parcours</h4>
            <ul className="space-y-2 text-cyan-300">
              <li>• <strong>Simplicité avant tout :</strong> Réduisez les étapes au minimum</li>
              <li>• <strong>Cohérence visuelle :</strong> Gardez le même design sur toutes les pages</li>
              <li>• <strong>Chargement rapide :</strong> Optimisez la vitesse de vos pages</li>
              <li>• <strong>Mobile responsive :</strong> 60% du trafic vient du mobile</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3 text-cyan-200">🎯 Conversion maximale</h4>
            <ul className="space-y-2 text-cyan-300">
              <li>• <strong>Urgence et rareté :</strong> Créez un sentiment d'urgence authentique</li>
              <li>• <strong>Preuves sociales :</strong> Avis, témoignages et compteurs</li>
              <li>• <strong>Garanties fortes :</strong> Réduisez le risque perçu</li>
              <li>• <strong>Analytics précis :</strong> Mesurez chaque étape du tunnel</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TunnelMakerPage() {
  return (
    <ToolLayout toolId="tunnel-maker">
      <PremiumGuard feature="Tunnel Maker IA">
        <TunnelMakerContent />
      </PremiumGuard>
    </ToolLayout>
  );
} 