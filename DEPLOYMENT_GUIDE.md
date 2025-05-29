# 🚀 Guide de Déploiement DropSkills

## 📋 Vue d'ensemble

Ce guide explique comment configurer et utiliser le déploiement automatique de DropSkills via Git et Vercel.

---

## 🔗 Configuration du Déploiement Git

### 1. Connecter GitHub à Vercel

1. **Accéder au Dashboard Vercel**
   - Allez sur [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Connectez-vous avec votre compte GitHub

2. **Importer le Repository**
   - Cliquez sur "Add New..." → "Project"
   - Sélectionnez "Import Git Repository"
   - Choisissez `NdfNegao/dropskills-app`
   - Cliquez sur "Import"

3. **Configuration du Projet**
   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   Node.js Version: 18.x
   ```

### 2. Variables d'Environnement

Les variables suivantes sont déjà configurées sur Vercel :

```env
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENAI_API_KEY=your-openai-api-key
NODE_ENV=production
```

---

## 🔄 Workflow de Déploiement

### Déploiement Automatique

```bash
# 1. Développer localement
npm run dev

# 2. Tester les changements
npm run test:all

# 3. Committer les changements
git add .
git commit -m "feat: nouvelle fonctionnalité"

# 4. Pousser vers GitHub
git push origin main

# 5. Vercel déploie automatiquement ! 🚀
```

### Types de Déploiement

| Branch | Type | URL | Description |
|--------|------|-----|-------------|
| `main` | Production | `dropskills.vercel.app` | Version live |
| `develop` | Staging | `dropskills-git-develop.vercel.app` | Tests pré-production |
| `feature/*` | Preview | `dropskills-git-feature-*.vercel.app` | Tests de fonctionnalités |

---

## 🛠️ Commandes Utiles

### Scripts NPM

```bash
# Déploiement et tests
npm run deploy              # Déploiement manuel
npm run test:all           # Tests complets
npm run setup-vercel       # Configuration Vercel
npm run setup-git-deployment # Guide déploiement Git

# Développement
npm run dev                # Serveur de développement
npm run build              # Build de production
npm run start              # Serveur de production local
```

### Commandes Vercel CLI

```bash
# Déploiement
vercel --prod              # Déploiement production manuel
vercel                     # Déploiement preview

# Monitoring
vercel logs                # Logs de production
vercel logs --follow       # Logs en temps réel
vercel domains             # Gestion des domaines

# Configuration
vercel env list            # Lister les variables d'environnement
vercel env add VAR_NAME    # Ajouter une variable
vercel env rm VAR_NAME     # Supprimer une variable
```

### Commandes Git

```bash
# Workflow standard
git checkout -b feature/nouvelle-fonctionnalite
git add .
git commit -m "feat: description"
git push origin feature/nouvelle-fonctionnalite

# Créer une Pull Request sur GitHub
# Merger vers main → déploiement automatique
```

---

## 🔍 Monitoring et Debugging

### Dashboard Vercel

- **URL**: [https://vercel.com/dashboard](https://vercel.com/dashboard)
- **Fonctionnalités**:
  - Logs en temps réel
  - Métriques de performance
  - Historique des déploiements
  - Gestion des domaines
  - Analytics

### Logs de Production

```bash
# Voir les logs
vercel logs

# Logs en temps réel
vercel logs --follow

# Logs d'une fonction spécifique
vercel logs --function=api/ai/titles/generate
```

### Debugging

```bash
# Tester le build localement
npm run build
npm run start

# Vérifier les variables d'environnement
vercel env list production

# Tester une route spécifique
curl https://your-domain.vercel.app/api/health
```

---

## 🌐 Configuration des Domaines

### Domaine Personnalisé

1. **Ajouter le Domaine**
   ```bash
   vercel domains add dropskills.com
   ```

2. **Configurer DNS**
   - Type: CNAME
   - Name: @
   - Value: cname.vercel-dns.com

3. **Mettre à jour les Variables**
   ```bash
   vercel env rm NEXTAUTH_URL production
   echo "https://dropskills.com" | vercel env add NEXTAUTH_URL production
   ```

### SSL/TLS

- ✅ Certificat SSL automatique
- ✅ HTTPS forcé
- ✅ HTTP/2 activé
- ✅ Compression Gzip/Brotli

---

## 🔐 Sécurité

### Variables d'Environnement

- ✅ Chiffrées au repos
- ✅ Isolées par environnement
- ✅ Accès restreint
- ✅ Audit trail

### Headers de Sécurité

```javascript
// Configurés dans vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

---

## 📊 Performance

### Optimisations Automatiques

- ✅ Edge Network (CDN global)
- ✅ Compression automatique
- ✅ Cache intelligent
- ✅ Image optimization
- ✅ Code splitting

### Métriques

| Métrique | Valeur | Status |
|----------|--------|--------|
| First Load JS | 87.3 kB | ✅ Excellent |
| Temps de réponse | ~107ms | ✅ Excellent |
| Core Web Vitals | Optimisé | ✅ Excellent |

---

## 🚨 Gestion des Erreurs

### Rollback Automatique

```bash
# Revenir à la version précédente
vercel rollback

# Revenir à un déploiement spécifique
vercel rollback [deployment-url]
```

### Monitoring des Erreurs

- **Logs Vercel**: Erreurs serveur
- **Browser Console**: Erreurs client
- **Analytics**: Métriques d'usage

---

## 🎯 Bonnes Pratiques

### Commits

```bash
# Format recommandé
git commit -m "type(scope): description"

# Exemples
git commit -m "feat(auth): add Google OAuth"
git commit -m "fix(api): handle OpenAI rate limits"
git commit -m "docs(readme): update deployment guide"
```

### Branches

```
main           → Production
develop        → Staging
feature/*      → Nouvelles fonctionnalités
hotfix/*       → Corrections urgentes
release/*      → Préparation de release
```

### Tests Avant Déploiement

```bash
# Checklist obligatoire
npm run lint           # ✅ Linting
npm run build          # ✅ Build
npm run test:all       # ✅ Tests
```

---

## 📞 Support

### Ressources

- **Documentation Vercel**: [https://vercel.com/docs](https://vercel.com/docs)
- **GitHub Repository**: [https://github.com/NdfNegao/dropskills-app](https://github.com/NdfNegao/dropskills-app)
- **Dashboard Vercel**: [https://vercel.com/dashboard](https://vercel.com/dashboard)

### Contacts

- **Issues GitHub**: Pour les bugs et fonctionnalités
- **Vercel Support**: Pour les problèmes de déploiement
- **Documentation**: Pour les guides et tutoriels

---

## 🎉 Conclusion

Le déploiement Git offre :

- ✅ **Automatisation complète**
- ✅ **Sécurité renforcée**
- ✅ **Collaboration facilitée**
- ✅ **Monitoring avancé**
- ✅ **Performance optimale**

**Votre DropSkills est maintenant prêt pour la production ! 🚀** 