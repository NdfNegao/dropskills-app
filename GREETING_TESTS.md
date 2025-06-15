# Tests de Validation - Gestion des Salutations AI Mentor

## Objectif
Vérifier que les mentors IA répondent naturellement aux salutations et messages courts sans appeler l'API IA, tout en conservant des réponses expertes pour les questions spécifiques.

## Cas de Test à Valider

### 1. Salutations Simples (Réponse Directe Attendue)

#### Test 1.1 - Salutations de base
- **Input :** `"Bonjour"`
- **Comportement attendu :** Réponse directe personnalisée selon le mentor
- **Vérification :** Pas d'appel API IA, réponse immédiate et naturelle

#### Test 1.2 - Variations de salutations
- **Inputs à tester :**
  - `"Salut"`
  - `"Hello"`
  - `"Bonsoir"`
  - `"Hey"`
  - `"Bonjour!"`
  - `"Salut!"`

#### Test 1.3 - Salutations avec ponctuation
- **Inputs à tester :**
  - `"Bonjour ?"`
  - `"Ça va ?"`
  - `"Comment allez-vous ?"`

### 2. Messages Courts (Réponse Directe Attendue)

#### Test 2.1 - Messages très courts
- **Inputs à tester :**
  - `"Ok"`
  - `"Merci"`
  - `"Super"`
  - `"Cool"`

### 3. Questions Spécifiques (Appel IA Attendu)

#### Test 3.1 - Copy Mentor
- **Input :** `"Je cherche un kit solaire pour une tiny house"`
- **Comportement attendu :** Appel à l'API IA avec prompt système enrichi
- **Vérification :** Réponse experte en copywriting, naturelle et non robotique

#### Test 3.2 - Questions business
- **Input :** `"Quels sont vos délais de livraison ?"`
- **Comportement attendu :** Appel à l'API IA
- **Vérification :** Réponse adaptée au contexte business

#### Test 3.3 - Questions techniques
- **Input :** `"Comment optimiser mon taux de conversion ?"`
- **Comportement attendu :** Appel à l'API IA
- **Vérification :** Réponse experte et structurée

## Réponses Attendues par Mentor

### Copy Mentor
- **Salutation :** "Bonjour ! Je suis votre Copy Mentor, expert en rédaction persuasive. Comment puis-je vous aider à créer des textes qui convertissent aujourd'hui ?"
- **Alternatives :** Rotation entre 3 réponses personnalisées

### Content Mentor
- **Salutation :** "Bonjour ! Je suis votre Content Mentor, spécialiste des réseaux sociaux. Sur quelle plateforme souhaitez-vous développer votre présence ?"
- **Alternatives :** Rotation entre 3 réponses personnalisées

### Funnel Mentor
- **Salutation :** "Bonjour ! Je suis votre Funnel Mentor, expert en tunnels de vente. Quel est votre taux de conversion actuel ?"
- **Alternatives :** Rotation entre 3 réponses personnalisées

## Critères de Validation

### ✅ Réponses Directes (Salutations)
- [ ] Réponse immédiate (< 500ms)
- [ ] Pas d'appel API visible dans les logs
- [ ] Message personnalisé selon le mentor
- [ ] Ton naturel et engageant
- [ ] Question d'engagement pour poursuivre la conversation

### ✅ Réponses IA (Questions Spécifiques)
- [ ] Appel API confirmé dans les logs
- [ ] Réponse experte et pertinente
- [ ] Ton naturel, non robotique
- [ ] Pas de formules bureaucratiques
- [ ] Structure claire et actionnable

## Instructions de Test

### 1. Accéder à l'Application
```
URL: http://localhost:3000
Navigation: AI Mentor > Sélectionner un mentor
```

### 2. Tester les Salutations
1. Ouvrir la console développeur (F12)
2. Aller dans l'onglet Network
3. Envoyer "Bonjour"
4. Vérifier :
   - Réponse immédiate
   - Pas d'appel à `/api/ai-mentor/[mentorId]` dans Network
   - Message personnalisé affiché

### 3. Tester les Questions Spécifiques
1. Envoyer une question technique
2. Vérifier :
   - Appel API visible dans Network
   - Temps de réponse normal (2-5s)
   - Qualité de la réponse

### 4. Vérifier les Logs Serveur
```bash
# Dans le terminal où tourne npm run dev
# Chercher les messages :
"Salutation détectée pour [mentor]: \"[message]\" -> Réponse directe"
```

## Résultats Attendus

### Performance
- **Salutations :** Réponse < 500ms
- **Questions IA :** Réponse 2-5s (selon API)

### Qualité
- **Salutations :** Naturelles, engageantes, personnalisées
- **Réponses IA :** Expertes, conversationnelles, non robotiques

### Logs
- Messages de détection des salutations visibles
- Pas d'erreurs API pour les salutations
- Appels API normaux pour les questions spécifiques

---

**Note :** Ces tests valident que l'objectif de réponses naturelles et pertinentes est atteint, avec une optimisation des performances pour les interactions simples.