#!/bin/bash

echo "Building Docker images..."

# Construire l'image pour le mode développement
docker build -t classroom-dev --target dev-stage .

# Construire l'image pour le mode de build
docker build -t classroom-build --target build-stage .

# Construire l'image pour le mode production
docker build -t classroom-prod --target production-stage .

echo "Docker images built successfully!"