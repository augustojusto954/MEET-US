<template>
  <q-page padding class="q-pb-xl">
    <!-- Header da Página -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bolder text-dark" style="letter-spacing: -0.5px;">
          Descobrir Estudantes
        </div>
        <div class="text-body2" style="color: #64748B;">
          Conecta-te com estudantes de todo Moçambique para trocar competências e aprender em conjunto.
        </div>
      </div>

      <div class="row items-center q-gutter-sm">
        <q-btn
          unelevated
          color="primary"
          icon="auto_awesome"
          label="Compatibilidade Inteligente"
          :to="{ name: 'matching' }"
          no-caps
          style="border-radius: 10px;"
        />
      </div>
    </div>

    <!-- Barra de Filtros -->
    <q-card flat class="q-pa-md q-mb-lg">
      <div class="row q-col-gutter-md items-center">
        <!-- Campo de Pesquisa -->
        <div class="col-12 col-md-4">
          <q-input
            v-model="searchQuery"
            dense
            outlined
            placeholder="Pesquisar por nome, curso ou competência..."
            clearable
          >
            <template #prepend>
              <q-icon name="search" color="grey-6" />
            </template>
          </q-input>
        </div>

        <!-- Filtro Universidade -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-select
            v-model="selectedInstitution"
            dense
            outlined
            emit-value
            map-options
            :options="institutionOptions"
            label="Universidade"
          />
        </div>

        <!-- Filtro Cidade -->
        <div class="col-12 col-sm-6 col-md-2">
          <q-select
            v-model="selectedCity"
            dense
            outlined
            emit-value
            map-options
            :options="cityOptions"
            label="Cidade"
          />
        </div>

        <!-- Ordenação -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-select
            v-model="sortBy"
            dense
            outlined
            emit-value
            map-options
            :options="sortOptions"
            label="Ordenar por"
          />
        </div>
      </div>

      <!-- Filtros Rápidos de Categorias de Competência -->
      <div class="q-mt-md row items-center q-gutter-xs">
        <span class="text-caption text-weight-bold q-mr-xs" style="color: #64748B;">Filtrar por área:</span>
        <q-chip
          v-for="cat in categoryChips"
          :key="cat"
          clickable
          :style="selectedCategory === cat ? 'background: #059669; color: white;' : 'background: #F1F5F9; color: #475569;'"
          size="sm"
          @click="selectedCategory = selectedCategory === cat ? '' : cat"
        >
          {{ cat }}
        </q-chip>
      </div>
    </q-card>

    <!-- Lista de Estudantes -->
    <div v-if="filteredStudents.length" class="row q-col-gutter-lg">
      <div
        v-for="student in filteredStudents"
        :key="student.id"
        class="col-12 col-sm-6 col-lg-4"
      >
        <q-card flat class="student-card hover-lift full-height column justify-between">
          <div>
            <!-- Foto / Cabeçalho -->
            <div class="student-card-header relative-position">
              <div class="student-img-container">
                <img :src="student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=059669&color=fff&size=256`" class="student-avatar-img" />
              </div>
              <!-- Badge Online Real -->
              <q-badge
                v-if="student.online"
                color="positive"
                class="q-px-sm q-py-xs text-weight-bold"
                rounded
                style="position: absolute; top: 10px; left: 10px; font-size: 11px; z-index: 2; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"
              >
                ● Online
              </q-badge>
              <div class="match-badge">
                {{ student.compatibilityScore || 85 }}%
                <div style="font-size: 8px; font-weight: 500;">compatível</div>
              </div>
            </div>

            <!-- Dados do Estudante -->
            <div class="q-pa-md">
              <div class="row items-center justify-between">
                <div class="text-subtitle1 text-weight-bold text-dark" style="line-height: 1.2;">
                  {{ student.name.replace(' (Você)', '') }}
                </div>
                <div class="row items-center">
                  <q-icon name="star" color="amber-8" size="14px" />
                  <span class="text-caption text-weight-bold q-ml-xs" style="color: #0F172A;">{{ student.reputation }}</span>
                  <span class="text-caption q-ml-xs" style="color: #94A3B8;">({{ student.reviews_count }})</span>
                </div>
              </div>

              <div class="text-caption q-mt-xs" style="color: #64748B;">
                {{ student.course }}
              </div>
              <div class="text-caption" style="color: #94A3B8;">
                {{ student.institution }} • {{ student.city }}
              </div>

              <div class="text-caption q-mt-sm ellipsis-2-lines" style="color: #475569; min-height: 36px; line-height: 1.4;">
                {{ student.bio }}
              </div>

              <q-separator class="q-my-sm" style="background: #F1F5F9;" />

              <!-- Competências que Ensina -->
              <div>
                <div class="text-caption text-weight-bold" style="color: #059669; font-size: 0.68rem; letter-spacing: 0.04em;">ENSINA</div>
                <div class="row q-gutter-xs q-mt-xs">
                  <q-badge
                    v-for="sk in getTeachSkills(student).slice(0, 3)"
                    :key="sk"
                    class="q-px-sm q-py-xs"
                    style="background: #ECFDF5; color: #059669; border-radius: 6px; font-weight: 500; font-size: 0.72rem;"
                  >
                    {{ sk }}
                  </q-badge>
                </div>
              </div>

              <!-- Competências que Quer Aprender -->
              <div class="q-mt-sm">
                <div class="text-caption text-weight-bold" style="color: #94A3B8; font-size: 0.68rem; letter-spacing: 0.04em;">QUER APRENDER</div>
                <div class="row q-gutter-xs q-mt-xs">
                  <q-badge
                    v-for="sk in getLearnSkills(student).slice(0, 2)"
                    :key="sk"
                    class="q-px-sm q-py-xs"
                    style="background: #F8FAFC; color: #64748B; border-radius: 6px; font-weight: 500; font-size: 0.72rem; border: 1px solid #E2E8F0;"
                  >
                    {{ sk }}
                  </q-badge>
                </div>
              </div>
            </div>
          </div>

          <!-- Ações do Cartão Responsivas (2 Linhas Limpas) -->
          <div class="q-pa-md q-pt-none">
            <div class="row q-gutter-xs q-mb-xs">
              <q-btn
                flat
                dense
                color="grey-8"
                label="Ver Perfil"
                class="col"
                no-caps
                style="border-radius: 8px; font-weight: 600;"
                :to="{ name: 'profile', query: { id: student.id } }"
              />

              <q-btn
                v-if="!getConnectionStatus(student.id)"
                outline
                dense
                color="primary"
                icon="person_add"
                label="Conectar"
                class="col"
                no-caps
                style="border-radius: 8px; font-weight: 600;"
                @click="handleConnect(student.id)"
              />
              <q-btn
                v-else-if="getConnectionStatus(student.id) === 'sent'"
                flat
                dense
                color="grey-7"
                icon="hourglass_empty"
                label="Enviado"
                class="col"
                no-caps
                style="border-radius: 8px;"
              />
              <q-btn
                v-else-if="getConnectionStatus(student.id) === 'connected'"
                unelevated
                dense
                color="positive"
                icon="check"
                label="Conectado"
                class="col"
                no-caps
                style="border-radius: 8px; font-weight: 600;"
              />

              <q-btn
                flat
                dense
                color="primary"
                icon="swap_horiz"
                label="Trocar"
                no-caps
                class="col-auto q-px-sm"
                style="border-radius: 8px; font-weight: 600;"
                :to="{ name: 'exchange-create', query: { partnerId: student.id } }"
              >
                <q-tooltip>Propor Troca Direta</q-tooltip>
              </q-btn>
            </div>

            <div class="row q-gutter-xs">
              <q-btn
                unelevated
                dense
                color="primary"
                icon="chat"
                label="Mensagem"
                no-caps
                class="col text-weight-bold"
                style="border-radius: 8px;"
                :to="{ name: 'chat-user', params: { userId: student.id } }"
              >
                <q-tooltip>Conversar em direto com {{ student.name }}</q-tooltip>
              </q-btn>

              <q-btn
                unelevated
                dense
                color="positive"
                icon="videocam"
                label="Ligar"
                no-caps
                class="col text-weight-bold"
                style="border-radius: 8px;"
                :to="{ name: 'calls', query: { partnerId: student.id, partner: student.name, autostart: '1' } }"
              >
                <q-tooltip>Iniciar Chamada em direto com {{ student.name }}</q-tooltip>
              </q-btn>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else
      icon="person_search"
      title="Nenhum estudante encontrado"
      description="Tenta ajustar os teus filtros de universidade, cidade ou área de conhecimento para encontrar outros colegas."
      action-label="Limpar Filtros"
      action-icon="clear_all"
      @action="clearFilters"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useMeetUsStore } from 'src/stores/meetus'
import { useAuthStore } from 'src/stores/auth'
import EmptyState from 'src/components/common/EmptyState.vue'

const $q = useQuasar()
const store = useMeetUsStore()
const auth = useAuthStore()

onMounted(() => {
  store.syncWithBackend?.()
})

const searchQuery = ref('')
const selectedInstitution = ref('')
const selectedCity = ref('')
const selectedCategory = ref('')
const sortBy = ref('compat')

const institutionOptions = [
  { label: 'Todas as Universidades', value: '' },
  { label: 'UEM - Eduardo Mondlane', value: 'Universidade Eduardo Mondlane' },
  { label: 'UP - Pedagógica', value: 'Universidade Pedagógica' },
  { label: 'ISCTEM', value: 'ISCTEM' },
  { label: 'UniSave', value: 'Universidade Save' },
  { label: 'A Politécnica', value: 'A Politécnica' },
  { label: 'UniZambeze', value: 'Universidade Zambeze' },
  { label: 'UniLúrio', value: 'Universidade Lúrio' }
]

const cityOptions = [
  { label: 'Todas as Cidades', value: '' },
  { label: 'Maputo', value: 'Maputo' },
  { label: 'Matola', value: 'Matola' },
  { label: 'Beira', value: 'Beira' },
  { label: 'Chongoene', value: 'Chongoene' },
  { label: 'Nampula', value: 'Nampula' }
]

const sortOptions = [
  { label: 'Maior Compatibilidade', value: 'compat' },
  { label: 'Maior Reputação', value: 'reputation' },
  { label: 'Mais Avaliações', value: 'reviews' }
]

const categoryChips = [
  'Programação & Tech',
  'Design & Multimédia',
  'Negócios & Gestão',
  'Línguas & Comunicação',
  'Ciências & Matemática',
  'Música & Artes'
]

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

function getConnectionStatus(studentId) {
  const c = store.connections.find(conn => conn.studentId === studentId)
  return c ? c.status : null
}

function handleConnect(studentId) {
  store.sendConnectionRequest(studentId)
  $q.notify({
    type: 'positive',
    message: 'Pedido de conexão enviado com sucesso!',
    position: 'top-right'
  })
}

function clearFilters() {
  searchQuery.value = ''
  selectedInstitution.value = ''
  selectedCity.value = ''
  selectedCategory.value = ''
  sortBy.value = 'compat'
}

const filteredStudents = computed(() => {
  const myId = String(auth.userId || store.currentUser.id || '')
  let list = store.students.filter(s => String(s.id) !== myId && String(s._id) !== myId)

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.course.toLowerCase().includes(q) ||
      (s.skillsTeach && s.skillsTeach.some(sk => sk.name.toLowerCase().includes(q))) ||
      (s.skillsLearn && s.skillsLearn.some(sk => sk.name.toLowerCase().includes(q))) ||
      (s.skills && s.skills.some(sk => sk.name.toLowerCase().includes(q)))
    )
  }

  if (selectedInstitution.value) {
    list = list.filter(s => s.institution === selectedInstitution.value)
  }

  if (selectedCity.value) {
    list = list.filter(s => s.city === selectedCity.value)
  }

  if (selectedCategory.value) {
    list = list.filter(s =>
      s.skillsTeach?.some(sk => sk.category === selectedCategory.value) ||
      s.skillsLearn?.some(sk => sk.category === selectedCategory.value)
    )
  }

  if (sortBy.value === 'compat') {
    list.sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0))
  } else if (sortBy.value === 'reputation') {
    list.sort((a, b) => (b.reputation || 0) - (a.reputation || 0))
  } else if (sortBy.value === 'reviews') {
    list.sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0))
  }

  return list
})
</script>

<style scoped>
.student-card {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #E2E8F0;
  background: #FFFFFF;
}

.student-card-header {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: #F1F5F9;
}

.student-img-container {
  width: 100%;
  height: 100%;
}

.student-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.match-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #059669;
  color: #FFFFFF;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 8px;
  line-height: 1.2;
  text-align: center;
}
</style>
