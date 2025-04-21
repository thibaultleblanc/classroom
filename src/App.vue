<script setup lang="ts">
import ClassroomNavbar from './components/ClassroomNavbar.vue'
</script>

<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <!-- Header -->
    <header>
      <ClassroomNavbar />
    </header>

    <!-- Partie centrale -->
    <main class="flex-grow-1 py-4">
      <div class="container flex-grow-1">
        <router-view />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-dark text-white py-3 mt-auto">
      <div class="container text-center">
        <p>&copy; 2025 Classroom. Tous droits réservés.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Ajoutez des styles personnalisés ici si nécessaire */
</style>