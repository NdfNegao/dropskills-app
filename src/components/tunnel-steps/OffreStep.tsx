import React from 'react';
import { Package } from 'lucide-react';
import StandardInput from '../ui/StandardInput';
import ConseilBlock from '../ui/ConseilBlock';

interface OffreStepProps {
  data: {
    offreProduitService: string;
  };
  onUpdate: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

export function OffreStep({ data, onUpdate, errors }: OffreStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-orange-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Votre Offre</h2>
        <p className="text-gray-400">Décrivez précisément votre produit ou service</p>
      </div>

      <StandardInput
        label="Offre/Produit/Service"
        tooltip="Décrivez votre offre de manière claire et précise. Incluez les bénéfices principaux, le public cible et ce qui la rend unique."
        placeholder="Ex: Formation en ligne sur le marketing digital pour entrepreneurs débutants, incluant 20 modules vidéo, templates et support communautaire..."
        value={data.offreProduitService}
        onChange={(value) => onUpdate('offreProduitService', value)}
        error={errors?.offreProduitService}
        required
        multiline
        rows={4}
        maxLength={500}
        icon={Package}
      />

      <ConseilBlock variant="orange" icon={<Package className="w-4 h-4" />}>
        <strong>Conseil pour une offre percutante :</strong>
        <ul className="mt-2 space-y-1 text-sm">
          <li>• Mentionnez le <strong>problème résolu</strong> et la <strong>transformation promise</strong></li>
          <li>• Précisez le <strong>format</strong> (formation, coaching, produit physique, service...)</li>
          <li>• Indiquez la <strong>durée</strong> ou le <strong>volume</strong> si applicable</li>
          <li>• Ajoutez les <strong>bonus</strong> ou <strong>garanties</strong> inclus</li>
        </ul>
      </ConseilBlock>
    </div>
  );
}

export default OffreStep;