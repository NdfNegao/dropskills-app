'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Upload, Tag, DollarSign } from 'lucide-react';

export default function NouveauPackPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    tags: '',
    file: null as File | null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de création du pack
    console.log('Création du pack:', formData);
    router.push('/admin/packs');
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
          <h1 className="text-3xl font-bold text-white">Nouveau Pack</h1>
          <p className="text-gray-400 mt-2">Créer un nouveau pack digital</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-semibold text-white mb-4">Informations générales</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Titre du pack
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                placeholder="Ex: Pack Business Complet"
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
                rows={4}
                className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                placeholder="Description détaillée du pack..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Prix (€)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                  placeholder="29.99"
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
                  <option value="business">Business</option>
                  <option value="marketing">Marketing</option>
                  <option value="design">Design</option>
                  <option value="formation">Formation</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Tags (séparés par des virgules)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                placeholder="business, marketing, startup"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <h3 className="text-lg font-semibold text-white mb-4">Fichier du pack</h3>
          
          <div className="border-2 border-dashed border-[#232323] rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">Glissez-déposez votre fichier ici ou cliquez pour sélectionner</p>
            <input
              type="file"
              accept=".zip,.pdf,.rar"
              onChange={(e) => setFormData({...formData, file: e.target.files?.[0] || null})}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block bg-[#232323] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#333] transition-colors"
            >
              Sélectionner un fichier
            </label>
            {formData.file && (
              <p className="text-green-400 mt-2">Fichier sélectionné: {formData.file.name}</p>
            )}
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
            Créer le pack
          </button>
        </div>
      </form>
    </div>
  );
} 