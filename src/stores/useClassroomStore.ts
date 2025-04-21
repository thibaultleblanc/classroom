import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';

export const useClassroomStore = defineStore('classroom', () => {
  // État
  const image = ref<string | null>(null);
  const markers_canvas = reactive<{ x: number; y: number }[]>([]);
  const markers_ratio = reactive<{ x: number; y: number }[]>([]);

  // Actions
  const setImage = (newImage: string | null) => {
    image.value = newImage;
    if (!newImage) {
      // Réinitialiser les marqueurs si l'image est supprimée
      markers_canvas.splice(0, markers_canvas.length);
      markers_ratio.splice(0, markers_ratio.length);
    }
  };

  const addMarker = (canvasMarker: { x: number; y: number }, ratioMarker: { x: number; y: number }) => {
    markers_canvas.push(canvasMarker);
    markers_ratio.push(ratioMarker);
  };

  const clearMarkers = () => {
    markers_canvas.splice(0, markers_canvas.length);
    markers_ratio.splice(0, markers_ratio.length);
  };

  return {
    image,
    markers_canvas,
    markers_ratio,
    setImage,
    addMarker,
    clearMarkers,
  };
});