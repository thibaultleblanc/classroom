<template>
  <div class="main-content py-4">
    <div class="container">
      <div class="row">
        <div class="col-md-8 d-flex justify-content-center align-items-center">
          <ClassroomImage />
        </div>
        <div class="col-md-4">

          <template v-if="beforePositionValidated">
            <PositionsControlPanel />
          </template>
          <template v-if="afterPositionValidated">
            <ClassroomControlPanel />
          </template>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col">
          <template v-if="beforePositionValidated">
            <PositionsContent />
          </template>
          <template v-if="afterPositionValidated">
            <ClassroomContent />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ClassroomImage from '../components/ClassroomImage.vue';

import PositionsContent from '../components/PositionsContent.vue';
import PositionsControlPanel from '../components/PositionsControlPanel.vue';

import ClassroomControlPanel from '../components/ClassroomControlPanel.vue';
import ClassroomContent from '../components/ClassroomContent.vue';

import { computed } from 'vue';
import { useClassroomStore } from '../stores/useClassroomStore';

// Utiliser le store Pinia
const classroomStore = useClassroomStore();

const beforePositionValidated = computed(() => {
  return classroomStore.state === 'start' || classroomStore.state === 'imageLoaded';
});

const afterPositionValidated = computed(() => {
  return classroomStore.state === 'positionsValidated' || classroomStore.state === 'studentsAssigned';
});
</script>

<style scoped>
.main-content {
  background-color: #f8f9fa;
  /* Couleur de fond claire */
  border-radius: 8px;
  padding: 20px;
}
</style>