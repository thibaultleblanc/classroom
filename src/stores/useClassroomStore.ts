import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";

export const useClassroomStore = defineStore("classroom", () => {
  // État
  const state = ref("start");
  const image = ref<string | null>(null);
  const markersCanvas = reactive<{ x: number; y: number }[]>([]);
  const markersRatioImage = computed(() => {
    return markersCanvas.map(marker => ({
      x: Math.ceil(marker.x * imageRatio.value),
      y: Math.ceil(marker.y * imageRatio.value),
    }));
  }); // Liste des marqueurs sur l'image
  const students = reactive<{ surname: string; name: string }[]>([]); // Liste des élèves
  const classroom = reactive<{ desk: { x: number; y: number }; deskResized: { x: number; y: number }; student: { name: string; surname: string } | null }[]>([]); // Liste des bureaux et élèves
  const xOffset = ref(0);
  const yOffset = ref(0);
  const xMax = ref(0);
  const yMax = ref(0);
  const imageRatio = ref(1);
  const markingMode = ref(false);

  // Actions
  const addImage = (newImage: string) => {
    image.value = newImage;
    if (!newImage) {
      removeImage();
      return;
    }
  };

  const setImageDimensions = (newXOffset: number, newYOffset: number, canvaImgWidth: number, canvaImgHeight: number, newImageRatio: number) => {
    xOffset.value = newXOffset;
    yOffset.value = newYOffset;
    xMax.value = newXOffset + canvaImgWidth;
    yMax.value = newYOffset + canvaImgHeight;
    imageRatio.value = newImageRatio;
    state.value = "imageLoaded";
  };

  const removeImage = () => {
    image.value = null;
    markersCanvas.splice(0, markersCanvas.length);
    students.splice(0, students.length);
    classroom.splice(0, classroom.length); // Réinitialiser la liste des bureaux et élèves
    xOffset.value = 0;
    yOffset.value = 0;
    xMax.value = 0;
    yMax.value = 0;
    imageRatio.value = 1;
    state.value = "start";
  };

  const validatePositions = () => {
    markingMode.value = false;
    state.value = "positionsValidated";
  };

  const toggleMarkingMode = () => {
    markingMode.value = !markingMode.value;
  };

  const addMarker = (canvasMarker: { x: number; y: number }) => {
    markersCanvas.push(canvasMarker);
  };

  const clearMarkers = () => {
    markersCanvas.splice(0, markersCanvas.length);
  };

  const importStudents = (newStudents: { surname: string; name: string }[]) => {
    if (newStudents.length > markersCanvas.length) {
      throw new Error("Le nombre d'élèves dépasse le nombre de places disponibles.");
    }
    students.splice(0, students.length, ...newStudents);
    state.value = "studentsImported";
  };

  const assignStudentsToDesks = (mode: "random" | "alphabetical") => {
    classroom.splice(0, classroom.length); // Réinitialiser la liste des bureaux et élèves

    let sortedStudents = [...students];
    if (mode === "alphabetical") {
      sortedStudents.sort((a, b) => a.surname.localeCompare(b.surname));
    } else if (mode === "random") {
      sortedStudents = sortedStudents.sort(() => Math.random() - 0.5);
    }

    markersCanvas.forEach((marker, index) => {
      const student = sortedStudents[index] || null; // Associer un élève ou laisser null si pas assez d'élèves
      classroom.push({
        desk: { x: marker.x, y: marker.y },
        deskResized: {
          x: Math.ceil(marker.x * imageRatio.value),
          y: Math.ceil(marker.y * imageRatio.value),
        },
        student: student,
      });
    });

    state.value = "studentsAssigned";
  };

  // Nouvelle fonction : Mettre à jour les marqueurs lors du redimensionnement
  const updateMarkersOnResize = (oldRatio: number, newRatio: number) => {
    markersCanvas.forEach(marker => {
      marker.x = Math.round(marker.x * (oldRatio / newRatio));
      marker.y = Math.round(marker.y * (oldRatio / newRatio));
    });
  };

  return {
    state,
    image,
    markersCanvas,
    markersRatioImage,
    students,
    classroom, // Expose la liste des bureaux et élèves
    xOffset,
    yOffset,
    xMax,
    yMax,
    imageRatio,
    markingMode,
    addImage,
    setImageDimensions,
    removeImage,
    validatePositions,
    toggleMarkingMode,
    addMarker,
    clearMarkers,
    importStudents,
    assignStudentsToDesks, // Expose la méthode d'association
    updateMarkersOnResize, // Expose la nouvelle fonction
  };
});
