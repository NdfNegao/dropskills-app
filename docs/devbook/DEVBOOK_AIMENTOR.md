# 📘 Devbook – Système de AI Mentor pour Dropskills

## 🎯 Objectif
Intégrer un **système de mentor IA thématisé** à la plateforme Dropskills. Chaque "mentor" agit comme un expert IA dans un domaine spécifique (copywriting, stratégie social media, tunnels de vente, branding, etc.) et interagit avec l’utilisateur via une interface de chat dédiée.

Le but est d’offrir une **expérience d'accompagnement intelligent**, accessible 24/7, alimentée par des bases de données internes, des prompts spécialisés et une IA conversationnelle.

---

## 🧠 Fonctionnement global

### 🔹 Structure conceptuelle
- **Interface de chat** : simple, conversationnelle, avec suggestions d'entrée, animation type "Mentor est en train d'ecrir", "Mentor est en train de.... en fonction du contexte".
- **Mentors spécialisés** : chacun dans un domaine précis (copywriting, contenu, tunnel, branding, etc.).
- **Contextualisation par prompt** : chaque mentor a une personnalité et une mission précise.
- **Base de connaissance dédiée** : extraction des PDF PLR, guides internes, templates, etc.

### 🔹 Exemple de mentors possibles
| Mentor | Rôle |
|--------|------|
| 📝 Copy Mentor | Aide à rédiger des textes de vente efficaces |
| 📱 Content Mentor | Génère du contenu pour réseaux sociaux |
| 🧲 Funnel Mentor | Optimise tunnels de vente et parcours client |
| 🧠 Business Mentor | Structure des idées de business |
| 🎥 Video Scriptor | Crée des scripts courts YouTube/TikTok |


---

## 🔧 Architecture technique

### 1. UI / Frontend
Chaque mentor est une page type : `/ai-mentor/[theme]`
- `page.tsx` : logique de chat
- `components/ChatBubble.tsx` *(optionnel)* : messages stylisés

### 2. Backend API
Route API dynamique : `/api/ai-mentor/[theme].ts`
- Lit les messages utilisateur
- Injecte un prompt de base spécifique au mentor
- Appelle une IA (OpenAI ou orchestrateur via n8n)

### 3. Sources de données
- PLR/Guides Dropskills transformés en fichiers markdown/JSON
- Base vectorielle (optionnelle) avec recherche sémantique (Supabase, Pinecone...)
- Historique des conversations (si login requis)


---

## 📐 Exemple de prompt de base
```txt
Tu es un mentor IA expert en [copywriting / contenu / stratégie...].
Ta mission : aider l’utilisateur à générer des idées et les transformer en actions concrètes.
Tu es direct, structuré, inspirant. Pose des questions si besoin de contexte. Ne tourne pas autour du pot.
```

---

## 📁 Permissions & Accès
- Accessible depuis la sidebar principale : "AI Mentor"
- Restreint aux utilisateurs avec plan Premium ou supérieur
- Historique des échanges sauvegardé en local ou dans DB utilisateur

---

## ✨ Fonctionnalités clés
- Chat UI responsive avec input + feedback
- Suggestions d’entrée (exemples de requêtes)
- Chargement via API / feedback utilisateur
- Possibilité d’export Markdown ou PDF des échanges
- Sauvegarde dans le coffre utilisateur (DropSkills)
- Intégration directe aux outils (pré-remplir un générateur, un email, un post...)


---

## 🚀 Évolutions possibles
- 📥 Plugin de mentor flottant visible sur tout Dropskills (overlay)
- 🧠 Coaching proactif : relances automatiques selon activité
- 📊 Tracking des progrès et analytics de requêtes
- 🤖 Connexion à des agents IA plus complexes (workflow n8n, lead scoring, etc.)


---

## ✅ Checklist intégration
- [x] Interface page mentor par thématique
- [x] API dynamique par thème avec prompts contextualisés
- [ ] Base de connaissance connectée (markdown ou vectoriel)
- [ ] Permissions utilisateur (auth, premium)
- [ ] Export / Sauvegarde / Intégration outils

---

## © Dropskills 2025 – AI Mentor Framework
