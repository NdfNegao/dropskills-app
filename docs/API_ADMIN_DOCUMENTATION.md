# 📚 Documentation API Admin DropSkills

## Vue d'ensemble

Cette documentation décrit toutes les APIs administratives développées pour DropSkills. Toutes les APIs sont sécurisées et nécessitent une authentification admin.

## 🔐 Authentification

Toutes les APIs admin nécessitent un token d'authentification valide. Les routes sont protégées par middleware.

**Base URL :** `http://localhost:3001/api/admin`

---

## 📊 API Dashboard Stats

### GET `/api/admin/dashboard/stats`

Récupère les statistiques globales du dashboard admin.

**Réponse :**
```json
{
  "users": {
    "total": 8,
    "active": 8,
    "new_this_month": 8
  },
  "packs": {
    "total": 3,
    "sold": 127,
    "revenue": 5683
  },
  "tools": {
    "total": 11,
    "premium": 6,
    "usage_today": 89
  },
  "activity": {
    "percentage": 94,
    "trend": "up"
  }
}
```

**Codes de statut :**
- `200`: Succès
- `500`: Erreur serveur

---

## 👥 API Utilisateurs

### GET `/api/admin/users`

Récupère la liste des utilisateurs avec pagination et filtres.

**Paramètres de requête :**
- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre d'éléments par page (défaut: 10)
- `status` (optionnel) : Filtre par statut (`free`, `premium`, `enterprise`)
- `search` (optionnel) : Recherche par email ou nom

**Exemple :**
```
GET /api/admin/users?page=1&limit=5&status=premium
```

**Réponse :**
```json
{
  "users": [
    {
      "id": "1",
      "email": "admin@dropskills.com",
      "name": "Admin User",
      "subscription_status": "premium",
      "created_at": "2024-01-15T10:30:00Z",
      "last_login": "2024-06-01T08:15:00Z",
      "is_active": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 8,
    "pages": 2
  }
}
```

---

## 📦 API Packs

### GET `/api/admin/packs`

Récupère la liste des packs avec statistiques de vente.

**Réponse :**
```json
[
  {
    "id": "1",
    "name": "Pack Starter",
    "description": "Pack parfait pour commencer avec les outils IA",
    "price": 29,
    "tools_included": ["ICP_MAKER", "HOOK_GENERATOR"],
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "sales_count": 45
  }
]
```

### POST `/api/admin/packs`

Crée un nouveau pack.

**Corps de la requête :**
```json
{
  "name": "Nouveau Pack",
  "description": "Description du pack",
  "price": 99,
  "tools_included": ["TOOL1", "TOOL2"],
  "is_active": true
}
```

---

## 🎫 API Support

### GET `/api/admin/support`

Récupère la liste des tickets de support avec filtres.

**Paramètres de requête :**
- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre d'éléments par page (défaut: 20)
- `status` (optionnel) : Filtre par statut (`open`, `in_progress`, `resolved`, `closed`)
- `priority` (optionnel) : Filtre par priorité (`low`, `medium`, `high`, `urgent`)

**Exemple :**
```
GET /api/admin/support?status=open&priority=high
```

**Réponse :**
```json
{
  "tickets": [
    {
      "id": "1",
      "user_email": "john.doe@example.com",
      "subject": "Problème avec les outils IA",
      "message": "Je n'arrive pas à utiliser l'outil ICP Maker...",
      "status": "open",
      "priority": "medium",
      "assigned_to": null,
      "response": null,
      "created_at": "2024-06-01T14:30:00Z",
      "updated_at": "2024-06-01T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 3,
    "pages": 1
  }
}
```

### POST `/api/admin/support`

Crée un nouveau ticket de support.

**Corps de la requête :**
```json
{
  "user_email": "user@example.com",
  "subject": "Nouveau ticket",
  "message": "Description du problème",
  "status": "open",
  "priority": "medium"
}
```

### GET `/api/admin/support/[id]`

Récupère un ticket spécifique par son ID.

### PUT `/api/admin/support/[id]`

Met à jour un ticket de support.

**Corps de la requête (partiel) :**
```json
{
  "status": "resolved",
  "response": "Problème résolu",
  "assigned_to": "Équipe Support"
}
```

---

## 💡 API Feature Requests

### GET `/api/admin/feature-requests`

Récupère la liste des demandes de fonctionnalités triées par votes.

**Paramètres de requête :**
- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre d'éléments par page (défaut: 20)
- `status` (optionnel) : Filtre par statut (`submitted`, `under_review`, `planned`, `in_development`, `completed`, `rejected`)
- `category` (optionnel) : Filtre par catégorie (`ai_tool`, `ui_improvement`, `new_feature`, `integration`, `other`)
- `priority` (optionnel) : Filtre par priorité (`low`, `medium`, `high`, `critical`)

**Exemple :**
```
GET /api/admin/feature-requests?category=ai_tool&status=planned
```

**Réponse :**
```json
{
  "features": [
    {
      "id": "1",
      "user_email": "sarah.dev@company.com",
      "title": "Générateur d'emails de prospection",
      "description": "Créer un outil IA qui génère des emails...",
      "category": "ai_tool",
      "priority": "high",
      "status": "planned",
      "votes": 47,
      "estimated_effort": "large",
      "target_version": "v2.1",
      "assigned_to": "Équipe IA",
      "business_value": "high",
      "technical_complexity": "medium",
      "created_at": "2024-05-27T18:51:52Z",
      "updated_at": "2024-05-31T18:51:52Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "pages": 1
  }
}
```

### POST `/api/admin/feature-requests`

Crée une nouvelle demande de fonctionnalité.

**Corps de la requête :**
```json
{
  "user_email": "user@example.com",
  "title": "Nouvelle fonctionnalité",
  "description": "Description détaillée de la fonctionnalité",
  "category": "new_feature",
  "priority": "medium",
  "status": "submitted"
}
```

---

## 🛡️ Validation des Données

Toutes les APIs utilisent des schémas Zod pour la validation :

### Support Ticket
- `user_email`: Email valide
- `subject`: 5-200 caractères
- `message`: 10-5000 caractères
- `status`: `open` | `in_progress` | `resolved` | `closed`
- `priority`: `low` | `medium` | `high` | `urgent`

### Feature Request
- `user_email`: Email valide
- `title`: 5-200 caractères
- `description`: 20-1000 caractères
- `category`: `ai_tool` | `ui_improvement` | `new_feature` | `integration` | `other`
- `priority`: `low` | `medium` | `high` | `critical`
- `status`: `submitted` | `under_review` | `planned` | `in_development` | `completed` | `rejected`

---

## ⚠️ Gestion d'Erreurs

### Codes d'erreur communs

- **400 Bad Request**: Données invalides
  ```json
  {
    "error": "Données invalides",
    "details": [
      {
        "field": "user_email",
        "message": "Email invalide"
      }
    ]
  }
  ```

- **404 Not Found**: Ressource non trouvée
  ```json
  {
    "error": "Ticket non trouvé"
  }
  ```

- **500 Internal Server Error**: Erreur serveur
  ```json
  {
    "error": "Erreur serveur"
  }
  ```

---

## 🔧 Configuration

### Variables d'environnement requises
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Fallbacks
Toutes les APIs ont des fallbacks avec des données mockées si les tables Supabase ne sont pas disponibles.

---

## 🚀 Performance

- **Pagination**: Toutes les listes supportent la pagination
- **Filtres**: Filtrage côté serveur pour de meilleures performances
- **Cache**: Headers `Cache-Control` appropriés
- **Validation**: Validation côté serveur avec Zod

---

## 📝 Exemples d'usage

### Récupérer les tickets ouverts urgents
```bash
curl "http://localhost:3001/api/admin/support?status=open&priority=urgent"
```

### Créer un nouveau ticket
```bash
curl -X POST "http://localhost:3001/api/admin/support" \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "user@example.com",
    "subject": "Bug urgent",
    "message": "Description du bug",
    "status": "open",
    "priority": "urgent"
  }'
```

### Récupérer les features les plus votées
```bash
curl "http://localhost:3001/api/admin/feature-requests?limit=5"
```

---

## 🧪 Tests

Tests Jest disponibles dans `__tests__/api/admin.test.ts` :

```bash
npm run test              # Lancer tous les tests
npm run test:watch        # Mode watch
npm run test:coverage     # Avec coverage
```

Tests couverts :
- ✅ Toutes les APIs GET/POST
- ✅ Validation des données
- ✅ Gestion d'erreurs
- ✅ Pagination
- ✅ Filtres
- ✅ Performance