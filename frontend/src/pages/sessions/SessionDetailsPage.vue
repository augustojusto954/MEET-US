<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center q-mb-lg">
      <q-btn flat round dense icon="arrow_back" color="grey-8" class="q-mr-sm" @click="$router.back()" />
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Detalhes da Sessão de Estudo</div>
        <div class="text-caption text-grey-7">
          Sala, materiais e acompanhamento em direto da sessão colaborativa.
        </div>
      </div>
    </div>

    <div v-if="session" class="row q-col-gutter-lg">
      <div class="col-12 col-md-8">
        <q-card flat class="q-pa-lg q-mb-md">
          <div class="row items-center justify-between q-mb-md">
            <q-badge color="positive" class="q-px-sm q-py-xs text-weight-bold">
              ● Sessão Ativa
            </q-badge>
            <span class="text-caption text-grey-7">Duração Prevista: 90 minutos</span>
          </div>

          <div class="text-h5 text-weight-bolder text-dark q-mb-xs">
            {{ session.skillGiven }} ⇄ {{ session.skillReceived }}
          </div>
          <div class="text-body2 text-grey-8 q-mb-md">
            {{ session.goal }}
          </div>

          <!-- Participantes -->
          <div class="bg-soft-lavender q-pa-md rounded-borders q-mb-lg">
            <div class="text-caption text-weight-bold text-primary q-mb-sm">PARTICIPANTES DA SESSÃO:</div>
            <div class="row q-col-gutter-md">
              <div class="col-6 row items-center">
                <q-avatar size="44px">
                  <img :src="store.currentUser.avatar" />
                </q-avatar>
                <div class="q-ml-sm">
                  <div class="text-weight-bold text-dark">{{ store.currentUser.name }}</div>
                  <div class="text-caption text-grey-7">Você (Estudante/Mentor)</div>
                </div>
              </div>
              <div class="col-6 row items-center">
                <q-avatar size="44px">
                  <img :src="session.partnerAvatar" />
                </q-avatar>
                <div class="q-ml-sm">
                  <div class="text-weight-bold text-dark">{{ session.partnerName }}</div>
                  <div class="text-caption text-grey-7">{{ session.partnerCourse }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Ações da Sessão -->
          <div class="row q-gutter-sm">
            <q-btn
              unelevated
              rounded
              color="positive"
              icon="videocam"
              label="Iniciar / Entrar na Sala de Vídeo"
              class="text-weight-bold"
              :to="{ name: 'calls', query: { partner: session.partnerName } }"
            />
            <q-btn
              outline
              rounded
              color="primary"
              icon="chat"
              label="Chat da Sessão"
              :to="{ name: 'chat-user', params: { userId: session.partnerId } }"
            />
            <q-btn
              unelevated
              rounded
              color="secondary"
              icon="check_circle"
              label="Concluir e Avaliar"
              :to="{ name: 'reviews' }"
            />
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat class="q-pa-md">
          <div class="text-subtitle1 text-weight-bold text-dark q-mb-sm">Diretrizes da Sessão</div>
          <q-list dense>
            <q-item>
              <q-item-section avatar><q-icon name="schedule" color="primary" /></q-item-section>
              <q-item-section>Pontualidade no início da chamada</q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon name="mic" color="primary" /></q-item-section>
              <q-item-section>Testar microfone e ambiente silencioso</q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon name="stars" color="primary" /></q-item-section>
              <q-item-section>Avaliação mútua no final da mentoria</q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMeetUsStore } from 'src/stores/meetus'

const route = useRoute()
const store = useMeetUsStore()

const session = computed(() => {
  const id = route.params.id
  return store.exchanges.find(e => e.id === id) || store.exchanges[0]
})
</script>
