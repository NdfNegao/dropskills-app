'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Palette, Upload, Download, ArrowLeft, FileText, Settings } from 'lucide-react';

export default function PDFRebranderPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [settings, setSettings] = useState({
    primaryColor: '#ff0033',
    secondaryColor: '#111111',
    logoUrl: '',
    companyName: '',
    website: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile);
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    
    // Simulation du traitement
    setTimeout(() => {
      setProcessedFile(`${file.name.replace('.pdf', '')}_rebranded.pdf`);
      setIsProcessing(false);
    }, 3000);
  };

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      
      <main className="ml-0 md:ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-400 hover:text-[#ff0033] transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux outils
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Rebranding PDF</h1>
                <p className="text-gray-400">Personnalisez vos PDFs avec votre marque</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload et paramètres */}
            <div className="space-y-6">
              {/* Upload de fichier */}
              <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
                <h3 className="text-lg font-semibold text-white mb-4">
                  <Upload className="w-5 h-5 inline mr-2" />
                  Fichier PDF
                </h3>
                
                <div className="border-2 border-dashed border-[#232323] rounded-lg p-8 text-center">
                  {file ? (
                    <div className="space-y-4">
                      <FileText className="w-12 h-12 text-green-400 mx-auto" />
                      <div>
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-gray-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button
                        onClick={() => setFile(null)}
                        className="text-[#ff0033] hover:text-[#cc0029] transition-colors"
                      >
                        Changer de fichier
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-gray-400 mb-2">Glissez-déposez votre PDF ici ou cliquez pour sélectionner</p>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="pdf-upload"
                        />
                        <label
                          htmlFor="pdf-upload"
                          className="inline-block bg-[#232323] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#333] transition-colors"
                        >
                          Sélectionner un PDF
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Paramètres de branding */}
              <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
                <h3 className="text-lg font-semibold text-white mb-4">
                  <Settings className="w-5 h-5 inline mr-2" />
                  Paramètres de marque
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Couleur principale
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                        className="w-12 h-10 rounded border border-[#232323] bg-[#1a1a1a]"
                      />
                      <input
                        type="text"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                        className="flex-1 bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Couleur secondaire
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                        className="w-12 h-10 rounded border border-[#232323] bg-[#1a1a1a]"
                      />
                      <input
                        type="text"
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                        className="flex-1 bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nom de l'entreprise
                    </label>
                    <input
                      type="text"
                      value={settings.companyName}
                      onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                      className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                      placeholder="Ex: Mon Entreprise"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Site web
                    </label>
                    <input
                      type="url"
                      value={settings.website}
                      onChange={(e) => setSettings({...settings, website: e.target.value})}
                      className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                      placeholder="https://monsite.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      URL du logo
                    </label>
                    <input
                      type="url"
                      value={settings.logoUrl}
                      onChange={(e) => setSettings({...settings, logoUrl: e.target.value})}
                      className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
                      placeholder="https://monsite.com/logo.png"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Aperçu et traitement */}
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <h3 className="text-lg font-semibold text-white mb-4">Aperçu et traitement</h3>
              
              {file ? (
                <div className="space-y-6">
                  {/* Aperçu des couleurs */}
                  <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#232323]">
                    <h4 className="text-white font-medium mb-3">Aperçu des couleurs</h4>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded border border-[#232323]"
                          style={{ backgroundColor: settings.primaryColor }}
                        ></div>
                        <span className="text-gray-300 text-sm">Principale</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded border border-[#232323]"
                          style={{ backgroundColor: settings.secondaryColor }}
                        ></div>
                        <span className="text-gray-300 text-sm">Secondaire</span>
                      </div>
                    </div>
                  </div>

                  {/* Informations de branding */}
                  {(settings.companyName || settings.website) && (
                    <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#232323]">
                      <h4 className="text-white font-medium mb-3">Informations ajoutées</h4>
                      <div className="space-y-2 text-sm">
                        {settings.companyName && (
                          <p className="text-gray-300">Entreprise: {settings.companyName}</p>
                        )}
                        {settings.website && (
                          <p className="text-gray-300">Site: {settings.website}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Bouton de traitement */}
                  <button
                    onClick={handleProcess}
                    disabled={isProcessing}
                    className="w-full bg-[#ff0033] text-white py-3 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Traitement en cours...
                      </>
                    ) : (
                      <>
                        <Palette className="w-4 h-4" />
                        Appliquer le rebranding
                      </>
                    )}
                  </button>

                  {/* Résultat */}
                  {processedFile && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-400 font-medium">PDF traité avec succès !</p>
                          <p className="text-gray-300 text-sm">{processedFile}</p>
                        </div>
                        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Télécharger
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-[#1a1a1a] rounded-lg p-8 border border-[#232323] text-center">
                  <Palette className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Uploadez un fichier PDF pour commencer le rebranding
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 