<template>
  <div class="classroom-content">
    <h5>Elèves :</h5>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Prénom</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="( student, index ) in classroomStore.students" :key="index">
          <td>{{ student.surname }}</td>
          <td>{{ student.name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { useClassroomStore } from '../stores/useClassroomStore';

// Utiliser le store Pinia
const classroomStore = useClassroomStore();
</script>

<style scoped>
.classroom-content {
  margin-top: 20px;
}

.table {
  margin-top: 10px;
}
</style>