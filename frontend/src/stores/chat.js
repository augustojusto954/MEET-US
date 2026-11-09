// frontend/src/stores/chat.js
import { defineStore } from 'pinia'
import { chatService } from 'src/services/chat.service'
import { useAuthStore } from './auth'
import { socket } from 'src/boot/socket'
import { Notify } from 'quasar'

function playMessageSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08) // A5
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.3)
  } catch (_) {}
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: [],
    activeConversation: null,
    messages: [],
    loading: false
  }),

  getters: {
    totalUnreadCount: (state) => {
      if (!Array.isArray(state.conversations)) return 0
      return state.conversations.reduce((sum, c) => sum + (c.unread || c.unreadCount || 0), 0)
    },
    unreadConversations: (state) => {
      if (!Array.isArray(state.conversations)) return []
      return state.conversations.filter(c => (c.unread || c.unreadCount || 0) > 0)
    },
    latestUnreadSenderId: (state) => {
      if (!Array.isArray(state.conversations)) return null
      const unread = state.conversations.find(c => (c.unread || c.unreadCount || 0) > 0)
      if (unread && unread.other) {
        return String(unread.other.id || unread.other._id)
      }
      return null
    },
    latestUnreadSenderName: (state) => {
      if (!Array.isArray(state.conversations)) return null
      const unread = state.conversations.find(c => (c.unread || c.unreadCount || 0) > 0)
      return unread?.other?.name || null
    }
  },

  actions: {
    async loadConversations() {
      const auth = useAuthStore()
      if (!auth.userId) return
      try {
        const { data } = await chatService.listConversations(auth.userId)
        this.conversations = Array.isArray(data) ? data : []
      } catch (e) {
        console.warn('Erro ao carregar conversas:', e.message)
      }
    },

    async openConversation(otherId) {
      const auth = useAuthStore()
      const { data: conv } = await chatService.getOrCreate(auth.userId, otherId)
      this.activeConversation = conv
      if (socket) socket.emit('conversation:join', conv.id)
      const { data: msgs } = await chatService.listMessages(conv.id)
      this.messages = Array.isArray(msgs) ? msgs : []
      await chatService.markRead(conv.id, auth.userId).catch(() => {})
      const found = this.conversations.find(c => String(c.id) === String(conv.id))
      if (found) found.unread = 0
      return conv
    },

    async send({ content, type = 'text', fileUrl }) {
      if (!this.activeConversation) return
      const auth = useAuthStore()
      const { data } = await chatService.sendMessage({
        conversationId: this.activeConversation.id,
        senderId: auth.userId,
        type, content, fileUrl
      })
      this.messages.push(data)
      if (socket) {
        socket.emit('chat:send', {
          ...data,
          receiverId: this.activeConversation.other?.id
        })
      }
    },

    async _onIncoming(msg) {
      const auth = useAuthStore()
      const isMine = String(msg.sender_id) === String(auth.userId)

      // Se o utilizador estiver neste momento a visualizar a conversa ativa
      if (this.activeConversation && String(msg.conversation_id) === String(this.activeConversation.id)) {
        this.messages.push(msg)
        if (!isMine) {
          chatService.markRead(this.activeConversation.id, auth.userId).catch(() => {})
        }
      } else if (!isMine) {
        // Tocar som de notificação estilo Facebook
        playMessageSound()

        // Recarregar conversas para atualizar badge vermelho
        await this.loadConversations()

        // Encontrar nome e foto do remetente
        const senderConv = this.conversations.find(c =>
          String(c.id) === String(msg.conversation_id) ||
          String(c.other?.id) === String(msg.sender_id)
        )
        const senderName = senderConv?.other?.name || 'Novo Colega'
        const senderId = String(msg.sender_id)

        // Notificação flutuante vermelha estilo Facebook no topo
        Notify.create({
          message: `${senderName}: ${msg.content || 'Enviou uma nova mensagem'}`,
          caption: 'Clica para abrir a conversa diretamente',
          color: 'negative',
          icon: 'chat',
          position: 'top-right',
          timeout: 7000,
          classes: 'cursor-pointer shadow-4 text-weight-bold',
          actions: [
            {
              label: 'Abrir Conversa',
              color: 'white',
              noCaps: true,
              handler: () => {
                if (window.__MEETUS_ROUTER__) {
                  window.__MEETUS_ROUTER__.push({ name: 'chat-user', params: { userId: senderId } })
                }
              }
            }
          ]
        })
        return
      }

      this.loadConversations()
    },

    bindSocket() {
      const auth = useAuthStore()
      if (auth.userId && socket) {
        socket.emit('user:join', auth.userId)
      }
      if (socket) {
        socket.off('chat:new')
        socket.on('chat:new', (msg) => this._onIncoming(msg))
      }
    }
  }
})
