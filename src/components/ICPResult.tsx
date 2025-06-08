'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Brain,
  AlertTriangle,
  MapPin,
  MessageSquare,
  DollarSign,
  Users,
  FileText,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Target,
  Heart,
  Zap,
  TrendingUp,
  Calendar,
  Star,
  Lightbulb
} from 'lucide-react';
import { ICPAnalysis } from '@/types/icp';

interface ICPResultProps {
  analysis: ICPAnalysis;
  onCopy: (text: string) => void;
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  gradient?: string;
}

function Section({ title, icon, children, defaultExpanded = false, gradient = "from-blue-500/20 to-purple-500/20" }: SectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textContent = extractTextContent(children);
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const extractTextContent = (element: any): string => {
    if (typeof element === 'string') return element;
    if (typeof element === 'number') return element.toString();
    if (Array.isArray(element)) return element.map(extractTextContent).join(' ');
    if (element?.props?.children) return extractTextContent(element.props.children);
    return '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111111] rounded-xl border border-[#232323] overflow-hidden"
    >
      <div 
        className="p-4 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-gradient-to-r ${gradient} rounded-lg`}>
              {icon}
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </motion.button>
            
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </motion.div>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-[#232323]"
          >
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function InfoCard({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
      <div className="flex items-center gap-2 mb-2">
        {icon && <div className="text-blue-400">{icon}</div>}
        <span className="text-gray-400 text-sm font-medium">{label}</span>
      </div>
      <p className="text-white font-semibold">{value}</p>
    </div>
  );
}

function ListCard({ title, items, icon, color = "blue" }: { title: string; items: string[]; icon?: React.ReactNode; color?: string }) {
  const colorClasses = {
    blue: "border-blue-500/20 bg-blue-500/5",
    green: "border-green-500/20 bg-green-500/5",
    red: "border-red-500/20 bg-red-500/5",
    purple: "border-purple-500/20 bg-purple-500/5",
    orange: "border-orange-500/20 bg-orange-500/5"
  };

  return (
    <div className={`rounded-lg p-4 border ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon && <div className={`text-${color}-400`}>{icon}</div>}
        <h4 className="text-white font-semibold">{title}</h4>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <div className={`w-1.5 h-1.5 bg-${color}-400 rounded-full mt-2 flex-shrink-0`} />
            <span className="text-gray-300 text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ICPResult({ analysis, onCopy }: ICPResultProps) {
  return (
    <div className="space-y-6">
      {/* Profil Sociodémographique */}
      <Section 
        title="Profil Sociodémographique" 
        icon={<User className="w-5 h-5 text-blue-400" />}
        defaultExpanded={true}
        gradient="from-blue-500/20 to-cyan-500/20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard 
            label="Âge" 
            value={analysis.profilSociodemographique.age}
            icon={<Calendar className="w-4 h-4" />}
          />
          <InfoCard 
            label="Sexe" 
            value={analysis.profilSociodemographique.sexe}
            icon={<Users className="w-4 h-4" />}
          />
          <InfoCard 
            label="Localisation" 
            value={analysis.profilSociodemographique.localisation}
            icon={<MapPin className="w-4 h-4" />}
          />
          <InfoCard 
            label="Situation Professionnelle" 
            value={analysis.profilSociodemographique.situationPro}
            icon={<Target className="w-4 h-4" />}
          />
          <InfoCard 
            label="Niveau de Revenus" 
            value={analysis.profilSociodemographique.niveauRevenus}
            icon={<DollarSign className="w-4 h-4" />}
          />
        </div>
      </Section>

      {/* Psychologie & Motivations */}
      <Section 
        title="Psychologie & Motivations" 
        icon={<Brain className="w-5 h-5 text-purple-400" />}
        gradient="from-purple-500/20 to-pink-500/20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <ListCard 
              title="Besoins Principaux"
              items={analysis.psychologieMotivations.besoins}
              icon={<Heart className="w-4 h-4" />}
              color="green"
            />
            <ListCard 
              title="Désirs & Aspirations"
              items={analysis.psychologieMotivations.desirs}
              icon={<Star className="w-4 h-4" />}
              color="blue"
            />
          </div>
          <div className="space-y-4">
            <ListCard 
              title="Peurs & Freins"
              items={analysis.psychologieMotivations.peurs}
              icon={<AlertTriangle className="w-4 h-4" />}
              color="red"
            />
            <ListCard 
              title="Objections Courantes"
              items={analysis.psychologieMotivations.objections}
              icon={<MessageSquare className="w-4 h-4" />}
              color="orange"
            />
          </div>
        </div>
      </Section>

      {/* Problèmes Principaux */}
      <Section 
        title="Problèmes Principaux" 
        icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
        gradient="from-red-500/20 to-orange-500/20"
      >
        <ListCard 
          title="Points de Douleur Identifiés"
          items={analysis.problemePrincipaux}
          icon={<Zap className="w-4 h-4" />}
          color="red"
        />
      </Section>

      {/* Où le Trouver */}
      <Section 
        title="Où Trouver Votre ICP" 
        icon={<MapPin className="w-5 h-5 text-green-400" />}
        gradient="from-green-500/20 to-emerald-500/20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <ListCard 
              title="Canaux de Communication"
              items={analysis.ouLeTrouver.canaux}
              icon={<MessageSquare className="w-4 h-4" />}
              color="green"
            />
            <ListCard 
              title="Plateformes Digitales"
              items={analysis.ouLeTrouver.plateformes}
              icon={<TrendingUp className="w-4 h-4" />}
              color="blue"
            />
          </div>
          <div className="space-y-4">
            <ListCard 
              title="Groupes & Communautés"
              items={analysis.ouLeTrouver.groupes}
              icon={<Users className="w-4 h-4" />}
              color="purple"
            />
            <ListCard 
              title="Événements & Lieux"
              items={analysis.ouLeTrouver.evenements}
              icon={<Calendar className="w-4 h-4" />}
              color="orange"
            />
          </div>
        </div>
      </Section>

      {/* Messaging Impactant */}
      <Section 
        title="Messaging Impactant" 
        icon={<MessageSquare className="w-5 h-5 text-yellow-400" />}
        gradient="from-yellow-500/20 to-orange-500/20"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ListCard 
              title="Expressions Clés"
              items={analysis.messagingImpactant.expressions}
              icon={<MessageSquare className="w-4 h-4" />}
              color="orange"
            />
            <ListCard 
              title="Accroches Efficaces"
              items={analysis.messagingImpactant.accroches}
              icon={<Zap className="w-4 h-4" />}
              color="purple"
            />
          </div>
          <InfoCard 
            label="Style de Discours Recommandé" 
            value={analysis.messagingImpactant.styleDiscours}
            icon={<Lightbulb className="w-4 h-4" />}
          />
        </div>
      </Section>

      {/* Budget & Pouvoir d'Achat */}
      <Section 
        title="Budget & Pouvoir d'Achat" 
        icon={<DollarSign className="w-5 h-5 text-green-400" />}
        gradient="from-green-500/20 to-teal-500/20"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard 
              label="Budget Typique" 
              value={analysis.budgetPouvoirAchat.budgetTypique}
              icon={<DollarSign className="w-4 h-4" />}
            />
            <InfoCard 
              label="Fréquence d'Achat" 
              value={analysis.budgetPouvoirAchat.frequenceAchat}
              icon={<Calendar className="w-4 h-4" />}
            />
          </div>
          <ListCard 
            title="Facteurs Influençant le Prix"
            items={analysis.budgetPouvoirAchat.facteursPrix}
            icon={<TrendingUp className="w-4 h-4" />}
            color="green"
          />
        </div>
      </Section>

      {/* Segments */}
      <Section 
        title="Segmentation" 
        icon={<Users className="w-5 h-5 text-purple-400" />}
        gradient="from-purple-500/20 to-indigo-500/20"
      >
        <div className="space-y-6">
          {/* Segment Principal */}
          <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg p-6 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Target className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">{analysis.segments.principal.nom}</h4>
                <span className="text-purple-400 font-semibold">{analysis.segments.principal.pourcentage}</span>
              </div>
            </div>
            <p className="text-gray-300">{analysis.segments.principal.description}</p>
          </div>

          {/* Segments Variantes */}
          {analysis.segments.variantes.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-white font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                Segments Secondaires
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.segments.variantes.map((segment, index) => (
                  <div key={index} className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-white font-semibold">{segment.nom}</h5>
                      <span className="text-indigo-400 text-sm font-medium">{segment.pourcentage}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{segment.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Journaux Intimes */}
      {analysis.journauxIntimes && (
        <Section 
          title="Journaux Intimes" 
          icon={<Heart className="w-5 h-5 text-pink-400" />}
          gradient="from-pink-500/20 to-rose-500/20"
          defaultExpanded={true}
        >
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-lg p-6 border border-red-500/20">
              <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Journal "Douleur"
              </h4>
              <p className="text-gray-300 leading-relaxed italic">"{analysis.journauxIntimes.douleur}"</p>
            </div>
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-6 border border-green-500/20">
              <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-green-400" />
                Journal "Victoire"
              </h4>
              <p className="text-gray-300 leading-relaxed italic">"{analysis.journauxIntimes.victoire}"</p>
            </div>
          </div>
        </Section>
      )}

      {/* Résumé Express */}
      {analysis.resumeExpress && (
        <Section 
          title="Résumé Express" 
          icon={<Zap className="w-5 h-5 text-yellow-400" />}
          gradient="from-yellow-500/20 to-orange-500/20"
          defaultExpanded={true}
        >
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-6 border border-yellow-500/20">
            <div className="space-y-2">
              {analysis.resumeExpress.map((ligne, index) => (
                <p key={index} className="text-gray-300 leading-relaxed">• {ligne}</p>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Accroches Marketing */}
      {analysis.accrochesCiblees && (
        <Section 
          title="Accroches Marketing" 
          icon={<MessageSquare className="w-5 h-5 text-cyan-400" />}
          gradient="from-cyan-500/20 to-blue-500/20"
          defaultExpanded={true}
        >
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-lg p-6 border border-red-500/20">
              <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Accroches "Douleur"
              </h4>
              <div className="space-y-2">
                {analysis.accrochesCiblees.douleur.map((accroche, index) => (
                  <p key={index} className="text-gray-300">• {accroche}</p>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-6 border border-green-500/20">
              <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-green-400" />
                Accroches "Situation Rêvée"
              </h4>
              <div className="space-y-2">
                {analysis.accrochesCiblees.situationRevee.map((accroche, index) => (
                  <p key={index} className="text-gray-300">• {accroche}</p>
                ))}
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* Fiche Actionable */}
      <Section 
        title="Plan d'Action" 
        icon={<FileText className="w-5 h-5 text-blue-400" />}
        gradient="from-blue-500/20 to-cyan-500/20"
        defaultExpanded={true}
      >
        <div className="space-y-6">
          {/* Résumé Exécutif */}
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg p-6 border border-blue-500/20">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-400" />
              Résumé Exécutif
            </h4>
            <p className="text-gray-300 leading-relaxed">{analysis.ficheActionable.resumeExecutif}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ListCard 
              title="Priorités Marketing"
              items={analysis.ficheActionable.prioritesMarketing}
              icon={<Target className="w-4 h-4" />}
              color="blue"
            />
            <ListCard 
              title="Prochaines Étapes"
              items={analysis.ficheActionable.prochainEtapes}
              icon={<Zap className="w-4 h-4" />}
              color="green"
            />
            <ListCard 
              title="Métriques Clés"
              items={analysis.ficheActionable.metriquesACles}
              icon={<TrendingUp className="w-4 h-4" />}
              color="purple"
            />
          </div>
        </div>
      </Section>
    </div>
  );
}