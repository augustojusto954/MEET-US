<template>
  <q-layout view="lHh Lpr lFf" class="bg-app">
    <!-- Header Sem Sombra, Idêntico ao Design Original (2.webp) -->
    <q-header class="bg-white text-dark" style="z-index: 2000; border-bottom: 1px solid #E2E8F0;">
      <q-toolbar class="q-px-lg" style="min-height: 64px;">
        <!-- Botão Menu Mobile -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          color="grey-8"
          class="lt-md q-mr-sm"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <!-- Logo Brand para Mobile -->
        <div class="row items-center cursor-pointer q-mr-md lt-md" @click="$router.push('/dashboard')">
          <div class="text-weight-bolder text-h6" style="color: #059669; letter-spacing: -0.5px;">MEET-US</div>
        </div>

        <!-- Barra de Pesquisa Global Ampla Idêntica à Tela 2 -->
        <div class="gt-sm" style="flex: 1; max-width: 680px;">
          <q-input
            dense
            outlined
            placeholder="Pesquisar competências, pessoas, cidades..."
            class="global-search-bar"
            readonly
            @click="showSearchDialog = true"
          >
            <template #prepend>
              <q-icon name="search" color="grey-5" size="20px" class="q-ml-xs" />
            </template>
          </q-input>
        </div>

        <q-space />

        <!-- Ações do Header -->
        <div class="row items-center q-gutter-xs q-gutter-sm-sm">
          <!-- Botão Pesquisa Mobile -->
          <q-btn
            flat
            round
            dense
            icon="search"
            color="grey-8"
            class="lt-md"
            @click="showSearchDialog = true"
          >
            <q-tooltip>Pesquisar</q-tooltip>
          </q-btn>

          <!-- Mensagens estilo Facebook (Ícone + Sinal Vermelho com Quantidade) -->
          <q-btn
            flat
            round
            dense
            icon="chat_bubble_outline"
            color="grey-8"
            size="md"
            class="q-mr-xs cursor-pointer relative-position"
            @click="handleMessageButtonClick"
          >
            <!-- Sinal Vermelho com Quantidade (Estilo Facebook) -->
            <q-badge
              v-if="chatStore.totalUnreadCount > 0"
              color="negative"
              floating
              rounded
              class="text-weight-bold shadow-2"
              style="font-size: 11px; padding: 2px 5px; top: 1px; right: 1px;"
            >
              {{ chatStore.totalUnreadCount > 99 ? '99+' : chatStore.totalUnreadCount }}
            </q-badge>
            <q-tooltip>Mensagens ({{ chatStore.totalUnreadCount }} não lidas)</q-tooltip>

            <!-- Dropdown rápido de conversas estilo Facebook -->
            <q-menu
              v-if="chatStore.conversations.length"
              anchor="bottom end"
              self="top end"
              class="shadow-4"
              style="min-width: 320px; max-width: 90vw; border-radius: 14px;"
            >
              <div class="row items-center justify-between q-pa-sm bg-grey-1" style="border-bottom: 1px solid #E2E8F0;">
                <span class="text-subtitle2 text-weight-bolder text-dark">Conversas</span>
                <q-badge v-if="chatStore.totalUnreadCount > 0" color="negative" class="text-weight-bold">
                  {{ chatStore.totalUnreadCount }} novas
                </q-badge>
              </div>

              <q-list separator dense class="q-py-xs">
                <q-item
                  v-for="c in chatStore.conversations.slice(0, 5)"
                  :key="c.id"
                  clickable
                  v-close-popup
                  class="q-py-sm"
                  :class="{ 'bg-red-1': (c.unread || c.unreadCount || 0) > 0 }"
                  @click="openChatWith(c.other?.id || c.participantId)"
                >
                  <q-item-section avatar>
                    <q-avatar size="38px" class="relative-position shadow-1">
                      <img :src="c.other?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.other?.name || 'C')}&background=059669&color=fff&size=256`" />
                      <q-badge
                        v-if="c.other?.online"
                        color="positive"
                        floating
                        rounded
                        style="top: 1px; right: 1px;"
                      />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-weight-bold text-dark ellipsis">{{ c.other?.name || 'Colega' }}</q-item-label>
                    <q-item-label caption class="ellipsis text-grey-8" :class="{ 'text-weight-bold text-dark': (c.unread || c.unreadCount || 0) > 0 }">
                      {{ c.last_message || 'Inicia uma conversa...' }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side v-if="(c.unread || c.unreadCount || 0) > 0">
                    <q-badge color="negative" rounded class="text-weight-bold">
                      {{ c.unread || c.unreadCount }}
                    </q-badge>
                  </q-item-section>
                </q-item>
              </q-list>

              <div class="q-pa-xs text-center border-top">
                <q-btn flat dense no-caps color="primary" label="Ver Todas as Mensagens" class="full-width text-weight-bold" :to="{ name: 'chat' }" v-close-popup />
              </div>
            </q-menu>
          </q-btn>

          <!-- Notificações -->
          <q-btn flat round dense icon="notifications_none" color="grey-8" size="md" :to="{ name: 'notifications' }">
            <q-badge
              v-if="store.unreadNotificationsCount > 0"
              color="negative"
              floating
              rounded
            >
              {{ store.unreadNotificationsCount }}
            </q-badge>
          </q-btn>

          <!-- Avatar do Utilizador Autenticado -->
          <q-btn flat round dense class="q-ml-xs">
            <q-avatar size="36px">
              <img :src="currentAvatar" />
            </q-avatar>

            <q-menu anchor="bottom end" self="top end" class="shadow-4" style="min-width: 220px; border-radius: 12px;">
              <q-item class="q-py-md" style="background: #F8FAFC;">
                <q-item-section avatar>
                  <q-avatar size="40px">
                    <img :src="currentAvatar" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold text-dark">{{ activeUser?.name || 'Estudante' }}</q-item-label>
                  <q-item-label caption class="ellipsis">{{ activeUser?.course || activeUser?.institution || 'Ensino Superior' }}</q-item-label>
                  <q-item-label caption class="text-grey-6" style="font-size: 11px;">{{ activeUser?.email }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator />

              <q-list padding dense>
                <q-item clickable v-close-popup :to="{ name: 'profile' }">
                  <q-item-section avatar><q-icon name="person_outline" color="grey-7" /></q-item-section>
                  <q-item-section>Meu Perfil</q-item-section>
                </q-item>
                <q-item clickable v-close-popup :to="{ name: 'profile-edit' }">
                  <q-item-section avatar><q-icon name="edit" color="grey-7" /></q-item-section>
                  <q-item-section>Editar Perfil</q-item-section>
                </q-item>
                <q-item clickable v-close-popup :to="{ name: 'settings' }">
                  <q-item-section avatar><q-icon name="settings" color="grey-7" /></q-item-section>
                  <q-item-section>Definições</q-item-section>
                </q-item>

                <template v-if="auth.isAdmin">
                  <q-separator class="q-my-xs" />
                  <q-item clickable v-close-popup :to="{ name: 'admin-overview' }">
                    <q-item-section avatar><q-icon name="admin_panel_settings" color="primary" /></q-item-section>
                    <q-item-section class="text-weight-bold text-primary">Portal Admin</q-item-section>
                  </q-item>
                </template>

                <q-separator class="q-my-xs" />

                <q-item clickable v-close-popup @click="logout" class="text-negative">
                  <q-item-section avatar><q-icon name="logout" color="negative" /></q-item-section>
                  <q-item-section class="text-weight-bold">Terminar Sessão</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Sidebar Branca com Pílulas Verdes Idêntica à Tela 2 -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="250"
      :breakpoint="1023"
      class="meetus-sidebar column justify-between"
    >
      <div>
        <!-- Brand Header -->
        <div class="q-pa-lg q-pb-md">
          <div class="row items-center cursor-pointer" @click="$router.push('/dashboard')">
            <div>
              <div class="text-h6 text-weight-bolder" style="color: #059669; letter-spacing: -0.5px; line-height: 1.1;">
                MEET-US
              </div>
              <div class="text-caption" style="font-size: 11px; font-weight: 500; color: #94A3B8; margin-top: 3px;">
                Liga-te. Partilha. Aprende.
              </div>
            </div>
          </div>
        </div>

        <!-- Navegação Idêntica aos 8 Menus do Design -->
        <div class="q-px-sm q-mt-sm">
          <q-item
            v-for="item in navLinks"
            :key="item.to"
            clickable
            v-ripple
            :to="getNavTarget(item)"
            class="sidebar-nav-item"
            active-class="sidebar-nav-active"
            @click="onNavClick"
          >
            <q-item-section avatar class="nav-avatar">
              <q-icon :name="item.icon" size="20px" />
            </q-item-section>
            <q-item-section class="text-weight-medium nav-text">{{ item.label }}</q-item-section>
            <!-- Sinal Vermelho na Sidebar para Mensagens (Estilo Facebook) -->
            <q-item-section side v-if="item.to === 'chat' && chatStore.totalUnreadCount > 0">
              <q-badge color="negative" rounded class="text-weight-bold shadow-1">
                {{ chatStore.totalUnreadCount }}
              </q-badge>
            </q-item-section>
          </q-item>
        </div>
      </div>

      <!-- Rodapé da Sidebar: Perfil do Estudante Autenticado -->
      <div class="q-pa-md" style="border-top: 1px solid #F1F5F9;">
        <div class="row items-center cursor-pointer" @click="$router.push({ name: 'profile' }); onNavClick()" title="Ver o meu perfil">
          <q-avatar size="36px" class="q-mr-sm shadow-1">
            <img :src="currentAvatar" />
          </q-avatar>
          <div style="line-height: 1.25;" class="ellipsis col">
            <div class="text-caption text-weight-bold text-dark ellipsis">{{ activeUser?.name || 'Estudante' }}</div>
            <div class="text-caption text-grey-6 ellipsis" style="font-size: 10px;">{{ activeUser?.institution || 'Ensino Superior' }}</div>
          </div>
        </div>
      </div>
    </q-drawer>

    <!-- Content Area -->
    <q-page-container class="bg-app">
      <router-view />
    </q-page-container>

    <!-- Dialog de Pesquisa Global -->
    <GlobalSearchDialog v-model="showSearchDialog" />

    <!-- Dialog de Chamada a Receber (WebRTC P2P) -->
    <q-dialog v-model="showIncomingCallDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="q-pa-lg text-center shadow-10" style="min-width: 320px; max-width: 400px; border-radius: 20px;">
        <div class="column items-center">
          <q-avatar size="88px" class="q-mb-md shadow-3 relative-position">
            <img :src="incomingCallAvatar" />
            <q-badge color="positive" floating rounded class="q-pa-xs">
              <q-icon name="phone_in_talk" color="white" size="14px" />
            </q-badge>
          </q-avatar>

          <div class="text-h6 text-weight-bolder text-dark">{{ callStore.incomingCall?.callerName || 'Colega MEET-US' }}</div>
          <div class="text-caption text-grey-7 q-mb-md">
            {{ callStore.incomingCall?.isVideo ? 'Chamada de Vídeo a entrar...' : 'Chamada de Voz a entrar...' }}
          </div>

          <div class="row q-gutter-md justify-center full-width q-mt-sm">
            <q-btn
              round
              color="negative"
              icon="call_end"
              size="lg"
              @click="rejectIncomingCall"
            >
              <q-tooltip>Recusar</q-tooltip>
            </q-btn>

            <q-btn
              round
              color="primary"
              icon="call"
              size="lg"
              @click="acceptIncomingCall(false)"
            >
              <q-tooltip>Atender (Áudio)</q-tooltip>
            </q-btn>

            <q-btn
              round
              color="positive"
              icon="videocam"
              size="lg"
              @click="acceptIncomingCall(true)"
            >
              <q-tooltip>Atender (com Vídeo)</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useMeetUsStore } from 'src/stores/meetus'
import { useAuthStore } from 'src/stores/auth'
import { useCallStore } from 'src/stores/call'
import { useChatStore } from 'src/stores/chat'
import { socket } from 'src/boot/socket'
import GlobalSearchDialog from 'src/components/common/GlobalSearchDialog.vue'

const router = useRouter()
const $q = useQuasar()
const store = useMeetUsStore()
const auth = useAuthStore()
const callStore = useCallStore()
const chatStore = useChatStore()

const showIncomingCallDialog = ref(false)

function onNavClick() {
  if ($q.screen.lt.md) {
    leftDrawerOpen.value = false
  }
}

const currentAvatar = computed(() => {
  if (activeUser.value?.avatar && activeUser.value.avatar.trim()) {
    return activeUser.value.avatar
  }
  const name = activeUser.value?.name || 'Estudante'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=059669&color=ffffff&size=256&bold=true`
})

const incomingCallAvatar = computed(() => {
  if (callStore.incomingCall?.callerAvatar && callStore.incomingCall.callerAvatar.trim()) {
    return callStore.incomingCall.callerAvatar
  }
  const name = callStore.incomingCall?.callerName || 'Colega MEET-US'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=059669&color=ffffff&size=256&bold=true`
})

function handleIncomingCall(data) {
  // Ignorar chamadas feitas pelo próprio utilizador
  if (data.callerId && String(data.callerId) === String(auth.userId)) return
  callStore.setIncomingCall(data)
  showIncomingCallDialog.value = true
}

function acceptIncomingCall(withVideo = true) {
  const call = callStore.incomingCall
  showIncomingCallDialog.value = false
  if (!call) return
  router.push({
    name: 'calls',
    query: {
      partnerId: String(call.callerId),
      partner: call.callerName || 'Colega',
      incoming: '1',
      video: withVideo ? '1' : '0'
    }
  })
}

function rejectIncomingCall() {
  const call = callStore.incomingCall
  if (call?.callerId) {
    socket.emit('call:reject', { callerId: call.callerId, targetId: auth.userId })
  }
  callStore.clearIncomingCall()
  showIncomingCallDialog.value = false
}

const activeUser = computed(() => {
  return auth.user?.name ? auth.user : store.currentUser
})

const leftDrawerOpen = ref(true)
const showSearchDialog = ref(false)

// Os 8 itens exatos da Tela 2 (2.webp)
const navLinks = computed(() => [
  { to: 'dashboard', label: 'Visão geral', icon: 'home' },
  { to: 'students', label: 'Descobrir', icon: 'search' },
  { to: 'skills', label: 'As minhas competências', icon: 'star_border' },
  { to: 'exchanges', label: 'Trocas', icon: 'swap_horiz' },
  { to: 'chat', label: 'Mensagens', icon: 'chat_bubble_outline' },
  { to: 'calendar', label: 'Calendário', icon: 'calendar_today' },
  { to: 'community', label: 'Comunidade', icon: 'groups' },
  { to: 'leaderboard', label: 'Classificação', icon: 'bar_chart' }
])

function logout() {
  auth.logout()
  router.push({ name: 'login' })
}

function handleMessageButtonClick() {
  const senderId = chatStore.latestUnreadSenderId
  if (senderId) {
    router.push({ name: 'chat-user', params: { userId: senderId } })
  } else {
    router.push({ name: 'chat' })
  }
}

function openChatWith(userId) {
  if (userId) {
    router.push({ name: 'chat-user', params: { userId: String(userId) } })
  } else {
    router.push({ name: 'chat' })
  }
}

function getNavTarget(item) {
  if (item.to === 'chat' && chatStore.latestUnreadSenderId) {
    return { name: 'chat-user', params: { userId: chatStore.latestUnreadSenderId } }
  }
  return { name: item.to }
}

// Ctrl+K / Cmd+K
function handleKeyDown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    showSearchDialog.value = true
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)

  if (auth.userId) {
    socket.emit('user:join', auth.userId)
  }

  chatStore.bindSocket?.()
  chatStore.loadConversations?.()

  socket.on('call:incoming', handleIncomingCall)
  socket.on('call:offer', handleIncomingCall)
  socket.on('call:ice-candidate', (data) => {
    if (data?.candidate) {
      callStore.addPendingCandidate(data.candidate)
    }
  })
  socket.on('call:ended', () => {
    showIncomingCallDialog.value = false
    callStore.clearIncomingCall()
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  socket.off('call:incoming', handleIncomingCall)
  socket.off('call:offer', handleIncomingCall)
  socket.off('call:ice-candidate')
})
</script>

<style scoped>
.global-search-bar :deep(.q-field__control) {
  border-radius: 28px;
  border: 1px solid #E2E8F0;
  background: #FFFFFF;
  height: 42px;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
}

.global-search-bar :deep(.q-field__control):hover {
  border-color: #10B981;
}

.sidebar-nav-item {
  border-radius: 10px;
  margin: 3px 6px;
  padding: 8px 14px;
  color: #475569;
  font-size: 0.88rem;
  transition: all 0.15s ease;
}

.sidebar-nav-item:hover {
  background: #F1F5F9;
  color: #0F172A;
}

.sidebar-nav-item .nav-avatar {
  min-width: 32px;
  padding-right: 8px;
}

.sidebar-nav-active {
  background: #ECFDF5 !important;
  color: #059669 !important;
  font-weight: 600;
}

.sidebar-nav-active .q-icon {
  color: #059669 !important;
}
</style>
