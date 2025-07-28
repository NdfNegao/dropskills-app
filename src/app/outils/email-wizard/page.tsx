'use client';

import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import PremiumGuard from '@/components/auth/PremiumGuard';
import StepWizard, { WizardStep } from '@/components/StepWizard';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Target, 
  Users, 
  Zap, 
  Copy, 
  RefreshCw, 
  Settings,
  MessageSquare,
  Palette,
  Sparkles,
  TrendingUp,
  Clock,
  DollarSign,
  Eye,
  MousePointer,
  HelpCircle,
  CheckCircle,
  Send
} from 'lucide-react';

export interface EmailFormData {
  objectif: string;
  produitService: string;
  audience: string;
  problemes: string;
  nombreEmails: string;
  tonalite: string;
  cta: string;
}

export interface EmailContent {
  sujet: string;
  contenu: string;
  cta: string;
  conseils: string[];
}

export interface EmailSequenceAnalysis {
  informationsGenerales: {
    objectifPrincipal: string;
    dureeSequence: string;
    frequenceEnvoi: string;
    tonaliteGlobale: string;
  };
  metriquesEstimees: {
    tauxOuverture: string;
    tauxClic: string;
    tauxConversion: string;
    roiEstime: string;
  };
  emails: EmailContent[];
}

const OBJECTIFS_OPTIONS = [
  'Vendre un produit/service',
  'Générer des leads qualifiés',
  'Nurturing et fidélisation',
  'Lancement de produit',
  'Réactivation clients inactifs',
  'Formation et éducation',
  'Promotion événement/webinar'
];

const TONALITES_OPTIONS = [
  'Professionnel et expert',
  'Amical et décontracté',
  'Urgent et persuasif',
  'Éducatif et informatif',
  'Inspirant et motivant',
  'Exclusif et premium',
  'Storytelling et émotionnel'
];

const NOMBRE_EMAILS_OPTIONS = [
  '3 emails',
  '5 emails',
  '7 emails',
  '10 emails'
];

// Interface pour les props des étapes
interface StepProps {
  data: EmailFormData;
  onChange: (updates: Partial<EmailFormData>) => void;
  errors: Record<string, string>;
}

// Composants d'étapes
function ConfigurationStep({ data, onChange, errors }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <Target className="w-4 h-4" />
          Objectif de la séquence
          <div className="group relative">
            <div className="w-4 h-4 text-gray-500 cursor-help rounded-full border border-gray-500 flex items-center justify-center text-xs">?</div>
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
              Quel est le but principal de cette séquence email ?
            </div>
          </div>
        </label>
        <div className="grid grid-cols-1 gap-3">
          {OBJECTIFS_OPTIONS.map((objectif) => (
            <button
              key={objectif}
              onClick={() => onChange({ objectif: objectif })}
              className={`p-4 rounded-lg border text-left transition-colors ${
                data.objectif === objectif
                  ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                  : 'bg-[#1a1a1a] border-[#333] text-white hover:border-blue-500/50'
              }`}
            >
              {objectif}
            </button>
          ))}
        </div>
        {errors.objectif && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.objectif}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <Zap className="w-4 h-4" />
          Produit/Service/Offre
          <div className="group relative">
            <div className="w-4 h-4 text-gray-500 cursor-help rounded-full border border-gray-500 flex items-center justify-center text-xs">?</div>
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
              Décrivez précisément ce que vous vendez
            </div>
          </div>
        </label>
        <textarea
          value={data.produitService || ''}
          onChange={(e) => onChange({ produitService: e.target.value })}
          placeholder="Ex: Formation en ligne sur le dropshipping, coaching 1-to-1 en marketing digital, logiciel SaaS de gestion..."
          rows={4}
          className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
            errors.produitService ? 'border-red-500' : 'border-[#232323] hover:border-[#333333]'
          }`}
        />
        {errors.produitService && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.produitService}
          </p>
        )}
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
          <div>
            <h4 className="text-blue-400 font-medium mb-1">Conseil Dropskills AI</h4>
            <p className="text-blue-300 text-sm leading-relaxed">
              Plus vous êtes précis sur votre objectif et votre offre, plus la séquence email sera personnalisée et efficace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AudienceStep({ data, onChange, errors }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <Users className="w-4 h-4" />
          Audience cible
          <div className="group relative">
            <div className="w-4 h-4 text-gray-500 cursor-help rounded-full border border-gray-500 flex items-center justify-center text-xs">?</div>
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
              Qui sont vos prospects ? Âge, profession, situation...
            </div>
          </div>
        </label>
        <textarea
          value={data.audience || ''}
          onChange={(e) => onChange({ audience: e.target.value })}
          placeholder="Ex: Entrepreneurs débutants 25-40 ans, salariés cherchant revenus complémentaires, e-commerçants expérimentés..."
          rows={4}
          className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
            errors.audience ? 'border-red-500' : 'border-[#232323] hover:border-[#333333]'
          }`}
        />
        {errors.audience && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.audience}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <Target className="w-4 h-4" />
          Problèmes/Pain Points
          <div className="group relative">
            <div className="w-4 h-4 text-gray-500 cursor-help rounded-full border border-gray-500 flex items-center justify-center text-xs">?</div>
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
              Quels problèmes votre audience rencontre-t-elle ?
            </div>
          </div>
        </label>
        <textarea
          value={data.problemes || ''}
          onChange={(e) => onChange({ problemes: e.target.value })}
          placeholder="Ex: Manque de temps, difficulté à générer du trafic, problèmes de conversion, budget limité..."
          rows={4}
          className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
            errors.problemes ? 'border-red-500' : 'border-[#232323] hover:border-[#333333]'
          }`}
        />
        {errors.problemes && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.problemes}
          </p>
        )}
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
          <div>
            <h4 className="text-blue-400 font-medium mb-1">Conseil Dropskills AI</h4>
            <p className="text-blue-300 text-sm leading-relaxed">
              Identifiez précisément les douleurs de votre audience pour créer des emails qui résonnent émotionnellement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContenuStep({ data, onChange, errors }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <Mail className="w-4 h-4" />
          Nombre d'emails
          <div className="group relative">
            <div className="w-4 h-4 text-gray-500 cursor-help rounded-full border border-gray-500 flex items-center justify-center text-xs">?</div>
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
              Combien d'emails voulez-vous dans votre séquence ?
            </div>
          </div>
        </label>
        <select
          value={data.nombreEmails || ''}
          onChange={(e) => onChange({ nombreEmails: e.target.value })}
          className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            errors.nombreEmails ? 'border-red-500' : 'border-[#232323] hover:border-[#333333]'
          }`}
        >
          <option value="">Sélectionnez le nombre d'emails</option>
          {NOMBRE_EMAILS_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.nombreEmails && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.nombreEmails}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <MousePointer className="w-4 h-4" />
          Call-to-Action principal
          <div className="group relative">
            <div className="w-4 h-4 text-gray-500 cursor-help rounded-full border border-gray-500 flex items-center justify-center text-xs">?</div>
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
              Quelle action voulez-vous que vos prospects effectuent ?
            </div>
          </div>
        </label>
        <textarea
          value={data.cta || ''}
          onChange={(e) => onChange({ cta: e.target.value })}
          placeholder="Ex: Acheter la formation, réserver un appel découverte, s'inscrire au webinar, télécharger le guide..."
          rows={3}
          className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
            errors.cta ? 'border-red-500' : 'border-[#232323] hover:border-[#333333]'
          }`}
        />
        {errors.cta && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.cta}
          </p>
        )}
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
          <div>
            <h4 className="text-blue-400 font-medium mb-1">Conseil Dropskills AI</h4>
            <p className="text-blue-300 text-sm leading-relaxed">
              Un CTA clair et spécifique augmente significativement vos taux de conversion. Évitez les formulations vagues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StyleStep({ data, onChange, errors }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <Palette className="w-4 h-4" />
          Tonalité et style
          <div className="group relative">
            <div className="w-4 h-4 text-gray-500 cursor-help rounded-full border border-gray-500 flex items-center justify-center text-xs">?</div>
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
              Quel ton voulez-vous adopter dans vos emails ?
            </div>
          </div>
        </label>
        <select
          value={data.tonalite || ''}
          onChange={(e) => onChange({ tonalite: e.target.value })}
          className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            errors.tonalite ? 'border-red-500' : 'border-[#232323] hover:border-[#333333]'
          }`}
        >
          <option value="">Sélectionnez une tonalité</option>
          {TONALITES_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.tonalite && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.tonalite}
          </p>
        )}
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
          <div>
            <h4 className="text-blue-400 font-medium mb-1">Conseil Dropskills AI</h4>
            <p className="text-blue-300 text-sm leading-relaxed">
              La tonalité doit correspondre à votre marque et à votre audience. Un ton cohérent renforce la confiance.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-green-400 font-medium mb-2">Prêt pour la génération !</h4>
            <p className="text-green-300 text-sm leading-relaxed mb-3">
              Dropskills AI va maintenant créer votre séquence email personnalisée en analysant :
            </p>
            <ul className="text-green-300 text-sm space-y-1">
              <li>• Votre objectif et votre offre</li>
              <li>• Le profil de votre audience</li>
              <li>• Les problèmes identifiés</li>
              <li>• La tonalité choisie</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function CopyMoneyMailContent() {
  const [emailSequence, setEmailSequence] = useState<EmailSequenceAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showWizard, setShowWizard] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFormData, setLastFormData] = useState<EmailFormData | null>(null);

  // Charger les données sauvegardées au démarrage
  useEffect(() => {
    const savedResult = localStorage.getItem('dropskills_copymoneymail_data');
    const savedFormData = localStorage.getItem('dropskills_copymoneymail_form_data');
    
    if (savedResult && savedFormData) {
      try {
        setEmailSequence(JSON.parse(savedResult));
        setLastFormData(JSON.parse(savedFormData));
        setShowWizard(false);
      } catch (e) {
        console.log('Erreur lors du chargement des données sauvegardées');
      }
    }
  }, []);

  const generateEmailSequence = async (formData: EmailFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai/copymoneymail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          objectif: formData.objectif,
          produitService: formData.produitService,
          audience: formData.audience,
          problemes: formData.problemes,
          nombreEmails: formData.nombreEmails,
          tonalite: formData.tonalite,
          cta: formData.cta
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération');
      }

      const result = await response.json();
      setEmailSequence(result);
      setLastFormData(formData);
      setShowWizard(false);
      
      // Sauvegarder les données
      localStorage.setItem('dropskills_copymoneymail_data', JSON.stringify(result));
      localStorage.setItem('dropskills_copymoneymail_form_data', JSON.stringify(formData));
      
    } catch (error) {
      console.error('Erreur:', error);
      setError('Une erreur est survenue lors de la génération. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateSequence = () => {
    if (lastFormData) {
      generateEmailSequence(lastFormData);
    }
  };

  const resetForm = () => {
    setEmailSequence(null);
    setLastFormData(null);
    setShowWizard(true);
    setError(null);
    localStorage.removeItem('dropskills_copymoneymail_data');
    localStorage.removeItem('dropskills_copymoneymail_form_data');
  };

  // Composant pour l'étape de résultats
  const ResultStep = ({ data, onUpdate }: { data: any; onUpdate: (field: string, value: any) => void }) => {
    if (!emailSequence) {
      return (
        <div className="text-center py-12">
          <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">Génération en cours...</p>
          <p className="text-gray-500 text-sm">Votre séquence email sera affichée ici</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Informations générales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#232323]">
            <h3 className="font-medium text-gray-300 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Informations générales
            </h3>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-400">Objectif:</span> <span className="text-white">{emailSequence.informationsGenerales.objectifPrincipal}</span></div>
              <div><span className="text-gray-400">Durée:</span> <span className="text-white">{emailSequence.informationsGenerales.dureeSequence}</span></div>
              <div><span className="text-gray-400">Fréquence:</span> <span className="text-white">{emailSequence.informationsGenerales.frequenceEnvoi}</span></div>
            </div>
          </div>
          
          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#232323]">
            <h3 className="font-medium text-gray-300 mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Métriques estimées
            </h3>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-400">Taux d'ouverture:</span> <span className="text-green-400">{emailSequence.metriquesEstimees.tauxOuverture}</span></div>
              <div><span className="text-gray-400">Taux de clic:</span> <span className="text-blue-400">{emailSequence.metriquesEstimees.tauxClic}</span></div>
              <div><span className="text-gray-400">Conversion:</span> <span className="text-yellow-400">{emailSequence.metriquesEstimees.tauxConversion}</span></div>
            </div>
          </div>
        </div>

        {/* Conseil Dropskills AI */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
          <h4 className="font-medium text-blue-400 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            💡 Conseil Dropskills AI
          </h4>
          <p className="text-blue-300 text-sm leading-relaxed">
            Votre séquence a été optimisée selon les meilleures pratiques. Pour maximiser vos résultats, 
            testez différents horaires d'envoi et personnalisez les emails selon les segments de votre audience.
          </p>
        </div>

        {/* Liste des emails */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Emails de la séquence ({emailSequence.emails.length})
          </h3>
          {emailSequence.emails.map((email, index) => (
            <div key={index} className="bg-[#1a1a1a] rounded-lg border border-[#232323] p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-white flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  Email {index + 1}
                </h4>
                <button
                  onClick={() => copyToClipboard(`${email.sujet}\n\n${email.contenu}`)}
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                  title="Copier l'email complet"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-300 mb-1 block">Sujet</span>
                  <div className="p-3 bg-[#0f0f0f] rounded border border-[#232323] text-white">
                    {email.sujet}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-300 mb-1 block">Contenu</span>
                  <div className="p-3 bg-[#0f0f0f] rounded border border-[#232323] text-white whitespace-pre-wrap text-sm leading-relaxed max-h-40 overflow-y-auto">
                    {email.contenu}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-300 mb-1 block">Call-to-Action</span>
                  <div className="p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded text-blue-300 text-sm">
                    {email.cta}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const steps: WizardStep[] = [
    {
      id: 'configuration',
      title: 'Configuration',
      description: 'Définissez l\'objectif et votre offre',
      icon: Settings,
      component: ConfigurationStep,
      validation: (data: EmailFormData) => {
        const errors: Record<string, string> = {};
        
        if (!data.objectif?.trim()) {
          errors.objectif = 'L\'objectif est requis';
        }
        
        if (!data.produitService?.trim()) {
          errors.produitService = 'La description du produit/service est requise';
        } else if (data.produitService.trim().length < 20) {
          errors.produitService = 'Veuillez fournir une description plus détaillée (minimum 20 caractères)';
        }
        
        return {
          isValid: Object.keys(errors).length === 0,
          errors
        };
      }
    },
    {
      id: 'audience',
      title: 'Audience',
      description: 'Définissez votre audience et ses problèmes',
      icon: Users,
      component: AudienceStep,
      validation: (data: EmailFormData) => {
        const errors: Record<string, string> = {};
        
        if (!data.audience?.trim()) {
          errors.audience = 'L\'audience cible est requise';
        } else if (data.audience.trim().length < 15) {
          errors.audience = 'Veuillez détailler davantage votre audience (minimum 15 caractères)';
        }
        
        if (!data.problemes?.trim()) {
          errors.problemes = 'Les problèmes/pain points sont requis';
        } else if (data.problemes.trim().length < 15) {
          errors.problemes = 'Veuillez détailler davantage les problèmes (minimum 15 caractères)';
        }
        
        return {
          isValid: Object.keys(errors).length === 0,
          errors
        };
      }
    },
    {
      id: 'contenu',
      title: 'Contenu',
      description: 'Configurez le nombre d\'emails et le CTA',
      icon: MessageSquare,
      component: ContenuStep,
      validation: (data: EmailFormData) => {
        const errors: Record<string, string> = {};
        
        if (!data.nombreEmails?.trim()) {
          errors.nombreEmails = 'Le nombre d\'emails est requis';
        }
        
        if (!data.cta?.trim()) {
          errors.cta = 'Le call-to-action est requis';
        } else if (data.cta.trim().length < 10) {
          errors.cta = 'Veuillez détailler davantage votre CTA (minimum 10 caractères)';
        }
        
        return {
          isValid: Object.keys(errors).length === 0,
          errors
        };
      }
    },
    {
      id: 'style',
      title: 'Style',
      description: 'Choisissez la tonalité de vos emails',
      icon: Palette,
      component: StyleStep,
      validation: (data: EmailFormData) => {
        const errors: Record<string, string> = {};
        
        if (!data.tonalite?.trim()) {
          errors.tonalite = 'La tonalité est requise';
        }
        
        return {
          isValid: Object.keys(errors).length === 0,
          errors
        };
      }
    }
  ];

  if (showWizard) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <StepWizard
            steps={steps}
            onComplete={generateEmailSequence}
            isLoading={isLoading}
            title="CopyMoneyMail"
            description="Générez des séquences email qui convertissent avec l'IA"
            initialData={lastFormData || {}}
            toolId="email-sequence"
          />
          
          {error && (
            <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-red-400 font-medium">Erreur</span>
              </div>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header des résultats */}
        <div className="bg-[#111111] rounded-xl border border-[#232323] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl">
                <Mail className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Votre Séquence Email
                </h1>
                <p className="text-gray-400 mt-1">
                  Séquence générée avec succès
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={regenerateSequence}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Régénérer
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetForm}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Nouvelle séquence
              </motion.button>
            </div>
          </div>

          {emailSequence && (
            <>
              {/* Informations générales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#232323]">
                  <h3 className="font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Informations générales
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-400">Objectif:</span> <span className="text-white">{emailSequence.informationsGenerales.objectifPrincipal}</span></div>
                    <div><span className="text-gray-400">Durée:</span> <span className="text-white">{emailSequence.informationsGenerales.dureeSequence}</span></div>
                    <div><span className="text-gray-400">Fréquence:</span> <span className="text-white">{emailSequence.informationsGenerales.frequenceEnvoi}</span></div>
                    <div><span className="text-gray-400">Tonalité:</span> <span className="text-white">{emailSequence.informationsGenerales.tonaliteGlobale}</span></div>
                  </div>
                </div>
                
                <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#232323]">
                  <h3 className="font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Métriques estimées
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-400">Taux d'ouverture:</span> <span className="text-green-400">{emailSequence.metriquesEstimees.tauxOuverture}</span></div>
                    <div><span className="text-gray-400">Taux de clic:</span> <span className="text-blue-400">{emailSequence.metriquesEstimees.tauxClic}</span></div>
                    <div><span className="text-gray-400">Conversion:</span> <span className="text-yellow-400">{emailSequence.metriquesEstimees.tauxConversion}</span></div>
                    <div><span className="text-gray-400">ROI estimé:</span> <span className="text-purple-400">{emailSequence.metriquesEstimees.roiEstime}</span></div>
                  </div>
                </div>
              </div>

              {/* Liste des emails */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Emails de la séquence ({emailSequence.emails.length})
                </h3>
                {emailSequence.emails.map((email, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#1a1a1a] rounded-lg border border-[#232323] overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-white flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          Email {index + 1}
                        </h4>
                        <button
                          onClick={() => copyToClipboard(`${email.sujet}\n\n${email.contenu}`)}
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                          title="Copier l'email complet"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <span className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-2">
                            <Eye className="w-4 h-4" />
                            Sujet de l'email
                          </span>
                          <div className="p-3 bg-[#0f0f0f] rounded border border-[#232323] text-white">
                            {email.sujet}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-2">
                            <MessageSquare className="w-4 h-4" />
                            Contenu de l'email
                          </span>
                          <div className="p-4 bg-[#0f0f0f] rounded border border-[#232323] text-white whitespace-pre-wrap leading-relaxed">
                            {email.contenu}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-2">
                            <MousePointer className="w-4 h-4" />
                            Call-to-Action
                          </span>
                          <div className="p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded text-blue-300">
                            {email.cta}
                          </div>
                        </div>
                        
                        {email.conseils && email.conseils.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-2">
                              <Sparkles className="w-4 h-4" />
                              Conseils d'optimisation
                            </span>
                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                              <ul className="space-y-1 text-green-300 text-sm">
                                {email.conseils.map((conseil, conseilIndex) => (
                                  <li key={conseilIndex} className="flex items-start gap-2">
                                    <div className="w-1 h-1 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                                    {conseil}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CopyMoneyMailPage() {
  const stats = [
    {
      icon: <Send className="w-5 h-5" />,
      label: "Emails générés",
      value: "15,234",
      color: "text-blue-400",
      description: "Séquences créées"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Taux d'ouverture",
      value: "47.3%",
      color: "text-green-400",
      description: "Moyenne des campagnes"
    },
    {
      icon: <MousePointer className="w-5 h-5" />,
      label: "Taux de clic",
      value: "12.8%",
      color: "text-purple-400",
      description: "CTR moyen"
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: "ROI moyen",
      value: "340%",
      color: "text-orange-400",
      description: "Retour sur investissement"
    }
  ];

  return (
    <ToolLayout toolId="copymoneymail">
      <PremiumGuard feature="Copy Money Mail IA">
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
        <CopyMoneyMailContent />
      </PremiumGuard>
    </ToolLayout>
  );
}