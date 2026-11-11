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
          <img src="/icons/meet-us-logo.png" style="height: 36px; max-width: 140px; object-fit: contain;" alt="MEET-US" />
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

    <!-- Banner Modo Offline (Exibido quando a internet cai) -->
    <div
      v-if="!estaOnline"
      class="bg-amber-9 text-white q-py-xs q-px-md text-caption text-center row items-center justify-center q-gutter-x-sm shadow-1"
      style="position: sticky; top: 64px; z-index: 1500;"
    >
      <q-icon name="wifi_off" size="16px" />
      <span class="text-weight-medium">Modo Offline: Sem ligação à internet. A usar conteúdos guardados localmente.</span>
    </div>

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
        <!-- Brand Header com Logótipo Oficial -->
        <div class="q-pa-md q-pb-xs">
          <div class="row items-center cursor-pointer" @click="$router.push('/dashboard')">
            <img src="/icons/meet-us-logo.png" style="height: 48px; max-width: 100%; object-fit: contain;" alt="MEET-US" />
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
            <!-- Sinal Vermelho na Sidebar para Aulas Ao Vivo -->
            <q-item-section side v-if="item.to === 'calendar' && sessionsStore.activeLiveSession">
              <q-badge color="negative" rounded class="text-weight-bold shadow-1 pulse-live-tag">
                ● AO VIVO
              </q-badge>
            </q-item-section>
          </q-item>
        </div>

        <!-- Botão Instalar Aplicação (PWA / Desktop) -->
        <div v-if="podeInstalar" class="q-px-sm q-mt-md">
          <q-btn
            unelevated
            no-caps
            class="full-width rounded-borders text-weight-bold"
            style="background: #E8F5E9; color: #059669; border: 1px dashed #059669;"
            icon="get_app"
            label="Instalar MEET-US"
            @click="instalarAplicacao"
          >
            <q-tooltip>Instalar no seu dispositivo</q-tooltip>
          </q-btn>
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
      <!-- SINAL GLOBAL DE TRANSMISSÃO AO VIVO (Visível em qualquer página e dispositivo) -->
      <transition name="fade">
        <div
          v-if="sessionsStore.activeLiveSession && dismissedLiveId !== (sessionsStore.activeLiveSession.id || sessionsStore.activeLiveSession._id)"
          class="global-live-signal-bar row items-center justify-between q-px-md q-py-xs shadow-3"
        >
          <div
            class="row items-center q-gutter-sm col ellipsis cursor-pointer"
            @click="enterLiveRoom(sessionsStore.activeLiveSession.id || sessionsStore.activeLiveSession._id)"
          >
            <q-badge color="negative" class="pulse-live-badge text-weight-bold">
              <span class="blink-dot q-mr-xs">●</span> AO VIVO
            </q-badge>
            <span class="text-caption text-weight-bold text-white ellipsis">
              <b>{{ sessionsStore.activeLiveSession.host_name }}</b> iniciou «{{ sessionsStore.activeLiveSession.title }}»!
            </span>
          </div>

          <div class="row items-center q-gutter-xs no-wrap q-ml-sm">
            <q-btn
              unelevated
              rounded
              dense
              color="white"
              text-color="negative"
              icon="sensors"
              label="Entrar na Aula"
              size="sm"
              class="text-weight-bolder q-px-sm shadow-1"
              @click="enterLiveRoom(sessionsStore.activeLiveSession.id || sessionsStore.activeLiveSession._id)"
            />
            <q-btn
              flat
              round
              dense
              icon="close"
              color="white"
              size="xs"
              @click="dismissedLiveId = (sessionsStore.activeLiveSession.id || sessionsStore.activeLiveSession._id)"
            />
          </div>
        </div>
      </transition>

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
import { useSessionsStore } from 'src/stores/sessions'
import { socket } from 'src/boot/socket'
import GlobalSearchDialog from 'src/components/common/GlobalSearchDialog.vue'

const router = useRouter()
const $q = useQuasar()
const store = useMeetUsStore()
const auth = useAuthStore()
const callStore = useCallStore()
const chatStore = useChatStore()
const sessionsStore = useSessionsStore()

const dismissedLiveId = ref(null)

function enterLiveRoom(sId) {
  if (sId) {
    router.push({ name: 'live-room', params: { id: sId } })
  }
}

const showIncomingCallDialog = ref(false)

// Monitorização Online / Offline e Instalação PWA
const estaOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true)
let deferredPrompt = null
const podeInstalar = ref(false)

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    estaOnline.value = true
    $q.notify({
      message: 'Ligação à internet restabelecida!',
      color: 'positive',
      icon: 'wifi',
      timeout: 2500,
      position: 'top'
    })
  })
  window.addEventListener('offline', () => {
    estaOnline.value = false
    $q.notify({
      message: 'Sem internet. A trabalhar em modo offline.',
      color: 'warning',
      icon: 'wifi_off',
      timeout: 3500,
      position: 'top'
    })
  })

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    podeInstalar.value = true
  })

  window.addEventListener('appinstalled', () => {
    podeInstalar.value = false
    deferredPrompt = null
    $q.notify({
      message: 'MEET-US instalado com sucesso no seu dispositivo!',
      color: 'positive',
      icon: 'check_circle',
      position: 'top'
    })
  })
}

async function instalarAplicacao() {
  if (!deferredPrompt) return
  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  if (outcome === 'accepted') {
    podeInstalar.value = false
  }
  deferredPrompt = null
}

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
  { to: 'calendar', label: 'Aulas & Agenda', icon: 'live_tv' },
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

let updateInterval = null

function checkForPwaUpdates() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && navigator.onLine) {
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg) {
        reg.update().catch(err => console.warn('[MEET-US] Erro ao verificar atualização:', err))
      }
    }).catch(() => {})
  }
}

function handleOnline() {
  $q.notify({
    message: 'Ligação à internet restabelecida!',
    caption: 'A sincronizar dados e verificar atualizações do MEET-US...',
    icon: 'cloud_done',
    color: 'positive',
    position: 'top-right',
    timeout: 3500
  })

  if (!socket.connected) {
    socket.connect()
  }

  // Verifica imediatamente se há nova versão da aplicação
  checkForPwaUpdates()

  // Recarrega conversas e dados
  chatStore.loadConversations?.()
  if (auth.userId) {
    store.fetchInitialData?.()
  }
}

function handleOffline() {
  $q.notify({
    message: 'Modo Offline Ativado',
    caption: 'Sem internet no momento. O MEET-US continua a funcionar com os teus dados guardados em cache.',
    icon: 'wifi_off',
    color: 'dark',
    position: 'bottom-right',
    timeout: 4500
  })
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)

  if (auth.userId) {
    socket.emit('user:join', auth.userId)
  }

  chatStore.bindSocket?.()
  chatStore.loadConversations?.()

  // Verificação inicial e periódica de atualizações quando online (a cada 10 minutos)
  checkForPwaUpdates()
  updateInterval = setInterval(checkForPwaUpdates, 10 * 60 * 1000)

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
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
  if (updateInterval) clearInterval(updateInterval)
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

.global-live-signal-bar {
  background: linear-gradient(90deg, #DC2626 0%, #B91C1C 100%);
  color: #FFFFFF;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.pulse-live-badge {
  border-radius: 12px;
  animation: pulseGlowRed 1.8s infinite;
}

.pulse-live-tag {
  animation: pulseGlowRed 2s infinite;
}

@keyframes pulseGlowRed {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

.blink-dot {
  animation: blinkAnim 1s infinite alternate;
}

@keyframes blinkAnim {
  0% { opacity: 1; }
  100% { opacity: 0.2; }
}
</style>
