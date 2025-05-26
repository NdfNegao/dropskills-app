'use client';

import { useState } from 'react';
import Sidebar from '../../../components/Sidebar';
import { FileCode, Upload, Palette, Type, Image, Download } from 'lucide-react';

type CustomizationOptions = {
  title: string;
  author: string;
  primaryColor: string;
  logo?: File;
};

export default function PDFRebrander() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customization, setCustomization] = useState<CustomizationOptions>({
    title: '',
    author: '',
    primaryColor: '#ff0033',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Gérer le téléchargement du fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    }
  };

  // Gérer le téléchargement du logo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setCustomization(prev => ({ ...prev, logo: file }));
    }
  };

  // Gérer les changements dans les options
  const handleCustomizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomization(prev => ({ ...prev, [name]: value }));
  };

  // Simuler le processus de rebranding
  const handleRebranding = () => {
    setIsProcessing(true);
    // Ici, nous ajouterions la logique réelle de rebranding
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Bannière promotionnelle */}
      <div className="bg-[#ff0033] text-white text-center py-2 text-sm">
        🎉 Offre de lancement 2025 ➜ -50% sur le Plan Pro
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Contenu principal */}
      <main className="ml-64 p-8">
        {/* En-tête */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <FileCode className="text-[#ff0033] w-8 h-8" />
            <h1 className="text-4xl font-bold text-white">PDF Rebrander</h1>
          </div>
          <p className="text-xl text-gray-400">Personnalisez vos PDFs avec votre marque en quelques clics</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Section de téléchargement */}
          <div className="bg-[#111111] rounded-xl p-6">
            <h2 className="text-white text-xl font-semibold mb-6">1. Téléchargez votre PDF</h2>
            
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-[#ff0033] transition-colors">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="pdf-upload"
              />
              <label 
                htmlFor="pdf-upload"
                className="cursor-pointer"
              >
                <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">
                  {selectedFile ? selectedFile.name : 'Glissez votre PDF ici ou cliquez pour parcourir'}
                </p>
                <p className="text-gray-500 text-sm">Format accepté : PDF (max 10MB)</p>
              </label>
            </div>
          </div>

          {/* Section de personnalisation */}
          <div className="bg-[#111111] rounded-xl p-6">
            <h2 className="text-white text-xl font-semibold mb-6">2. Personnalisez votre marque</h2>
            
            <div className="space-y-4">
              {/* Titre */}
              <div>
                <label className="block text-gray-400 mb-2">Titre du document</label>
                <div className="flex items-center bg-[#1a1a1a] rounded-lg px-4 py-2">
                  <Type className="text-gray-500 w-5 h-5 mr-2" />
                  <input
                    type="text"
                    name="title"
                    value={customization.title}
                    onChange={handleCustomizationChange}
                    placeholder="Mon super ebook"
                    className="bg-transparent text-white w-full focus:outline-none"
                  />
                </div>
              </div>

              {/* Auteur */}
              <div>
                <label className="block text-gray-400 mb-2">Nom de l'auteur</label>
                <div className="flex items-center bg-[#1a1a1a] rounded-lg px-4 py-2">
                  <Type className="text-gray-500 w-5 h-5 mr-2" />
                  <input
                    type="text"
                    name="author"
                    value={customization.author}
                    onChange={handleCustomizationChange}
                    placeholder="John Doe"
                    className="bg-transparent text-white w-full focus:outline-none"
                  />
                </div>
              </div>

              {/* Couleur principale */}
              <div>
                <label className="block text-gray-400 mb-2">Couleur principale</label>
                <div className="flex items-center bg-[#1a1a1a] rounded-lg px-4 py-2">
                  <Palette className="text-gray-500 w-5 h-5 mr-2" />
                  <input
                    type="color"
                    name="primaryColor"
                    value={customization.primaryColor}
                    onChange={handleCustomizationChange}
                    className="bg-transparent w-full h-8"
                  />
                </div>
              </div>

              {/* Logo */}
              <div>
                <label className="block text-gray-400 mb-2">Logo (optionnel)</label>
                <div className="flex items-center bg-[#1a1a1a] rounded-lg px-4 py-2">
                  <Image className="text-gray-500 w-5 h-5 mr-2" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="text-gray-400 text-sm w-full focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#ff0033] file:text-white hover:file:bg-[#cc0029]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section de génération */}
        <div className="mt-8 bg-[#111111] rounded-xl p-6">
          <h2 className="text-white text-xl font-semibold mb-6">3. Générez votre PDF personnalisé</h2>
          
          <div className="flex items-center justify-between">
            <p className="text-gray-400">
              {selectedFile ? 'Votre PDF est prêt à être personnalisé !' : 'Téléchargez d\'abord votre PDF'}
            </p>
            <button
              onClick={handleRebranding}
              disabled={!selectedFile || isProcessing}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                !selectedFile || isProcessing
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-[#ff0033] text-white hover:bg-[#cc0029]'
              }`}
            >
              <Download className="w-5 h-5" />
              {isProcessing ? 'Génération en cours...' : 'Générer le PDF'}
            </button>
          </div>
        </div>

        {/* Section Pro */}
        <div className="mt-12 bg-gradient-to-r from-[#ff0033] to-[#cc0029] rounded-xl p-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Passez à la Version Pro</h2>
              <p className="text-white/80">Personnalisez en masse et accédez à plus d'options de personnalisation.</p>
            </div>
            <button className="bg-white text-[#ff0033] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Débloquer les Options Pro
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 