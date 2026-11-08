<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center q-mb-lg">
      <q-btn flat round dense icon="arrow_back" color="grey-8" class="q-mr-sm" @click="$router.back()" />
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Análise de Compatibilidade</div>
        <div class="text-caption text-grey-7">
          Entende em detalhe porque este perfil é um ótimo parceiro de aprendizagem mútua.
        </div>
      </div>
    </div>

    <div v-if="partner" class="row q-col-gutter-lg">
      <!-- Coluna Esquerda: Score Donut & Perfil Rápido -->
      <div class="col-12 col-md-4">
        <q-card flat class="q-pa-lg text-center full-height">
          <!-- Donut Circular -->
          <div class="flex flex-center q-mb-md">
            <CompatibilityDonut :score="partner.compatibilityScore || 92" :size="140" :stroke-width="12" />
          </div>

          <div class="text-h6 text-weight-bolder text-dark">{{ partner.name }}</div>
          <div class="text-caption text-grey-7">{{ partner.course }}</div>
          <div class="text-caption text-grey-6">{{ partner.institution }} • {{ partner.city }}</div>

          <div class="row justify-center items-center q-mt-sm">
            <q-rating :model-value="partner.reputation" size="18px" color="amber-9" readonly />
            <span class="text-weight-bold text-caption q-ml-xs">{{ partner.reputation }} ({{ partner.reviews_count }} avaliações)</span>
          </div>

          <q-separator class="q-my-md" />

          <!-- Ações Rápidas -->
          <div class="column q-gutter-sm">
            <q-btn
              unelevated
              rounded
              color="primary"
              icon="swap_horiz"
              label="Propor Troca Direta"
              class="text-weight-bold"
              :to="{ name: 'exchange-create', query: { partnerId: partner.id } }"
            />
            <q-btn
              outline
              rounded
              color="primary"
              icon="chat"
              label="Enviar Mensagem"
              :to="{ name: 'chat-user', params: { userId: partner.id } }"
            />
            <q-btn
              flat
              rounded
              color="grey-7"
              icon="person"
              label="Ver Perfil Completo"
              :to="{ name: 'profile', query: { id: partner.id } }"
            />
          </div>
        </q-card>
      </div>

      <!-- Coluna Direita: Análise dos Critérios -->
      <div class="col-12 col-md-8">
        <div class="column q-gutter-md">
          <!-- 1. Competências Correspondentes -->
          <q-card flat class="q-pa-md">
            <div class="row items-center justify-between q-mb-sm">
              <div class="row items-center">
                <q-avatar size="36px" class="bg-soft-lavender text-primary q-mr-sm">
                  <q-icon name="check_circle" size="20px" />
                </q-avatar>
                <div>
                  <div class="text-subtitle1 text-weight-bold text-dark">Competências Correspondentes</div>
                  <div class="text-caption text-grey-7">O que tu queres aprender e {{ partner.name }} domina para ensinar</div>
                </div>
              </div>
              <q-badge color="positive" class="text-weight-bold">+40% peso</q-badge>
            </div>

            <div class="row q-gutter-sm q-mt-xs">
              <q-chip
                v-for="s in matchingTeachSkills"
                :key="s.id"
                color="soft-lavender"
                text-color="primary"
                icon="school"
              >
                {{ s.name }} — Nível {{ s.level }}
              </q-chip>
            </div>
          </q-card>

          <!-- 2. Competências Complementares -->
          <q-card flat class="q-pa-md">
            <div class="row items-center justify-between q-mb-sm">
              <div class="row items-center">
                <q-avatar size="36px" class="bg-lavender text-secondary q-mr-sm">
                  <q-icon name="handshake" size="20px" />
                </q-avatar>
                <div>
                  <div class="text-subtitle1 text-weight-bold text-dark">Competências Complementares</div>
                  <div class="text-caption text-grey-7">O que tu ensinas e {{ partner.name }} procura aprender</div>
                </div>
              </div>
              <q-badge color="positive" class="text-weight-bold">+35% peso</q-badge>
            </div>

            <div class="row q-gutter-sm q-mt-xs">
              <q-chip
                v-for="s in matchingLearnSkills"
                :key="s.id"
                color="lavender"
                text-color="secondary"
                icon="menu_book"
              >
                {{ s.name }}
              </q-chip>
            </div>
          </q-card>

          <!-- 3. Interesses em Comum & Universidade -->
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-card flat class="q-pa-md full-height">
                <div class="text-subtitle2 text-weight-bold text-dark q-mb-xs">
                  <q-icon name="stars" color="amber-9" class="q-mr-xs" />
                  Interesses em Comum
                </div>
                <div class="text-caption text-grey-7 q-mb-sm">Tópicos que ambos partilham</div>
                <div class="row q-gutter-xs">
                  <q-badge
                    v-for="i in commonInterests"
                    :key="i"
                    color="grey-2"
                    text-color="dark"
                    class="q-pa-xs"
                  >
                    {{ i }}
                  </q-badge>
                </div>
              </q-card>
            </div>

            <div class="col-12 col-sm-6">
              <q-card flat class="q-pa-md full-height">
                <div class="text-subtitle2 text-weight-bold text-dark q-mb-xs">
                  <q-icon name="account_balance" color="primary" class="q-mr-xs" />
                  Proximidade Académica
                </div>
                <div class="text-caption text-grey-7 q-mb-sm">Campus e facilidade de encontro</div>
                <div class="text-body2 text-grey-9">
                  Ambos da <b>{{ partner.institution }}</b> em {{ partner.city }}.
                </div>
                <div class="text-caption text-positive q-mt-xs">
                  ✓ Sessões presenciais e grupos de estudo facilitados!
                </div>
              </q-card>
            </div>
          </div>

          <!-- 4. Disponibilidade Horária -->
          <q-card flat class="q-pa-md">
            <div class="text-subtitle2 text-weight-bold text-dark q-mb-xs">
              <q-icon name="schedule" color="info" class="q-mr-xs" />
              Disponibilidade Compatível
            </div>
            <div class="text-body2 text-grey-8">
              {{ partner.availability || 'Tardes de Terça e Quinta, fins de semana' }}
            </div>
          </q-card>
        </div>
      </div>
    </div>

    <EmptyState
      v-else
      icon="person_off"
      title="Estudante não encontrado"
      description="Não foi possível carregar a análise deste perfil."
      action-label="Voltar aos Estudantes"
      action-icon="arrow_back"
      @action="$router.push({ name: 'students' })"
    />
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMeetUsStore } from 'src/stores/meetus'
import CompatibilityDonut from 'src/components/common/CompatibilityDonut.vue'
import EmptyState from 'src/components/common/EmptyState.vue'

const route = useRoute()
const store = useMeetUsStore()

const partner = computed(() => {
  const id = route.params.id || '2'
  return store.students.find(s => s.id === id) || store.students[1]
})

const matchingTeachSkills = computed(() => {
  if (!partner.value?.skillsTeach) return []
  return partner.value.skillsTeach
})

const matchingLearnSkills = computed(() => {
  if (!store.currentUser?.skillsTeach) return []
  return store.currentUser.skillsTeach.slice(0, 2)
})

const commonInterests = computed(() => {
  const myInt = store.currentUser?.interests || []
  const theirInt = partner.value?.interests || []
  const common = myInt.filter(i => theirInt.includes(i))
  return common.length ? common : ['Tecnologia', 'Educação', 'Networking']
})
</script>
