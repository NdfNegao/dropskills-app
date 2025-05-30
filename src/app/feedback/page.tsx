import { Metadata } from 'next';
import NewIdeaForm from '@/components/feedback/NewIdeaForm';
import IdeaList from '@/components/feedback/IdeaList';

export const metadata: Metadata = {
  title: 'Feedback Board | Dropskills',
  description: 'Soumettez vos idées et votez pour les meilleures fonctionnalités',
};

// Placeholder pour les stats (à remplacer par un vrai composant si besoin)
function FeedbackStats() {
  return (
    <div className="flex gap-6 justify-center mb-8">
      <div>
        <div className="text-lg font-bold">12</div>
        <div className="text-xs text-gray-400">Idées</div>
      </div>
      <div>
        <div className="text-lg font-bold">54</div>
        <div className="text-xs text-gray-400">Votes</div>
      </div>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* 1. Icône + Titre */}
      <div className="flex items-center gap-3 mb-2 justify-center">
        <span className="text-3xl">💡</span>
        <h1 className="text-2xl font-bold">Feedback Board</h1>
      </div>

      {/* 2. Sous-titre */}
      <p className="text-gray-400 text-center mb-6">
        Proposez vos idées ou votez pour les suggestions de la communauté !
      </p>

      {/* 3. Statistiques */}
      <FeedbackStats />

      {/* 4. Bloc soumission d'idée */}
      <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800 mb-10">
        <h2 className="text-xl font-semibold mb-4">Proposer une nouvelle idée</h2>
        <NewIdeaForm />
      </div>

      {/* 5. Liste des idées */}
      <div>
        <IdeaList />
      </div>
    </div>
  );
} 