#!/bin/bash

echo "Running Docker container in build mode..."

# Exécuter le conteneur en mode production

docker run -it --rm -v $PWD:/app --name classroom-build classroom-build

echo "Production container stopped."