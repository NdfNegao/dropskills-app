'use client';

import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { 
  Palette, 
  Upload, 
  Download, 
  FileText, 
  Settings, 
  Sparkles,
  TrendingUp,
  Users,
  CheckCircle,
  Lightbulb,
  Zap
} from 'lucide-react';

function PDFRebranderContent() {
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

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">


        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-orange-400" />
              <div>
                <p className="text-white font-semibold">2,847</p>
                <p className="text-gray-400 text-sm">PDFs rebrandés</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-white font-semibold">+45%</p>
                <p className="text-gray-400 text-sm">Reconnaissance de marque</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-white font-semibold">892</p>
                <p className="text-gray-400 text-sm">Utilisateurs actifs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Conseils */}
        <div className="mb-8 bg-orange-900/20 border border-orange-500/30 rounded-xl p-6">
          <h3 className="text-orange-400 font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            💡 Conseils pour un rebranding efficace
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-orange-300 text-sm">
            <div>
              <h4 className="font-medium mb-3 text-orange-200">✨ Préparation optimale</h4>
              <ul className="space-y-2 text-orange-300">
                <li>• <strong>Logo haute qualité :</strong> Utilisez un format PNG avec fond transparent</li>
                <li>• <strong>Couleurs cohérentes :</strong> Respectez votre charte graphique</li>
                <li>• <strong>PDF source :</strong> Privilégiez des fichiers de bonne qualité</li>
                <li>• <strong>Informations complètes :</strong> Préparez nom, site web et coordonnées</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-orange-200">🎯 Utilisation stratégique</h4>
              <ul className="space-y-2 text-orange-300">
                <li>• <strong>Lead magnets :</strong> Rebrandez vos guides et ebooks gratuits</li>
                <li>• <strong>Formations :</strong> Personnalisez vos supports de cours</li>
                <li>• <strong>Rapports :</strong> Ajoutez votre marque aux études et analyses</li>
                <li>• <strong>Cohérence :</strong> Gardez le même style sur tous vos documents</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload et paramètres */}
          <div className="space-y-6">
            {/* Upload de fichier */}
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Upload className="w-5 h-5 text-orange-400" />
                Fichier PDF
              </h2>
              
              <div className="border-2 border-dashed border-[#333] rounded-lg p-8 text-center hover:border-[#00D2FF] transition-colors">
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
                        className="inline-block bg-[#1a1a1a] text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-[#333] transition-colors border border-[#333]"
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
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-400" />
                Paramètres de marque
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Couleur principale
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                      className="w-12 h-10 rounded border border-[#333] bg-[#1a1a1a]"
                    />
                    <input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                      className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#00D2FF] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Couleur secondaire
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                      className="w-12 h-10 rounded border border-[#333] bg-[#1a1a1a]"
                    />
                    <input
                      type="text"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                      className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#00D2FF] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Nom de l'entreprise
                  </label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                    placeholder="Ex: Mon Entreprise"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Site web
                  </label>
                  <input
                    type="url"
                    value={settings.website}
                    onChange={(e) => setSettings({...settings, website: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                    placeholder="https://monsite.com"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    URL du logo
                  </label>
                  <input
                    type="url"
                    value={settings.logoUrl}
                    onChange={(e) => setSettings({...settings, logoUrl: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                    placeholder="https://monsite.com/logo.png"
                  />
                </div>

                <button
                  onClick={handleProcess}
                  disabled={!file || isProcessing}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Rebrander le PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Résultats et aperçu */}
          <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-400" />
              Résultat
            </h2>

            {!processedFile ? (
              <div className="text-center py-12">
                <Palette className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">
                  Uploadez un PDF et configurez vos paramètres de marque pour commencer
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>✨ Ajout automatique de votre logo</p>
                  <p>🎨 Application de vos couleurs de marque</p>
                  <p>📝 Insertion de vos informations d'entreprise</p>
                  <p>⚡ Traitement rapide et sécurisé</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <h3 className="text-white font-semibold">PDF rebrandé avec succès !</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Fichier original :</span>
                      <span className="text-white">{file?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Fichier rebrandé :</span>
                      <span className="text-white">{processedFile}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Couleur principale :</span>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded border border-gray-600"
                          style={{ backgroundColor: settings.primaryColor }}
                        ></div>
                        <span className="text-white">{settings.primaryColor}</span>
                      </div>
                    </div>
                    {settings.companyName && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Entreprise :</span>
                        <span className="text-white">{settings.companyName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    // Simulation du téléchargement
                    const link = document.createElement('a');
                    link.href = '#';
                    link.download = processedFile || 'rebranded.pdf';
                    link.click();
                  }}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Télécharger le PDF rebrandé
                </button>

                <button
                  onClick={() => {
                    setProcessedFile(null);
                    setFile(null);
                  }}
                  className="w-full bg-[#1a1a1a] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#333] transition-colors border border-[#333]"
                >
                  Rebrander un autre PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
}

export default function PDFRebranderPage() {
  return (
    <ToolLayout toolId="pdf-rebrander">
      <PDFRebranderContent />
    </ToolLayout>
  );
}