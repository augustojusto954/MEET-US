<template>
  <q-layout view="hHh Lpr lFf" class="auth-layout-root bg-white">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
</script>

<style scoped>
.auth-layout-root {
  min-height: 100vh;
  width: 100%;
  background-color: #ffffff;
}
</style>
