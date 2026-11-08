<template>
  <div class="fullscreen bg-app text-dark text-center q-pa-md flex flex-center">
    <div style="max-width: 480px;">
      <q-avatar size="100px" class="bg-soft-lavender text-primary q-mb-md shadow-2">
        <q-icon name="explore_off" size="56px" />
      </q-avatar>

      <div class="text-h3 text-weight-bolder text-primary q-mb-xs">404</div>
      <div class="text-h5 text-weight-bolder text-dark q-mb-sm">Página Não Encontrada</div>
      <p class="text-body2 text-grey-7 q-mb-lg">
        O endereço que procuras não existe ou foi movido. Volta ao teu painel de estudo colaborativo.
      </p>

      <q-btn
        unelevated
        rounded
        color="primary"
        icon="home"
        label="Voltar ao Dashboard"
        class="text-weight-bold"
        to="/dashboard"
      />
    </div>
  </div>
</template>

<script setup>
</script>
