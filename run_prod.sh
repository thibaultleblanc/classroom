#!/bin/bash

echo "Running Docker container in production mode..."

# Exécuter le conteneur en mode production
docker run -it --rm -p 80:80 classroom-prod

echo "Production container stopped."