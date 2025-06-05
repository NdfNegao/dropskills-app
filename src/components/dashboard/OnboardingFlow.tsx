'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, Target, Bot, TrendingUp, Crown } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'welcome',
      title: 'Bienvenue sur DropSkills ! 🎉',
      description: 'Votre plateforme d\'outils IA pour entrepreneurs. Découvrons ensemble comment maximiser votre potentiel business.',
      icon: Sparkles,
      color: 'from-purple-400 to-blue-500',
      highlight: 'dashboard-header'
    },
    {
      id: 'stats',
      title: 'Suivez votre progression 📊',
      description: 'Vos statistiques en temps réel : opportunités détectées, outils utilisés, score business et plus encore.',
      icon: TrendingUp,
      color: 'from-blue-400 to-cyan-500',
      highlight: 'stats-section'
    },
    {
      id: 'tools',
      title: 'Découvrez vos outils IA 🤖',
      description: 'ICP Maker gratuit, et 13+ outils premium pour automatiser votre croissance business.',
      icon: Bot,
      color: 'from-green-400 to-emerald-500',
      highlight: 'tools-section'
    },
    {
      id: 'opportunities',
      title: 'Détectez des opportunités 🎯',
      description: 'Lancez des veilles automatisées pour découvrir des opportunités business personnalisées.',
      icon: Target,
      color: 'from-orange-400 to-red-500',
      highlight: 'opportunities-section'
    },
    {
      id: 'premium',
      title: 'Débloquez votre potentiel 👑',
      description: 'Passez Premium pour accéder à tous les outils et fonctionnalités avancées.',
      icon: Crown,
      color: 'from-yellow-400 to-orange-500',
      highlight: 'premium-cta'
    }
  ];

  const currentStepData = steps[currentStep];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    onComplete();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Onboarding Card */}
      <motion.div
        className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-lg w-full relative overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentStepData.color} opacity-10`} />
        
        {/* Close button */}
        <motion.button
          onClick={skipOnboarding}
          className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-4 h-4 text-white" />
        </motion.button>

        <div className="relative z-10">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Étape {currentStep + 1} sur {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full bg-gradient-to-r ${currentStepData.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              className="text-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Icon */}
              <motion.div
                className={`w-20 h-20 bg-gradient-to-r ${currentStepData.color} rounded-3xl flex items-center justify-center mx-auto mb-6`}
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <currentStepData.icon className="w-10 h-10 text-white" />
              </motion.div>

              {/* Title */}
              <motion.h2
                className="text-2xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {currentStepData.title}
              </motion.h2>

              {/* Description */}
              <motion.p
                className="text-gray-300 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {currentStepData.description}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <motion.button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </motion.button>

            <div className="flex gap-2">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-white' : 
                    index < currentStep ? 'bg-green-400' : 'bg-gray-600'
                  }`}
                  animate={{ scale: index === currentStep ? 1.2 : 1 }}
                />
              ))}
            </div>

            <motion.button
              onClick={nextStep}
              className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${currentStepData.color} text-white rounded-xl font-semibold hover:opacity-90 transition-opacity`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentStep === steps.length - 1 ? 'Commencer' : 'Suivant'}
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Skip option */}
          <motion.button
            onClick={skipOnboarding}
            className="w-full mt-4 text-gray-500 hover:text-gray-400 text-sm transition-colors"
            whileHover={{ scale: 1.02 }}
          >
            Passer l'introduction
          </motion.button>
        </div>

        {/* Floating particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 bg-gradient-to-r ${currentStepData.color} rounded-full opacity-60`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + (i % 2) * 70}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>

      {/* Highlight overlay for specific sections */}
      {currentStepData.highlight && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <motion.div
            className="absolute border-4 border-white/50 rounded-2xl"
            animate={{ 
              scale: [1, 1.02, 1],
              borderColor: ['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0.5)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              // Position would be calculated based on currentStepData.highlight
              // This is a simplified version
              top: '20%',
              left: '10%',
              right: '10%',
              height: '200px'
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
} 