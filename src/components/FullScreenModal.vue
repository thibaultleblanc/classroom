<template>
  <div>
    <!-- Modale Bootstrap -->
    <div
      class="modal fade"
      tabindex="-1"
      :id="id"
      aria-labelledby="modalLabel"
      aria-hidden="true"
      ref="modal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <!-- Header de la modale -->
          <div class="modal-header">
            <slot name="header">
              <h5 class="modal-title" id="modalLabel">Titre de la modale</h5>
            </slot>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <!-- Corps de la modale -->
          <div class="modal-body">
            <slot name="body">
              Contenu de la modale
            </slot>
          </div>

          <!-- Footer de la modale -->
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Modal } from 'bootstrap';

// Props pour rendre le composant générique
defineProps({
  id: {
    type: String,
    required: true,
  },
});

// Référence pour la modale Bootstrap
const modal = ref<HTMLElement | null>(null);
let bootstrapModal: Modal | null = null;

// Initialisation de la modale Bootstrap
onMounted(() => {
  if (modal.value) {
    bootstrapModal = new Modal(modal.value);
  }
});

// Méthodes pour ouvrir et fermer la modale
const open = () => {
  bootstrapModal?.show();
};

const close = () => {
  bootstrapModal?.hide();
};

// Exposer les méthodes pour le parent
defineExpose({
  open,
  close,
});
</script>

<style scoped>
/* Ajoutez des styles personnalisés ici si nécessaire */
</style>