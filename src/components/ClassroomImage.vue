<template>
  <div class="classroom-image position-relative">
    <!-- Canvas grisé -->
    <div class="canvas bg-light d-flex align-items-center justify-content-center position-relative"
      @click="markPosition">
      <!-- Bouton "Load Image" (visible si aucune image n'est chargée) -->
      <button v-if="!imageSrc" class="btn btn-primary btn-lg position-absolute" @click="triggerFileInput">
        Load Image
      </button>

      <!-- Image chargée -->
      <img v-if="imageSrc" :src="imageSrc" alt="Image chargée" class="img-fluid" ref="imageElement" />

      <!-- Croix pour supprimer l'image (visible si une image est chargée) -->
      <button v-if="imageSrc" class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2" @click="removeImage">
        &times;
      </button>

      <!-- Marqueurs (croix rouges) -->
      <div v-for="(marker, index) in markers_canvas" :key="index" class="marker"
        :style="{ top: marker.y + 'px', left: marker.x + 'px' }">
        &times;
      </div>
    </div>

    <!-- Input caché pour uploader une image -->
    <input type="file" ref="fileInput" accept="image/*" class="d-none" @change="handleImageUpload" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue';

// Déclarer les props
const props = defineProps({
  markingMode: {
    type: Boolean,
    required: true,
  },
});

// Déclarer les événements
const emit = defineEmits(['update-image', 'update-markers']);

// Références et état
const fileInput = ref<HTMLInputElement | null>(null);
const imageSrc = ref<string | null>(null);
const markers_canvas = reactive<{ x: number; y: number }[]>([]);
const markers_ratio = ref<{ x: number; y: number }[]>([]); // Marqueurs avec ratio
const imageElement = ref<HTMLImageElement | null>(null); // Référence à l'élément image
const xOffset = ref(0);
const yOffset = ref(0);
const imageRatio = ref(0);

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
      imageSrc.value = e.target?.result as string;
      emit('update-image', imageSrc.value); // Émettre l'image au parent

      // Attendre que l'image soit rendue dans le DOM
      await nextTick();
      setImageDimensions();
    };
    reader.readAsDataURL(file);
  }
};

// Fonction pour supprimer l'image
const removeImage = () => {
  imageSrc.value = null;
  markers_canvas.splice(0, markers_canvas.length); // Supprime tous les marqueurs
  markers_ratio.value.splice(0, markers_ratio.value.length); // Supprime tous les marqueurs avec ratio
  emit('update-image', null); // Émettre null pour indiquer qu'il n'y a plus d'image
  emit('update-markers', []); // Émettre une liste vide de marqueurs
};

// Fonction pour marquer une position
const markPosition = (event: MouseEvent) => {
  if (!props.markingMode || !imageSrc.value) return;

  // Obtenir la position du clic relative au canvas
  const canvas = event.currentTarget as HTMLElement;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Ajouter un marqueur
  markers_canvas.push({ x, y });
  markers_ratio.value.push({
    x: Math.ceil((x - xOffset.value) * imageRatio.value),
    y: Math.ceil((y - yOffset.value) * imageRatio.value),
  });
  // Émettre les marqueurs au parent
  emit('update-markers', markers_ratio.value);

  // Afficher tous les marqueurs dans la console
  console.log('Marqueurs canvas :', markers_canvas);
  console.log('Marqueurs ratio :', markers_ratio.value);
};

// Fonction pour afficher les détails de l'image
const setImageDimensions = () => {
  if (!imageElement.value) return;

  const canvas = imageElement.value.closest('.canvas') as HTMLElement;
  const canvasRect = canvas.getBoundingClientRect();
  const imageRect = imageElement.value.getBoundingClientRect();

  xOffset.value = imageRect.left - canvasRect.left;
  yOffset.value = imageRect.top - canvasRect.top;
  imageRatio.value = imageElement.value.naturalWidth / imageRect.width;

  console.log('Position de l\'image dans le canvas :', {
    top: imageRect.top - canvasRect.top,
    left: imageRect.left - canvasRect.left,
  });

  console.log('Dimensions de l\'image initiale :', {
    width: imageElement.value.naturalWidth,
    height: imageElement.value.naturalHeight,
  });

  console.log('Dimensions de l\'image redimensionnée :', {
    width: imageRect.width,
    height: imageRect.height,
  });
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