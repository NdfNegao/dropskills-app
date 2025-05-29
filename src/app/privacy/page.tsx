'use client';

import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { Shield, Calendar } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <LayoutWithSidebar>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-[#ff0033]" />
            <h1 className="text-3xl font-bold text-white">Politique de Confidentialité</h1>
          </div>
          <div className="flex items-center gap-2 text-neutral-400">
            <Calendar className="w-4 h-4" />
            <span>Dernière mise à jour : 29 janvier 2025</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-[#1a1a1a] rounded-xl p-8 border border-[#333] prose prose-invert max-w-none">
          <h2 className="text-xl font-bold text-white mb-4">1. Introduction</h2>
          <p className="text-neutral-300 mb-6">
            DropSkills respecte votre vie privée et s'engage à protéger vos données personnelles. 
            Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
          </p>

          <h2 className="text-xl font-bold text-white mb-4">2. Données Collectées</h2>
          <h3 className="text-lg font-semibold text-white mb-3">Informations que vous nous fournissez :</h3>
          <ul className="text-neutral-300 mb-4 space-y-2">
            <li>• Nom et adresse email lors de l'inscription</li>
            <li>• Informations de paiement pour les achats</li>
            <li>• Communications que vous nous envoyez</li>
          </ul>

          <h3 className="text-lg font-semibold text-white mb-3">Informations collectées automatiquement :</h3>
          <ul className="text-neutral-300 mb-6 space-y-2">
            <li>• Données d'utilisation et de navigation</li>
            <li>• Adresse IP et informations sur l'appareil</li>
            <li>• Cookies et technologies similaires</li>
          </ul>

          <h2 className="text-xl font-bold text-white mb-4">3. Utilisation des Données</h2>
          <p className="text-neutral-300 mb-4">Nous utilisons vos données pour :</p>
          <ul className="text-neutral-300 mb-6 space-y-2">
            <li>• Fournir et améliorer nos services</li>
            <li>• Traiter vos commandes et paiements</li>
            <li>• Vous envoyer des communications importantes</li>
            <li>• Personnaliser votre expérience</li>
            <li>• Analyser l'utilisation de notre plateforme</li>
          </ul>

          <h2 className="text-xl font-bold text-white mb-4">4. Partage des Données</h2>
          <p className="text-neutral-300 mb-6">
            Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations 
            uniquement avec des prestataires de services de confiance qui nous aident à exploiter 
            notre plateforme (processeurs de paiement, services d'hébergement, etc.).
          </p>

          <h2 className="text-xl font-bold text-white mb-4">5. Sécurité des Données</h2>
          <p className="text-neutral-300 mb-6">
            Nous mettons en place des mesures de sécurité techniques et organisationnelles appropriées 
            pour protéger vos données contre l'accès non autorisé, la modification, la divulgation ou 
            la destruction.
          </p>

          <h2 className="text-xl font-bold text-white mb-4">6. Vos Droits</h2>
          <p className="text-neutral-300 mb-4">Conformément au RGPD, vous avez le droit de :</p>
          <ul className="text-neutral-300 mb-6 space-y-2">
            <li>• Accéder à vos données personnelles</li>
            <li>• Rectifier des données inexactes</li>
            <li>• Demander l'effacement de vos données</li>
            <li>• Limiter le traitement de vos données</li>
            <li>• Portabilité de vos données</li>
            <li>• Vous opposer au traitement</li>
          </ul>

          <h2 className="text-xl font-bold text-white mb-4">7. Cookies</h2>
          <p className="text-neutral-300 mb-6">
            Nous utilisons des cookies pour améliorer votre expérience sur notre site. Vous pouvez 
            gérer vos préférences de cookies dans les paramètres de votre navigateur.
          </p>

          <h2 className="text-xl font-bold text-white mb-4">8. Conservation des Données</h2>
          <p className="text-neutral-300 mb-6">
            Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir 
            nos services et respecter nos obligations légales.
          </p>

          <h2 className="text-xl font-bold text-white mb-4">9. Contact</h2>
          <p className="text-neutral-300">
            Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, 
            contactez-nous à : 
            <a href="mailto:privacy@dropskills.com" className="text-[#ff0033] hover:underline ml-1">
              privacy@dropskills.com
            </a>
          </p>
        </div>
      </div>
    </LayoutWithSidebar>
  );
} 