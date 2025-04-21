<template>
  <footer class="footer bg-dark py-0">
    <div class="links-container p-2 mx-0">
      <a
        href="https://github.com/thibaultleblanc"
        target="_blank"
        class="icon-link"
      >
        <font-awesome-icon :icon="['fab', 'github']" class="icon" />
      </a>
      <a
        href="https://fr.linkedin.com/in/thibault-leblanc-303635138"
        target="_blank"
        class="icon-link"
      >
        <font-awesome-icon :icon="['fab', 'linkedin']" class="icon" />
      </a>
    </div>
    <div class="text-center p-2">© 2025 Thibault Leblanc</div>
  </footer>
</template>

<style scoped>
.footer {
  left: 0;
  bottom: 0;
  width: 100%;
  color: white;
  text-align: center;
  padding: 0;
}

.links-container {
  background-color: rgba(255, 255, 255, 0.1);
  width: 100%;
  display: flex;
  justify-content: center;
}

.icon-link {
  color: white;
  text-decoration: none;
  margin: 0 10px;
}
.icon-link:hover {
  color: lightgray;
}

.icon {
  font-size: 30px;
}
</style>
