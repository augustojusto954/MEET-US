<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">Privacidade & Visibilidade</div>
        <div class="text-caption text-grey-7">Controla como outros estudantes interagem com o teu perfil</div>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <!-- Preferências de Visibilidade -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Visibilidade do Perfil</div>
            <div class="text-caption text-grey-7 q-mb-md">Decide que informações são visíveis para outros estudantes</div>

            <q-list separator>
              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Mostrar estado online</q-item-label>
                  <q-item-label caption>Permite que outros vejam quando estás ativo na plataforma</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="onlineStatus" @update:model-value="toggleOnline" color="primary" />
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Aparecer no Matching</q-item-label>
                  <q-item-label caption>O teu perfil será apresentado como sugestão a outros utilizadores</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="matchingVisible" @update:model-value="savePreference" color="primary" />
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Receber pedidos diretos de troca</q-item-label>
                  <q-item-label caption>Qualquer estudante poderá enviar-te propostas de aprendizagem</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="allowDirectExchanges" @update:model-value="savePreference" color="primary" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <!-- Informações e Dicas de Segurança -->
        <q-card flat bordered class="bg-blue-1 text-blue-10">
          <q-card-section>
            <div class="row items-center q-mb-xs">
              <q-icon name="security" size="20px" class="q-mr-xs" />
              <span class="text-subtitle2 text-weight-bold">Dicas de Segurança entre Estudantes</span>
            </div>
            <div class="text-caption">
              • Nunca partilhes palavras-passe ou dados financeiros.<br/>
              • As sessões de estudo presenciais devem ocorrer preferencialmente no campus universitário ou em bibliotecas públicas.<br/>
              • Podes bloquear ou denunciar qualquer utilizador que apresente comportamento desadequado.
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Utilizadores Bloqueados -->
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Utilizadores Bloqueados</div>
            <div class="text-caption text-grey-7 q-mb-md">Utilizadores bloqueados não te podem enviar mensagens nem propor trocas</div>

            <div v-if="loadingBlocks" class="flex flex-center q-pa-md">
              <q-spinner color="primary" size="2rem" />
            </div>

            <div v-else-if="!blockedUsers.length" class="text-center q-pa-lg text-grey-7">
              <q-icon name="check_circle" color="positive" size="2.5rem" />
              <div class="text-caption q-mt-sm">Não tens nenhum utilizador bloqueado.</div>
            </div>

            <q-list v-else separator>
              <q-item v-for="b in blockedUsers" :key="b.block_id">
                <q-item-section avatar>
                  <q-avatar size="40px">
                    <img :src="b.avatar || 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=400&h=400&fit=crop&crop=faces'" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-medium">{{ b.name }}</q-item-label>
                  <q-item-label caption>{{ b.institution || 'Estudante' }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    flat dense size="sm"
                    color="primary"
                    label="Desbloquear"
                    @click="unblock(b.block_id, b.name)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import { queryAll, run } from 'src/db'
import { api } from 'src/boot/axios'

const USE_FAKE = (import.meta.env.VITE_USE_FAKE_API || import.meta.env.USE_FAKE_API || 'false') === 'true'

const $q = useQuasar()
const auth = useAuthStore()

const onlineStatus = ref(Boolean(auth.user?.online))
const matchingVisible = ref(true)
const allowDirectExchanges = ref(true)

const blockedUsers = ref([])
const loadingBlocks = ref(false)

async function loadBlockedUsers() {
  if (!auth.userId) return
  loadingBlocks.value = true
  try {
    if (!USE_FAKE) {
      const res = await api.get('/users/blocked')
      blockedUsers.value = res.data.map(u => ({ block_id: u.id, ...u }))
      return
    }
    const rows = queryAll(
      `SELECT b.id AS block_id, u.id, u.name, u.avatar, u.institution
       FROM blocks b
       JOIN users u ON u.id = b.blocked_id
       WHERE b.blocker_id = ?`,
      [auth.userId]
    )
    blockedUsers.value = rows
  } catch (err) {
    console.error('Failed to load blocked users', err)
  } finally {
    loadingBlocks.value = false
  }
}

async function toggleOnline(val) {
  try {
    if (!USE_FAKE) {
      await api.put(`/users/${auth.userId}`, { online: val })
      auth.user.online = val
      auth._persist()
      $q.notify({ type: 'positive', message: `Estado online ${val ? 'ativado' : 'desativado'}` })
      return
    }
    run('UPDATE users SET online = ? WHERE id = ?', [val ? 1 : 0, auth.userId])
    auth.user.online = val ? 1 : 0
    auth._persist()
    $q.notify({ type: 'positive', message: `Estado online ${val ? 'ativado' : 'desativado'}` })
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Erro ao atualizar estado online' })
  }
}

function savePreference() {
  $q.notify({ type: 'positive', message: 'Preferências guardadas com sucesso!' })
}

async function unblock(blockId, name) {
  try {
    if (!USE_FAKE) {
      await api.delete(`/users/block/${blockId}`)
      blockedUsers.value = blockedUsers.value.filter((b) => b.block_id !== blockId && b.id !== blockId)
      $q.notify({ type: 'positive', message: `${name} foi desbloqueado.` })
      return
    }
    run('DELETE FROM blocks WHERE id = ?', [blockId])
    blockedUsers.value = blockedUsers.value.filter((b) => b.block_id !== blockId)
    $q.notify({ type: 'positive', message: `${name} foi desbloqueado.` })
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Erro ao desbloquear utilizador' })
  }
}

onMounted(() => {
  loadBlockedUsers()
})
</script>
