'use client';

import { useState } from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import PremiumGuard from '@/components/auth/PremiumGuard';
import { 
  Target, 
  Sparkles, 
  TrendingUp, 
  Users, 
  DollarSign,
  Lightbulb,
  Zap,
  CheckCircle,
  Copy,
  RefreshCw,
  Download,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface OfferData {
  businessType: string;
  targetAudience: string;
  productService: string;
  uniqueValue: string;
  priceRange: string;
  urgency: string;
  tone: string;
}

interface GeneratedOffer {
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  features: string[];
  pricing: {
    original: string;
    current: string;
    savings: string;
  };
  urgency: string;
  guarantee: string;
  cta: string;
  bonuses: string[];
}

const BUSINESS_TYPES = [
  'Formation en ligne',
  'Coaching/Consulting',
  'E-commerce',
  'SaaS/Logiciel',
  'Service local',
  'Agence marketing',
  'Freelance',
  'Autre'
];

const PRICE_RANGES = [
  '0-50€',
  '50-200€',
  '200-500€',
  '500-1000€',
  '1000-2000€',
  '2000€+'
];

const URGENCY_LEVELS = [
  'Aucune urgence',
  'Offre limitée dans le temps',
  'Stock limité',
  'Bonus exclusif',
  'Prix promotionnel'
];

const TONE_OPTIONS = [
  'Professionnel',
  'Amical',
  'Urgent',
  'Luxe',
  'Décontracté'
];

function GenerateurOffreContent() {
  const [formData, setFormData] = useState<OfferData>({
    businessType: '',
    targetAudience: '',
    productService: '',
    uniqueValue: '',
    priceRange: '',
    urgency: '',
    tone: ''
  });

  const [offerResult, setOfferResult] = useState<GeneratedOffer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    business: true,
    audience: false,
    product: false,
    value: false,
    pricing: false,
    urgency: false,
    tone: false
  });

  const handleGenerate = async () => {
    if (!formData.businessType || !formData.targetAudience || !formData.productService) {
      alert('Veuillez remplir au moins le type de business, l\'audience et le produit/service');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulation de génération IA
      setTimeout(() => {
        const mockOffer: GeneratedOffer = {
          title: `${formData.productService} - La Solution Complète pour ${formData.targetAudience}`,
          subtitle: `Transformez votre ${formData.businessType.toLowerCase()} avec notre méthode éprouvée`,
          description: `Découvrez comment ${formData.uniqueValue || 'notre solution unique'} peut révolutionner votre approche et vous faire gagner du temps tout en augmentant vos résultats.`,
          benefits: [
            `Économisez 10h par semaine grâce à notre système optimisé`,
            `Augmentez vos revenus de 50% en 3 mois`,
            `Accédez à une communauté exclusive de ${formData.targetAudience.toLowerCase()}`,
            `Bénéficiez d'un support personnalisé 7j/7`
          ],
          features: [
            `Module de formation vidéo (4h de contenu)`,
            `Templates et outils prêts à utiliser`,
            `Accès à vie à la plateforme`,
            `Mises à jour gratuites`,
            `Groupe privé Facebook`
          ],
          pricing: {
            original: formData.priceRange ? `${parseInt(formData.priceRange.split('-')[1] || '500') * 2}€` : '997€',
            current: formData.priceRange.split('-')[1] || '497€',
            savings: '500€'
          },
          urgency: formData.urgency || 'Offre limitée - Plus que 48h !',
          guarantee: 'Garantie satisfait ou remboursé 30 jours',
          cta: 'Je veux transformer mon business maintenant !',
          bonuses: [
            'BONUS #1 : Checklist de lancement (valeur 97€)',
            'BONUS #2 : 1h de coaching personnalisé (valeur 200€)',
            'BONUS #3 : Accès VIP aux futures formations (valeur 300€)'
          ]
        };
        
        setOfferResult(mockOffer);
        setIsLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération de l\'offre');
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof OfferData, value: string) => {
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
          <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl">
            <Target className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Générateur d'Offre IA</h1>
            <p className="text-gray-400">Créez des offres irrésistibles qui convertissent</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-white font-semibold">12,847</p>
                <p className="text-gray-400 text-sm">Offres générées</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-white font-semibold">+127%</p>
                <p className="text-gray-400 text-sm">Taux de conversion</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-white font-semibold">€2.4M</p>
                <p className="text-gray-400 text-sm">CA généré</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire */}
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            Paramètres de l'offre
          </h2>

          <div className="space-y-4">
            {/* Type de business */}
            <div className="border border-[#232323] rounded-lg">
              <button
                onClick={() => toggleSection('business')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition-colors"
              >
                <span className="text-white font-medium">Type de business *</span>
                {expandedSections.business ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {expandedSections.business && (
                <div className="p-4 pt-0">
                  <div className="grid grid-cols-2 gap-2">
                    {BUSINESS_TYPES.map((type) => (
                      <button
                        key={type}
                        onClick={() => handleInputChange('businessType', type)}
                        className={`p-3 rounded-lg border text-sm transition-colors text-left ${
                          formData.businessType === type
                            ? 'bg-[#00D2FF] border-[#00D2FF] text-black'
                            : 'bg-[#1a1a1a] border-[#333] text-white hover:border-[#00D2FF]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Audience cible */}
            <div className="border border-[#232323] rounded-lg">
              <button
                onClick={() => toggleSection('audience')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition-colors"
              >
                <span className="text-white font-medium">Audience cible *</span>
                {expandedSections.audience ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {expandedSections.audience && (
                <div className="p-4 pt-0">
                  <input
                    type="text"
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    placeholder="Ex: Entrepreneurs débutants, PME, particuliers..."
                    className="w-full p-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Produit/Service */}
            <div className="border border-[#232323] rounded-lg">
              <button
                onClick={() => toggleSection('product')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition-colors"
              >
                <span className="text-white font-medium">Produit/Service *</span>
                {expandedSections.product ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {expandedSections.product && (
                <div className="p-4 pt-0">
                  <textarea
                    value={formData.productService}
                    onChange={(e) => handleInputChange('productService', e.target.value)}
                    placeholder="Décrivez votre produit ou service en quelques mots..."
                    rows={3}
                    className="w-full p-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Valeur unique */}
            <div className="border border-[#232323] rounded-lg">
              <button
                onClick={() => toggleSection('value')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition-colors"
              >
                <span className="text-white font-medium">Proposition de valeur unique</span>
                {expandedSections.value ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {expandedSections.value && (
                <div className="p-4 pt-0">
                  <input
                    type="text"
                    value={formData.uniqueValue}
                    onChange={(e) => handleInputChange('uniqueValue', e.target.value)}
                    placeholder="Ce qui vous différencie de la concurrence..."
                    className="w-full p-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Gamme de prix */}
            <div className="border border-[#232323] rounded-lg">
              <button
                onClick={() => toggleSection('pricing')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition-colors"
              >
                <span className="text-white font-medium">Gamme de prix</span>
                {expandedSections.pricing ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {expandedSections.pricing && (
                <div className="p-4 pt-0">
                  <div className="grid grid-cols-3 gap-2">
                    {PRICE_RANGES.map((range) => (
                      <button
                        key={range}
                        onClick={() => handleInputChange('priceRange', range)}
                        className={`p-2 rounded-lg border text-sm transition-colors ${
                          formData.priceRange === range
                            ? 'bg-[#00D2FF] border-[#00D2FF] text-black'
                            : 'bg-[#1a1a1a] border-[#333] text-white hover:border-[#00D2FF]'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Urgence */}
            <div className="border border-[#232323] rounded-lg">
              <button
                onClick={() => toggleSection('urgency')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition-colors"
              >
                <span className="text-white font-medium">Niveau d'urgence</span>
                {expandedSections.urgency ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {expandedSections.urgency && (
                <div className="p-4 pt-0">
                  <div className="grid grid-cols-1 gap-2">
                    {URGENCY_LEVELS.map((level) => (
                      <button
                        key={level}
                        onClick={() => handleInputChange('urgency', level)}
                        className={`p-3 rounded-lg border text-sm transition-colors text-left ${
                          formData.urgency === level
                            ? 'bg-[#00D2FF] border-[#00D2FF] text-black'
                            : 'bg-[#1a1a1a] border-[#333] text-white hover:border-[#00D2FF]'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tonalité */}
            <div className="border border-[#232323] rounded-lg">
              <button
                onClick={() => toggleSection('tone')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition-colors"
              >
                <span className="text-white font-medium">Tonalité</span>
                {expandedSections.tone ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {expandedSections.tone && (
                <div className="p-4 pt-0">
                  <div className="grid grid-cols-2 gap-2">
                    {TONE_OPTIONS.map((tone) => (
                      <button
                        key={tone}
                        onClick={() => handleInputChange('tone', tone)}
                        className={`p-3 rounded-lg border text-sm transition-colors ${
                          formData.tone === tone
                            ? 'bg-[#00D2FF] border-[#00D2FF] text-black'
                            : 'bg-[#1a1a1a] border-[#333] text-white hover:border-[#00D2FF]'
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !formData.businessType || !formData.targetAudience || !formData.productService}
            className="w-full mt-6 bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Générer mon offre
              </>
            )}
          </button>
        </div>

        {/* Résultats */}
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            Votre Offre Générée
          </h2>

          {!offerResult ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">Prêt à créer votre offre irrésistible ?</p>
              <p className="text-gray-500 text-sm">Remplissez le formulaire et cliquez sur "Générer mon offre"</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Titre principal */}
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <h3 className="text-white font-bold text-xl mb-2">{offerResult.title}</h3>
                <p className="text-gray-300 text-lg">{offerResult.subtitle}</p>
                <p className="text-gray-400 mt-2">{offerResult.description}</p>
              </div>

              {/* Prix */}
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-yellow-400" />
                  Tarification
                </h4>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 line-through text-lg">{offerResult.pricing.original}</span>
                  <span className="text-green-400 font-bold text-2xl">{offerResult.pricing.current}</span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">-{offerResult.pricing.savings}</span>
                </div>
              </div>

              {/* Bénéfices */}
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Bénéfices
                </h4>
                <ul className="space-y-2">
                  {offerResult.benefits.map((benefit, index) => (
                    <li key={index} className="text-gray-300 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bonus */}
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Bonus inclus
                </h4>
                <ul className="space-y-2">
                  {offerResult.bonuses.map((bonus, index) => (
                    <li key={index} className="text-gray-300 flex items-start gap-2">
                      <Zap className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      {bonus}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-4 text-center">
                <p className="text-white font-bold text-lg mb-2">{offerResult.cta}</p>
                <p className="text-white/80 text-sm">{offerResult.urgency}</p>
                <p className="text-white/60 text-xs mt-2">{offerResult.guarantee}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(JSON.stringify(offerResult, null, 2))}
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
      <div className="mt-8 bg-green-900/20 border border-green-500/30 rounded-xl p-6">
        <h3 className="text-green-400 font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          💡 Conseils pour une offre efficace
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-green-300 text-sm">
          <div>
            <h4 className="font-medium mb-3 text-green-200">✨ Optimisation de l'offre</h4>
            <ul className="space-y-2 text-green-300">
              <li>• <strong>Soyez spécifique :</strong> Définissez précisément votre audience cible</li>
              <li>• <strong>Mettez en avant vos bénéfices uniques :</strong> Ce qui vous différencie vraiment</li>
              <li>• <strong>Utilisez des chiffres concrets :</strong> Résultats mesurables et témoignages</li>
              <li>• <strong>Prix psychologique :</strong> Testez différentes gammes de prix</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3 text-green-200">🎯 Conversion maximale</h4>
            <ul className="space-y-2 text-green-300">
              <li>• <strong>Créez un sentiment d'urgence :</strong> Offre limitée dans le temps</li>
              <li>• <strong>Proposez une garantie :</strong> Réduisez le risque perçu</li>
              <li>• <strong>Incluez un appel à l'action clair :</strong> Dites exactement quoi faire</li>
              <li>• <strong>Testez et mesurez :</strong> A/B testez vos offres pour optimiser</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GenerateurOffrePage() {
  return (
    <LayoutWithSidebar>
      <PremiumGuard feature="Générateur d'Offre IA">
        <GenerateurOffreContent />
      </PremiumGuard>
    </LayoutWithSidebar>
  );
} 