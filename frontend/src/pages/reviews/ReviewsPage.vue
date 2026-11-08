<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Avaliações & Reputação</div>
        <div class="text-caption text-grey-7">
          Feedback qualitativo e classificação de pontualidade, didática e domínio.
        </div>
      </div>
      <q-btn
        unelevated
        rounded
        color="primary"
        icon="rate_review"
        label="Escrever Avaliação"
        @click="showReviewModal = true"
      />
    </div>

    <!-- Resumo Geral da Reputação -->
    <q-card flat class="q-pa-lg q-mb-lg">
      <div class="row q-col-gutter-lg items-center">
        <!-- Classificação Média -->
        <div class="col-12 col-md-4 text-center border-right-md">
          <div class="text-h2 text-weight-bolder text-primary" style="line-height: 1;">4.9</div>
          <q-rating :model-value="4.9" size="24px" color="amber-9" readonly class="q-my-xs" />
          <div class="text-caption text-grey-7 text-weight-bold">Baseado em {{ store.reviews.length }} avaliações verificadas</div>
          <q-badge color="positive" class="q-mt-xs q-px-sm">98% de Recomendação</q-badge>
        </div>

        <!-- Distribuição das Estrelas (5★ a 1★) -->
        <div class="col-12 col-md-5">
          <div class="column q-gutter-xs">
            <div class="row items-center" v-for="star in [5, 4, 3, 2, 1]" :key="star">
              <span class="text-caption text-weight-bold text-dark" style="width: 30px;">{{ star }} ★</span>
              <q-linear-progress
                :value="getStarRatio(star)"
                rounded
                size="8px"
                color="amber-9"
                track-color="grey-3"
                class="col q-mx-sm"
              />
              <span class="text-caption text-grey-6" style="width: 35px; text-align: right;">{{ getStarCount(star) }}</span>
            </div>
          </div>
        </div>

        <!-- Médias por Critérios -->
        <div class="col-12 col-md-3">
          <div class="column q-gutter-sm text-caption">
            <div class="row justify-between bg-soft-lavender q-pa-xs rounded-borders">
              <span>Didática & Clareza:</span>
              <b class="text-primary">5.0 ★</b>
            </div>
            <div class="row justify-between bg-soft-lavender q-pa-xs rounded-borders">
              <span>Pontualidade:</span>
              <b class="text-secondary">4.9 ★</b>
            </div>
            <div class="row justify-between bg-soft-lavender q-pa-xs rounded-borders">
              <span>Domínio da Matéria:</span>
              <b class="text-positive">5.0 ★</b>
            </div>
          </div>
        </div>
      </div>
    </q-card>

    <!-- Tabs: Avaliações Recebidas vs Avaliações Realizadas -->
    <q-card flat class="q-mb-md">
      <q-tabs
        v-model="reviewTab"
        dense
        class="text-grey-7 bg-soft-lavender"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="received" label="Avaliações Recebidas">
          <q-badge color="primary" class="q-ml-xs">{{ store.reviews.length }}</q-badge>
        </q-tab>
        <q-tab name="given" label="Avaliações Realizadas por Mim">
          <q-badge color="grey-6" class="q-ml-xs">2</q-badge>
        </q-tab>
      </q-tabs>
    </q-card>

    <!-- Lista de Comentários / Avaliações -->
    <div v-if="reviewTab === 'received'" class="column q-gutter-md">
      <q-card
        v-for="rev in store.reviews"
        :key="rev.id"
        flat
        class="q-pa-lg hover-lift"
      >
        <div class="row items-center justify-between q-mb-sm">
          <div class="row items-center">
            <q-avatar size="48px" class="shadow-1">
              <img :src="rev.reviewerAvatar" />
            </q-avatar>
            <div class="q-ml-sm">
              <div class="text-subtitle1 text-weight-bolder text-dark">{{ rev.reviewerName }}</div>
              <div class="text-caption text-grey-7">{{ rev.reviewerCourse }}</div>
            </div>
          </div>

          <div class="row items-center">
            <q-rating :model-value="rev.rating" size="18px" color="amber-9" readonly />
            <span class="text-caption text-grey-6 q-ml-sm">{{ rev.date }}</span>
          </div>
        </div>

        <div class="q-mb-xs">
          <q-badge color="lavender" text-color="primary" class="q-pa-xs text-weight-bold">
            Tópico da Troca: {{ rev.exchangeTopic }}
          </q-badge>
        </div>

        <p class="text-body2 text-grey-9 q-mt-sm italic leading-relaxed">
          "{{ rev.comment }}"
        </p>
      </q-card>
    </div>

    <div v-else class="column q-gutter-md">
      <q-card flat class="q-pa-lg">
        <div class="row items-center justify-between">
          <div class="text-subtitle1 text-weight-bold">Avaliação enviada para Carlos Mangue</div>
          <q-rating :model-value="5" size="18px" color="amber-9" readonly />
        </div>
        <p class="text-body2 text-grey-8 q-mt-sm">
          "Excelente explicação sobre tabelas dinâmicas e fórmulas no Excel!"
        </p>
      </q-card>
    </div>

    <!-- Modal Escrever Nova Avaliação -->
    <q-dialog v-model="showReviewModal">
      <q-card style="width: 500px; max-width: 95vw; border-radius: 20px;">
        <q-card-section class="row items-center justify-between bg-soft-lavender">
          <div class="text-subtitle1 text-weight-bold">Avaliar Sessão de Estudo</div>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-card-section class="q-gutter-md q-pt-md">
          <q-select
            v-model="newReview.partner"
            label="Colega a Avaliar *"
            :options="['Amália Mondlane', 'Carlos Mangue', 'Lúcia Nanttumbo', 'Hélder Mucavele']"
            outlined
            dense
          />

          <div class="text-center q-my-sm">
            <label class="text-caption text-weight-bold text-dark block q-mb-xs">Classificação Geral:</label>
            <q-rating v-model="newReview.rating" size="32px" color="amber-9" />
          </div>

          <q-input
            v-model="newReview.topic"
            label="Tópico / Matéria Abordada"
            placeholder="Ex: Introdução a Componentes no Vue.js"
            outlined
            dense
          />

          <q-input
            v-model="newReview.comment"
            label="Comentário & Feedback Construtivo *"
            placeholder="Conta como correu a sessão, clareza nas explicações e pontualidade..."
            type="textarea"
            rows="3"
            outlined
            dense
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn
            unelevated
            rounded
            label="Submeter Avaliação"
            color="primary"
            class="text-weight-bold"
            @click="submitReview"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useMeetUsStore } from 'src/stores/meetus'

const $q = useQuasar()
const store = useMeetUsStore()

const reviewTab = ref('received')
const showReviewModal = ref(false)

const newReview = ref({
  partner: 'Amália Mondlane',
  rating: 5,
  topic: '',
  comment: ''
})

function getStarCount(star) {
  if (star === 5) return store.reviews.length - 1 || 1
  if (star === 4) return 1
  return 0
}

function getStarRatio(star) {
  const count = getStarCount(star)
  return count / (store.reviews.length || 1)
}

function submitReview() {
  if (!newReview.value.comment.trim()) {
    $q.notify({ type: 'warning', message: 'Por favor, escreve um comentário sobre a sessão.' })
    return
  }

  store.addReview({
    rating: newReview.value.rating,
    topic: newReview.value.topic || 'Mentoria Geral',
    comment: newReview.value.comment
  })

  showReviewModal.value = false
  newReview.value = { partner: 'Amália Mondlane', rating: 5, topic: '', comment: '' }
  $q.notify({ type: 'positive', message: 'Avaliação submetida com sucesso!' })
}
</script>

<style scoped>
@media (min-width: 1024px) {
  .border-right-md {
    border-right: 1px solid #EAE8FF;
  }
}
</style>
