<template>
  <div class="control-panel d-flex flex-column justify-content-center align-items-start">
    <button class="btn btn-primary mb-2" :disabled="disableToggleMarkingMode" @click="toggleMarkingMode">
      {{ markingMode ? 'Désactiver' : 'Activer' }} le mode marquer
    </button>
    <button class="btn btn-secondary mb-2" :disabled="disableExportImage" @click="exportImage">
      Exporter l'image
    </button>
    <button class="btn btn-success mb-2" :disabled="disableImportCsv" @click="triggerFileInput">
      Importer un CSV
    </button>
    <input type="file" ref="fileInput" accept=".csv" class="d-none" @change="handleFileUpload" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue';
import { useClassroomStore } from '../stores/useClassroomStore';

// Déclarer les props
defineProps({
  markingMode: {
    type: Boolean,
    required: true,
  },
  disableMarkingMode: {
    type: Boolean,
    required: true,
  },
});

// Déclarer les événements
const emit = defineEmits(['toggle-marking-mode']);
const classroomStore = useClassroomStore();

// Références
const fileInput = ref<HTMLInputElement | null>(null);

const disableExportImage = computed(() => {
  return !classroomStore.image || classroomStore.markers_canvas.length == 0;
});

const disableImportCsv = computed(() => {
  return !classroomStore.image; // Actif uniquement si une image est chargée
});

const disableToggleMarkingMode = computed(() => {
  return !classroomStore.image;
});

// Méthode pour émettre l'événement de basculement du mode marquer
const toggleMarkingMode = () => {
  emit('toggle-marking-mode');
};

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

// Fonction pour déclencher l'input file
const triggerFileInput = () => {
  fileInput.value?.click();
};

// Fonction pour gérer l'importation du fichier CSV
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const newMarkers: { x: number; y: number }[] = []; // Créer un nouveau tableau pour les marqueurs
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvData = e.target?.result as string;
      const rows = csvData.split('\n').filter((row) => row.trim() !== ''); // Ignorer les lignes vides
      rows.forEach((row) => {
        const [x, y] = row.split(',').map((value) => parseFloat(value.trim()));
        if (!isNaN(x) && !isNaN(y)) {
          newMarkers.push({
            x: Math.ceil(classroomStore.xOffset + x / classroomStore.imageRatio),
            y: Math.ceil(classroomStore.yOffset + y / classroomStore.imageRatio),
          });
        }
      });
      classroomStore.markers_canvas.splice(0, classroomStore.markers_canvas.length, ...newMarkers);
    };
    reader.readAsText(file);
  }
};
</script>

<style scoped>
.control-panel {
  width: 100%;
}
</style>