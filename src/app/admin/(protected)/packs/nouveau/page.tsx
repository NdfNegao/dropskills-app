'use client';

import { useState } from 'react';
import { ArrowLeft, Save, Upload, DollarSign } from 'lucide-react';

export default function NouveauPack() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    format: '',
    files: null as File[] | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nouveau pack:', formData);
    // Logique de création du pack
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({...formData, files: Array.from(e.target.files)});
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Créer un nouveau pack</h1>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium mb-2">Titre du pack</label>
            <input
              type="text"
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 focus:outline-none focus:border-[#ff0033]"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Ex: Pack Marketing Digital 2025"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 h-32 focus:outline-none focus:border-[#ff0033]"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Décrivez le contenu et les bénéfices de ce pack..."
              required
            />
          </div>

          {/* Prix et Catégorie */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Prix (€)
              </label>
              <input
                type="number"
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 focus:outline-none focus:border-[#ff0033]"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="29.99"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Catégorie</label>
              <select
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 focus:outline-none focus:border-[#ff0033]"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="marketing-digital">Marketing Digital</option>
                <option value="entrepreneuriat">Entrepreneuriat</option>
                <option value="productivite">Productivité</option>
                <option value="ia">Intelligence Artificielle</option>
                <option value="vente">Vente & Négociation</option>
              </select>
            </div>
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-medium mb-2">Format</label>
            <select
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 focus:outline-none focus:border-[#ff0033]"
              value={formData.format}
              onChange={(e) => setFormData({...formData, format: e.target.value})}
              required
            >
              <option value="">Sélectionner un format</option>
              <option value="ebook">E-book</option>
              <option value="video">Vidéo</option>
              <option value="audio">Audio</option>
              <option value="template">Template</option>
              <option value="tool">Outil</option>
            </select>
          </div>

          {/* Upload de fichiers */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Upload className="w-4 h-4 inline mr-1" />
              Fichiers du pack
            </label>
            <input
              type="file"
              multiple
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 focus:outline-none focus:border-[#ff0033]"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.zip,.mp4,.mp3,.png,.jpg,.jpeg"
            />
            <p className="text-sm text-gray-400 mt-2">
              Formats acceptés: PDF, DOC, ZIP, MP4, MP3, images
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              className="px-6 py-3 border border-[#333] rounded-lg hover:bg-[#1a1a1a] transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#ff0033] hover:bg-red-600 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Créer le pack
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 