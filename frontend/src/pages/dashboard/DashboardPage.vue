<template>
  <q-page class="q-pa-lg q-pb-xl bg-app">
    <!-- Saudação Idêntica ao Design Original da Tela 2 -->
    <div class="q-mb-md">
      <div class="text-h4 text-weight-bolder text-dark" style="letter-spacing: -0.5px; font-size: 2rem;">
        Olá, {{ firstName }}!
      </div>
      <div class="text-body2 text-grey-7 q-mt-xs">
        Pronto para aprender algo novo hoje?
      </div>
    </div>

    <!-- Barra de Ação Rápida com Filtros -->
    <div class="row items-center q-mb-lg q-gutter-sm">
      <div class="col">
        <q-input
          dense
          outlined
          placeholder="O que queres aprender ou ensinar?"
          class="quick-search-input"
          v-model="quickQuery"
          @keyup.enter="handleQuickSearch"
        >
          <template #prepend>
            <q-icon name="search" color="grey-5" size="18px" />
          </template>
        </q-input>
      </div>
      <q-btn
        unelevated
        color="primary"
        icon="tune"
        label="Filtros"
        no-caps
        class="text-weight-bold q-px-md"
        style="border-radius: 10px; height: 42px;"
        :to="{ name: 'students' }"
      />
    </div>

    <!-- Layout 2 Colunas Idêntico à Tela 2 -->
    <div class="row q-col-gutter-lg">
      <!-- Coluna Principal (Esquerda - 8 Colunas) -->
      <div class="col-12 col-lg-8">
        <!-- Banner Verde Esmeralda de Destaque -->
        <div class="highlight-banner q-mb-lg">
          <div class="row items-center justify-between no-wrap">
            <div class="row items-center col">
              <q-avatar size="36px" class="bg-white-20 q-mr-md gt-xs">
                <q-icon name="groups" color="white" size="20px" />
              </q-avatar>
              <div class="text-body1 text-white text-weight-medium" style="line-height: 1.4;">
                Esta semana — <strong>3 novas pessoas</strong> querem aprender
                <strong>{{ teachSkillName }}</strong> contigo
              </div>
            </div>
            <div class="row items-center q-gutter-sm q-ml-md">
              <!-- Avatares Sobrepostos -->
              <div class="avatar-stack">
                <q-avatar
                  v-for="(a, i) in bannerAvatars"
                  :key="i"
                  size="32px"
                  class="stack-avatar"
                  :style="{ zIndex: 3 - i, marginLeft: i > 0 ? '-10px' : '0' }"
                >
                  <img :src="a" />
                </q-avatar>
              </div>
              <q-btn
                unelevated
                color="white"
                text-color="primary"
                label="Ver compatibilidades"
                no-caps
                size="sm"
                class="text-weight-bold q-px-sm"
                style="border-radius: 8px; font-size: 0.78rem;"
                :to="{ name: 'matching' }"
              />
            </div>
          </div>
        </div>

        <!-- Abas de Navegação com Sublinhado Verde -->
        <div class="row items-center q-mb-md q-gutter-lg tabs-container">
          <div
            v-for="tab in tabs"
            :key="tab"
            class="tab-item cursor-pointer"
            :class="{ 'tab-active': activeTab === tab }"
            @click="activeTab = tab"
          >
            {{ tab }}
          </div>
        </div>

        <!-- Título da Secção -->
        <div class="text-subtitle1 text-weight-bolder text-dark q-mb-md">
          Recomendados para ti
        </div>

        <!-- Cards de Estudantes (Amélia, Celso, Neusa) -->
        <div class="row q-col-gutter-md">
          <div
            v-for="s in displayedStudents"
            :key="s.id"
            class="col-12 col-sm-6 col-md-4"
          >
            <q-card flat class="student-card hover-lift full-height cursor-pointer" @click="$router.push({ name: 'matching-details', params: { id: s.id } })">
              <!-- Foto do Estudante com Badge Verde Suave -->
              <div class="student-photo-wrapper relative-position">
                <img :src="s.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=059669&color=fff&size=256`" class="student-photo" />
                <q-badge
                  v-if="s.online"
                  color="positive"
                  class="q-px-xs q-py-xs text-weight-bold"
                  rounded
                  style="position: absolute; top: 8px; left: 8px; z-index: 2; font-size: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.25);"
                >
                  ● Online
                </q-badge>
                <div class="compat-badge shadow-1">
                  <div class="text-weight-bold" style="line-height: 1.1;">{{ s.compatibilityScore || 90 }}%</div>
                  <div style="font-size: 8px; font-weight: 600; text-transform: lowercase;">compatível</div>
                </div>
              </div>

              <!-- Detalhes do Estudante -->
              <q-card-section class="q-pt-sm q-pb-md">
                <div class="text-subtitle1 text-weight-bolder text-dark" style="line-height: 1.3;">
                  {{ s.name.replace(' (Você)', '') }}
                </div>
                <div class="text-caption text-grey-7">
                  {{ s.course }}
                </div>
                <div class="text-caption text-grey-5">
                  {{ s.city }}
                </div>

                <!-- Rating -->
                <div class="row items-center q-mt-xs q-gutter-xs">
                  <q-icon name="star" color="amber-8" size="14px" />
                  <span class="text-caption text-weight-bold text-dark">{{ s.reputation }}</span>
                  <span class="text-caption text-grey-5">{{ s.reviews_count }} sessões realizadas</span>
                </div>

                <!-- ENSINA -->
                <div class="q-mt-sm">
                  <div class="text-caption text-weight-bold" style="color: #059669; font-size: 0.68rem; letter-spacing: 0.04em;">ENSINA</div>
                  <div class="row q-gutter-xs q-mt-xs">
                    <q-badge
                      v-for="sk in getTeachSkills(s).slice(0, 2)"
                      :key="sk"
                      class="q-px-sm q-py-xs"
                      style="background: #F1F5F9; color: #334155; border-radius: 6px; font-weight: 500; font-size: 0.72rem;"
                    >
                      {{ sk }}
                    </q-badge>
                  </div>
                </div>

                <!-- QUER APRENDER -->
                <div class="q-mt-sm">
                  <div class="text-caption text-weight-bold text-grey-6" style="font-size: 0.68rem; letter-spacing: 0.04em;">QUER APRENDER</div>
                  <div class="row q-gutter-xs q-mt-xs">
                    <q-badge
                      v-for="sk in getLearnSkills(s).slice(0, 2)"
                      :key="sk"
                      class="q-px-sm q-py-xs"
                      style="background: #F8FAFC; color: #64748B; border-radius: 6px; font-weight: 500; font-size: 0.72rem; border: 1px solid #E2E8F0;"
                    >
                      {{ sk }}
                    </q-badge>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Coluna Lateral (Direita - 4 Colunas Idêntica à Tela 2) -->
      <div class="col-12 col-lg-4">
        <!-- 1. Conexões sugeridas -->
        <q-card flat class="q-mb-md sidebar-card">
          <q-card-section class="q-pb-xs">
            <div class="text-subtitle2 text-weight-bolder text-dark">Conexões sugeridas</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div
              v-for="c in suggestedConnections"
              :key="c.id"
              class="row items-center q-py-sm cursor-pointer hover-item"
              @click="$router.push({ name: 'matching-details', params: { id: c.id } })"
            >
              <q-avatar size="36px" class="q-mr-sm">
                <img :src="c.avatar" />
              </q-avatar>
              <div class="col">
                <div class="text-caption text-weight-bold text-dark">{{ c.name }}</div>
                <div class="text-caption text-grey-6" style="font-size: 0.72rem;">{{ c.course }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- 2. Próximas sessões (Exatas da Tela 2) -->
        <q-card flat class="q-mb-md sidebar-card">
          <q-card-section class="q-pb-xs">
            <div class="text-subtitle2 text-weight-bolder text-dark">Próximas sessões</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div
              v-for="(session, idx) in officialUpcomingSessions"
              :key="idx"
              class="row items-center justify-between q-py-sm session-row"
            >
              <span class="text-caption text-weight-medium text-grey-8">{{ session.title }}</span>
              <span class="text-caption text-grey-6" style="font-size: 0.72rem;">{{ session.date }}</span>
            </div>
          </q-card-section>
        </q-card>

        <!-- 3. Competências mais procuradas (Exatas da Tela 2) -->
        <q-card flat class="q-mb-md sidebar-card">
          <q-card-section class="q-pb-xs">
            <div class="text-subtitle2 text-weight-bolder text-dark">Competências mais procuradas</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="column q-gutter-y-xs">
              <div
                v-for="(skill, idx) in topSkills"
                :key="idx"
                class="q-py-xs cursor-pointer skill-row text-caption text-grey-8"
                @click="$router.push({ name: 'students', query: { skill } })"
              >
                {{ skill }}
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- 4. Melhores estudantes (Exatos da Tela 2) -->
        <q-card flat class="sidebar-card">
          <q-card-section class="q-pb-xs">
            <div class="text-subtitle2 text-weight-bolder text-dark">Melhores estudantes</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div
              v-for="(top, idx) in topStudents"
              :key="top.id"
              class="row items-center justify-between q-py-xs cursor-pointer hover-item"
              @click="$router.push({ name: 'matching-details', params: { id: top.id } })"
            >
              <div class="row items-center">
                <span class="text-caption text-weight-bold q-mr-sm text-grey-5" style="min-width: 16px;">{{ idx + 1 }}</span>
                <span class="text-caption text-weight-medium text-dark">{{ top.name }}</span>
              </div>
              <span class="text-caption text-weight-bold" style="color: #0F172A;">{{ top.reputation }}</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { useMeetUsStore } from 'src/stores/meetus'

const router = useRouter()
const auth = useAuthStore()
const store = useMeetUsStore()
const activeTab = ref('Para ti')
const quickQuery = ref('')

const tabs = ['Para ti', 'Mais compatíveis', 'Perto de ti', 'Novos']

const activeUser = computed(() => {
  return auth.user?.name ? auth.user : store.currentUser
})

const firstName = computed(() => {
  const name = activeUser.value?.name || store.currentUser?.name || ''
  const clean = name.replace(/\s*\(Você\)\s*/i, '').trim()
  if (!clean) return 'Estudante'
  return clean.split(' ')[0]
})

const teachSkillName = computed(() => {
  const teaches = activeUser.value?.skillsTeach || store.currentUser?.skillsTeach || []
  if (teaches.length > 0 && teaches[0]?.name) return teaches[0].name
  const rawSkills = activeUser.value?.skills || []
  const offer = rawSkills.find(s => s.type === 'offer' || s.type === 'both')
  if (offer?.name) return offer.name
  return activeUser.value?.course || 'Competências Digitais'
})

// Estudantes recomendados excluindo o próprio utilizador logado
const displayedStudents = computed(() => {
  const currentId = String(activeUser.value?.id || activeUser.value?._id || store.currentUser?.id || '')
  const currentEmail = activeUser.value?.email || store.currentUser?.email || ''
  const others = store.students.filter(s => String(s.id) !== currentId && (!currentEmail || s.email !== currentEmail))

  if (activeTab.value === 'Mais compatíveis') {
    return [...others].sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0)).slice(0, 3)
  }
  if (activeTab.value === 'Perto de ti') {
    const userCity = activeUser.value?.city || store.currentUser?.city || 'Maputo'
    const near = others.filter(s => s.city === userCity)
    return (near.length >= 3 ? near : others).slice(0, 3)
  }
  if (activeTab.value === 'Novos') {
    return [...others].reverse().slice(0, 3)
  }
  // "Para ti"
  return others.slice(0, 3)
})

const bannerAvatars = [
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=faces', // Amélia
  'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=400&h=400&fit=crop&crop=faces', // Celso
  'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=400&fit=crop&crop=faces'  // Neusa
]

// Conexões sugeridas exatas da Tela 2
const rawSuggestedConnections = [
  {
    id: '5',
    name: 'Lúcia Armando',
    course: 'Engenharia Civil',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=400&fit=crop&crop=faces'
  },
  {
    id: '6',
    name: 'Samuel Nantumbo',
    course: 'Economia',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces'
  },
  {
    id: '7',
    name: 'Marta Cossa',
    course: 'Direito',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces'
  }
]

const suggestedConnections = computed(() => {
  const currentId = String(activeUser.value?.id || activeUser.value?._id || '')
  return rawSuggestedConnections.filter(c => String(c.id) !== currentId)
})

// Próximas sessões exatas da Tela 2
const officialUpcomingSessions = [
  { title: 'Design de Interfaces', date: '15 Mai • 15:00' },
  { title: 'React para iniciantes', date: '16 Mai • 17:30' },
  { title: 'Excel avançado', date: '17 Mai • 18:00' }
]

// Competências mais procuradas exatas da Tela 2
const topSkills = [
  'Design de Interfaces',
  'React',
  'Excel',
  'Contabilidade',
  'Fotografia'
]

// Melhores estudantes com notas oficiais
const topStudents = [
  { id: '2', name: 'Amélia Mondlane', reputation: '4,9' },
  { id: '3', name: 'Celso Macuácua', reputation: '4,9' },
  { id: '4', name: 'Neusa Tembe', reputation: '4,9' }
]

function handleQuickSearch() {
  if (quickQuery.value) {
    router.push({ name: 'students', query: { q: quickQuery.value } })
  }
}

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
</script>

<style scoped>
.quick-search-input :deep(.q-field__control) {
  border-radius: 24px;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  height: 42px;
}

.highlight-banner {
  background: linear-gradient(135deg, #059669 0%, #10B981 100%);
  border-radius: 14px;
  padding: 16px 20px;
}

.bg-white-20 {
  background: rgba(255, 255, 255, 0.2);
}

.avatar-stack {
  display: flex;
  align-items: center;
}

.stack-avatar {
  border: 2px solid #FFFFFF;
}

.tabs-container {
  border-bottom: 1px solid #E2E8F0;
  padding-bottom: 2px;
}

.tab-item {
  font-size: 0.9rem;
  font-weight: 500;
  color: #64748B;
  padding-bottom: 8px;
  margin-bottom: -1px;
  border-bottom: 2px solid transparent;
  transition: all 0.15s ease;
}

.tab-item:hover {
  color: #0F172A;
}

.tab-active {
  color: #059669;
  font-weight: 700;
  border-bottom-color: #059669;
}

.student-card {
  border-radius: 14px;
  border: 1px solid #E2E8F0;
  background: #FFFFFF;
  overflow: hidden;
}

.student-photo-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.student-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.compat-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #D1FAE5;
  color: #047857;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 8px;
  line-height: 1.15;
  text-align: center;
}

.sidebar-card {
  border-radius: 14px;
  border: 1px solid #E2E8F0;
  background: #FFFFFF;
}

.session-row {
  border-bottom: 1px solid #F8FAFC;
}

.session-row:last-child {
  border-bottom: none;
}

.skill-row {
  transition: color 0.15s ease;
}

.skill-row:hover {
  color: #059669;
  font-weight: 600;
}

.hover-item {
  border-radius: 8px;
  transition: background 0.15s ease;
}

.hover-item:hover {
  background: #F8FAFC;
}
</style>
