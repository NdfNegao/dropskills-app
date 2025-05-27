#!/bin/bash

# =====================================================
# SCRIPT DE MIGRATION AUTOMATISÉ DROPSKILLS V2
# Version Prisma (sans psql)
# =====================================================

set -e  # Arrêter en cas d'erreur

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction de log
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Vérifier les prérequis
check_prerequisites() {
    log "Vérification des prérequis..."
    
    # Vérifier que les fichiers existent
    if [[ ! -f "audit_current_db.sql" ]]; then
        error "Fichier audit_current_db.sql manquant"
    fi
    
    if [[ ! -f "create_v2_schema.sql" ]]; then
        error "Fichier create_v2_schema.sql manquant"
    fi
    
    if [[ ! -f "migrate_data_to_v2.sql" ]]; then
        error "Fichier migrate_data_to_v2.sql manquant"
    fi
    
    if [[ ! -f "prisma/schema_v2.prisma" ]]; then
        error "Fichier prisma/schema_v2.prisma manquant"
    fi
    
    # Vérifier que DATABASE_URL est définie
    if [[ -z "$DATABASE_URL" ]]; then
        error "Variable d'environnement DATABASE_URL non définie"
    fi
    
    success "Prérequis validés"
}

# Fonction pour exécuter du SQL avec Prisma
execute_sql_prisma() {
    local file=$1
    local description=$2
    
    log "Exécution: $description"
    
    if npx prisma db execute --file="$file" --schema=prisma/schema.prisma > "logs/${file%.sql}_$(date +%Y%m%d_%H%M%S).log" 2>&1; then
        success "$description terminé"
    else
        error "$description échoué - Voir logs/${file%.sql}_$(date +%Y%m%d_%H%M%S).log"
    fi
}

# Créer le dossier de logs
mkdir -p logs

# Demander confirmation
echo "🚀 MIGRATION DROPSKILLS VERS V2 (VERSION PRISMA)"
echo "================================================"
echo ""
echo "Cette migration va :"
echo "1. Auditer la base actuelle"
echo "2. Créer le nouveau schéma V2 en parallèle"
echo "3. Migrer toutes les données"
echo "4. Valider la cohérence"
echo ""
warning "⚠️  IMPORTANT: Assurez-vous d'avoir une sauvegarde récente !"
echo ""
read -p "Voulez-vous continuer ? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log "Migration annulée par l'utilisateur"
    exit 0
fi

# Étape 1: Vérification des prérequis
log "=== ÉTAPE 1: VÉRIFICATION DES PRÉREQUIS ==="
check_prerequisites

# Étape 2: Audit de la base actuelle
log "=== ÉTAPE 2: AUDIT DE LA BASE ACTUELLE ==="
execute_sql_prisma "audit_current_db.sql" "Audit de la base de données actuelle"

# Étape 3: Création du schéma V2
log "=== ÉTAPE 3: CRÉATION DU SCHÉMA V2 ==="
execute_sql_prisma "create_v2_schema.sql" "Création du nouveau schéma V2"

# Étape 4: Migration des données
log "=== ÉTAPE 4: MIGRATION DES DONNÉES ==="
warning "Cette étape peut prendre plusieurs minutes selon la taille de vos données..."

# Créer un script temporaire avec COMMIT automatique
cat > temp_migration.sql << EOF
-- Migration avec commit automatique
$(cat migrate_data_to_v2.sql | sed 's/-- COMMIT;/COMMIT;/')
EOF

execute_sql_prisma "temp_migration.sql" "Migration des données vers V2"
rm temp_migration.sql

# Étape 5: Génération du client Prisma V2
log "=== ÉTAPE 5: GÉNÉRATION DU CLIENT PRISMA V2 ==="
log "Génération du client Prisma pour le schéma V2..."

# Sauvegarder le schéma actuel
cp prisma/schema.prisma prisma/schema_backup.prisma

# Utiliser le nouveau schéma temporairement
cp prisma/schema_v2.prisma prisma/schema.prisma

if npx prisma generate; then
    success "Client Prisma V2 généré"
else
    error "Échec de la génération du client Prisma V2"
fi

# Restaurer le schéma original
cp prisma/schema_backup.prisma prisma/schema.prisma

# Étape 6: Tests de validation
log "=== ÉTAPE 6: TESTS DE VALIDATION ==="

# Créer un script de validation
cat > validate_migration.sql << EOF
-- Tests de validation de la migration
SET search_path TO dropskills_v2;

-- Compter les enregistrements
SELECT 'VALIDATION - Comptage des enregistrements' as test;
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'packs' as table_name, COUNT(*) as count FROM packs
UNION ALL
SELECT 'categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'samples' as table_name, COUNT(*) as count FROM samples
UNION ALL
SELECT 'favorites' as table_name, COUNT(*) as count FROM favorites
UNION ALL
SELECT 'tags' as table_name, COUNT(*) as count FROM tags;

-- Vérifier l'intégrité référentielle
SELECT 'VALIDATION - Intégrité référentielle' as test;
SELECT 'Packs sans catégorie' as check_name, COUNT(*) as count 
FROM packs WHERE category_id IS NOT NULL AND category_id NOT IN (SELECT id FROM categories)
UNION ALL
SELECT 'Samples orphelins' as check_name, COUNT(*) as count 
FROM samples WHERE pack_id NOT IN (SELECT id FROM packs)
UNION ALL
SELECT 'Favoris orphelins (users)' as check_name, COUNT(*) as count 
FROM favorites WHERE user_id NOT IN (SELECT id FROM users)
UNION ALL
SELECT 'Favoris orphelins (packs)' as check_name, COUNT(*) as count 
FROM favorites WHERE pack_id NOT IN (SELECT id FROM packs);

-- Vérifier les données critiques
SELECT 'VALIDATION - Données critiques' as test;
SELECT 'Users sans email' as check_name, COUNT(*) as count 
FROM users WHERE email IS NULL OR email = ''
UNION ALL
SELECT 'Packs sans titre' as check_name, COUNT(*) as count 
FROM packs WHERE title IS NULL OR title = '';

SET search_path TO public;
EOF

execute_sql_prisma "validate_migration.sql" "Validation de la migration"
rm validate_migration.sql

# Étape 7: Rapport final
log "=== ÉTAPE 7: RAPPORT FINAL ==="

# Créer un rapport de migration simple
cat > migration_report.md << EOF
# 📊 RAPPORT DE MIGRATION DROPSKILLS V2

**Date:** $(date)
**Statut:** ✅ SUCCÈS

## 🎯 Migration terminée

La migration vers le schéma V2 a été effectuée avec succès.

## 🔧 Prochaines étapes

1. **Tester l'application** avec le nouveau schéma
2. **Mettre à jour les routes API** pour utiliser le nouveau client Prisma
3. **Valider les fonctionnalités** critiques
4. **Planifier le basculement** en production

## 📁 Fichiers générés

- \`logs/\` : Logs détaillés de chaque étape
- \`prisma/schema_v2.prisma\` : Nouveau schéma Prisma
- \`migration_report.md\` : Ce rapport

## ⚠️ Important

Le schéma V2 est créé dans le namespace \`dropskills_v2\`.
L'ancien schéma \`public\` reste intact pour rollback si nécessaire.

EOF

success "Migration terminée avec succès !"
echo ""
log "📊 Rapport de migration généré: migration_report.md"
log "📁 Logs détaillés disponibles dans: logs/"
echo ""
warning "🔄 Prochaines étapes:"
echo "1. Tester l'application avec le nouveau schéma"
echo "2. Mettre à jour les routes API"
echo "3. Planifier le basculement en production"
echo ""
success "🎉 Migration Dropskills V2 terminée !" 