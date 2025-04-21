<template>
  <div class="container">
    <div class="row mb-4">
      <div class="col">
        <p>
          Importez une liste d'élèves au format CSV pour les ajouter à la salle de classe. Vous pourrez ensuite exporter l'image.
        </p>
      </div>
    </div>

    <div class="row g-2">
      <!-- Bouton pour exporter l'image -->
      <div class="col-12 col-md-6">
        <button class="btn btn-secondary w-100" :disabled="disableExportImage" @click="exportImage">
          Exporter l'image
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useClassroomStore } from '../stores/useClassroomStore';

// Déclarer les événements
const classroomStore = useClassroomStore();

// Propriétés calculées pour gérer l'état des boutons
const disableExportImage = computed(() => {
  return !classroomStore.image || classroomStore.markers_canvas.length === 0;
});

// Fonction pour exporter l'image avec les marqueurs
const exportImage = () => {
  if (!classroomStore.image) {
    console.error("Aucune image à exporter.");
    return;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    console.error("Impossible d'obtenir le contexte du canvas.");
    return;
  }

  const img = new Image();
  img.src = classroomStore.image;

  img.onload = () => {
    // Configurer la taille du canvas
    canvas.width = img.width;
    canvas.height = img.height;

    // Dessiner l'image de base
    ctx.drawImage(img, 0, 0);

    // Dessiner les marqueurs
    classroomStore.markers_ratio.forEach((marker) => {
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(marker.x, marker.y, 10, 0, Math.PI * 2);
      ctx.fill();
    });

    // Exporter l'image
    const link = document.createElement('a');
    link.download = 'image-avec-marqueurs.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
};
</script>

<style scoped>
.control-panel {
  width: 100%;
}
</style>