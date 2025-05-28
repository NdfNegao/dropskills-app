'use client';

import { useState } from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import PremiumGuard from '@/components/auth/PremiumGuard';
import { 
  Sparkles, 
  Target, 
  DollarSign, 
  Users, 
  Clock,
  Download,
  Copy,
  RefreshCw
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

function GenerateurOffreContent() {
  const [formData, setFormData] = useState<OfferData>({
    businessType: '',
    targetAudience: '',
    productService: '',
    uniqueValue: '',
    priceRange: '',
    urgency: 'medium',
    tone: 'professional'
  });

  const [generatedOffer, setGeneratedOffer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/offer/generate', {
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
      setGeneratedOffer(data.offer);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération de l\'offre');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedOffer);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Erreur de copie:', error);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedOffer], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'offre-commerciale.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Générateur d'Offres IA</h1>
            <p className="text-gray-400">Créez des offres commerciales irrésistibles en quelques clics</p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-400 mb-1">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">Taux de conversion</span>
            </div>
            <div className="text-2xl font-bold text-white">+47%</div>
            <div className="text-xs text-gray-400">vs offres manuelles</div>
          </div>
          
          <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Temps économisé</span>
            </div>
            <div className="text-2xl font-bold text-white">3h</div>
            <div className="text-xs text-gray-400">par offre créée</div>
          </div>
          
          <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Offres générées</span>
            </div>
            <div className="text-2xl font-bold text-white">12,847</div>
            <div className="text-xs text-gray-400">ce mois-ci</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire */}
        <div className="bg-[#111111] border border-[#232323] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Paramètres de votre offre</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type d'entreprise
              </label>
              <select
                value={formData.businessType}
                onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
                required
              >
                <option value="">Sélectionnez votre secteur</option>
                <option value="ecommerce">E-commerce</option>
                <option value="saas">SaaS / Logiciel</option>
                <option value="consulting">Conseil / Formation</option>
                <option value="agency">Agence / Services</option>
                <option value="restaurant">Restaurant / Food</option>
                <option value="fitness">Fitness / Bien-être</option>
                <option value="real-estate">Immobilier</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Audience cible
              </label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                placeholder="Ex: Entrepreneurs débutants, PME, particuliers..."
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Produit/Service
              </label>
              <textarea
                value={formData.productService}
                onChange={(e) => setFormData({...formData, productService: e.target.value})}
                placeholder="Décrivez votre produit ou service en quelques mots..."
                rows={3}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Proposition de valeur unique
              </label>
              <input
                type="text"
                value={formData.uniqueValue}
                onChange={(e) => setFormData({...formData, uniqueValue: e.target.value})}
                placeholder="Ce qui vous différencie de la concurrence..."
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gamme de prix
                </label>
                <select
                  value={formData.priceRange}
                  onChange={(e) => setFormData({...formData, priceRange: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
                  required
                >
                  <option value="">Sélectionnez</option>
                  <option value="0-50">0€ - 50€</option>
                  <option value="50-200">50€ - 200€</option>
                  <option value="200-500">200€ - 500€</option>
                  <option value="500-1000">500€ - 1000€</option>
                  <option value="1000-5000">1000€ - 5000€</option>
                  <option value="5000+">5000€+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Urgence
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
                >
                  <option value="low">Faible</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Élevée</option>
                </select>
              </div>
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
                <option value="urgent">Urgent</option>
                <option value="luxury">Luxe</option>
                <option value="casual">Décontracté</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
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
                  Générer mon offre
                </>
              )}
            </button>
          </form>
        </div>

        {/* Résultat */}
        <div className="bg-[#111111] border border-[#232323] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Votre offre générée</h2>
            {generatedOffer && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="bg-[#232323] text-white px-3 py-2 rounded-lg hover:bg-[#333] transition-colors flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copySuccess ? 'Copié !' : 'Copier'}
                </button>
                <button
                  onClick={handleDownload}
                  className="bg-[#232323] text-white px-3 py-2 rounded-lg hover:bg-[#333] transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Télécharger
                </button>
              </div>
            )}
          </div>

          {generatedOffer ? (
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
              <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                {generatedOffer}
              </div>
            </div>
          ) : (
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-12 text-center">
              <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">Votre offre apparaîtra ici</p>
              <p className="text-gray-500 text-sm">
                Remplissez le formulaire et cliquez sur "Générer" pour créer votre offre personnalisée
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Conseils */}
      <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-blue-400 font-semibold mb-4">💡 Conseils pour une offre efficace</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-300 text-sm">
          <div>
            <h4 className="font-medium mb-2">✨ Optimisation</h4>
            <ul className="space-y-1 text-blue-200">
              <li>• Soyez spécifique sur votre audience</li>
              <li>• Mettez en avant vos bénéfices uniques</li>
              <li>• Utilisez des chiffres concrets</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">🎯 Conversion</h4>
            <ul className="space-y-1 text-blue-200">
              <li>• Créez un sentiment d'urgence</li>
              <li>• Proposez une garantie</li>
              <li>• Incluez un appel à l'action clair</li>
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
      <PremiumGuard feature="Générateur d'Offres IA">
        <GenerateurOffreContent />
      </PremiumGuard>
    </LayoutWithSidebar>
  );
} 