#!/bin/bash

# Vérifier si ImageMagick est installé
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick n'est pas installé. Installation..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install imagemagick
    else
        sudo apt-get install imagemagick
    fi
fi

# Créer le dossier de sortie s'il n'existe pas
mkdir -p public/formations

# Liste des images à traiter
IMAGES=(
    "meta-ads-2025"
    "social-media-workbook"
    "psychology-selling"
    "productivity-masterclass"
    "business-plan-template"
)

# Traiter chaque image
for img in "${IMAGES[@]}"; do
    if [ -f "public/formations/$img.png" ]; then
        echo "🔄 Redimensionnement de $img.png..."
        convert "public/formations/$img.png" -resize 1200x675^ -gravity center -extent 1200x675 "public/formations/$img.png"
        echo "✅ $img.png redimensionné"
    else
        echo "⚠️  $img.png non trouvé"
    fi
done

echo "✨ Traitement terminé" 