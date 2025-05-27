# 🚀 Dropskills – Roadmap Upgrade 2025

## Sprint 1 : Upgrade technique & socle UI

- [ ] Migrer Next.js à la version 15+
- [ ] Mettre à jour Tailwind CSS
- [ ] Installer shadcn/ui, Radix UI, Lucide, Heroicons, etc.
- [ ] Initialiser shadcn/ui (`npx shadcn-ui@latest init`)
- [ ] Ajouter les premiers composants shadcn/ui (Button, Input, Card…)
- [ ] Passer les Google Fonts en local (`next/font/local`)
- [ ] Vérifier la structure App Router et layouts
- [ ] Tester le build et le déploiement

---

## Sprint 2 : Tracking, Analytics, Auth, Paiement

- [ ] Installer et configurer PostHog (`npm install posthog-js`)
- [ ] Ajouter le snippet PostHog dans `_app.tsx` ou `layout.tsx`
- [ ] Vérifier Google Analytics 4 & GTM
- [ ] Installer Stripe (`npm install @stripe/stripe-js @stripe/react-stripe-js`)
- [ ] Intégrer Stripe Checkout sur un flow test
- [ ] Installer et configurer NextAuth.js (ou Supabase Auth/Clerk)
- [ ] Ajouter au moins 2 providers OAuth (Google, Github…)

---

## Sprint 3 : Refonte UI & accessibilité

- [ ] Refondre la page dashboard avec shadcn/ui + Radix
- [ ] Refondre la page outils IA (tableau, modale, actions…)
- [ ] Refondre la page admin (stats, monitoring…)
- [ ] Ajouter Priority Hints et preload sur les assets critiques
- [ ] Ajouter les meta tags dynamiques et OG images
- [ ] Améliorer l'accessibilité (focus, contrastes, navigation clavier)
- [ ] Audit Lighthouse > 90 sur accessibilité

---

## Sprint 4 : IA, automatisation, différenciation

- [ ] Installer et connecter n8n (workflows IA)
- [ ] Créer les endpoints `/api/ia/*` (génération, scoring…)
- [ ] Ajouter des webhooks sur les formulaires et outils
- [ ] Mettre en place le dashboard analytics IA (statistiques personnalisées)
- [ ] Ajouter "Powered by Dropskills AI" sur chaque outil

---

## Sprint 5 : Tests, RGPD, sécurité, polish

- [ ] Ajouter/valider la bannière cookies RGPD
- [ ] Anonymiser les analytics (PostHog, GA4)
- [ ] Vérifier la sécurité (headers, .env, CSP, XSS…)
- [ ] Automatiser les backups, CI/CD, monitoring
- [ ] Mettre en place des tests utilisateurs
- [ ] Lancer un AB test avec PostHog

---

**Conseil :**
- Importe ce fichier dans Notion comme page ou base de tâches (Markdown supporté)
- Utilise les cases à cocher pour le suivi
- Ajoute des sous-tâches, liens, ou commentaires selon l'avancement 