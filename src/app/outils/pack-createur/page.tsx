'use client';

import { useState } from 'react';
import Sidebar from '../../../components/Sidebar';
import { Sparkles, BookOpen, BrainCircuit, FileCode, Calculator, Save, Share2, Download, Info } from 'lucide-react';

export default function PackCreateurIA() {
  const [step, setStep] = useState(1);
  const [help, setHelp] = useState('');
  const [form, setForm] = useState({
    idee: '',
    titre: '',
    description: '',
    pdf: '',
    revenu: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] flex items-center justify-center">
      <Sidebar />
      <main className="ml-64 flex flex-col items-center w-full min-h-screen">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 mt-16 mb-8 relative">
          {/* Progression améliorée */}
          <div className="flex justify-between items-center mb-10 px-2">
            <div className={`flex flex-col items-center ${step === 1 ? 'text-[#ff0033]' : 'text-gray-400'}`}>
              <Sparkles className="w-7 h-7 mb-1" />
              <span className="font-semibold text-sm">Idée</span>
              {step === 1 && <div className="w-2 h-2 rounded-full bg-[#ff0033] mt-1" />}
            </div>
            <div className={`flex flex-col items-center ${step === 2 ? 'text-[#ff0033]' : 'text-gray-400'}`}>
              <BookOpen className="w-7 h-7 mb-1" />
              <span className="font-semibold text-sm">Titre</span>
              {step === 2 && <div className="w-2 h-2 rounded-full bg-[#ff0033] mt-1" />}
            </div>
            <div className={`flex flex-col items-center ${step === 3 ? 'text-[#ff0033]' : 'text-gray-400'}`}>
              <BrainCircuit className="w-7 h-7 mb-1" />
              <span className="font-semibold text-sm">Description</span>
              {step === 3 && <div className="w-2 h-2 rounded-full bg-[#ff0033] mt-1" />}
            </div>
            <div className={`flex flex-col items-center ${step === 4 ? 'text-[#ff0033]' : 'text-gray-400'}`}>
              <FileCode className="w-7 h-7 mb-1" />
              <span className="font-semibold text-sm">PDF</span>
              {step === 4 && <div className="w-2 h-2 rounded-full bg-[#ff0033] mt-1" />}
            </div>
            <div className={`flex flex-col items-center ${step === 5 ? 'text-[#ff0033]' : 'text-gray-400'}`}>
              <Calculator className="w-7 h-7 mb-1" />
              <span className="font-semibold text-sm">Revenu</span>
              {step === 5 && <div className="w-2 h-2 rounded-full bg-[#ff0033] mt-1" />}
            </div>
          </div>

          {/* Étape 1 : Idée */}
          {step === 1 && (
            <div className="flex flex-col items-center">
              <h2 className="text-3xl font-extrabold text-[#0a0a0a] mb-6 text-center">1. Génère ton idée de business</h2>
              <input
                type="text"
                name="idee"
                value={form.idee}
                onChange={handleChange}
                placeholder="Décris ton idée..."
                className="w-full bg-[#f5f5f5] text-[#111] border border-gray-200 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#ff0033]"
              />
              <div className="flex w-full gap-4 mt-4">
                <div className="flex-1" />
                <button onClick={() => setStep(2)} className="flex-1 bg-[#ff0033] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#e6002a] transition">Étape suivante</button>
              </div>
            </div>
          )}

          {/* Étape 2 : Titre */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#0a0a0a]">2. Trouve un titre accrocheur</h2>
              <input
                type="text"
                name="titre"
                value={form.titre}
                onChange={handleChange}
                placeholder="Saisis un titre..."
                className="w-full bg-[#f5f5f5] text-[#111] border border-gray-200 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#ff0033]"
              />
              <div className="flex w-full gap-4 mt-4">
                <button onClick={() => setStep(1)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">Retour</button>
                <button onClick={() => setStep(3)} className="flex-1 bg-[#ff0033] text-white py-3 rounded-lg font-semibold hover:bg-[#e6002a] transition">Étape suivante</button>
              </div>
            </div>
          )}

          {/* Étape 3 : Description */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#0a0a0a]">3. Rédige une description persuasive</h2>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Écris une description..."
                className="w-full bg-[#f5f5f5] text-[#111] border border-gray-200 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#ff0033] min-h-[100px]"
              />
              <div className="flex w-full gap-4 mt-4">
                <button onClick={() => setStep(2)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">Retour</button>
                <button onClick={() => setStep(4)} className="flex-1 bg-[#ff0033] text-white py-3 rounded-lg font-semibold hover:bg-[#e6002a] transition">Étape suivante</button>
              </div>
            </div>
          )}

          {/* Étape 4 : PDF personnalisé */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#0a0a0a]">4. Personnalise ton PDF</h2>
              <input
                type="text"
                name="pdf"
                value={form.pdf}
                onChange={handleChange}
                placeholder="Lien ou nom du PDF..."
                className="w-full bg-[#f5f5f5] text-[#111] border border-gray-200 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#ff0033]"
              />
              <div className="flex w-full gap-4 mt-4">
                <button onClick={() => setStep(3)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">Retour</button>
                <button onClick={() => setStep(5)} className="flex-1 bg-[#ff0033] text-white py-3 rounded-lg font-semibold hover:bg-[#e6002a] transition">Étape suivante</button>
              </div>
            </div>
          )}

          {/* Étape 5 : Simulation de revenus */}
          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#0a0a0a]">5. Simule tes revenus</h2>
              <input
                type="text"
                name="revenu"
                value={form.revenu}
                onChange={handleChange}
                placeholder="Exemple : 1000€/mois, 10 ventes, etc."
                className="w-full bg-[#f5f5f5] text-[#111] border border-gray-200 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#ff0033]"
              />
              <div className="flex w-full gap-4 mt-4">
                <button onClick={() => setStep(4)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">Retour</button>
                <button className="flex-1 bg-[#ff0033] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#e6002a] transition"><Save className="w-5 h-5" /> Sauvegarder</button>
              </div>
              <div className="flex w-full gap-4 mt-4">
                <button className="flex-1 bg-[#111111] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#232323] transition"><Share2 className="w-5 h-5" /> Partager</button>
                <button className="flex-1 bg-[#ff0033] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#e6002a] transition"><Download className="w-5 h-5" /> Exporter</button>
              </div>
            </div>
          )}

          {/* Aide contextuelle IA modernisée */}
          <div className="mt-10 flex items-center gap-3 bg-[#ff0033]/10 border-l-4 border-[#ff0033] text-[#ff0033] p-5 rounded-xl shadow-sm">
            <Info className="w-6 h-6" />
            <span className="text-base font-medium">{help || "Besoin d'aide ? L'assistant IA te guide à chaque étape."}</span>
          </div>
        </div>
      </main>
    </div>
  );
} 