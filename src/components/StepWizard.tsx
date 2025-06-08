'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Sparkles,
  Brain
} from 'lucide-react';
import AILoadingLogs from './AILoadingLogs';

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
  validation?: (data: any) => { isValid: boolean; errors: Record<string, string> };
  isOptional?: boolean;
}

export interface StepWizardProps {
  steps: WizardStep[];
  onComplete: (data: any) => void;
  onStepChange?: (stepIndex: number, data: any) => void;
  isLoading?: boolean;
  title: string;
  description: string;
  initialData?: any;
  className?: string;
}

function StepWizard({
  steps,
  onComplete,
  onStepChange,
  isLoading = false,
  title,
  description,
  initialData = {},
  className = ''
}: StepWizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [stepHistory, setStepHistory] = useState<number[]>([0]);
  const [showLogs, setShowLogs] = useState(false);

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  useEffect(() => {
    onStepChange?.(currentStepIndex, formData);
  }, [currentStepIndex, formData, onStepChange]);

  useEffect(() => {
    if (!isLoading && showLogs) {
      // Masquer les logs après un délai quand le chargement se termine
      const timer = setTimeout(() => {
        setShowLogs(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isLoading, showLogs]);

  const validateCurrentStep = (): boolean => {
    if (!currentStep?.validation) return true;
    
    const validation = currentStep.validation(formData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCompletedSteps(prev => new Set([...prev, currentStepIndex]));
      
      if (isLastStep) {
        setShowLogs(true);
        onComplete(formData);
      } else {
        const nextStepIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextStepIndex);
        setStepHistory(prev => [...prev, nextStepIndex]);
      }
    }
  };

  const handlePrevious = () => {
    if (stepHistory.length > 1) {
      const newHistory = stepHistory.slice(0, -1);
      const previousStepIndex = newHistory[newHistory.length - 1];
      setStepHistory(newHistory);
      if (previousStepIndex !== undefined) {
        setCurrentStepIndex(previousStepIndex);
      }
      setErrors({});
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (completedSteps.has(stepIndex) || stepIndex <= currentStepIndex) {
      setCurrentStepIndex(stepIndex);
      setStepHistory(prev => [...prev, stepIndex]);
      setErrors({});
    }
  };

  const updateFormData = (updates: any) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear errors when user updates data
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  };

  return (
    <div className={`bg-[#111111] rounded-xl border border-[#232323] ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-[#232323]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
            <Brain className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-gray-400">{description}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">
              Étape {currentStepIndex + 1} sur {steps.length}
            </span>
            <span className="text-gray-400">
              {Math.round(progress)}% complété
            </span>
          </div>
          <div className="w-full bg-[#232323] rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Steps Navigation */}
      <div className="p-6 border-b border-[#232323]">
        <div className="flex justify-between items-center overflow-x-auto pb-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStepIndex === index;
            const isCompleted = completedSteps.has(index);
            const isAccessible = completedSteps.has(index) || index <= currentStepIndex;
            
            return (
              <div key={step.id} className="flex flex-col items-center min-w-0 flex-1">
                <button
                  onClick={() => handleStepClick(index)}
                  disabled={!isAccessible}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                      : isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isAccessible
                      ? 'bg-[#232323] text-gray-400 hover:bg-[#333333]'
                      : 'bg-[#1a1a1a] text-gray-600 cursor-not-allowed'
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </button>
                <span className={`
                  text-xs mt-2 text-center px-1 leading-tight
                  ${isActive ? 'text-white font-medium' : 'text-gray-500'}
                `}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`
                    hidden md:block absolute top-6 left-1/2 w-full h-0.5 -z-10
                    ${isCompleted ? 'bg-green-500' : 'bg-[#232323]'}
                  `} style={{ transform: 'translateX(50%)' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {showLogs && isLoading ? (
            <motion.div
              key="loading-logs"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <AILoadingLogs 
                isVisible={true}
                toolName={title}
                onComplete={() => {/* Les logs se masqueront automatiquement */}}
              />
            </motion.div>
          ) : (
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Step Header */}
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white">
                  {currentStep.title}
                </h2>
                <p className="text-gray-400">
                  {currentStep.description}
                </p>
              </div>

              {/* Step Component */}
              <div className="min-h-[200px]">
                <currentStep.component 
                  data={formData}
                  onChange={updateFormData}
                  errors={errors}
                  isActive={true}
                />
              </div>

              {/* Error Display */}
              {Object.keys(errors).length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="text-red-400 font-medium">Erreurs à corriger :</span>
                  </div>
                  <ul className="space-y-1">
                    {Object.values(errors).map((error, index) => (
                      <li key={index} className="text-red-400 text-sm ml-4">
                        • {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="p-6 border-t border-[#232323] flex justify-between items-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePrevious}
          disabled={stepHistory.length <= 1}
          className="
            flex items-center gap-2 px-6 py-3 rounded-lg transition-all
            bg-[#1a1a1a] text-gray-400 hover:bg-[#232323] hover:text-white
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#1a1a1a]
          "
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Précédent</span>
        </motion.button>

        <div className="flex items-center gap-4">
          {currentStep.isOptional && (
            <span className="text-sm text-gray-500">
              Cette étape est optionnelle
            </span>
          )}
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            disabled={isLoading}
            className="
              flex items-center gap-2 px-6 py-3 rounded-lg transition-all
              bg-gradient-to-r from-blue-500 to-purple-500 text-white
              hover:from-blue-600 hover:to-purple-600
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Traitement...</span>
              </>
            ) : (
              <>
                <span>{isLastStep ? 'Générer avec Dropskills AI' : 'Suivant'}</span>
                {isLastStep ? (
                  <Sparkles className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default StepWizard;