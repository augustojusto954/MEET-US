<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Mensagens & Conversas</div>
        <div class="text-caption text-grey-7">Conversas em direto com os teus parceiros de mentoria.</div>
      </div>
    </div>

    <q-card flat class="chat-main-card row no-wrap" style="border-radius: 20px; overflow: hidden;">
      <!-- Coluna da Esquerda: Lista de Conversas -->
      <div
        v-show="$q.screen.gt.sm || !selectedConversation"
        class="col-12 col-md-4 border-right column bg-white"
        style="border-right: 1px solid #E2E8F0;"
      >
        <div class="q-pa-md border-bottom" style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0;">
          <q-input
            v-model="searchConv"
            placeholder="Pesquisar conversas..."
            dense
            outlined
            clearable
            bg-color="white"
          >
            <template #prepend>
              <q-icon name="search" color="grey-6" />
            </template>
          </q-input>
        </div>

        <q-scroll-area class="col">
          <div v-if="loadingConversations" class="q-pa-lg text-center">
            <q-spinner-dots color="primary" size="32px" />
            <div class="text-caption text-grey-6 q-mt-xs">A carregar conversas reais...</div>
          </div>

          <!-- Lista de Conversas Existentes -->
          <q-list v-else-if="filteredConversations.length" separator>
            <q-item
              v-for="c in filteredConversations"
              :key="c.id"
              clickable
              v-ripple
              :active="selectedConversation?.id === c.id"
              active-class="bg-emerald-50"
              class="q-py-md"
              @click="selectConversation(c)"
            >
              <q-item-section avatar>
                <q-avatar size="48px" class="relative-position">
                  <img :src="c.avatar" />
                  <q-badge
                    v-if="c.online"
                    color="positive"
                    floating
                    rounded
                    style="top: 2px; right: 2px;"
                  />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <div class="row items-center justify-between">
                  <span class="text-subtitle2 text-weight-bold text-dark ellipsis">{{ c.name }}</span>
                  <span class="text-caption text-grey-6" style="font-size: 11px;">{{ c.lastMessageAt }}</span>
                </div>
                <div class="text-caption text-grey-7 ellipsis q-mt-xs">
                  {{ c.lastMessage }}
                </div>
              </q-item-section>

              <q-item-section side v-if="c.unreadCount">
                <q-badge color="primary" rounded>{{ c.unreadCount }}</q-badge>
              </q-item-section>
            </q-item>
          </q-list>

          <!-- Se ainda não tem conversas: Sugerir colegas reais para iniciar conversa -->
          <div v-else class="q-pa-md text-center">
            <q-icon name="forum" size="40px" color="grey-4" class="q-mb-sm" />
            <div class="text-subtitle2 text-weight-bold text-dark">Ainda não tens conversas ativas</div>
            <div class="text-caption text-grey-6 q-mb-md">Escolhe um colega abaixo para iniciar a tua primeira conversa real:</div>

            <q-list dense separator class="text-left bg-grey-1 rounded-borders q-pa-xs">
              <q-item
                v-for="st in suggestedStudents.slice(0, 5)"
                :key="st.id"
                clickable
                v-ripple
                class="rounded-borders"
                @click="startChatWith(st.id)"
              >
                <q-item-section avatar>
                  <q-avatar size="32px">
                    <img :src="st.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(st.name)}&background=059669&color=fff&size=256`" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold text-caption ellipsis">{{ st.name }}</q-item-label>
                  <q-item-label caption class="ellipsis" style="font-size: 10px;">{{ st.course || st.institution }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn round flat dense icon="chat" color="primary" size="sm" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-scroll-area>
      </div>

      <!-- Coluna Central: Janela da Conversa Ativa -->
      <div
        v-if="selectedConversation"
        v-show="$q.screen.gt.sm || selectedConversation"
        class="col-12 col-md-8 col column bg-app"
      >
        <!-- Topo da Conversa com Controles -->
        <div class="row items-center justify-between q-pa-sm q-pa-md-md bg-white border-bottom" style="border-bottom: 1px solid #E2E8F0;">
          <div class="row items-center">
            <!-- Botão Voltar para Mobile -->
            <q-btn
              flat
              round
              dense
              icon="arrow_back"
              color="grey-8"
              class="lt-md q-mr-xs"
              @click="selectedConversation = null"
            />
            <q-avatar size="40px" class="q-mr-sm">
              <img :src="selectedConversation.avatar" />
            </q-avatar>
            <div>
              <div class="text-subtitle2 text-weight-bold text-dark">{{ selectedConversation.name }}</div>
              <div class="text-caption row items-center">
                <q-badge :color="selectedConversation.online ? 'positive' : 'grey-5'" rounded class="q-mr-xs" />
                <span :class="selectedConversation.online ? 'text-positive' : 'text-grey-6'">
                  {{ selectedConversation.online ? 'Online agora' : 'Offline' }}
                </span>
              </div>
            </div>
          </div>

          <div class="row items-center q-gutter-xs">
            <!-- Botão Iniciar Chamada Real passando o partnerId -->
            <q-btn
              unelevated
              rounded
              dense
              color="positive"
              icon="videocam"
              label="Ligar"
              class="q-px-sm text-weight-bold"
              no-caps
              :to="{ name: 'calls', query: { partnerId: partnerUserId, partner: selectedConversation.name, autostart: '1' } }"
            >
              <q-tooltip>Iniciar Chamada de Vídeo/Áudio com {{ selectedConversation.name }}</q-tooltip>
            </q-btn>

            <!-- Toggle Painel Lateral de Informações -->
            <q-btn
              flat
              round
              dense
              color="grey-7"
              icon="info"
              class="gt-sm"
              @click="showInfoDrawer = !showInfoDrawer"
            >
              <q-tooltip>Detalhes do Contacto</q-tooltip>
            </q-btn>
          </div>
        </div>

        <!-- Mensagens em Scroll -->
        <q-scroll-area ref="messagesScrollRef" class="col q-pa-sm q-pa-md-md">
          <div v-if="loadingMessages" class="q-pa-lg text-center">
            <q-spinner-dots color="primary" size="28px" />
          </div>

          <div v-else-if="currentMessages.length === 0" class="q-pa-xl text-center text-grey-6">
            <q-icon name="waving_hand" size="36px" color="amber-7" class="q-mb-xs" />
            <div class="text-subtitle2 text-weight-bold">Diz olá a {{ selectedConversation.name }}!</div>
            <div class="text-caption">Esta é uma conversa privada em direto entre vós.</div>
          </div>

          <div v-else class="column q-gutter-sm">
            <div
              v-for="msg in currentMessages"
              :key="msg.id"
              class="row"
              :class="msg.sender === 'me' ? 'justify-end' : 'justify-start'"
            >
              <div
                class="q-pa-sm q-pa-md-md shadow-1 chat-bubble"
                :class="msg.sender === 'me' ? 'bg-primary text-white' : 'bg-white text-dark'"
                style="border-radius: 14px; border: 1px solid #E2E8F0;"
              >
                <div class="text-body2" style="word-break: break-word;">{{ msg.text }}</div>
                <div
                  class="text-caption text-right q-mt-xs"
                  :class="msg.sender === 'me' ? 'text-emerald-100' : 'text-grey-6'"
                  style="font-size: 10px;"
                >
                  {{ msg.time }}
                </div>
              </div>
            </div>
          </div>
        </q-scroll-area>

        <!-- Input de Envio de Mensagem -->
        <div class="q-pa-sm q-pa-md-md bg-white" style="border-top: 1px solid #E2E8F0;">
          <div class="row items-center q-gutter-xs q-gutter-sm-sm">
            <q-input
              v-model="inputMessage"
              placeholder="Escreve a tua mensagem em tempo real..."
              dense
              outlined
              class="col"
              @keyup.enter="handleSend"
            />
            <q-btn
              round
              unelevated
              color="primary"
              icon="send"
              :disable="!inputMessage.trim()"
              @click="handleSend"
            />
          </div>
        </div>
      </div>

      <!-- Estado Vazio para Desktop se nenhuma conversa estiver aberta -->
      <div
        v-if="!selectedConversation && $q.screen.gt.sm"
        class="col column items-center justify-center bg-white text-center q-pa-lg text-grey-6"
      >
        <q-icon name="chat" size="56px" color="grey-4" class="q-mb-md" />
        <div class="text-h6 text-weight-bold">Nenhuma conversa selecionada</div>
        <div class="text-body2">Escolhe um estudante na lista para iniciar a troca de mensagens.</div>
      </div>

      <!-- Coluna da Direita: Drawer de Informações do Contacto -->
      <div
        v-if="showInfoDrawer && selectedConversation && $q.screen.gt.sm"
        class="col-12 col-md-3 border-left bg-white q-pa-md"
        style="border-left: 1px solid #E2E8F0;"
      >
        <div class="text-center q-mb-md">
          <q-avatar size="72px" class="shadow-2 q-mb-sm">
            <img :src="selectedConversation.avatar" />
          </q-avatar>
          <div class="text-h6 text-weight-bolder text-dark">{{ selectedConversation.name }}</div>
          <div class="text-caption text-grey-7">{{ selectedConversation.other?.course || 'Estudante' }}</div>
          <div class="text-caption text-grey-6">{{ selectedConversation.other?.institution || 'Moçambique' }}</div>
        </div>

        <q-separator class="q-my-md" />

        <div class="column q-gutter-sm">
          <q-btn
            unelevated
            color="positive"
            icon="videocam"
            label="Fazer Chamada"
            no-caps
            class="full-width text-weight-bold"
            :to="{ name: 'calls', query: { partnerId: partnerUserId, partner: selectedConversation.name, autostart: '1' } }"
          />

          <q-btn
            outline
            color="primary"
            label="Ver Perfil Completo"
            no-caps
            class="full-width text-weight-bold"
            :to="{ name: 'profile', query: { id: partnerUserId } }"
          />
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { socket } from 'src/boot/socket'
import { useAuthStore } from 'src/stores/auth'
import { useMeetUsStore } from 'src/stores/meetus'
import { useChatStore } from 'src/stores/chat'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const auth = useAuthStore()
const store = useMeetUsStore()
const chatStore = useChatStore()

const searchConv = ref('')
const inputMessage = ref('')
const showInfoDrawer = ref(false)
const loadingConversations = ref(false)
const loadingMessages = ref(false)
const messagesScrollRef = ref(null)

const conversations = ref([])
const selectedConversation = ref(null)
const currentMessages = ref([])
const suggestedStudents = ref([])

const partnerUserId = computed(() => {
  if (!selectedConversation.value) return ''
  const other = selectedConversation.value.other
  if (other) return String(other.id || other._id)
  return String(selectedConversation.value.participantId || '')
})

const filteredConversations = computed(() => {
  if (!searchConv.value.trim()) return conversations.value
  const q = searchConv.value.toLowerCase()
  return conversations.value.filter(c => c.name.toLowerCase().includes(q))
})

function formatTime(isoOrDate) {
  if (!isoOrDate) return ''
  try {
    const d = new Date(isoOrDate)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch (e) {
    return ''
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesScrollRef.value) {
      messagesScrollRef.value.setScrollPercentage('vertical', 1.0)
    }
  })
}

async function loadConversations(autoSelect = true) {
  if (!auth.userId) return
  loadingConversations.value = true
  try {
    const res = await api.get('/chat/conversations', { params: { userId: auth.userId } })
    const rawList = Array.isArray(res.data) ? res.data : []

    conversations.value = rawList.map(c => {
      const other = c.other || {}
      const name = other.name || 'Colega MEET-US'
      const avatar = other.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=059669&color=fff&size=256`
      return {
        id: String(c.id || c._id),
        other,
        name,
        avatar,
        online: Boolean(other.online),
        lastMessage: c.last_message || 'Inicia uma conversa...',
        lastMessageAt: formatTime(c.last_message_at),
        unreadCount: c.unread || 0
      }
    })

    if (autoSelect && !selectedConversation.value && conversations.value.length > 0 && $q.screen.gt.sm) {
      selectConversation(conversations.value[0])
    }
  } catch (err) {
    console.error('Erro ao carregar conversas do backend:', err)
  } finally {
    loadingConversations.value = false
  }
}

async function selectConversation(conv) {
  selectedConversation.value = conv
  currentMessages.value = []
  loadingMessages.value = true

  if (socket) {
    socket.emit('conversation:join', conv.id)
  }

  try {
    const res = await api.get(`/chat/conversations/${conv.id}/messages`)
    const rawMsgs = Array.isArray(res.data) ? res.data : []

    currentMessages.value = rawMsgs.map(m => ({
      id: String(m._id || m.id),
      sender: String(m.sender_id) === String(auth.userId) ? 'me' : 'other',
      text: m.content || '',
      time: formatTime(m.createdAt)
    }))

    // Marcar como lido e atualizar o badge vermelho de mensagens
    api.put(`/chat/conversations/${conv.id}/read`).then(() => {
      chatStore.loadConversations()
    }).catch(() => {})
    conv.unreadCount = 0

    scrollToBottom()
  } catch (err) {
    console.error('Erro ao carregar mensagens:', err)
  } finally {
    loadingMessages.value = false
  }
}

async function startChatWith(otherUserId) {
  if (!otherUserId || String(otherUserId) === String(auth.userId)) return
  try {
    const res = await api.post('/chat/conversations', {
      userId: auth.userId,
      otherId: String(otherUserId)
    })
    const convData = res.data

    await loadConversations(false)

    const existing = conversations.value.find(c => String(c.id) === String(convData.id || convData._id))
    if (existing) {
      selectConversation(existing)
    } else {
      let other = convData.other || store.students.find(s => String(s.id) === String(otherUserId))
      if (!other || !other.name) {
        try {
          const uRes = await api.get(`/users/${otherUserId}`)
          if (uRes.data) other = uRes.data
        } catch (_) {}
      }
      other = other || {}
      const newConv = {
        id: String(convData.id || convData._id),
        other,
        name: other.name || 'Colega',
        avatar: other.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(other.name || 'C')}&background=059669&color=fff&size=256`,
        online: Boolean(other.online),
        lastMessage: '',
        lastMessageAt: '',
        unreadCount: 0
      }
      conversations.value.unshift(newConv)
      selectConversation(newConv)
    }
  } catch (err) {
    console.error('Erro ao iniciar conversa com utilizador:', err)
    $q.notify({ type: 'negative', message: 'Não foi possível abrir conversa com este estudante.' })
  }
}

async function handleSend() {
  if (!inputMessage.value.trim() || !selectedConversation.value) return
  const text = inputMessage.value.trim()
  inputMessage.value = ''

  const convId = selectedConversation.value.id
  const receiverId = partnerUserId.value

  const optimisticMsg = {
    id: `opt-${Date.now()}`,
    sender: 'me',
    text,
    time: formatTime(new Date())
  }
  currentMessages.value.push(optimisticMsg)
  scrollToBottom()

  selectedConversation.value.lastMessage = text
  selectedConversation.value.lastMessageAt = optimisticMsg.time

  try {
    const res = await api.post('/chat/messages', {
      conversationId: convId,
      content: text
    })

    const createdMsg = res.data
    if (socket) {
      socket.emit('chat:send', {
        _id: createdMsg?._id || createdMsg?.id,
        conversationId: convId,
        senderId: auth.userId,
        receiverId,
        content: text,
        createdAt: createdMsg?.createdAt || new Date().toISOString()
      })
    }
  } catch (err) {
    console.error('Erro ao enviar mensagem:', err)
    $q.notify({ type: 'negative', message: 'Falha ao enviar mensagem.' })
  }
}

function handleIncomingMessage(msg) {
  if (!msg) return
  const convId = String(msg.conversation_id)

  if (selectedConversation.value && String(selectedConversation.value.id) === convId) {
    if (String(msg.sender_id) !== String(auth.userId)) {
      currentMessages.value.push({
        id: String(msg._id || msg.id),
        sender: 'other',
        text: msg.content || '',
        time: formatTime(msg.createdAt || Date.now())
      })
      scrollToBottom()
      api.put(`/chat/conversations/${convId}/read`).then(() => {
        chatStore.loadConversations()
      }).catch(() => {})
    }
  }

  // Atualizar a conversa na lista
  const targetConv = conversations.value.find(c => String(c.id) === convId)
  if (targetConv) {
    targetConv.lastMessage = msg.content || ''
    targetConv.lastMessageAt = formatTime(msg.createdAt || Date.now())
    if (!selectedConversation.value || String(selectedConversation.value.id) !== convId) {
      targetConv.unreadCount = (targetConv.unreadCount || 0) + 1
    }
  } else {
    loadConversations(false)
  }
}

onMounted(async () => {
  if (socket) {
    socket.on('chat:new', handleIncomingMessage)
    if (auth.userId) socket.emit('user:join', auth.userId)
  }

  // Carregar lista de colegas sugeridos para criar conversas imediatas
  suggestedStudents.value = store.students.filter(s => String(s.id) !== String(auth.userId))

  await loadConversations(false)

  // Se veio com parâmetro de rota :userId (/chat/:userId)
  const targetUserIdFromRoute = route.params.userId || route.query.userId
  if (targetUserIdFromRoute) {
    await startChatWith(targetUserIdFromRoute)
  } else if (conversations.value.length > 0 && $q.screen.gt.sm) {
    selectConversation(conversations.value[0])
  }
})

// Observar mudança de rota caso navegue entre diferentes utilizadores
watch(() => route.params.userId, (newUserId) => {
  if (newUserId) {
    startChatWith(newUserId)
  }
})

onUnmounted(() => {
  if (socket) {
    socket.off('chat:new', handleIncomingMessage)
  }
})
</script>

<style scoped>
.chat-main-card {
  height: calc(100vh - 180px);
  min-height: 480px;
}
.chat-bubble {
  max-width: 65%;
}
@media (max-width: 768px) {
  .chat-main-card {
    height: calc(100vh - 130px);
    min-height: 420px;
  }
  .chat-bubble {
    max-width: 85%;
  }
}
.border-right {
  border-right: 1px solid #EAE8FF;
}
.border-bottom {
  border-bottom: 1px solid #EAE8FF;
}
.border-top {
  border-top: 1px solid #EAE8FF;
}
.border-left {
  border-left: 1px solid #EAE8FF;
}
</style>
