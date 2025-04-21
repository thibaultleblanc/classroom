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

      <!-- Bouton pour importer un CSV -->
      <div class="col-12 col-md-6">
        <button class="btn btn-success w-100" @click="triggerFileInput">
          Importer une liste d'élèves
        </button>
      </div>

      <!-- Bouton pour exporter l'image -->
      <div class="col-12 col-md-6">
        <button class="btn btn-secondary w-100" :disabled="disableExportImage" @click="exportImage">
          Exporter l'image
        </button>
      </div>
    </div>

    <!-- Input pour importer un fichier CSV -->
    <input type="file" ref="studentList" accept=".csv" class="d-none" @change="handleFileUpload" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useClassroomStore } from '../stores/useClassroomStore';

// Déclarer les événements
const classroomStore = useClassroomStore();

// Références
const studentList = ref<HTMLInputElement | null>(null);

// Fonction pour déclencher l'input file
const triggerFileInput = () => {
  studentList.value?.click();
};

// Fonction pour gérer l'importation du fichier CSV
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const newStudents: { surname: string; name: string }[] = []; // Créer un tableau pour les élèves
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvData = e.target?.result as string;
      const rows = csvData.split('\n').filter((row) => row.trim() !== ''); // Ignorer les lignes vides
      rows.forEach((row) => {
        const [surname, name] = row.split(',').map((value) => value.trim());
        if (surname && name) {
          newStudents.push({ surname, name });
        }
      });

      // Vérifier si le nombre d'élèves dépasse le nombre de marqueurs
      if (newStudents.length > classroomStore.markers_canvas.length) {
        alert("Le nombre d'élèves dépasse le nombre de places disponibles !");
        return;
      }

      // Ajouter les élèves au store
      classroomStore.students.splice(0, classroomStore.students.length, ...newStudents);
      console.log("Liste des élèves importée avec succès :", newStudents);
    };
    reader.readAsText(file);
  }
};

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