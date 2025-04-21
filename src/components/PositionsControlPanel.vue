<template>
  <div class="container">
    <div class="row mb-4">
      <div class="col">
        <p>
          Commencez par charger une image de la salle de classe. Vous pouvez ensuite ajouter des positions pour indiquer
          les bureaux.
        </p>
      </div>
    </div>

    <div class="row g-2">
      <!-- Bouton pour activer/désactiver le mode marquage -->
      <div class="col-12 col-md-6">
        <button class="btn btn-primary w-100" :disabled="disableToggleMarkingMode" @click="classroomStore.toggleMarkingMode">
          {{ classroomStore.markingMode ? 'Arrêter l\'ajout' : 'Ajouter des bureaux' }}
        </button>
      </div>

      <!-- Bouton pour importer un CSV -->
      <div class="col-12 col-md-6">
        <button class="btn btn-success w-100" :disabled="disableImportCsv" @click="triggerFileInput">
          Importer un CSV
        </button>
      </div>

      <!-- Bouton pour valider les bureaux -->
      <div class="col-12 col-md-6">
        <button class="btn btn-info w-100" :disabled="disableValidatePositions" @click="validatePositions">
          Valider les bureaux
        </button>
      </div>
    </div>

    <!-- Input pour importer un fichier CSV -->
    <input type="file" ref="fileInput" accept=".csv" class="d-none" @change="handleFileUpload" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useClassroomStore } from '../stores/useClassroomStore';

// Déclarer les événements
const classroomStore = useClassroomStore();

// Références
const fileInput = ref<HTMLInputElement | null>(null);

const disableImportCsv = computed(() => {
  return !classroomStore.image; // Actif uniquement si une image est chargée
});

const disableToggleMarkingMode = computed(() => {
  return !classroomStore.image;
});

const disableValidatePositions = computed(() => {
  return classroomStore.markers_canvas.length === 0; // Actif uniquement si des marqueurs existent
});

// Fonction pour valider les bureaux
const validatePositions = () => {
  classroomStore.validatePositions(); // Appelle la fonction du store
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