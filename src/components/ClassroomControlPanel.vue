<template>
  <div class="container">
    <div class="row mb-4">
      <div class="col">
        <p>
          Importez une liste d'élèves au format CSV pour les ajouter à la salle de classe. Vous pourrez ensuite exporter l'image.
        </p>
      </div>
      <div class="col-12">
        <button class="btn btn-success w-100" @click="triggerFileInput">
          Importer une liste d'élèves
        </button>
        <input type="file" ref="studentList" accept=".csv" class="d-none" @change="handleFileUpload" />
      </div>
    </div>

    <!-- Ligne 2 : Menu déroulant et bouton "Placer les élèves" -->
    <div class="row mb-4">
      <div class="col-12">
        <label for="distributionMode" class="form-label">Mode de distribution :</label>
        <select id="distributionMode" class="form-select" v-model="selectedDistribution">
          <option value="random">Aléatoire</option>
          <option value="alphabetical">Ordre alphabétique</option>
        </select>
      </div>

      <div class="col-12 mt-2">
        <p class="text-muted">{{ distributionDescription }}</p>
      </div>
      <div class="col-12">
        <button class="btn btn-info w-100" :disabled="disablePlaceStudents" @click="placeStudents">
          Placer les élèves
        </button>
      </div>
    </div>

    <!-- Ligne 3 : Exporter l'image -->
    <div class="row">
      <div class="col-12">
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

// Utiliser le store
const classroomStore = useClassroomStore();

// Références
const studentList = ref<HTMLInputElement | null>(null);

// État local pour le mode de distribution
const selectedDistribution = ref<'random' | 'alphabetical'>('random');

// Description du mode de distribution
const distributionDescription = computed(() => {
  if (selectedDistribution.value === 'random') {
    return 'Les élèves seront placés de manière aléatoire dans la salle.';
  } else if (selectedDistribution.value === 'alphabetical') {
    return 'Les élèves seront placés dans l\'ordre alphabétique.';
  }
  return '';
});

// Propriétés calculées pour gérer l'état des boutons
const disablePlaceStudents = computed(() => {
  return classroomStore.students.length === 0 || classroomStore.markersCanvas.length === 0;
});

const disableExportImage = computed(() => {
  return classroomStore.state !== 'studentsAssigned';
});

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
      if (newStudents.length > classroomStore.markersCanvas.length) {
        alert("Le nombre d'élèves dépasse le nombre de places disponibles !");
        return;
      }

      // Ajouter les élèves au store
      classroomStore.students.splice(0, classroomStore.students.length, ...newStudents);
      console.log("Liste des élèves importée avec succès :", newStudents);
    };
    reader.readAsText(file);
  }

  // Réinitialiser la valeur de l'input pour permettre de réimporter le même fichier
  target.value = '';
};

// Fonction pour placer les élèves
const placeStudents = () => {
  classroomStore.assignStudentsToDesks(selectedDistribution.value); // Appeler la méthode avec la valeur sélectionnée
  console.log(`Les élèves ont été placés en mode : ${selectedDistribution.value}`);
};

// Fonction pour exporter l'image
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

    // Dessiner les noms et prénoms des élèves
    classroomStore.classroom.forEach((item) => {
      if (item.student) {
        const { x, y } = item.deskResized;
        const { surname, name } = item.student;

        // Configurer le style du texte
        ctx.fillStyle = '#00008B'; // Bleu foncé
        ctx.textAlign = 'center';
        ctx.font = 'bold 16px Arial'; // Nom de famille en gras
        ctx.fillText(surname, x, y - 10); // Nom de famille (au-dessus)

        ctx.font = 'normal 14px Arial'; // Prénom en normal
        ctx.fillText(name, x, y + 10); // Prénom (en dessous)
      }
    });

    // Exporter l'image
    const link = document.createElement('a');
    link.download = 'image-avec-eleves.png';
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