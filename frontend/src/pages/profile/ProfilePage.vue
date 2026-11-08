<template>
  <q-page padding class="q-pb-xl">
    <!-- Capa e Cabeçalho do Perfil -->
    <q-card flat class="overflow-hidden q-mb-lg" style="border-radius: 20px;">
      <div style="height: 200px; position: relative;">
        <img
          :src="profileUser.cover || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=400&fit=crop'"
          class="full-width full-height object-cover"
        />
        <div class="absolute-top-right q-pa-md row q-gutter-sm items-center">
          <template v-if="isMe">
            <q-btn
              unelevated
              rounded
              color="white"
              text-color="primary"
              icon="edit"
              label="Editar Perfil"
              class="text-weight-bold shadow-2"
              :to="{ name: 'profile-edit' }"
            />
            <q-btn
              unelevated
              rounded
              color="negative"
              icon="logout"
              label="Terminar Sessão"
              class="text-weight-bold shadow-2"
              @click="handleLogout"
            />
          </template>
          <q-btn
            v-else
            unelevated
            rounded
            color="primary"
            icon="swap_horiz"
            label="Propor Troca"
            class="text-weight-bold shadow-2"
            :to="{ name: 'exchange-create', query: { partnerId: profileUser.id } }"
          />
        </div>
      </div>

      <div class="q-pa-lg">
        <div class="row items-end justify-between" style="margin-top: -65px;">
          <div class="row items-end">
            <q-avatar size="100px" class="shadow-3 border-white bg-white relative-position" style="border: 4px solid #FFFFFF;">
              <img :src="profileUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileUser.name || 'Estudante')}&background=059669&color=fff&size=256`" />
              <q-badge
                v-if="profileUser.online"
                color="positive"
                floating
                rounded
                style="top: 8px; right: 8px; width: 14px; height: 14px; border: 2px solid white;"
              />
            </q-avatar>
            <div class="q-ml-md q-mb-xs">
              <div class="row items-center">
                <span class="text-h5 text-weight-bolder text-dark">{{ profileUser.name }}</span>
                <q-icon v-if="profileUser.verified" name="verified" color="primary" size="22px" class="q-ml-xs">
                  <q-tooltip>Estudante Verificado</q-tooltip>
                </q-icon>
                <q-badge
                  :color="profileUser.online ? 'positive' : 'grey-5'"
                  rounded
                  class="q-ml-sm q-px-xs text-weight-bold"
                  style="font-size: 10px;"
                >
                  {{ profileUser.online ? 'Online agora' : 'Offline' }}
                </q-badge>
              </div>
              <div class="text-subtitle2 text-grey-8">{{ profileUser.course }} ({{ profileUser.year }}º Ano)</div>
              <div class="text-caption text-grey-6">{{ profileUser.institution }} • {{ profileUser.city }}</div>
            </div>
          </div>

          <div class="row q-gutter-md q-mt-md q-mt-sm-none">
            <div class="text-center bg-soft-lavender q-pa-sm rounded-borders" style="min-width: 90px;">
              <div class="text-h6 text-weight-bolder text-primary">{{ profileUser.reputation }} ★</div>
              <div class="text-caption text-grey-7">{{ profileUser.reviews_count }} avaliações</div>
            </div>
            <div class="text-center bg-soft-lavender q-pa-sm rounded-borders" style="min-width: 90px;">
              <div class="text-h6 text-weight-bolder text-secondary">
                {{ (profileUser.skillsTeach?.length || 0) + (profileUser.skillsLearn?.length || 0) }}
              </div>
              <div class="text-caption text-grey-7">Competências</div>
            </div>
          </div>
        </div>

        <q-separator class="q-my-md" />

        <!-- Biografia -->
        <div class="q-mb-md">
          <div class="text-subtitle2 text-weight-bold text-dark q-mb-xs">Biografia Académica</div>
          <p class="text-body2 text-grey-8 leading-relaxed">
            {{ profileUser.bio || 'Estudante universitário dedicado à partilha mútua de competências e colaboração académica.' }}
          </p>
        </div>

        <!-- Disponibilidade -->
        <div class="q-mb-md">
          <div class="text-subtitle2 text-weight-bold text-dark q-mb-xs">Disponibilidade Habitual</div>
          <div class="text-caption text-primary text-weight-bold row items-center">
            <q-icon name="schedule" size="16px" class="q-mr-xs" />
            {{ profileUser.availability || 'Terças e Quintas, fins de semana' }}
          </div>
        </div>
      </div>
    </q-card>

    <!-- Grelha de Competências (Ensina vs Quer Aprender) -->
    <div class="row q-col-gutter-lg q-mb-lg">
      <div class="col-12 col-md-6">
        <q-card flat class="q-pa-lg full-height">
          <div class="text-subtitle1 text-weight-bold text-primary q-mb-md">
            <q-icon name="school" size="22px" class="q-mr-xs" />
            Competências que Ensina (Skills I Teach)
          </div>
          <div v-if="profileUser.skillsTeach?.length" class="column q-gutter-sm">
            <div
              v-for="s in profileUser.skillsTeach"
              :key="s.id"
              class="q-pa-sm bg-soft-lavender rounded-borders"
            >
              <div class="row items-center justify-between">
                <span class="text-weight-bold text-dark">{{ s.name }}</span>
                <q-badge color="primary">{{ s.level }}</q-badge>
              </div>
              <div class="text-caption text-grey-7 q-mt-xs">{{ s.description }}</div>
            </div>
          </div>
          <div v-else class="text-caption text-grey-6">Nenhuma competência registada para ensinar.</div>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card flat class="q-pa-lg full-height">
          <div class="text-subtitle1 text-weight-bold text-secondary q-mb-md">
            <q-icon name="menu_book" size="22px" class="q-mr-xs" />
            O que Quer Aprender (Skills I Want to Learn)
          </div>
          <div v-if="profileUser.skillsLearn?.length" class="column q-gutter-sm">
            <div
              v-for="s in profileUser.skillsLearn"
              :key="s.id"
              class="q-pa-sm bg-lavender rounded-borders"
            >
              <div class="row items-center justify-between">
                <span class="text-weight-bold text-dark">{{ s.name }}</span>
                <q-badge color="secondary">{{ s.priority || 'Alta' }}</q-badge>
              </div>
              <div class="text-caption text-grey-7 q-mt-xs">{{ s.goal }}</div>
            </div>
          </div>
          <div v-else class="text-caption text-grey-6">Nenhuma competência na lista de aprendizagem.</div>
        </q-card>
      </div>
    </div>

    <!-- Interesses em Comum -->
    <q-card flat class="q-pa-md">
      <div class="text-subtitle1 text-weight-bold text-dark q-mb-sm">Interesses & Hobbies</div>
      <div class="row q-gutter-xs">
        <q-chip
          v-for="int in (profileUser.interests || ['Tecnologia', 'Educação', 'Música', 'Networking'])"
          :key="int"
          color="soft-lavender"
          text-color="primary"
          icon="tag"
        >
          {{ int }}
        </q-chip>
      </div>
    </q-card>

    <!-- Zona de Sessão / Logout (apenas no próprio perfil) -->
    <q-card v-if="isMe" flat class="q-pa-lg q-mt-lg" style="border: 1px solid #FEE2E2; background: #FFFBFB; border-radius: 16px;">
      <div class="row items-center justify-between q-col-gutter-md">
        <div>
          <div class="text-subtitle1 text-weight-bolder text-negative row items-center">
            <q-icon name="logout" color="negative" class="q-mr-xs" size="20px" />
            Sessão & Conta
          </div>
          <div class="text-caption text-grey-8 q-mt-xs">
            Terminar a sessão ativa neste dispositivo. Podes voltar a entrar a qualquer momento com as tuas credenciais.
          </div>
        </div>
        <div>
          <q-btn
            unelevated
            rounded
            color="negative"
            icon="logout"
            label="Terminar Sessão"
            class="text-weight-bold q-px-lg shadow-1"
            @click="handleLogout"
          />
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useMeetUsStore } from 'src/stores/meetus'
import { useAuthStore } from 'src/stores/auth'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const store = useMeetUsStore()
const auth = useAuthStore()

const profileUser = computed(() => {
  const queryId = route.query.id
  if (queryId && queryId !== String(store.currentUser.id)) {
    const found = store.students.find(s => s.id === queryId)
    if (found) return found
  }
  return store.currentUser
})

const isMe = computed(() => {
  return String(profileUser.value.id) === String(store.currentUser.id) || !route.query.id
})

function handleLogout() {
  $q.dialog({
    title: 'Terminar Sessão',
    message: 'Tens a certeza de que desejas sair da tua conta MEET-US?',
    cancel: {
      flat: true,
      label: 'Cancelar',
      color: 'grey-7'
    },
    ok: {
      unelevated: true,
      label: 'Sim, Terminar Sessão',
      color: 'negative'
    },
    persistent: false
  }).onOk(() => {
    auth.logout()
    $q.notify({
      type: 'info',
      message: 'Sessão terminada com sucesso.',
      icon: 'logout'
    })
    router.push({ name: 'login' })
  })
}
</script>
