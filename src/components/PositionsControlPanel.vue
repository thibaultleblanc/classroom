<template>
  <div class="container">
    <!-- Instructions -->
    <div class="row mb-4">
      <div class="col">
        <p class="instructions">
          Commencez par charger une image de la salle de classe.
        </p>
        <p class="instructions">
          Ensuite, ajoutez des positions pour indiquer les bureaux ou importez un fichier CSV contenant les positions
          des bureaux.
        </p>
        <p class="instructions">
          Replacez les positions en modifiant les coordonnées X et Y dans la liste des bureaux.
        </p>
        <p class="instructions">
          Une fois terminé, validez les positions en cliquant sur le bouton <strong>"Valider les bureaux"</strong>.
        </p>
      </div>
    </div>

    <!-- Boutons Ajouter des bureaux et Importer un CSV -->
    <div class="row g-3 align-items-center mb-4">
      <div class="col-md-6">
        <button class="btn btn-primary w-100" :disabled="disableToggleMarkingMode"
          @click="classroomStore.toggleMarkingMode">
          {{ classroomStore.markingMode ? 'Arrêter l\'ajout' : 'Ajouter des bureaux' }}
        </button>
      </div>
      <div class="col-md-6">
        <button class="btn btn-success w-100" :disabled="disableImportCsv" @click="triggerFileInput">
          Importer un CSV
        </button>
      </div>
    </div>

    <!-- Bouton Télécharger le CSV -->
    <div class="row mb-4">
      <div class="col">
        <button class="btn btn-warning w-100" :disabled="disableDownloadCsv" @click="downloadCsv">
          Télécharger le CSV
        </button>
      </div>
    </div>

    <!-- Bouton Valider les bureaux -->
    <div class="row mb-4">
      <div class="col">
        <button class="btn btn-info w-100" :disabled="disableValidatePositions" @click="openModal">
          Valider les bureaux
        </button>
      </div>
    </div>

    <!-- Modale -->
    <FullScreenModal id="validationModal" ref="modalRef">
      <template #header>
        <h5 class="modal-title">Validation des positions</h5>
      </template>
      <template #body>
        <p>Êtes-vous sûr de vouloir valider les positions des élèves ?</p>
        <p>Pensez à télécharger les position. Cette action ne sera plus disponible après.</p>
      </template>
      <template #footer>
        <button type="button" class="btn btn-warning" @click="downloadCsv">Télécharger le CSV</button>
        <button type="button" class="btn btn-primary" @click="confirmValidation">Confirmer</button>
      </template>
    </FullScreenModal>

    <!-- Input pour importer un fichier CSV -->
    <input type="file" ref="fileInput" accept=".csv" class="d-none" @change="handleFileUpload" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useClassroomStore } from '@/stores/useClassroomStore';
import FullScreenModal from '@/components/FullScreenModal.vue';

// Utiliser le store Pinia
const classroomStore = useClassroomStore();

// Références
const modalRef = ref(null);
const fileInput = ref<HTMLInputElement | null>(null);

// Méthodes pour ouvrir et fermer la modale
const openModal = () => {
  modalRef.value?.open();
};

const closeModal = () => {
  modalRef.value?.close();
};

// Fonction pour confirmer la validation
const confirmValidation = () => {
  classroomStore.validatePositions();
  closeModal(); // Fermer la modale après validation
};

// Fonction pour télécharger le CSV
const downloadCsv = () => {
  // Ajouter l'entête "x,y" au début du fichier CSV
  const csvHeader = "x,y";
  const csvContent = classroomStore.markersRatioImage
    .map((marker) => `${marker.x },${marker.y}`)
    .join('\n');
  const fullCsvContent = `${csvHeader}\n${csvContent}`; // Combiner l'entête et les données

  // Créer un fichier Blob pour le téléchargement
  const blob = new Blob([fullCsvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'positions.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Computed pour désactiver les boutons
const disableImportCsv = computed(() => {
  return !classroomStore.image; // Actif uniquement si une image est chargée
});

const disableToggleMarkingMode = computed(() => {
  return !classroomStore.image;
});

const disableValidatePositions = computed(() => {
  return classroomStore.markersCanvas.length === 0; // Actif uniquement si des marqueurs existent
});

const disableDownloadCsv = computed(() => {
  return classroomStore.markersCanvas.length === 0; // Actif uniquement si des marqueurs existent
});

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
            x: Math.ceil(x / classroomStore.imageRatio),
            y: Math.ceil(y / classroomStore.imageRatio),
          });
        }
      });
      classroomStore.markersCanvas.splice(0, classroomStore.markersCanvas.length, ...newMarkers);
    };
    reader.readAsText(file);
  }

  // Réinitialiser la valeur de l'input pour permettre de réimporter le même fichier
  target.value = '';
};
</script>

<style scoped>
.instructions {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  text-align: justify;
}

.btn {
  font-size: 1rem;
  padding: 0.75rem 1rem;
}
</style>