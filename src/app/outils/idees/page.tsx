'use client';

import { useState } from 'react';
import Sidebar from '../../../components/Sidebar';
import { Users, FileText, LayoutGrid, BookOpen, Monitor, UserCheck, Lock } from 'lucide-react';

const FORMATS = [
  { label: 'E-book', value: 'ebook', icon: <BookOpen className="w-4 h-4 mr-1" /> },
  { label: 'Course', value: 'course', icon: <FileText className="w-4 h-4 mr-1" /> },
  { label: 'Template', value: 'template', icon: <LayoutGrid className="w-4 h-4 mr-1" /> },
  { label: 'Software', value: 'software', icon: <Monitor className="w-4 h-4 mr-1" /> },
  { label: 'Membership', value: 'membership', icon: <Users className="w-4 h-4 mr-1" /> },
  { label: 'Coaching', value: 'coaching', icon: <UserCheck className="w-4 h-4 mr-1" /> },
];

const EXAMPLES = [
  {
    title: 'Vertical Farming Blueprint',
    desc: 'Un guide complet pour créer et rentabiliser une ferme verticale.',
    tags: ['Course', 'Eco-friendly', 'Innovation']
  },
  {
    title: 'Crypto Portfolio Simulator',
    desc: 'Un outil interactif pour tester des stratégies de trading crypto.',
    tags: ['Software', 'Finance', 'Web3']
  },
  {
    title: 'Remote Team Culture Builder',
    desc: "Un framework d'activités pour renforcer la cohésion des équipes à distance.",
    tags: ['Template', 'Leadership', 'Remote work']
  },
  {
    title: 'No-Code Business Automation',
    desc: 'Apprenez à automatiser votre business sans coder.',
    tags: ['Course', 'No-code', 'Automation']
  },
  {
    title: 'Ethical Investing Framework',
    desc: 'Un système pour évaluer les investissements responsables.',
    tags: ['Template', 'ESG', 'Finance']
  },
  {
    title: 'Digital Detox Retreat Planner',
    desc: 'Un guide pour organiser des retraites sans technologie.',
    tags: ['Template', 'Wellness', 'Mindfulness']
  },
];

export default function ProductIdeas() {
  const [audience, setAudience] = useState('');
  const [topic, setTopic] = useState('');
  const [formats, setFormats] = useState<string[]>([]);
  const [ideas, setIdeas] = useState<typeof EXAMPLES>([]);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFormatToggle = (value: string) => {
    setFormats((prev) =>
      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation de génération d'idées
    setTimeout(() => {
      setIdeas(EXAMPLES.map((ex, i) => ({
        ...ex,
        title: ex.title + (audience ? ` pour ${audience}` : ''),
        desc: ex.desc + (topic ? ` Thème : ${topic}.` : ''),
        tags: formats.length ? ex.tags.filter(t => formats.map(f=>f.toLowerCase()).includes(t.toLowerCase()) || FORMATS.map(f=>f.label.toLowerCase()).includes(t.toLowerCase())) : ex.tags
      })));
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      {/* Fond discret */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{backgroundImage:'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect x=\'0.5\' y=\'0.5\' width=\'39\' height=\'39\' rx=\'7.5\' fill=\'white\' fill-opacity=\'0.03\' stroke=\'%230a0a0a\'/%3E%3C/svg%3E")'}} />
      {/* Bannière */}
      <div className="bg-[#ff0033] text-white text-center py-2 text-sm relative z-10">
        🎉 Offre de lancement 2025 ➜ -50% sur le Plan Pro
      </div>
      <Sidebar />
      <main className="ml-64 p-8 relative z-10 flex gap-8">
        {/* Cartes idées à gauche */}
        <div className="flex-1 flex flex-col gap-4 justify-center items-end">
          {ideas.length === 0 ? EXAMPLES.slice(0,3).map((idea, i) => (
            <IdeaCard key={i} {...idea} align="left" />
          )) : ideas.slice(0,3).map((idea, i) => (
            <IdeaCard key={i} {...idea} align="left" />
          ))}
        </div>
        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="w-[480px] bg-white/95 rounded-2xl shadow-xl p-8 flex flex-col gap-6 border border-gray-200">
          <h1 className="text-2xl font-bold text-[#0a0a0a] mb-1 text-center">Digital Product Ideator</h1>
          <p className="text-gray-500 text-center mb-4">Trouvez l'inspiration avec des idées de produits digitaux adaptées à votre audience.</p>
          <div className="flex flex-col gap-4">
            <div>
              <label className="font-medium text-[#0a0a0a] flex items-center gap-2 mb-1"><Users className="w-4 h-4" /> Audience cible</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff0033]" placeholder="Ex: Entrepreneurs, Freelances, Étudiants..." value={audience} onChange={e=>setAudience(e.target.value)} required />
            </div>
            <div>
              <label className="font-medium text-[#0a0a0a] flex items-center gap-2 mb-1"><FileText className="w-4 h-4" /> Sujet (optionnel)</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none" placeholder="Ex: IA, Productivité, Marketing..." value={topic} onChange={e=>setTopic(e.target.value)} />
            </div>
            <div>
              <label className="font-medium text-[#0a0a0a] flex items-center gap-2 mb-1"><LayoutGrid className="w-4 h-4" /> Formats (optionnel)</label>
              <div className="flex flex-wrap gap-2">
                {FORMATS.map(f => (
                  <button type="button" key={f.value} onClick={()=>handleFormatToggle(f.value)} className={`flex items-center px-4 py-2 rounded-full border text-sm font-medium transition-colors ${formats.includes(f.value) ? 'bg-[#0a0a0a] text-white border-[#ff0033]' : 'bg-white text-[#0a0a0a] border-gray-300 hover:bg-gray-100'}`}>
                    {f.icon}{f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button type="submit" className="w-full bg-[#ff0033] text-white py-3 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors flex items-center justify-center gap-2" disabled={loading || isPro}>
            {loading ? 'Génération en cours...' : 'Générer des idées'}
          </button>
          <button type="button" className="w-full bg-gray-100 text-gray-500 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 mt-2 cursor-not-allowed" disabled>
            <Lock className="w-4 h-4 mr-1" /> Débloquer cette fonctionnalité
          </button>
        </form>
        {/* Cartes idées à droite */}
        <div className="flex-1 flex flex-col gap-4 justify-center items-start">
          {ideas.length === 0 ? EXAMPLES.slice(3).map((idea, i) => (
            <IdeaCard key={i} {...idea} align="right" />
          )) : ideas.slice(3).map((idea, i) => (
            <IdeaCard key={i} {...idea} align="right" />
          ))}
        </div>
      </main>
    </div>
  );
}

function IdeaCard({ title, desc, tags, align }: { title: string; desc: string; tags: string[]; align: 'left'|'right' }) {
  return (
    <div className={`bg-white shadow-lg rounded-xl px-6 py-4 w-[320px] mb-2 border border-gray-200 ${align==='left' ? 'ml-auto' : 'mr-auto'}`}
      style={{transform: `rotate(${align==='left' ? '-2' : '2'}deg)`}}>
      <h3 className="font-bold text-[#0a0a0a] text-lg mb-1">{title}</h3>
      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{desc}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span key={i} className="bg-[#ff0033]/10 text-[#ff0033] text-xs font-semibold px-2 py-1 rounded-full">{tag}</span>
        ))}
      </div>
    </div>
  );
} 