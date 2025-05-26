'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Bot, Code, Settings } from 'lucide-react';

export default function NouvelOutilIAPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    apiEndpoint: '',
    prompt: '',
    parameters: '',
    active: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de création de l'outil IA
    console.log('Création de l\'outil IA:', formData);
    router.push('/admin/outils-ia');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">Nouvel Outil IA</h1>
          <p className="text-gray-400 mt-2">Configurer un nouvel outil d'intelligence artificielle</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-semibold text-white mb-4">
            <Bot className="w-5 h-5 inline mr-2" />
            Informations générales
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nom de l'outil
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                placeholder="Ex: Générateur de Descriptions"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                placeholder="Description de l'outil et de son utilité..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                required
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="generation">Génération de contenu</option>
                <option value="analysis">Analyse</option>
                <option value="optimization">Optimisation</option>
                <option value="design">Design</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-semibold text-white mb-4">
            <Code className="w-5 h-5 inline mr-2" />
            Configuration technique
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Endpoint API
              </label>
              <input
                type="url"
                value={formData.apiEndpoint}
                onChange={(e) => setFormData({...formData, apiEndpoint: e.target.value})}
                className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                placeholder="https://api.openai.com/v1/chat/completions"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Prompt système
              </label>
              <textarea
                value={formData.prompt}
                onChange={(e) => setFormData({...formData, prompt: e.target.value})}
                rows={4}
                className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                placeholder="Tu es un expert en... Ton rôle est de..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Paramètres (JSON)
              </label>
              <textarea
                value={formData.parameters}
                onChange={(e) => setFormData({...formData, parameters: e.target.value})}
                rows={3}
                className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none font-mono text-sm"
                placeholder='{"temperature": 0.7, "max_tokens": 1000}'
              />
            </div>
          </div>
        </div>

        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-semibold text-white mb-4">
            <Settings className="w-5 h-5 inline mr-2" />
            Paramètres
          </h3>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({...formData, active: e.target.checked})}
              className="w-4 h-4 text-[#ff0033] bg-[#1a1a1a] border-[#232323] rounded focus:ring-[#ff0033]"
            />
            <label htmlFor="active" className="text-gray-300">
              Outil actif et disponible pour les utilisateurs
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="bg-[#ff0033] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Créer l'outil
          </button>
        </div>
      </form>
    </div>
  );
} 