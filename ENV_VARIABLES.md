# 🔐 Variables d'Environnement - DropSkills

## 📋 Configuration Requise

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# =============================================================================
# NextAuth Configuration
# =============================================================================
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here-minimum-32-characters

# =============================================================================
# Google OAuth Configuration
# =============================================================================
# Obtenez ces valeurs depuis Google Cloud Console
# https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret

# =============================================================================
# OpenAI Configuration (pour les outils IA)
# =============================================================================
OPENAI_API_KEY=sk-your-openai-api-key-here

# =============================================================================
# Test Accounts (Développement uniquement)
# =============================================================================
# Ces comptes sont utilisés uniquement en mode développement
TEST_ADMIN_EMAIL=admin@dropskills.com
TEST_ADMIN_PASSWORD=admin123
TEST_PREMIUM_EMAIL=premium@dropskills.com
TEST_PREMIUM_PASSWORD=premium123
TEST_USER_EMAIL=user@dropskills.com
TEST_USER_PASSWORD=user123
```

## 🔧 Génération des Secrets

### NEXTAUTH_SECRET

```bash
# Méthode 1: OpenSSL
openssl rand -base64 32

# Méthode 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Méthode 3: En ligne
# https://generate-secret.vercel.app/32
```

### Google OAuth

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un existant
3. Activez l'API Google+
4. Configurez l'écran de consentement OAuth
5. Créez des identifiants OAuth 2.0
6. Copiez le Client ID et Client Secret

## 🚀 Production (Vercel)

Dans votre dashboard Vercel, ajoutez ces variables d'environnement :

| Variable | Valeur Production |
|----------|-------------------|
| `NEXTAUTH_URL` | `https://dropskills-app.vercel.app` |
| `NEXTAUTH_SECRET` | Votre secret de production (différent du dev) |
| `GOOGLE_CLIENT_ID` | Votre Client ID Google |
| `GOOGLE_CLIENT_SECRET` | Votre Client Secret Google |
| `OPENAI_API_KEY` | Votre clé API OpenAI |

## ✅ Vérification

Utilisez notre script de vérification :

```bash
npm run check-google
```

Ce script vérifiera :
- ✅ Présence des variables requises
- ✅ Format des variables Google
- ✅ Longueur du secret NextAuth
- ✅ Configuration des fichiers

## 🔒 Sécurité

### ⚠️ Important

- **Jamais de secrets dans le code** : Utilisez toujours les variables d'environnement
- **Fichier .env.local** : Ne commitez jamais ce fichier (il est dans .gitignore)
- **Secrets différents** : Utilisez des secrets différents entre dev et production
- **Rotation régulière** : Changez vos secrets périodiquement

### 🛡️ Bonnes Pratiques

1. **Environnements séparés** : Dev, staging, production
2. **Accès limité** : Seules les personnes autorisées ont accès aux secrets
3. **Monitoring** : Surveillez l'utilisation des APIs
4. **Backup** : Sauvegardez vos configurations (sans les secrets)

## 🐛 Dépannage

### Erreurs Communes

1. **"Invalid client"** → Vérifiez GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET
2. **"Redirect URI mismatch"** → Vérifiez la configuration dans Google Console
3. **"Secret too short"** → NEXTAUTH_SECRET doit faire au moins 32 caractères

### Debug

Activez les logs NextAuth en développement :

```env
NEXTAUTH_DEBUG=true
```

## 📞 Support

- 📖 [Documentation NextAuth](https://next-auth.js.org/)
- 🔗 [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- 🛠️ Script de vérification : `npm run check-google` 