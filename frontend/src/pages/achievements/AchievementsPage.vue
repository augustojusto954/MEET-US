<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Conquistas & Gamificação</div>
        <div class="text-caption text-grey-7">
          Evolui o teu nível na rede universitária, acumula XP e desbloqueia medalhas de mentor.
        </div>
      </div>
    </div>

    <!-- Banner de Nível & XP -->
    <q-card flat class="gradient-purple text-white q-pa-lg q-mb-lg shadow-2" style="border-radius: 20px;">
      <div class="row items-center justify-between">
        <div class="col-12 col-md-7">
          <div class="row items-center q-mb-xs">
            <q-badge color="white" text-color="primary" class="q-px-sm q-py-xs text-weight-bolder">
              NÍVEL 5
            </q-badge>
            <span class="q-ml-sm text-caption text-lavender font-weight-medium">Mentor Universitário Avançado</span>
          </div>
          <div class="text-h4 text-weight-bolder q-mt-xs">1.450 / 2.000 XP</div>
          <div class="text-caption text-lavender q-mt-xs">Faltam apenas 550 XP para o Nível 6: Mestre Académico!</div>

          <!-- Barra de Progresso XP -->
          <div class="q-mt-md" style="max-width: 450px;">
            <q-linear-progress :value="0.72" rounded size="10px" color="amber-9" track-color="white" />
          </div>
        </div>

        <div class="col-12 col-md-5 row justify-md-end q-mt-md q-mt-md-none items-center q-gutter-md">
          <div class="text-center bg-white q-pa-md rounded-borders text-dark shadow-1" style="min-width: 110px;">
            <div class="text-h5 text-weight-bolder text-primary">2</div>
            <div class="text-caption text-grey-7">Desbloqueadas</div>
          </div>
          <div class="text-center bg-white q-pa-md rounded-borders text-dark shadow-1" style="min-width: 110px;">
            <div class="text-h5 text-weight-bolder text-amber-9">3</div>
            <div class="text-caption text-grey-7">Em Progresso</div>
          </div>
        </div>
      </div>
    </q-card>

    <!-- Filtros de Categorias de Conquistas -->
    <div class="row q-gutter-xs q-mb-md">
      <q-chip
        v-for="cat in ['Todas', 'Learning', 'Teaching', 'Collaboration', 'Community', 'Consistency']"
        :key="cat"
        clickable
        :color="selectedCategory === cat ? 'primary' : 'lavender'"
        :text-color="selectedCategory === cat ? 'white' : 'primary'"
        size="sm"
        @click="selectedCategory = cat"
      >
        {{ cat }}
      </q-chip>
    </div>

    <!-- Lista de Conquistas -->
    <div class="row q-col-gutter-md">
      <div
        v-for="ach in filteredAchievements"
        :key="ach.id"
        class="col-12 col-sm-6 col-lg-4"
      >
        <q-card
          flat
          class="q-pa-md hover-lift full-height column justify-between"
          :class="{ 'bg-soft-lavender border-primary': ach.unlocked }"
        >
          <div>
            <div class="row items-center justify-between">
              <q-avatar
                size="54px"
                :class="ach.unlocked ? 'bg-primary text-white shadow-2' : 'bg-grey-3 text-grey-6'"
              >
                <q-icon :name="ach.icon" size="28px" />
              </q-avatar>
              <q-badge
                :color="ach.unlocked ? 'positive' : 'grey-5'"
                class="q-pa-xs text-weight-bold"
              >
                {{ ach.unlocked ? 'Desbloqueada ✓' : 'Bloqueada' }}
              </q-badge>
            </div>

            <div class="text-subtitle1 text-weight-bolder text-dark q-mt-sm">{{ ach.title }}</div>
            <div class="text-caption text-grey-7">{{ ach.description }}</div>

            <!-- Progresso da Conquista -->
            <div class="q-mt-md">
              <div class="row items-center justify-between text-caption text-weight-bold q-mb-xs">
                <span class="text-grey-7">Progresso</span>
                <span class="text-primary">{{ ach.current }} / {{ ach.total }}</span>
              </div>
              <q-linear-progress
                :value="ach.current / ach.total"
                rounded
                size="8px"
                :color="ach.unlocked ? 'positive' : 'primary'"
                track-color="grey-3"
              />
            </div>
          </div>

          <div class="row items-center justify-between q-mt-md pt-xs border-top">
            <span class="text-caption text-weight-bold text-amber-9">+{{ ach.rewardXP }} XP</span>
            <span v-if="ach.unlockedAt" class="text-caption text-grey-6">Ganha em {{ ach.unlockedAt }}</span>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMeetUsStore } from 'src/stores/meetus'

const store = useMeetUsStore()
const selectedCategory = ref('Todas')

const filteredAchievements = computed(() => {
  if (selectedCategory.value === 'Todas') return store.achievements
  return store.achievements.filter(a => a.category === selectedCategory.value)
})
</script>
