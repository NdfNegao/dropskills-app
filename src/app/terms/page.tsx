'use client';

import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { FileText, Calendar } from 'lucide-react';

export default function TermsPage() {
  return (
    <LayoutWithSidebar>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-[#ff0033]" />
            <h1 className="text-3xl font-bold text-white">Conditions d'Utilisation</h1>
          </div>
          <div className="flex items-center gap-2 text-neutral-400">
            <Calendar className="w-4 h-4" />
            <span>Dernière mise à jour : 29 janvier 2025</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-[#1a1a1a] rounded-xl p-8 border border-[#333] prose prose-invert max-w-none">
          <h2 className="text-xl font-bold text-white mb-4">1. Acceptation des Conditions</h2>
          <p className="text-neutral-300 mb-6">
            En accédant et en utilisant DropSkills, vous acceptez d'être lié par ces conditions d'utilisation. 
            Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
          </p>

          <h2 className="text-xl font-bold text-white mb-4">2. Description du Service</h2>
          <p className="text-neutral-300 mb-6">
            DropSkills est une plateforme qui fournit des outils IA, des templates, des guides et des ressources 
            pour aider les entrepreneurs à développer leur business. Nous proposons des contenus gratuits et premium.
          </p>

          <h2 className="text-xl font-bold text-white mb-4">3. Utilisation Autorisée</h2>
          <ul className="text-neutral-300 mb-6 space-y-2">
            <li>• Vous pouvez utiliser nos ressources pour vos projets personnels et commerciaux</li>
            <li>• Vous ne pouvez pas revendre ou redistribuer nos contenus sans autorisation</li>
            <li>• Vous ne pouvez pas utiliser notre service pour des activités illégales</li>
            <li>• Vous devez respecter les droits de propriété intellectuelle</li>
          </ul>

          <h2 className="text-xl font-bold text-white mb-4">4. Comptes Utilisateur</h2>
          <p className="text-neutral-300 mb-6">
            Vous êtes responsable de maintenir la confidentialité de vos informations de compte et de toutes 
            les activités qui se produisent sous votre compte.
          </p>

          <h2 className="text-xl font-bold text-white mb-4">5. Paiements et Remboursements</h2>
          <p className="text-neutral-300 mb-6">
            Les paiements pour les services premium sont traités de manière sécurisée. Les remboursements 
            sont possibles dans les 14 jours suivant l'achat, sous certaines conditions.
          </p>

          <h2 className="text-xl font-bold text-white mb-4">6. Propriété Intellectuelle</h2>
          <p className="text-neutral-300 mb-6">
            Tous les contenus, outils et ressources disponibles sur DropSkills sont protégés par des droits 
            de propriété intellectuelle. Vous obtenez une licence d'utilisation, non une propriété.
          </p>

          <h2 className="text-xl font-bold text-white mb-4">7. Limitation de Responsabilité</h2>
          <p className="text-neutral-300 mb-6">
            DropSkills ne peut être tenu responsable des dommages directs, indirects, accessoires ou 
            consécutifs résultant de l'utilisation de notre service.
          </p>

          <h2 className="text-xl font-bold text-white mb-4">8. Modifications</h2>
          <p className="text-neutral-300 mb-6">
            Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications 
            seront effectives dès leur publication sur cette page.
          </p>

          <h2 className="text-xl font-bold text-white mb-4">9. Contact</h2>
          <p className="text-neutral-300">
            Pour toute question concernant ces conditions d'utilisation, contactez-nous à : 
            <a href="mailto:support@dropskills.com" className="text-[#ff0033] hover:underline ml-1">
              support@dropskills.com
            </a>
          </p>
        </div>
      </div>
    </LayoutWithSidebar>
  );
} 