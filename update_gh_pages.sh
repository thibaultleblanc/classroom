#!/bin/bash

# Arrêter le script en cas d'erreur
set -e

# Nom de la branche pour le déploiement
BRANCH="gh-pages"

# Vérifier si le dossier dist existe
if [ ! -d "dist" ]; then
  echo "Erreur : le dossier 'dist' n'a pas été généré."
  exit 1
fi

# Initialiser un dépôt Git temporaire dans le dossier dist
echo "Préparation du dossier 'dist' pour le déploiement..."
cd dist
git init
git checkout -b $BRANCH
git add .
git commit -m "Déploiement vers la branche $BRANCH"

# Pousser le contenu de dist vers la branche gh-pages
echo "Poussée des fichiers vers la branche $BRANCH..."
git remote add origin git@github.com:thibaultleblanc/classroom.git
git push --force origin $BRANCH

# Nettoyer le dépôt Git temporaire
cd ..
rm -rf dist/.git

echo "Déploiement terminé avec succès !"