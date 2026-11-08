<template>
  <q-page padding class="column items-center justify-center q-pb-xl">
    <div class="text-center q-mb-md">
      <div class="text-h4 text-weight-bolder text-dark" style="letter-spacing: -0.5px;">
        Compatibilidade Inteligente
      </div>
      <div class="text-body2" style="color: #64748B;">
        Descobre parceiros ideais com base nas competências que dominas e nas que queres aprender.
      </div>
    </div>

    <!-- Se não há mais candidatos -->
    <div v-if="!currentCandidate" class="text-center q-pa-xl" style="max-width: 450px;">
      <q-avatar size="72px" class="q-mb-md" style="background: #ECFDF5; color: #059669;">
        <q-icon name="celebration" size="40px" />
      </q-avatar>
      <div class="text-h6 text-weight-bolder text-dark">Exploraste todos os candidatos!</div>
      <div class="text-body2 q-mt-xs q-mb-lg" style="color: #64748B;">
        Novos estudantes registam-se diariamente na rede universitária. Podes recarregar ou pesquisar no directório.
      </div>
      <div class="row q-gutter-sm justify-center">
        <q-btn unelevated color="primary" label="Recarregar Perfis" @click="resetCandidates" no-caps style="border-radius: 10px;" />
        <q-btn outline color="primary" label="Explorar Estudantes" :to="{ name: 'students' }" no-caps style="border-radius: 10px;" />
      </div>
    </div>

    <!-- Cartão Central de Matching -->
    <div v-else style="max-width: 440px; width: 100%;">
      <q-card flat class="overflow-hidden" style="border-radius: 16px; border: 1px solid #E2E8F0; background: #FFFFFF;">
        <!-- Imagem de Capa e Foto do Estudante -->
        <div class="relative-position" style="height: 280px;">
          <img
            :src="currentCandidate.avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&fit=crop'"
            class="full-width full-height"
            style="object-fit: cover;"
          />
          <!-- Badge de Score Flutuante -->
          <div class="absolute-top-right q-pa-md">
            <q-badge class="q-px-md q-py-xs text-subtitle2 text-weight-bolder shadow-1" style="border-radius: 10px; background: #059669; color: #FFFFFF;">
              {{ currentCandidate.compatibilityScore || 90 }}% Match
            </q-badge>
          </div>

          <!-- Avatar e Nome sobre a foto -->
          <div class="absolute-bottom q-pa-md text-white" style="background: linear-gradient(to top, rgba(15, 23, 42, 0.9), transparent);">
            <div class="row items-center">
              <q-avatar size="52px" style="border: 2px solid #FFFFFF;">
                <img :src="currentCandidate.avatar" />
              </q-avatar>
              <div class="q-ml-sm">
                <div class="row items-center">
                  <span class="text-h6 text-weight-bolder text-white">{{ currentCandidate.name.replace(' (Você)', '') }}</span>
                  <q-icon v-if="currentCandidate.verified" name="verified" color="white" size="18px" class="q-ml-xs" />
                </div>
                <div class="text-caption" style="color: #E2E8F0;">{{ currentCandidate.course }} • {{ currentCandidate.institution }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Conteúdo do Perfil -->
        <q-card-section class="q-pa-md">
          <!-- Reputação & Cidade -->
          <div class="row items-center justify-between text-caption q-mb-sm" style="color: #64748B;">
            <div class="row items-center">
              <q-icon name="star" color="amber-8" size="16px" class="q-mr-xs" />
              <b class="text-dark">{{ currentCandidate.reputation }}</b>
              <span class="q-ml-xs">({{ currentCandidate.reviews_count }} sessões)</span>
            </div>
            <div class="row items-center">
              <q-icon name="place" color="grey-6" size="16px" class="q-mr-xs" />
              {{ currentCandidate.city }}
            </div>
          </div>

          <!-- Bio -->
          <p class="text-body2 q-mb-md" style="color: #334155; line-height: 1.5;">
            {{ currentCandidate.bio }}
          </p>

          <!-- Competências que Ensina -->
          <div class="q-mb-sm">
            <div class="text-caption text-weight-bold" style="color: #059669; font-size: 0.68rem; letter-spacing: 0.04em;">ENSINA:</div>
            <div class="row q-gutter-xs q-mt-xs">
              <q-badge
                v-for="sk in getTeachSkills(currentCandidate).slice(0, 3)"
                :key="sk"
                class="q-px-sm q-py-xs text-weight-medium"
                style="background: #ECFDF5; color: #059669; border-radius: 6px; font-size: 0.72rem;"
              >
                {{ sk }}
              </q-badge>
            </div>
          </div>

          <!-- Competências que Quer Aprender -->
          <div>
            <div class="text-caption text-weight-bold" style="color: #94A3B8; font-size: 0.68rem; letter-spacing: 0.04em;">QUER APRENDER:</div>
            <div class="row q-gutter-xs q-mt-xs">
              <q-badge
                v-for="sk in getLearnSkills(currentCandidate).slice(0, 2)"
                :key="sk"
                class="q-px-sm q-py-xs text-weight-medium"
                style="background: #F8FAFC; color: #64748B; border-radius: 6px; font-size: 0.72rem; border: 1px solid #E2E8F0;"
              >
                {{ sk }}
              </q-badge>
            </div>
          </div>

          <!-- Link para Detalhes de Análise -->
          <div class="text-center q-mt-md">
            <q-btn
              flat
              dense
              color="primary"
              label="Ver Análise Completa de Compatibilidade →"
              class="text-weight-bold"
              no-caps
              :to="{ name: 'matching-details', params: { id: currentCandidate.id } }"
            />
          </div>
        </q-card-section>

        <!-- Botões de Ação Swipe -->
        <q-card-actions align="around" class="q-pa-md" style="background: #F8FAFC; border-top: 1px solid #E2E8F0;">
          <!-- Pass Button -->
          <q-btn
            round
            unelevated
            color="white"
            text-color="negative"
            icon="close"
            size="md"
            class="shadow-1 hover-lift"
            @click="handleSwipe('pass')"
          >
            <q-tooltip>Passar este perfil</q-tooltip>
          </q-btn>

          <!-- Propor Troca Direta -->
          <q-btn
            round
            unelevated
            color="primary"
            icon="swap_horiz"
            size="md"
            class="shadow-1"
            :to="{ name: 'exchange-create', query: { partnerId: currentCandidate.id } }"
          >
            <q-tooltip>Criar Proposta de Troca</q-tooltip>
          </q-btn>

          <!-- Like Button -->
          <q-btn
            round
            unelevated
            color="primary"
            icon="favorite"
            size="md"
            class="shadow-2 hover-lift"
            @click="handleSwipe('like')"
          >
            <q-tooltip>Gostar deste perfil</q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useMeetUsStore } from 'src/stores/meetus'

const $q = useQuasar()
const store = useMeetUsStore()

const currentIndex = ref(0)
const candidates = ref([])

function initCandidates() {
  candidates.value = store.students
    .filter(s => s.id !== store.currentUser.id && s.compatibilityScore)
    .sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0))
}

initCandidates()

const currentCandidate = computed(() => {
  return candidates.value[currentIndex.value] || null
})

function getTeachSkills(student) {
  if (student.skillsTeach) return student.skillsTeach.map(s => s.name)
  if (student.skills) return student.skills.filter(s => s.type === 'offer').map(s => s.name)
  return []
}

function getLearnSkills(student) {
  if (student.skillsLearn) return student.skillsLearn.map(s => s.name)
  if (student.skills) return student.skills.filter(s => s.type === 'seek').map(s => s.name)
  return []
}

function handleSwipe(action) {
  if (action === 'like') {
    store.sendConnectionRequest(currentCandidate.value.id)
    $q.notify({
      type: 'positive',
      message: `Conectaste-te com ${currentCandidate.value.name}!`,
      icon: 'favorite'
    })
  }
  currentIndex.value++
}

function resetCandidates() {
  currentIndex.value = 0
}
</script>
