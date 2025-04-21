#!/bin/bash

echo "Running Docker container in development mode..."

# Exécuter le conteneur en mode développement
docker run -it --rm -v $PWD:/app --name classroom-dev -p 5173:5173 classroom-dev

echo "Development container stopped."