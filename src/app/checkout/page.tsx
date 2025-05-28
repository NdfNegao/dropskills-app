'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { 
  CreditCard, 
  Lock, 
  Check, 
  ArrowLeft, 
  Crown,
  Sparkles,
  Shield,
  Zap
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
}

const PLANS: Record<string, Plan> = {
  'premium-monthly': {
    id: 'premium-monthly',
    name: 'Premium Mensuel',
    price: 47,
    period: 'mois',
    description: 'Accès complet aux outils IA',
    features: [
      'Tous les outils IA premium',
      'Génération illimitée',
      'Support prioritaire',
      'Mises à jour en avant-première',
      'Templates exclusifs'
    ]
  },
  'premium-yearly': {
    id: 'premium-yearly',
    name: 'Premium Annuel',
    price: 397,
    originalPrice: 564,
    period: 'an',
    description: '2 mois offerts + bonus exclusifs',
    features: [
      'Tous les outils IA premium',
      'Génération illimitée',
      'Support prioritaire VIP',
      'Accès aux bêtas privées',
      'Templates exclusifs',
      'Formation 1-on-1 offerte',
      'Communauté privée'
    ],
    popular: true
  }
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, canAccessPremium } = useAuth();
  
  const planId = searchParams.get('plan') || 'premium-yearly';
  const plan = PLANS[planId];
  
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [formData, setFormData] = useState({
    email: user?.email || '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    country: 'FR',
    acceptTerms: false
  });

  // Redirection si déjà premium
  useEffect(() => {
    if (canAccessPremium) {
      router.push('/premium?already=true');
    }
  }, [canAccessPremium, router]);

  if (!plan) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-white mb-4">Plan non trouvé</h1>
        <p className="text-gray-400 mb-6">Le plan sélectionné n'existe pas.</p>
        <button
          onClick={() => router.push('/premium')}
          className="bg-[#ff0033] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors"
        >
          Retour aux plans
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptTerms) {
      alert('Veuillez accepter les conditions générales');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulation du processus de paiement
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Redirection vers page de succès
      router.push('/checkout/success?plan=' + planId);
      
    } catch (error) {
      console.error('Erreur de paiement:', error);
      alert('Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/premium')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux plans
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">Finaliser votre commande</h1>
        <p className="text-gray-400">Rejoignez les entrepreneurs qui transforment leur business</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire de paiement */}
        <div className="bg-[#111111] border border-[#232323] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Informations de paiement</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
                required
              />
            </div>

            {/* Méthode de paiement */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Méthode de paiement
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-[#ff0033] bg-[#ff0033]/10 text-white'
                      : 'border-[#333] bg-[#1a1a1a] text-gray-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Carte
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${
                    paymentMethod === 'paypal'
                      ? 'border-[#ff0033] bg-[#ff0033]/10 text-white'
                      : 'border-[#333] bg-[#1a1a1a] text-gray-400'
                  }`}
                >
                  PayPal
                </button>
              </div>
            </div>

            {/* Informations carte */}
            {paymentMethod === 'card' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Numéro de carte
                  </label>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({...formData, cardNumber: formatCardNumber(e.target.value)})}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Date d'expiration
                    </label>
                    <input
                      type="text"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({...formData, expiryDate: formatExpiryDate(e.target.value)})}
                      placeholder="MM/AA"
                      maxLength={5}
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={formData.cvv}
                      onChange={(e) => setFormData({...formData, cvv: e.target.value.replace(/\D/g, '').substring(0, 4)})}
                      placeholder="123"
                      maxLength={4}
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nom sur la carte
                  </label>
                  <input
                    type="text"
                    value={formData.cardName}
                    onChange={(e) => setFormData({...formData, cardName: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
                    required
                  />
                </div>
              </>
            )}

            {/* PayPal */}
            {paymentMethod === 'paypal' && (
              <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 text-center">
                <div className="text-blue-400 text-lg font-semibold mb-2">PayPal</div>
                <p className="text-gray-400 text-sm">
                  Vous serez redirigé vers PayPal pour finaliser votre paiement
                </p>
              </div>
            )}

            {/* Conditions */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
                className="mt-1 w-4 h-4 text-[#ff0033] bg-[#1a1a1a] border-[#333] rounded focus:ring-[#ff0033]"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-300">
                J'accepte les{' '}
                <a href="/terms" className="text-[#ff0033] hover:underline">
                  conditions générales
                </a>{' '}
                et la{' '}
                <a href="/privacy" className="text-[#ff0033] hover:underline">
                  politique de confidentialité
                </a>
              </label>
            </div>

            {/* Bouton de paiement */}
            <button
              type="submit"
              disabled={isLoading || !formData.acceptTerms}
              className="w-full bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white py-4 rounded-lg font-semibold hover:from-[#cc0029] hover:to-[#990022] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Traitement en cours...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Payer {plan.price}€/{plan.period}
                </>
              )}
            </button>
          </form>

          {/* Sécurité */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
            <Shield className="w-4 h-4" />
            Paiement sécurisé SSL 256-bit
          </div>
        </div>

        {/* Résumé de commande */}
        <div className="bg-[#111111] border border-[#232323] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Résumé de commande</h2>
          
          {/* Plan sélectionné */}
          <div className="bg-[#1a1a1a] rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{plan.name}</h3>
                <p className="text-gray-400 text-sm">{plan.description}</p>
              </div>
            </div>
            
            {plan.popular && (
              <div className="inline-flex items-center gap-1 bg-[#ff0033] text-white px-2 py-1 rounded-full text-xs font-medium mb-3">
                <Sparkles className="w-3 h-3" />
                Plus populaire
              </div>
            )}
          </div>

          {/* Fonctionnalités */}
          <div className="mb-6">
            <h4 className="text-white font-medium mb-3">Inclus dans votre plan :</h4>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Prix */}
          <div className="border-t border-[#333] pt-4">
            {plan.originalPrice && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Prix normal</span>
                <span className="text-gray-400 line-through">{plan.originalPrice}€/{plan.period}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Prix {plan.name}</span>
              <span className="text-white font-semibold">{plan.price}€/{plan.period}</span>
            </div>
            
            {plan.originalPrice && (
              <div className="flex justify-between items-center mb-4">
                <span className="text-green-400 font-medium">Économies</span>
                <span className="text-green-400 font-semibold">
                  -{plan.originalPrice - plan.price}€
                </span>
              </div>
            )}
            
            <div className="border-t border-[#333] pt-4">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold text-lg">Total</span>
                <span className="text-white font-bold text-xl">{plan.price}€/{plan.period}</span>
              </div>
            </div>
          </div>

          {/* Garantie */}
          <div className="mt-6 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-400 font-medium mb-1">
              <Zap className="w-4 h-4" />
              Garantie 30 jours
            </div>
            <p className="text-green-300 text-sm">
              Satisfait ou remboursé, sans condition
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <LayoutWithSidebar>
      <Suspense fallback={
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff0033] mx-auto"></div>
          <p className="text-gray-400 mt-4">Chargement...</p>
        </div>
      }>
        <CheckoutContent />
      </Suspense>
    </LayoutWithSidebar>
  );
} 