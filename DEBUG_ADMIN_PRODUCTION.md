# 🔧 Debug Admin Production - Guide DropSkills

## 🚨 Problème
Le bouton ADMINISTRATION s'affiche en local mais pas en production pour `cyril.iriebi@gmail.com`.

## 🔍 Diagnostic

### 1. Tester l'authentification en production

Allez sur votre URL de production + `/api/test-auth` :

```
https://dropskills-app.vercel.app/api/test-auth
```

**Réponse attendue :**
```json
{
  "authenticated": true,
  "user": {
    "email": "cyril.iriebi@gmail.com",
    "name": "Cyril Iriebi",
    "id": "..."
  },
  "isAdmin": true,
  "env": {
    "NODE_ENV": "production",
    "NEXTAUTH_URL": "https://dropskills-app.vercel.app",
    "hasGoogleClientId": true,
    "hasGoogleClientSecret": true,
    "hasNextAuthSecret": true
  }
}
```

### 2. Causes possibles

#### ❌ Pas connecté en production
- Vous devez vous connecter avec Google OAuth sur la production
- L'email doit être exactement `cyril.iriebi@gmail.com`

#### ❌ Variables d'environnement manquantes
Vérifiez sur [Vercel Dashboard](https://vercel.com/dashboard) :
- `NEXTAUTH_URL` = `https://dropskills-app.vercel.app` 
- `NEXTAUTH_SECRET` = (clé secrète)
- `GOOGLE_CLIENT_ID` = `89017...googleusercontent.com`
- `GOOGLE_CLIENT_SECRET` = `GOCSPX-...`

#### ❌ Configuration Google OAuth
Les URLs de redirection doivent inclure :
- `https://dropskills-app.vercel.app/api/auth/callback/google`

## ✅ Solutions

### Solution 1 : Vérifier les variables Vercel

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet `dropskills-app`
3. Allez dans **Settings** > **Environment Variables**
4. Vérifiez que ces variables existent :

```env
NEXTAUTH_URL=https://dropskills-app.vercel.app
NEXTAUTH_SECRET=dropskills-v2-secret-key-2024-production
GOOGLE_CLIENT_ID=89017493138-43p09easib9rt7t2v1mbkukpo5l17dbh.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

5. Si manquantes, ajoutez-les et redéployez

### Solution 2 : Configurer Google OAuth pour la production

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionnez votre projet
3. **APIs & Services** > **Credentials**
4. Éditez votre **OAuth 2.0 Client ID**
5. Ajoutez dans **Authorized redirect URIs** :
   ```
   https://dropskills-app.vercel.app/api/auth/callback/google
   ```
6. Sauvegardez

### Solution 3 : Se connecter avec Google en production

1. Allez sur `https://dropskills-app.vercel.app/auth/signin`
2. Cliquez sur "Continuer avec Google"
3. Connectez-vous avec `cyril.iriebi@gmail.com`
4. Le bouton admin devrait maintenant apparaître

### Solution 4 : Force refresh du déploiement

Si tout semble correct mais ne marche pas :

1. Sur Vercel, allez dans **Deployments**
2. Trouvez le dernier déploiement
3. Cliquez sur les **3 points** > **Redeploy**
4. Cochez "Use existing Build Cache" = **OFF**
5. Cliquez **Redeploy**

## 🧪 Tests de validation

### Test 1 : API d'authentification
```bash
curl "https://dropskills-app.vercel.app/api/test-auth"
```

### Test 2 : Connexion manuelle
1. `https://dropskills-app.vercel.app/auth/signin`
2. Google OAuth avec `cyril.iriebi@gmail.com`
3. Redirection vers `/dashboard`
4. Le bouton admin doit être visible dans la sidebar

### Test 3 : Accès direct admin
```
https://dropskills-app.vercel.app/admin
```

## 📞 Support d'urgence

Si rien ne fonctionne, vous pouvez temporairement :

### Option A : Session de développement
```javascript
// Dans useAuth.ts (temporaire)
const isAdmin = user?.email === 'cyril.iriebi@gmail.com' || 
                localStorage.getItem('force-admin') === 'true';
```

### Option B : Admin hardcodé temporaire
```javascript
// Dans DropskillsSidebar.tsx (temporaire)
const isAdmin = true; // TEMPORAIRE - retirer après fix
```

⚠️ **ATTENTION** : Retirez ces modifications après avoir résolu le problème principal !

## 📊 Checklist de validation

- [ ] Variables d'environnement Vercel configurées
- [ ] Google OAuth URLs de redirection correctes  
- [ ] `/api/test-auth` retourne `authenticated: true`
- [ ] Connexion Google fonctionne en production
- [ ] Bouton admin visible après connexion
- [ ] Accès à `/admin` fonctionne

## 🎯 Prochaines étapes

1. **Testez maintenant** : `https://dropskills-app.vercel.app/api/test-auth`
2. **Si `authenticated: false`** : Connectez-vous avec Google
3. **Si variables manquantes** : Ajoutez sur Vercel
4. **Si URLs invalides** : Corrigez Google OAuth
5. **Si rien ne marche** : Contactez le support

---

💡 **Tip** : Après chaque changement sur Vercel, attendez 2-3 minutes pour le déploiement automatique. 