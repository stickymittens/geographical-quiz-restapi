<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <RouterView />

  <NavBar id="navbar" />
</template>

<style scoped>
#navbar {
  z-index: 10;

  position: fixed;
  width: 100%;

  top: 0;
  left: 0;
}

input:focus {
  outline: none;
  box-shadow: none;
  border-color: var(--color-border-hover); /* Optional: custom focus border */
}
</style>
