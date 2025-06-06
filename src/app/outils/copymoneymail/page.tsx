'use client';

import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import PremiumGuard from '@/components/auth/PremiumGuard';
import { 
  Mail, 
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
  Send
} from 'lucide-react';

export interface EmailFormData {
  objectifSequence: string;
  offreProduitService: string;
  icpCible: string;
  painPoints: string;
  nombreEmails: number;
  tonaliteStyle: string;
  bonusContent: string;
  callToAction: string;
}

export interface EmailContent {
  numeroEmail: number;
  sujet: string;
  varianteSujet: string;
  corpsMessage: string;
  momentEnvoi: string;
  conseilsEnvoi: string;
  objectifEmail: string;
  metriquesEstimees: {
    tauxOuverture: number;
    tauxClic: number;
    tauxConversion: number;
  };
}

export interface EmailSequenceAnalysis {
  sequenceInfo: {
    titre: string;
    description: string;
    dureeTotal: string;
    objectifGlobal: string;
  };
  emails: EmailContent[];
  conseilsGeneraux: {
    segmentation: string[];
    automatisation: string[];
    optimisation: string[];
    delivrabilite: string[];
  };
  metriquesGlobales: {
    tauxOuvertureEstime: number;
    tauxClicEstime: number;
    tauxConversionEstime: number;
    revenusEstimes: string;
  };
  outilsRecommandes: string[];
  prochainEtapes: string[];
}

const OBJECTIFS_OPTIONS = [
  'Vendre un produit/service',
  'Générer des leads qualifiés',
  'Nurturing et fidélisation',
  'Lancement de produit',
  'Réactivation clients',
  'Formation/éducation'
];

const TONALITES_OPTIONS = [
  'Professionnel et expert',
  'Amical et accessible', 
  'Urgent et persuasif',
  'Éducatif et pédagogue',
  'Luxe et premium',
  'Décontracté et fun'
];

const NOMBRE_EMAILS_OPTIONS = [3, 5, 7, 10];

function CopyMoneyMailContent() {
  const [formData, setFormData] = useState<EmailFormData>({
    objectifSequence: '',
    offreProduitService: '',
    icpCible: '',
    painPoints: '',
    nombreEmails: 5,
    tonaliteStyle: '',
    bonusContent: '',
    callToAction: ''
  });

  const [emailResult, setEmailResult] = useState<EmailSequenceAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [icpData, setIcpData] = useState<any>(null);
  const [uspData, setUspData] = useState<any>(null);
  const [tunnelData, setTunnelData] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState({
    objectif: true,
    offre: false,
    audience: false,
    pain: false,
    sequence: false,
    tonalite: false,
    bonus: false,
    cta: false
  });

  // Récupération des données ICP, USP et Tunnel si disponibles
  useEffect(() => {
    const savedICP = localStorage.getItem('dropskills_icp_data');
    const savedUSP = localStorage.getItem('dropskills_usp_data');
    const savedTunnel = localStorage.getItem('dropskills_tunnel_data');
    
    if (savedICP) {
      try {
        const parsedICP = JSON.parse(savedICP);
        setIcpData(parsedICP);
        // Pré-remplir avec les données ICP
        setFormData(prev => ({
          ...prev,
          icpCible: `${parsedICP.profilSociodemographique?.age || ''} ${parsedICP.profilSociodemographique?.situationPro || ''}`.trim()
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
    
    if (savedTunnel) {
      try {
        const parsedTunnel = JSON.parse(savedTunnel);
        setTunnelData(parsedTunnel);
      } catch (error) {
        console.error('Erreur lors du parsing des données Tunnel:', error);
      }
    }
  }, []);

  const handleGenerate = async () => {
    if (!formData.objectifSequence || !formData.offreProduitService) {
      alert('Veuillez remplir au moins l\'objectif et l\'offre');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulation de génération IA
      setTimeout(() => {
        const mockResult: EmailSequenceAnalysis = {
          sequenceInfo: {
            titre: `Séquence ${formData.objectifSequence}`,
            description: `Séquence de ${formData.nombreEmails} emails pour ${formData.offreProduitService}`,
            dureeTotal: `${formData.nombreEmails * 2} jours`,
            objectifGlobal: formData.objectifSequence
          },
          emails: Array.from({ length: formData.nombreEmails }, (_, i) => ({
            numeroEmail: i + 1,
            sujet: `Email ${i + 1}: ${i === 0 ? 'Bienvenue' : i === formData.nombreEmails - 1 ? 'Dernière chance' : `Valeur ${i}`}`,
            varianteSujet: `[URGENT] ${i === 0 ? 'Votre accès est prêt' : i === formData.nombreEmails - 1 ? 'Offre expire dans 24h' : `Secret ${i} révélé`}`,
            corpsMessage: `Contenu de l'email ${i + 1} adapté à votre ${formData.tonaliteStyle.toLowerCase()} pour ${formData.offreProduitService}...`,
            momentEnvoi: `Jour ${(i * 2) + 1} - ${i === 0 ? '9h00' : i % 2 === 0 ? '14h00' : '10h00'}`,
            conseilsEnvoi: `Optimisé pour ${i === 0 ? 'l\'accueil' : i === formData.nombreEmails - 1 ? 'la conversion finale' : 'l\'engagement'}`,
            objectifEmail: i === 0 ? 'Accueil et première valeur' : i === formData.nombreEmails - 1 ? 'Conversion finale' : 'Nurturing et valeur',
            metriquesEstimees: {
              tauxOuverture: Math.max(20, 45 - (i * 3)),
              tauxClic: Math.max(3, 12 - (i * 1.5)),
              tauxConversion: i === formData.nombreEmails - 1 ? 8 : Math.max(1, 3 - (i * 0.5))
            }
          })),
          conseilsGeneraux: {
            segmentation: ['Segmentez par engagement', 'Adaptez selon le comportement'],
            automatisation: ['Configurez les délais', 'Testez les horaires d\'envoi'],
            optimisation: ['A/B testez les objets', 'Mesurez les performances'],
            delivrabilite: ['Réchauffez votre domaine', 'Nettoyez votre liste']
          },
          metriquesGlobales: {
            tauxOuvertureEstime: 35,
            tauxClicEstime: 8,
            tauxConversionEstime: 12,
            revenusEstimes: '2,500€'
          },
          outilsRecommandes: ['Mailchimp', 'ConvertKit', 'ActiveCampaign'],
          prochainEtapes: ['Configurer l\'automatisation', 'Tester la séquence', 'Analyser les résultats']
        };
        
        setEmailResult(mockResult);
        setIsLoading(false);
        
        // Sauvegarder la séquence générée
        localStorage.setItem('dropskills_email_sequence_data', JSON.stringify(mockResult));
        localStorage.setItem('dropskills_email_form_data', JSON.stringify(formData));
      }, 3000);
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération de la séquence');
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof EmailFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
          <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">CopyMoneyMail</h1>
            <p className="text-gray-400">Créez des séquences email qui convertissent</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-pink-400" />
              <div>
                <p className="text-white font-semibold">3,247</p>
                <p className="text-gray-400 text-sm">Séquences générées</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-white font-semibold">+42%</p>
                <p className="text-gray-400 text-sm">Taux d'ouverture moyen</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-white font-semibold">1,456</p>
                <p className="text-gray-400 text-sm">Marketeurs actifs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Données détectées */}
        {(icpData || uspData || tunnelData) && (
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
              {tunnelData && (
                <div className="inline-flex items-center px-3 py-1 bg-orange-500/10 text-orange-400 rounded-lg text-sm border border-orange-500/20">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                  Tunnel détecté
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Conseils */}
      <div className="mb-8 bg-pink-900/20 border border-pink-500/30 rounded-xl p-6">
        <h3 className="text-pink-400 font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          💡 Conseils pour des emails efficaces
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-pink-300 text-sm">
          <div>
            <h4 className="font-medium mb-3 text-pink-200">✨ Optimisation des campagnes</h4>
            <ul className="space-y-2 text-pink-300">
              <li>• <strong>Segmentez votre liste :</strong> Adaptez le message selon le profil</li>
              <li>• <strong>Objets accrocheurs :</strong> 30-50 caractères, évitez le spam</li>
              <li>• <strong>Personnalisation :</strong> Utilisez le prénom et les données client</li>
              <li>• <strong>Mobile-first :</strong> 70% des emails sont lus sur mobile</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3 text-pink-200">🎯 Conversion et engagement</h4>
            <ul className="space-y-2 text-pink-300">
              <li>• <strong>Un seul CTA :</strong> Concentrez l'attention sur une action</li>
              <li>• <strong>Storytelling :</strong> Racontez une histoire qui résonne</li>
              <li>• <strong>Preuve sociale :</strong> Témoignages et résultats clients</li>
              <li>• <strong>Testez et mesurez :</strong> A/B testez objets, contenus et CTA</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire */}
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-pink-400" />
            Configuration de la séquence
          </h2>

          <div className="space-y-4">
            {/* Objectif */}
            <div className="border border-[#232323] rounded-lg">
              <button
                onClick={() => toggleSection('objectif')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition-colors"
              >
                <span className="text-white font-medium">Objectif de la séquence *</span>
                {expandedSections.objectif ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {expandedSections.objectif && (
                <div className="p-4 pt-0">
                  <div className="grid grid-cols-1 gap-2">
                    {OBJECTIFS_OPTIONS.map((objectif) => (
                      <button
                        key={objectif}
                        onClick={() => handleInputChange('objectifSequence', objectif)}
                        className={`p-3 rounded-lg border text-sm transition-colors text-left ${
                          formData.objectifSequence === objectif
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

            {/* Audience */}
            <div className="border border-[#232323] rounded-lg">
              <button
                onClick={() => toggleSection('audience')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition-colors"
              >
                <span className="text-white font-medium">Audience cible</span>
                {expandedSections.audience ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {expandedSections.audience && (
                <div className="p-4 pt-0">
                  <input
                    type="text"
                    value={formData.icpCible}
                    onChange={(e) => handleInputChange('icpCible', e.target.value)}
                    placeholder="Ex: Entrepreneurs débutants, E-commerçants..."
                    className="w-full p-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Pain Points */}
            <div className="border border-[#232323] rounded-lg">
              <button
                onClick={() => toggleSection('pain')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition-colors"
              >
                <span className="text-white font-medium">Problèmes/Pain Points</span>
                {expandedSections.pain ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {expandedSections.pain && (
                <div className="p-4 pt-0">
                  <textarea
                    value={formData.painPoints}
                    onChange={(e) => handleInputChange('painPoints', e.target.value)}
                    placeholder="Quels problèmes votre audience rencontre-t-elle ?"
                    rows={2}
                    className="w-full p-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Nombre d'emails */}
            <div className="border border-[#232323] rounded-lg">
              <button
                onClick={() => toggleSection('sequence')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition-colors"
              >
                <span className="text-white font-medium">Nombre d'emails</span>
                {expandedSections.sequence ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {expandedSections.sequence && (
                <div className="p-4 pt-0">
                  <div className="grid grid-cols-4 gap-2">
                    {NOMBRE_EMAILS_OPTIONS.map((nombre) => (
                      <button
                        key={nombre}
                        onClick={() => handleInputChange('nombreEmails', nombre)}
                        className={`p-3 rounded-lg border text-sm transition-colors ${
                          formData.nombreEmails === nombre
                            ? 'bg-[#00D2FF] border-[#00D2FF] text-black'
                            : 'bg-[#1a1a1a] border-[#333] text-white hover:border-[#00D2FF]'
                        }`}
                      >
                        {nombre}
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
                <span className="text-white font-medium">Tonalité et style</span>
                {expandedSections.tonalite ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {expandedSections.tonalite && (
                <div className="p-4 pt-0">
                  <div className="grid grid-cols-1 gap-2">
                    {TONALITES_OPTIONS.map((tonalite) => (
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

            {/* Call to Action */}
            <div className="border border-[#232323] rounded-lg">
              <button
                onClick={() => toggleSection('cta')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition-colors"
              >
                <span className="text-white font-medium">Call-to-Action principal</span>
                {expandedSections.cta ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {expandedSections.cta && (
                <div className="p-4 pt-0">
                  <input
                    type="text"
                    value={formData.callToAction}
                    onChange={(e) => handleInputChange('callToAction', e.target.value)}
                    placeholder="Ex: Acheter maintenant, S'inscrire, Télécharger..."
                    className="w-full p-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !formData.objectifSequence || !formData.offreProduitService}
            className="w-full mt-6 bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Générer ma séquence
              </>
            )}
          </button>
        </div>

        {/* Résultats */}
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Send className="w-5 h-5 text-pink-400" />
            Votre Séquence Email
          </h2>

          {!emailResult ? (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">Prêt à créer votre séquence email ?</p>
              <p className="text-gray-500 text-sm">Remplissez le formulaire et cliquez sur "Générer ma séquence"</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Info séquence */}
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-pink-400" />
                  Informations générales
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300"><span className="text-pink-400">Titre:</span> {emailResult.sequenceInfo.titre}</p>
                  <p className="text-gray-300"><span className="text-pink-400">Durée:</span> {emailResult.sequenceInfo.dureeTotal}</p>
                  <p className="text-gray-300"><span className="text-pink-400">Objectif:</span> {emailResult.sequenceInfo.objectifGlobal}</p>
                </div>
              </div>

              {/* Métriques globales */}
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  Métriques estimées
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-green-400 font-medium">Taux d'ouverture</p>
                    <p className="text-white text-lg">{emailResult.metriquesGlobales.tauxOuvertureEstime}%</p>
                  </div>
                  <div>
                    <p className="text-blue-400 font-medium">Taux de clic</p>
                    <p className="text-white text-lg">{emailResult.metriquesGlobales.tauxClicEstime}%</p>
                  </div>
                  <div>
                    <p className="text-purple-400 font-medium">Conversion</p>
                    <p className="text-white text-lg">{emailResult.metriquesGlobales.tauxConversionEstime}%</p>
                  </div>
                  <div>
                    <p className="text-yellow-400 font-medium">Revenus estimés</p>
                    <p className="text-white text-lg">{emailResult.metriquesGlobales.revenusEstimes}</p>
                  </div>
                </div>
              </div>

              {/* Emails */}
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  Emails de la séquence
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {emailResult.emails.map((email, index) => (
                    <div key={index} className="bg-[#111111] p-3 rounded border border-[#333]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-400 font-medium text-sm">Email {email.numeroEmail}</span>
                        <button
                          onClick={() => copyToClipboard(email.sujet)}
                          className="text-gray-500 hover:text-[#00D2FF] transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-white text-sm font-medium mb-1">{email.sujet}</p>
                      <p className="text-gray-400 text-xs">{email.momentEnvoi} • {email.objectifEmail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(JSON.stringify(emailResult, null, 2))}
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


    </div>
  );
}

export default function CopyMoneyMailPage() {
  return (
    <ToolLayout toolId="copymoneymail">
      <PremiumGuard feature="Copy Money Mail IA">
        <CopyMoneyMailContent />
      </PremiumGuard>
    </ToolLayout>
  );
}