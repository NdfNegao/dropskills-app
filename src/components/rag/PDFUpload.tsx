'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface UploadResult {
  success: boolean;
  data?: {
    id: string;
    title: string;
    detectedLanguage: string;
    wasTranslated: boolean;
    textLength: number;
    tags: string[];
  };
  message?: string;
  error?: string;
}

interface PDFUploadProps {
  onUploadSuccess?: (result: UploadResult['data']) => void;
}

export default function PDFUpload({ onUploadSuccess }: PDFUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Métadonnées du document
  const [title, setTitle] = useState('');
  const [sourceType, setSourceType] = useState('document');
  const [sourceUrl, setSourceUrl] = useState('');
  const [tags, setTags] = useState('');
  const [autoTranslate, setAutoTranslate] = useState(true);

  // Gestion du drag & drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      setSelectedFile(pdfFile);
      if (!title) {
        // Générer un titre basé sur le nom du fichier
        const fileName = pdfFile.name.replace(/\.pdf$/i, '');
        setTitle(fileName.replace(/[_-]/g, ' '));
      }
    } else {
      toast.error('Veuillez sélectionner un fichier PDF');
    }
  }, [title]);

  // Gestion de la sélection de fichier
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      if (!title) {
        const fileName = file.name.replace(/\.pdf$/i, '');
        setTitle(fileName.replace(/[_-]/g, ' '));
      }
    } else {
      toast.error('Veuillez sélectionner un fichier PDF');
    }
  }, [title]);

  // Supprimer le fichier sélectionné
  const removeFile = useCallback(() => {
    setSelectedFile(null);
    setUploadProgress(0);
  }, []);

  // Upload du fichier
  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      toast.error('Veuillez sélectionner un fichier et saisir un titre');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', title.trim());
      formData.append('sourceType', sourceType);
      formData.append('sourceUrl', sourceUrl);
      formData.append('tags', tags);
      formData.append('autoTranslate', autoTranslate.toString());

      // Simuler le progrès
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/rag/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result: UploadResult = await response.json();

      if (result.success && result.data) {
        toast.success(result.message || 'PDF uploadé avec succès!');
        
        // Réinitialiser le formulaire
        setSelectedFile(null);
        setTitle('');
        setSourceUrl('');
        setTags('');
        setUploadProgress(0);
        
        // Callback de succès
        onUploadSuccess?.(result.data);
      } else {
        toast.error(result.error || 'Erreur lors de l\'upload');
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error('Erreur lors de l\'upload du PDF');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Zone de drop */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : selectedFile 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <FileText className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-medium text-green-800">{selectedFile.name}</p>
                <p className="text-sm text-green-600">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Upload en cours... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="h-12 w-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-lg font-medium text-gray-700">
                Glissez-déposez votre PDF ici
              </p>
              <p className="text-sm text-gray-500">
                ou cliquez pour sélectionner un fichier
              </p>
            </div>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="pdf-upload"
            />
            <Label htmlFor="pdf-upload">
              <Button variant="outline" className="cursor-pointer">
                Sélectionner un PDF
              </Button>
            </Label>
          </div>
        )}
      </div>

      {/* Métadonnées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre du document"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sourceType">Type de source</Label>
          <Select value={sourceType} onValueChange={setSourceType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="guide">Guide</SelectItem>
              <SelectItem value="faq">FAQ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sourceUrl">URL source (optionnel)</Label>
          <Input
            id="sourceUrl"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="https://..."
            type="url"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
          <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="formation, technique, guide"
          />
        </div>
      </div>

      {/* Options de traduction */}
      <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
        <Switch
          id="autoTranslate"
          checked={autoTranslate}
          onCheckedChange={setAutoTranslate}
        />
        <div className="flex-1">
          <Label htmlFor="autoTranslate" className="font-medium">
            Traduction automatique
          </Label>
          <p className="text-sm text-gray-600">
            Traduire automatiquement les documents anglais en français
          </p>
        </div>
      </div>

      {/* Bouton d'upload */}
      <div className="flex justify-end">
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !title.trim() || isUploading}
          className="min-w-[120px]"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Upload...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Uploader
            </>
          )}
        </Button>
      </div>
    </div>
  );
}