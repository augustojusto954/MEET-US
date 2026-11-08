<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Definições da Plataforma (Admin Settings) ⚙️</div>
        <div class="text-caption text-grey-7">Parâmetros operacionais globais, termos de adesão e moderação automática.</div>
      </div>
    </div>

    <q-card flat class="q-pa-lg" style="max-width: 800px;">
      <div class="text-subtitle1 text-weight-bold text-dark q-mb-md">Configurações Gerais</div>

      <q-list separator>
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label class="text-weight-bold">Registo Aberto a Novos Estudantes</q-item-label>
            <q-item-label caption>Permite que novos estudantes universitários criem conta livremente</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle v-model="settings.allowRegistration" color="primary" />
          </q-item-section>
        </q-item>

        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label class="text-weight-bold">Filtro Automático de Palavras Sensíveis / Moderação AI</q-item-label>
            <q-item-label caption>Deteta linguagem ofensiva e tentativas de cobrança financeira em posts</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle v-model="settings.autoModeration" color="primary" />
          </q-item-section>
        </q-item>

        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label class="text-weight-bold">Exigir E-mail Institucional para Selo Verificado</q-item-label>
            <q-item-label caption>Validação obrigatória de domínios @uem.mz, @up.ac.mz, @isctem.ac.mz, etc.</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle v-model="settings.requireUniEmail" color="primary" />
          </q-item-section>
        </q-item>
      </q-list>

      <div class="row justify-end q-mt-lg">
        <q-btn unelevated rounded color="primary" label="Guardar Parâmetros" @click="$q.notify({ type: 'positive', message: 'Configurações globais salvas com sucesso!' })" />
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const settings = ref({
  allowRegistration: true,
  autoModeration: true,
  requireUniEmail: true
})
</script>
