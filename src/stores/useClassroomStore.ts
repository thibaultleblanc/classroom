import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';

export const useClassroomStore = defineStore('classroom', () => {
  // État
  const image = ref<string | null>(null);
  const markers_canvas = reactive<{ x: number; y: number }[]>([]);
  const xOffset = ref(0);
  const yOffset = ref(0);
  const imageRatio = ref(1);

  // Propriété calculée pour les ratioMarkers
  const markers_ratio = computed(() =>
    markers_canvas.map((marker) => ({
      x: Math.ceil((marker.x - xOffset.value) * imageRatio.value),
      y: Math.ceil((marker.y - yOffset.value) * imageRatio.value),
    }))
  );

  // Actions
  const setImage = (newImage: string | null) => {
    image.value = newImage;
    if (!newImage) {
      // Réinitialiser les marqueurs et les offsets si l'image est supprimée
      markers_canvas.splice(0, markers_canvas.length);
      xOffset.value = 0;
      yOffset.value = 0;
      imageRatio.value = 1;
    }
  };

  const addMarker = (canvasMarker: { x: number; y: number }) => {
    markers_canvas.push(canvasMarker);
  };

  const clearMarkers = () => {
    markers_canvas.splice(0, markers_canvas.length);
  };

  const setImageDimensions = (newXOffset: number, newYOffset: number, newImageRatio: number) => {
    xOffset.value = newXOffset;
    yOffset.value = newYOffset;
    imageRatio.value = newImageRatio;
  };

  return {
    image,
    markers_canvas,
    markers_ratio, // Expose les ratioMarkers comme une propriété calculée
    xOffset,
    yOffset,
    imageRatio,
    setImage,
    addMarker,
    clearMarkers,
    setImageDimensions,
  };
});