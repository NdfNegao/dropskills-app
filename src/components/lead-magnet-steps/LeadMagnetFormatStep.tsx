'use client';

import React from 'react';
import { FileText, CheckCircle, Copy, Download, Users, Video, HelpCircle } from 'lucide-react';
import { LeadMagnetFormData } from '../LeadMagnetWizard';

interface LeadMagnetFormatStepProps {
  data: LeadMagnetFormData;
  onChange: (updates: Partial<LeadMagnetFormData>) => void;
  errors: Record<string, string>;
  isActive: boolean;
}

export function LeadMagnetFormatStep({ data, onChange, errors }: LeadMagnetFormatStepProps) {
  const handleInputChange = (field: keyof LeadMagnetFormData, value: string) => {
    onChange({ [field]: value });
  };

  const formats = [
    { 
      id: 'ebook', 
      label: 'E-book', 
      icon: <FileText className="w-4 h-4" />,
      description: 'Guide complet et détaillé'
    },
    { 
      id: 'checklist', 
      label: 'Checklist', 
      icon: <CheckCircle className="w-4 h-4" />,
      description: 'Liste d\'actions concrètes'
    },
    { 
      id: 'template', 
      label: 'Template', 
      icon: <Copy className="w-4 h-4" />,
      description: 'Modèle prêt à utiliser'
    },
    { 
      id: 'guide', 
      label: 'Guide PDF', 
      icon: <Download className="w-4 h-4" />,
      description: 'Guide pratique étape par étape'
    },
    { 
      id: 'webinar', 
      label: 'Webinaire', 
      icon: <Users className="w-4 h-4" />,
      description: 'Formation vidéo interactive'
    },
    { 
      id: 'video', 
      label: 'Série Vidéo', 
      icon: <Video className="w-4 h-4" />,
      description: 'Contenu vidéo éducatif'
    }
  ];

  const tones = [
    { 
      id: 'professionnel', 
      label: 'Professionnel',
      description: 'Ton sérieux et expert'
    },
    { 
      id: 'amical', 
      label: 'Amical',
      description: 'Ton décontracté et proche'
    },
    { 
      id: 'expert', 
      label: 'Expert',
      description: 'Ton technique et autoritaire'
    },
    { 
      id: 'accessible', 
      label: 'Accessible',
      description: 'Ton simple et pédagogique'
    },
    { 
      id: 'inspirant', 
      label: 'Inspirant',
      description: 'Ton motivant et énergique'
    },
    { 
      id: 'educatif', 
      label: 'Éducatif',
      description: 'Ton informatif et structuré'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Format du lead magnet */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <FileText className="w-4 h-4" />
          Format du lead magnet
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
              Choisissez le format le plus adapté à votre audience
            </div>
          </div>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {formats.map((format) => (
            <button
              key={format.id}
              onClick={() => handleInputChange('format', format.id)}
              className={`
                p-4 rounded-lg border transition-all text-left
                ${data.format === format.id
                  ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                  : 'bg-[#1a1a1a] border-[#232323] text-gray-300 hover:border-blue-500/50 hover:bg-blue-500/5'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                {format.icon}
                <span className="font-medium text-sm">{format.label}</span>
              </div>
              <p className="text-xs opacity-75">{format.description}</p>
            </button>
          ))}
        </div>
        {errors.format && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.format}
          </p>
        )}
      </div>

      {/* Ton de communication */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <Users className="w-4 h-4" />
          Ton de communication
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
            <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
              Quel style correspond le mieux à votre marque ?
            </div>
          </div>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {tones.map((tone) => (
            <button
              key={tone.id}
              onClick={() => handleInputChange('tone', tone.id)}
              className={`
                p-4 rounded-lg border transition-all text-left
                ${data.tone === tone.id
                  ? 'bg-green-500/20 border-green-500 text-green-300'
                  : 'bg-[#1a1a1a] border-[#232323] text-gray-300 hover:border-green-500/50 hover:bg-green-500/5'
                }
              `}
            >
              <div className="font-medium text-sm mb-1">{tone.label}</div>
              <p className="text-xs opacity-75">{tone.description}</p>
            </button>
          ))}
        </div>
        {errors.tone && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.tone}
          </p>
        )}
      </div>

      {/* Bloc conseil */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
          <div>
            <h4 className="text-blue-400 font-medium mb-1">Conseil Dropskills AI</h4>
            <p className="text-blue-300 text-sm leading-relaxed mb-3">
              Le format et le ton doivent correspondre aux préférences de votre audience. 
              Les entrepreneurs préfèrent souvent des checklists et guides pratiques, 
              tandis que les créatifs apprécient les contenus visuels et inspirants.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <strong className="text-blue-200">📊 Formats populaires :</strong>
                <ul className="mt-1 space-y-1 text-blue-300">
                  <li>• E-books : 73% de taux de téléchargement</li>
                  <li>• Checklists : 68% d'engagement</li>
                  <li>• Templates : 61% d'utilisation</li>
                </ul>
              </div>
              <div>
                <strong className="text-blue-200">🎯 Conseils ton :</strong>
                <ul className="mt-1 space-y-1 text-blue-300">
                  <li>• B2B : Professionnel ou Expert</li>
                  <li>• B2C : Amical ou Accessible</li>
                  <li>• Formation : Éducatif ou Inspirant</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadMagnetFormatStep;