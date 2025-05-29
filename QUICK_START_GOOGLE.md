# ⚡ Démarrage Rapide - Configuration Google OAuth

## 🚀 En 5 Minutes

### 1. Créer le fichier d'environnement

```bash
# Créez le fichier .env.local
touch .env.local
```

### 2. Générer un secret NextAuth

```bash
# Générez un secret sécurisé
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Configurer Google OAuth

1. **Allez sur** [Google Cloud Console](https://console.cloud.google.com/)
2. **Créez un projet** : `dropskills-auth`
3. **Activez l'API** : Google+ API
4. **Créez des identifiants** : OAuth 2.0 Client ID
5. **Configurez les URIs** :
   - Origins: `http://localhost:3000`
   - Redirect: `http://localhost:3000/api/auth/callback/google`

### 4. Remplir .env.local

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre-secret-généré-étape-2
GOOGLE_CLIENT_ID=votre-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-votre-client-secret
OPENAI_API_KEY=sk-votre-clé-openai

# Comptes de test (optionnel)
TEST_ADMIN_EMAIL=admin@dropskills.com
TEST_ADMIN_PASSWORD=admin123
```

### 5. Vérifier la configuration

```bash
npm run check-google
```

### 6. Tester

```bash
npm run dev
```

Allez sur `http://localhost:3000/auth/signin` et testez la connexion Google !

## 🎯 Configuration Production (Vercel)

### Variables Vercel à ajouter :

```
NEXTAUTH_URL=https://dropskills-app.vercel.app
NEXTAUTH_SECRET=nouveau-secret-production
GOOGLE_CLIENT_ID=même-que-dev
GOOGLE_CLIENT_SECRET=même-que-dev
OPENAI_API_KEY=votre-clé-openai
```

### URIs Google Console (Production) :

- **Origins**: `https://dropskills-app.vercel.app`
- **Redirect**: `https://dropskills-app.vercel.app/api/auth/callback/google`

## ✅ Checklist

- [ ] Projet Google Cloud créé
- [ ] API Google+ activée
- [ ] Identifiants OAuth créés
- [ ] Fichier .env.local configuré
- [ ] Script de vérification passé
- [ ] Test local réussi
- [ ] Variables Vercel configurées (si production)
- [ ] Test production réussi (si production)

## 🆘 Problèmes ?

### Erreur "redirect_uri_mismatch"
```
Vérifiez que l'URI dans Google Console est exactement :
http://localhost:3000/api/auth/callback/google
```

### Erreur "invalid_client"
```
Vérifiez GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET
```

### Script de diagnostic
```bash
npm run check-google
```

## 📚 Documentation Complète

- 📖 [Guide Complet](./GOOGLE_SETUP.md)
- 🔐 [Variables d'Environnement](./ENV_VARIABLES.md)
- 🛠️ [Configuration NextAuth](./src/lib/auth.ts)

---

**🎉 C'est tout !** Votre authentification Google est prête en 5 minutes. 