'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Sparkles, 
  CheckCircle, 
  ShoppingCart, 
  Rocket, 
  Lock, 
  Star, 
  Users, 
  TrendingUp, 
  Zap, 
  Target, 
  Mail, 
  BarChart3,
  ArrowRight,
  Play,
  Code,
  Database,
  Globe,
  Download,
  Eye,
  Heart
} from 'lucide-react';

export default function HomeTraePage() {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, 25]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  const demos = [
    {
      title: "Formation Dropshipping 2025",
      description: "Guide complet avec templates et stratégies",
      preview: "📦 Module 1: Recherche de produits\n🎯 Module 2: Création de store\n💰 Module 3: Publicités Facebook\n📈 Module 4: Optimisation conversions",
      price: "197€",
      category: "E-commerce"
    },
    {
      title: "Pack Email Marketing",
      description: "50 templates d'emails + séquences automatisées",
      preview: "✉️ 50 templates d'emails\n🤖 10 séquences automatisées\n📊 Métriques de performance\n🎨 Designs personnalisables",
      price: "97€",
      category: "Marketing"
    },
    {
      title: "Coaching High-Ticket",
      description: "Méthode complète pour vendre des services premium",
      preview: "🎯 Positionnement expert\n💬 Scripts de vente\n📞 Techniques de closing\n💎 Stratégies premium",
      price: "497€",
      category: "Business"
    }
  ];

  const stats = [
    { value: "300+", label: "Entrepreneurs", icon: <Users className="w-5 h-5" /> },
    { value: "95%", label: "Marge moyenne", icon: <TrendingUp className="w-5 h-5" /> },
    { value: "24/7", label: "Livraison", icon: <Zap className="w-5 h-5" /> },
    { value: "∞", label: "Stock", icon: <Database className="w-5 h-5" /> }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDemo((prev) => (prev + 1) % demos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#18181b] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#ff0033]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Hero Section */}
      <motion.section 
        style={{ y: y1, opacity }}
        className="relative max-w-6xl mx-auto text-center py-20 px-4 z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-[#ff0033]/10 border border-[#ff0033]/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#ff0033]" />
            <span className="text-sm font-medium">Nouveau: IA intégrée pour optimiser vos ventes</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Transformez des
            <span className="block bg-gradient-to-r from-[#ff0033] to-[#ff6b6b] bg-clip-text text-transparent">
              Produits Digitaux
            </span>
            en Business Rentable
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Accédez à un catalogue premium de formations, templates et outils.
            <br className="hidden md:block" />
            Revendez avec <strong className="text-primary">95% de marge</strong> et une livraison automatisée.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Link href="/auth/signin">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#ff0033] to-[#cc0029] hover:from-[#cc0029] hover:to-[#990022] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300 flex items-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              Commencer gratuitement
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-6 py-4 border border-border hover:border-border rounded-xl transition-all duration-300"
          >
            <Play className="w-5 h-5" />
            Voir la démo (2 min)
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 text-center"
            >
              <div className="flex justify-center mb-2 text-primary">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Interactive Demo Section */}
      <motion.section 
        style={{ y: y2 }}
        className="relative max-w-6xl mx-auto py-20 px-4 z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Explorez notre <span className="text-primary">Catalogue Premium</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez en temps réel le contenu de nos produits les plus vendus
          </p>
        </motion.div>

        {/* Demo Showcase */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Demo Controls */}
          <div className="space-y-4">
            {demos.map((demo, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveDemo(index)}
                className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 ${
                  activeDemo === index
                    ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20'
                    : 'bg-card/50 border-border hover:border-border'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{demo.title}</h3>
                    <p className="text-muted-foreground text-sm">{demo.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[#ff0033] font-bold">{demo.price}</div>
                    <div className="text-xs text-muted-foreground">{demo.category}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  <span>Aperçu disponible</span>
                  {activeDemo === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto"
                    >
                      <CheckCircle className="w-5 h-5 text-[#ff0033]" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Demo Preview */}
          <motion.div
            key={activeDemo}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border rounded-xl p-6 h-96 overflow-hidden relative"
          >
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <div className="text-sm text-muted-foreground ml-4">
                {demos[activeDemo].title} - Aperçu
              </div>
            </div>
            
            <div className="space-y-3">
              {demos[activeDemo].preview.split('\n').map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-background rounded-lg"
                >
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-muted-foreground">{line}</span>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-4 right-4"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Download className="w-4 h-4" />
                <span>Téléchargement instantané</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pourquoi choisir <span className="text-[#ff0033]">DropSkills</span> ?
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Rocket className="w-8 h-8" />,
              title: "Lancement Rapide",
              description: "Démarrez votre business en moins de 24h avec nos produits prêts à vendre",
              color: "from-red-500 to-pink-500"
            },
            {
              icon: <Target className="w-8 h-8" />,
              title: "Marge Maximale",
              description: "Jusqu'à 95% de marge sur chaque vente, sans frais cachés ni commission",
              color: "from-blue-500 to-cyan-500"
            },
            {
              icon: <Zap className="w-8 h-8" />,
              title: "Automatisation",
              description: "Livraison automatique, gestion des clients et support inclus",
              color: "from-purple-500 to-indigo-500"
            },
            {
              icon: <Globe className="w-8 h-8" />,
              title: "Marché Global",
              description: "Vendez partout dans le monde avec nos contenus multilingues",
              color: "from-green-500 to-emerald-500"
            },
            {
              icon: <Code className="w-8 h-8" />,
              title: "Outils IA",
              description: "Générateurs de contenu, d'emails et de tunnels de vente intégrés",
              color: "from-orange-500 to-red-500"
            },
            {
              icon: <Heart className="w-8 h-8" />,
              title: "Support Premium",
              description: "Accompagnement personnalisé et communauté d'entrepreneurs",
              color: "from-pink-500 to-rose-500"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              viewport={{ once: true }}
              className="group relative bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-border transition-all duration-300"
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-4`}>
                {feature.icon}
              </div>
              <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center py-20 px-4"
      >
        <div className="bg-gradient-to-r from-[#ff0033]/10 to-purple-500/10 border border-[#ff0033]/20 rounded-2xl p-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à lancer votre <span className="text-[#ff0033]">Empire Digital</span> ?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Rejoignez les 300+ entrepreneurs qui génèrent des revenus passifs avec DropSkills
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Accès gratuit immédiat
              </motion.button>
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-8 py-4 border border-border hover:border-border rounded-xl transition-all duration-300 flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Parler à un expert
            </motion.button>
          </div>
          
          <div className="mt-8 flex justify-center items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Sans engagement</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Support 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Garantie 30 jours</span>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}