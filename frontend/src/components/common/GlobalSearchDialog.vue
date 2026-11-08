<template>
  <q-dialog v-model="isOpen" position="top">
    <q-card style="width: 600px; max-width: 95vw; margin-top: 60px; border-radius: 20px;">
      <q-card-section class="q-pb-none">
        <q-input
          v-model="query"
          placeholder="Pesquisar estudantes, competências ou publicações..."
          outlined
          dense
          autofocus
          class="search-input"
          bg-color="soft-lavender"
        >
          <template #prepend>
            <q-icon name="search" color="primary" />
          </template>
          <template #append v-if="query">
            <q-icon name="close" class="cursor-pointer" @click="query = ''" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-section class="q-pt-sm" style="max-height: 450px; overflow-y: auto;">
        <!-- Se nada digitado: sugestões rápidas -->
        <div v-if="!query.trim()" class="q-pa-sm">
          <div class="text-caption text-weight-bold text-grey-7 q-mb-sm">PESQUISAS FREQUENTES</div>
          <div class="row q-gutter-xs">
            <q-chip
              v-for="tag in ['Vue.js', 'Figma', 'Inglês', 'Cálculo', 'Excel', 'UEM', 'ISCTEM']"
              :key="tag"
              clickable
              color="lavender"
              text-color="primary"
              size="sm"
              @click="query = tag"
            >
              {{ tag }}
            </q-chip>
          </div>
        </div>

        <!-- Resultados -->
        <div v-else>
          <!-- Estudantes -->
          <div v-if="filteredStudents.length" class="q-mb-md">
            <div class="text-caption text-weight-bold text-primary q-mb-xs">ESTUDANTES ({{ filteredStudents.length }})</div>
            <q-list separator>
              <q-item
                v-for="s in filteredStudents.slice(0, 4)"
                :key="s.id"
                clickable
                v-ripple
                class="rounded-borders"
                @click="goToStudent(s.id)"
              >
                <q-item-section avatar>
                  <q-avatar size="36px">
                    <img :src="s.avatar" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ s.name }}</q-item-label>
                  <q-item-label caption>{{ s.course }} • {{ s.institution }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge color="primary" label="Ver Perfil" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- Publicações da Comunidade -->
          <div v-if="filteredPosts.length" class="q-mb-md">
            <div class="text-caption text-weight-bold text-secondary q-mb-xs">PUBLICATÓRIAS ({{ filteredPosts.length }})</div>
            <q-list separator>
              <q-item
                v-for="p in filteredPosts.slice(0, 3)"
                :key="p.id"
                clickable
                v-ripple
                class="rounded-borders"
                @click="goToCommunity"
              >
                <q-item-section avatar>
                  <q-icon name="forum" color="secondary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-medium ellipsis">{{ p.title }}</q-item-label>
                  <q-item-label caption class="ellipsis">{{ p.content }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <div v-if="!filteredStudents.length && !filteredPosts.length" class="text-center q-pa-md text-grey-6">
            Nenhum resultado encontrado para "{{ query }}".
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMeetUsStore } from 'src/stores/meetus'

const isOpen = defineModel('modelValue', { type: Boolean, default: false })
const query = ref('')
const router = useRouter()
const store = useMeetUsStore()

const filteredStudents = computed(() => {
  if (!query.value.trim()) return []
  const q = query.value.toLowerCase()
  return store.students.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.course.toLowerCase().includes(q) ||
    s.institution.toLowerCase().includes(q) ||
    (s.skillsTeach && s.skillsTeach.some(sk => sk.name.toLowerCase().includes(q))) ||
    (s.skillsLearn && s.skillsLearn.some(sk => sk.name.toLowerCase().includes(q)))
  )
})

const filteredPosts = computed(() => {
  if (!query.value.trim()) return []
  const q = query.value.toLowerCase()
  return store.posts.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.content.toLowerCase().includes(q) ||
    (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
  )
})

function goToStudent(id) {
  isOpen.value = false
  router.push({ name: 'profile', query: { id } })
}

function goToCommunity() {
  isOpen.value = false
  router.push({ name: 'community' })
}
</script>
