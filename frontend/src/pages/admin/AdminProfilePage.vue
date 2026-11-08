<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Perfil do Administrador</div>
        <div class="text-caption text-grey-7">Credenciais e nível de privilégio na gestão do MEET-US.</div>
      </div>
    </div>

    <q-card flat class="q-pa-lg" style="max-width: 600px;">
      <div class="row items-center q-mb-lg">
        <q-avatar size="64px" class="bg-primary text-white text-weight-bolder shadow-2">
          A
        </q-avatar>
        <div class="q-ml-md">
          <div class="text-h6 text-weight-bolder text-dark">Administrador Central</div>
          <div class="text-caption text-grey-7">admin@meetus.mz</div>
          <q-badge color="deep-purple" class="q-mt-xs">Super Administrador (Acesso Total)</q-badge>
        </div>
      </div>

      <q-separator class="q-my-md" />

      <div class="column q-gutter-md">
        <q-input v-model="adminName" label="Nome do Responsável" outlined dense />
        <q-input v-model="adminEmail" label="E-mail de Notificações Técnicas" outlined dense />
        <div class="row justify-end">
          <q-btn unelevated rounded color="primary" label="Atualizar Credenciais" @click="$q.notify({ type: 'positive', message: 'Dados de administrador salvos!' })" />
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const adminName = ref('Administrador Central MEET-US')
const adminEmail = ref('admin@meetus.mz')
</script>
