<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link class="navbar-brand" to="/">
        <!-- Superposition des icônes -->
        <span class="fa-stack fa-lg">
          <font-awesome-icon :icon="['fas', 'square']" class="fa-stack-2x text-warning" />
          <font-awesome-icon :icon="['fas', 'school']" class="fa-stack-1x text-dark" />
        </span>
        Classroom
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/about">À propos</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
// Pas de logique spécifique pour l'instant
</script>

<style scoped>
/* Ajoutez des styles personnalisés ici si nécessaire */
.fa-stack {
  font-size: 0.75em; /* Ajustez la taille globale de l'icône */
  vertical-align: middle; /* Aligne verticalement l'icône avec le texte */
  position: relative;
  top: -2px; /* Ajustez cette valeur pour surélever l'icône */
}
</style>