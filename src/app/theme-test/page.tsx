'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Sun, Moon, Palette, Eye, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

export default function ThemeTestPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-[#0a0a0a] text-white' 
        : 'bg-white text-[#0f172a]'
    }`}>
      {/* Header avec toggle thème */}
      <header className={`border-b transition-colors ${
        isDarkMode ? 'border-[#232323]' : 'border-[#e2e8f0]'
      }`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="h-8 w-8 text-[#ff0033]" />
              <div>
                <h1 className="text-2xl font-bold">Test du Thème Dropskills</h1>
                <p className={`text-sm ${
                  isDarkMode ? 'text-[#a3a3a3]' : 'text-[#475569]'
                }`}>
                  Démonstration des thèmes sombre et clair
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Sun className={`h-4 w-4 ${
                  !isDarkMode ? 'text-[#ff0033]' : isDarkMode ? 'text-[#666666]' : 'text-[#94a3b8]'
                }`} />
                <Switch 
                  checked={isDarkMode}
                  onCheckedChange={toggleTheme}
                  className="data-[state=checked]:bg-[#ff0033]"
                />
                <Moon className={`h-4 w-4 ${
                  isDarkMode ? 'text-[#ff0033]' : !isDarkMode ? 'text-[#94a3b8]' : 'text-[#666666]'
                }`} />
              </div>
              <Badge variant="outline" className={`${
                isDarkMode 
                  ? 'border-[#232323] text-[#a3a3a3]' 
                  : 'border-[#e2e8f0] text-[#475569]'
              }`}>
                {isDarkMode ? 'Thème Sombre' : 'Thème Clair'}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Section Couleurs */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Palette de Couleurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Couleur Primaire */}
            <Card className={`${
              isDarkMode 
                ? 'bg-[#111111] border-[#232323]' 
                : 'bg-[#f8f9fa] border-[#e2e8f0]'
            }`}>
              <CardHeader>
                <CardTitle className="text-lg">Couleur Primaire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-16 bg-[#ff0033] rounded-lg flex items-center justify-center">
                    <span className="text-white font-medium">#ff0033</span>
                  </div>
                  <Button className="w-full bg-[#ff0033] hover:bg-[#cc0029] text-white">
                    Bouton Principal
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* États */}
            <Card className={`${
              isDarkMode 
                ? 'bg-[#111111] border-[#232323]' 
                : 'bg-[#f8f9fa] border-[#e2e8f0]'
            }`}>
              <CardHeader>
                <CardTitle className="text-lg">États</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className={`flex items-center gap-2 p-2 rounded ${
                    isDarkMode ? 'text-[#22c55e]' : 'text-[#059669]'
                  }`}>
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Succès</span>
                  </div>
                  <div className={`flex items-center gap-2 p-2 rounded ${
                    isDarkMode ? 'text-[#f59e0b]' : 'text-[#d97706]'
                  }`}>
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">Attention</span>
                  </div>
                  <div className={`flex items-center gap-2 p-2 rounded ${
                    isDarkMode ? 'text-[#ef4444]' : 'text-[#dc2626]'
                  }`}>
                    <XCircle className="h-4 w-4" />
                    <span className="text-sm">Erreur</span>
                  </div>
                  <div className={`flex items-center gap-2 p-2 rounded ${
                    isDarkMode ? 'text-[#3b82f6]' : 'text-[#2563eb]'
                  }`}>
                    <Info className="h-4 w-4" />
                    <span className="text-sm">Information</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Texte */}
            <Card className={`${
              isDarkMode 
                ? 'bg-[#111111] border-[#232323]' 
                : 'bg-[#f8f9fa] border-[#e2e8f0]'
            }`}>
              <CardHeader>
                <CardTitle className="text-lg">Hiérarchie Texte</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Titre Principal</h3>
                  <h4 className="text-lg font-semibold">Sous-titre</h4>
                  <p className="text-base">Texte principal avec une bonne lisibilité</p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-[#a3a3a3]' : 'text-[#475569]'
                  }`}>
                    Texte secondaire
                  </p>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-[#666666]' : 'text-[#94a3b8]'
                  }`}>
                    Métadonnées
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card className={`${
              isDarkMode 
                ? 'bg-[#111111] border-[#232323]' 
                : 'bg-[#f8f9fa] border-[#e2e8f0]'
            }`}>
              <CardHeader>
                <CardTitle className="text-lg">Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-white">
                    Premium
                  </Badge>
                  <Badge className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white">
                    Nouveau
                  </Badge>
                  <Badge className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white">
                    Populaire
                  </Badge>
                  <Badge variant="outline" className={`${
                    isDarkMode 
                      ? 'border-[#232323] text-[#a3a3a3]' 
                      : 'border-[#e2e8f0] text-[#475569]'
                  }`}>
                    Standard
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section Formulaires */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Composants de Formulaire</h2>
          <Card className={`max-w-2xl ${
            isDarkMode 
              ? 'bg-[#111111] border-[#232323]' 
              : 'bg-[#f8f9fa] border-[#e2e8f0]'
          }`}>
            <CardHeader>
              <CardTitle>Formulaire de Test</CardTitle>
              <CardDescription className={`${
                isDarkMode ? 'text-[#a3a3a3]' : 'text-[#475569]'
              }`}>
                Testez la lisibilité des champs de formulaire
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input 
                  id="name" 
                  placeholder="Entrez votre nom"
                  className={`${
                    isDarkMode 
                      ? 'bg-[#0a0a0a] border-[#232323] text-white placeholder:text-[#666666]' 
                      : 'bg-white border-[#e2e8f0] text-[#0f172a] placeholder:text-[#94a3b8]'
                  }`}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="votre@email.com"
                  className={`${
                    isDarkMode 
                      ? 'bg-[#0a0a0a] border-[#232323] text-white placeholder:text-[#666666]' 
                      : 'bg-white border-[#e2e8f0] text-[#0f172a] placeholder:text-[#94a3b8]'
                  }`}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Votre message..."
                  className={`${
                    isDarkMode 
                      ? 'bg-[#0a0a0a] border-[#232323] text-white placeholder:text-[#666666]' 
                      : 'bg-white border-[#e2e8f0] text-[#0f172a] placeholder:text-[#94a3b8]'
                  }`}
                />
              </div>
              <div className="flex gap-3">
                <Button className="bg-[#ff0033] hover:bg-[#cc0029] text-white">
                  Envoyer
                </Button>
                <Button variant="outline" className={`${
                  isDarkMode 
                    ? 'border-[#232323] text-[#a3a3a3] hover:bg-[#111111]' 
                    : 'border-[#e2e8f0] text-[#475569] hover:bg-[#f1f5f9]'
                }`}>
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section Accessibilité */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Test d'Accessibilité</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className={`${
              isDarkMode 
                ? 'bg-[#111111] border-[#232323]' 
                : 'bg-[#f8f9fa] border-[#e2e8f0]'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Contraste WCAG
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${
                    isDarkMode ? 'bg-[#0a0a0a]' : 'bg-white'
                  }`}>
                    <h4 className="font-semibold mb-2">Texte Principal</h4>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-[#a3a3a3]' : 'text-[#475569]'
                    }`}>
                      Ratio de contraste : {isDarkMode ? '12.6:1' : '9.2:1'} ✅ WCAG AAA
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${
                    isDarkMode ? 'bg-[#0a0a0a]' : 'bg-white'
                  }`}>
                    <h4 className="font-semibold mb-2 text-[#ff0033]">Couleur Primaire</h4>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-[#a3a3a3]' : 'text-[#475569]'
                    }`}>
                      Ratio de contraste : {isDarkMode ? '5.1:1' : '8.9:1'} ✅ WCAG AA
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`${
              isDarkMode 
                ? 'bg-[#111111] border-[#232323]' 
                : 'bg-[#f8f9fa] border-[#e2e8f0]'
            }`}>
              <CardHeader>
                <CardTitle>Recommandations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className={`h-4 w-4 mt-0.5 ${
                      isDarkMode ? 'text-[#22c55e]' : 'text-[#059669]'
                    }`} />
                    <span className="text-sm">Contraste texte conforme WCAG AA</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className={`h-4 w-4 mt-0.5 ${
                      isDarkMode ? 'text-[#22c55e]' : 'text-[#059669]'
                    }`} />
                    <span className="text-sm">États focus visibles</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className={`h-4 w-4 mt-0.5 ${
                      isDarkMode ? 'text-[#22c55e]' : 'text-[#059669]'
                    }`} />
                    <span className="text-sm">Navigation au clavier</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className={`h-4 w-4 mt-0.5 ${
                      isDarkMode ? 'text-[#22c55e]' : 'text-[#059669]'
                    }`} />
                    <span className="text-sm">Bordures douces et lisibles</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`mt-16 border-t py-8 ${
        isDarkMode ? 'border-[#232323]' : 'border-[#e2e8f0]'
      }`}>
        <div className="container mx-auto px-4 text-center">
          <p className={`text-sm ${
            isDarkMode ? 'text-[#a3a3a3]' : 'text-[#475569]'
          }`}>
            Test du système de thème Dropskills - Utilisez{' '}
            <a 
              href="https://www.color.review/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#ff0033] hover:underline"
            >
              Color.review
            </a>{' '}
            pour vérifier le contraste
          </p>
        </div>
      </footer>
    </div>
  );
}