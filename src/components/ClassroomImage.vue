<template>
  <div class="classroom-image position-relative">
    <!-- Canvas grisé -->
    <div class="canvas bg-light d-flex align-items-center justify-content-center position-relative"
      @click="markPosition">
      <!-- Bouton "Load Image" (visible si aucune image n'est chargée) -->
      <button v-if="!classroomStore.image" class="btn btn-primary btn-lg position-absolute" @click="triggerFileInput">
        Load Image
      </button>

      <!-- Image chargée -->
      <img v-if="classroomStore.image" :src="classroomStore.image" alt="Image chargée" class="img-fluid" ref="imageElement" />

      <!-- Croix pour supprimer l'image (visible si une image est chargée) -->
      <button v-if="classroomStore.image" class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2" @click="removeImage">
        &times;
      </button>

      <!-- Marqueurs (croix rouges) -->
      <div v-for="(marker, index) in classroomStore.markers_canvas" :key="index" class="marker"
        :style="{ top: marker.y + 'px', left: marker.x + 'px' }">
        &times;
      </div>
    </div>

    <!-- Input caché pour uploader une image -->
    <input type="file" ref="fileInput" accept="image/*" class="d-none" @change="handleImageUpload" />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useClassroomStore } from '../stores/useClassroomStore';

// Utiliser le store
const classroomStore = useClassroomStore();

// Références et état local
const fileInput = ref<HTMLInputElement | null>(null);
const imageElement = ref<HTMLImageElement | null>(null);

// Fonction pour déclencher l'input file
const triggerFileInput = () => {
  fileInput.value?.click();
};

// Fonction pour gérer l'upload de l'image
const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const newImage = e.target?.result as string;
      classroomStore.addImage(newImage); // Stocker l'image dans le store

      // Attendre que l'image soit rendue dans le DOM
      await nextTick();
      setImageDimensions();
    };
    reader.readAsDataURL(file);
  }
};

// Fonction pour supprimer l'image
const removeImage = () => {
  classroomStore.removeImage(); // Supprimer l'image dans le store
};

// Fonction pour marquer une position
const markPosition = (event: MouseEvent) => {
  if (!classroomStore.markingMode || !classroomStore.image) return;

  // Obtenir la position du clic relative au canvas
  const canvas = event.currentTarget as HTMLElement;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Ajouter le marqueur au store
  classroomStore.addMarker({ x: Math.ceil(x), y: Math.ceil(y) });
};

// Fonction pour afficher les détails de l'image
const setImageDimensions = () => {
  if (!imageElement.value) return;

  const canvas = imageElement.value.closest('.canvas') as HTMLElement;
  const canvasRect = canvas.getBoundingClientRect();
  const imageRect = imageElement.value.getBoundingClientRect();

  const newXOffset = imageRect.left - canvasRect.left;
  const newYOffset = imageRect.top - canvasRect.top;
  const newImageRatio = imageElement.value.naturalWidth / imageRect.width;

  // Mettre à jour les dimensions dans le store
  classroomStore.setImageDimensions(newXOffset, newYOffset, newImageRatio);
};
</script>

<style scoped>
.classroom-image {
  width: 100%;
  margin: 0 auto;
}

.canvas {
  width: 100%;
  height: 60vh;
  border: 2px dashed #ccc;
  border-radius: 8px;
  position: relative;
}

.canvas img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.marker {
  position: absolute;
  color: red;
  font-size: 24px;
  transform: translate(-50%, -50%);
}

button.position-absolute {
  z-index: 10;
}
</style>