<template>
  <div class="main-content py-4">
    <div class="container">
      <!-- Première ligne : Paragraphe -->
      <div class="row mb-4">
        <div class="col">
          <p>
            Ceci est la section principale de votre application. Vous pouvez y ajouter du contenu,
            des composants ou tout ce que vous souhaitez afficher entre le header et le footer.
          </p>
        </div>
      </div>

      <!-- Seconde ligne : Image et panneau de contrôle -->
      <div class="row">
        <!-- Colonne gauche : Image -->
        <div class="col-md-8 d-flex justify-content-center align-items-center">
          <ClassroomImage :markingMode="markingMode" />
        </div>

        <!-- Colonne droite : Panneau de contrôle -->
        <div class="col-md-4">
          <ClassroomControlPanel
            :markingMode="markingMode"
            :disableMarkingMode="!classroomStore.image"
            @toggle-marking-mode="toggleMarkingMode"
            @export-image="exportImage"
          />
        </div>
      </div>

      <!-- Affichage des données déplacé dans ClassroomContent -->
      <div class="row mt-4">
        <div class="col">
          <ClassroomContent />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ClassroomImage from '../components/ClassroomImage.vue';
import ClassroomControlPanel from '../components/ClassroomControlPanel.vue';
import ClassroomContent from '../components/ClassroomContent.vue';
import { useClassroomStore } from '../stores/useClassroomStore';
import { ref } from 'vue';

// Utiliser le store Pinia
const classroomStore = useClassroomStore();
const markingMode = ref(false);

// Fonction pour basculer le mode marquage
const toggleMarkingMode = () => {
  markingMode.value = !markingMode.value;
};

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
.main-content {
  background-color: #f8f9fa;
  /* Couleur de fond claire */
  border-radius: 8px;
  padding: 20px;
}
</style>