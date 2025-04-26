<template>
  <div class="positions-content">
    <h5>Bureaux :</h5>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Bureau</th>
          <th>Position X</th>
          <th>Position Y</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(marker, index) in classroomStore.markersCanvas" :key="index">
          <td>Bureau-{{ index + 1 }}</td>
          <td>
            <input
              type="number"
              class="form-control"
              v-model.number="marker.x"
              :min="0"
              :max="classroomStore.xMax"
              @input="updateMarker(index, 'x', marker.x)"
            />
          </td>
          <td>
            <input
              type="number"
              class="form-control"
              v-model.number="marker.y"
              :min="0"
              :max="classroomStore.yMax"
              @input="updateMarker(index, 'y', marker.y)"
            />
          </td>
          <td>
            <button class="btn btn-danger btn-sm" @click="removeMarker(index)">
              Supprimer
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { useClassroomStore } from '../stores/useClassroomStore';

// Utiliser le store Pinia
const classroomStore = useClassroomStore();

// Fonction pour mettre à jour un marqueur
const updateMarker = (index: number, key: 'x' | 'y', value: number) => {
  // Limiter la valeur à la plage autorisée
  if (key === 'x') {
    value = Math.max(0, Math.min(classroomStore.xMax, value));
  } else if (key === 'y') {
    value = Math.max(0, Math.min(classroomStore.yMax, value));
  }

  classroomStore.markersCanvas[index][key] = value;
};

// Fonction pour supprimer un marqueur
const removeMarker = (index: number) => {
  classroomStore.markersCanvas.splice(index, 1); // Supprimer également du canvas
};
</script>

<style scoped>
.positions-content {
  margin-top: 20px;
}

.table {
  margin-top: 10px;
}
</style>