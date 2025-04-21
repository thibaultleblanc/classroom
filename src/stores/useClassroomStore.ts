import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";

export const useClassroomStore = defineStore("classroom", () => {
  // État
  const state = ref("start");
  const image = ref<string | null>(null);
  const markers_canvas = reactive<{ x: number; y: number }[]>([]);
  const students = reactive<{ surname: string; name: string }[]>([]); // Liste des élèves
  const xOffset = ref(0);
  const yOffset = ref(0);
  const imageRatio = ref(1);
  const markingMode = ref(false); // Ajout de markingMode

  // Propriété calculée pour les ratioMarkers
  const markers_ratio = computed(() =>
    markers_canvas.map((marker) => ({
      x: Math.ceil((marker.x - xOffset.value) * imageRatio.value),
      y: Math.ceil((marker.y - yOffset.value) * imageRatio.value),
    }))
  );

  // Actions
  const addImage = (newImage: string) => {
    image.value = newImage;
    if (!newImage) {
      removeImage();
      return;
    }
      };

  const setImageDimensions = (
    newXOffset: number,
    newYOffset: number,
    newImageRatio: number
  ) => {
    xOffset.value = newXOffset;
    yOffset.value = newYOffset;
    imageRatio.value = newImageRatio;
    if (!image.value) {
      removeImage(); // Supprimer l'image si elle n'est pas définie
      return;
    }
    state.value = "imageLoaded"; // Mettre à jour l'état
  };

  const removeImage = () => {
    image.value = null;
    markers_canvas.splice(0, markers_canvas.length);
    students.splice(0, students.length); // Réinitialiser les élèves
    xOffset.value = 0;
    yOffset.value = 0;
    imageRatio.value = 1;
    state.value = "start"; // Mettre à jour l'état
  };

  const validatePositions = () => {
    markingMode.value = false; // Désactiver le mode de marquage
    state.value = "positionsValidated";
  };

  const toggleMarkingMode = () => {
    markingMode.value = !markingMode.value;
  };

  const addMarker = (canvasMarker: { x: number; y: number }) => {
    markers_canvas.push(canvasMarker);
  };

  const clearMarkers = () => {
    markers_canvas.splice(0, markers_canvas.length);
  };

  const importStudents = (newStudents: { surname: string; name: string }[]) => {
    if (newStudents.length > markers_canvas.length) {
      throw new Error("Le nombre d'élèves dépasse le nombre de places disponibles.");
    }
    students.splice(0, students.length, ...newStudents); // Remplace la liste des élèves
    state.value = "studentsImported";
  };

  return {
    state,
    image,
    markers_canvas,
    markers_ratio,
    students, // Expose les élèves
    xOffset,
    yOffset,
    imageRatio,
    markingMode, // Expose markingMode
    addImage,
    setImageDimensions,
    removeImage,
    validatePositions,
    toggleMarkingMode,
    addMarker,
    clearMarkers,
    importStudents, // Expose la méthode d'importation des élèves
  };
});
