<template>
  <div class="control-panel d-flex flex-column justify-content-center align-items-start">
    <button class="btn btn-primary mb-2" :disabled="disableMarkingMode" @click="toggleMarkingMode">
      {{ markingMode ? 'Désactiver' : 'Activer' }} le mode marquer
    </button>
    <button class="btn btn-secondary mb-2" :disabled="disableMarkingMode" @click="exportImage">
      Exporter l'image
    </button>
    <button class="btn btn-success mb-2">Bouton 3</button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

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
const emit = defineEmits(['toggle-marking-mode', 'export-image']);

// Méthode pour émettre l'événement de basculement du mode marquer
const toggleMarkingMode = () => {
  emit('toggle-marking-mode');
};

// Méthode pour émettre l'événement d'exportation de l'image
const exportImage = () => {
  emit('export-image');
};
</script>

<style scoped>
/* Ajoutez des styles personnalisés ici si nécessaire */
.control-panel {
  width: 100%;
}
</style>