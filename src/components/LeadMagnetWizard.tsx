'use client';

import React from 'react';
import { Gift, Target, FileText, Palette, CheckCircle } from 'lucide-react';
import StepWizard, { WizardStep } from './StepWizard';
import LeadMagnetContextStep from './lead-magnet-steps/LeadMagnetContextStep';
import LeadMagnetContentStep from './lead-magnet-steps/LeadMagnetContentStep';
import LeadMagnetFormatStep from './lead-magnet-steps/LeadMagnetFormatStep';
import LeadMagnetSummaryStep from './lead-magnet-steps/LeadMagnetSummaryStep';

export interface LeadMagnetFormData {
  business: string;
  audience: string;
  problem: string;
  solution: string;
  format: string;
  tone: string;
  title?: string;
  description?: string;
}

interface LeadMagnetWizardProps {
  onComplete: (data: LeadMagnetFormData) => void;
  isLoading: boolean;
  initialData?: Partial<LeadMagnetFormData>;
}

export function LeadMagnetWizard({ onComplete, isLoading, initialData = {} }: LeadMagnetWizardProps) {
  const steps: WizardStep[] = [
    {
      id: 'context',
      title: 'Contexte Business',
      description: 'Définissez votre business et votre audience cible',
      icon: Target,
      component: LeadMagnetContextStep,
      validation: (data: LeadMagnetFormData) => {
        const errors: Record<string, string> = {};
        
        if (!data.business?.trim()) {
          errors.business = 'Le secteur d\'activité est requis';
        } else if (data.business.trim().length < 10) {
          errors.business = 'Veuillez fournir une description plus détaillée (minimum 10 caractères)';
        }
        
        if (!data.audience?.trim()) {
          errors.audience = 'L\'audience cible est requise';
        } else if (data.audience.trim().length < 10) {
          errors.audience = 'Veuillez décrire plus précisément votre audience (minimum 10 caractères)';
        }
        
        return {
          isValid: Object.keys(errors).length === 0,
          errors
        };
      }
    },
    {
      id: 'content',
      title: 'Contenu & Solution',
      description: 'Définissez le problème à résoudre et votre solution',
      icon: FileText,
      component: LeadMagnetContentStep,
      validation: (data: LeadMagnetFormData) => {
        const errors: Record<string, string> = {};
        
        if (!data.problem?.trim()) {
          errors.problem = 'Le problème principal est requis';
        } else if (data.problem.trim().length < 15) {
          errors.problem = 'Veuillez détailler davantage le problème (minimum 15 caractères)';
        }
        
        if (!data.solution?.trim()) {
          errors.solution = 'La solution proposée est requise';
        } else if (data.solution.trim().length < 10) {
          errors.solution = 'Veuillez détailler votre solution (minimum 10 caractères)';
        }
        
        return {
          isValid: Object.keys(errors).length === 0,
          errors
        };
      }
    },
    {
      id: 'format',
      title: 'Format & Style',
      description: 'Choisissez le format et le ton de votre lead magnet',
      icon: Palette,
      component: LeadMagnetFormatStep,
      validation: (data: LeadMagnetFormData) => {
        const errors: Record<string, string> = {};
        
        if (!data.format?.trim()) {
          errors.format = 'Le format est requis';
        }
        
        if (!data.tone?.trim()) {
          errors.tone = 'Le ton de communication est requis';
        }
        
        return {
          isValid: Object.keys(errors).length === 0,
          errors
        };
      }
    },
    {
      id: 'summary',
      title: 'Récapitulatif',
      description: 'Vérifiez vos informations avant génération',
      icon: CheckCircle,
      component: LeadMagnetSummaryStep,
      validation: () => ({ isValid: true, errors: {} })
    }
  ];

  return (
    <StepWizard
      steps={steps}
      onComplete={onComplete}
      isLoading={isLoading}
      title="Lead Magnet Creator avec Dropskills AI"
      description="Créez votre lead magnet irrésistible en quelques étapes"
      toolId="lead-magnet"
      initialData={{
        business: '',
        audience: '',
        problem: '',
        solution: '',
        format: 'ebook',
        tone: 'professionnel',
        ...initialData
      }}
      className="max-w-4xl mx-auto"
    />
  );
}

export default LeadMagnetWizard;