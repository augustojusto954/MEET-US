// frontend/src/stores/chat.js
import { defineStore } from 'pinia'
import { chatService } from 'src/services/chat.service'
import { useAuthStore } from './auth'
import { socket } from 'src/boot/socket'

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: [],
    activeConversation: null,
    messages: [],
    loading: false
  }),

  actions: {
    async loadConversations() {
      const auth = useAuthStore()
      const { data } = await chatService.listConversations(auth.userId)
      this.conversations = data
    },

    async openConversation(otherId) {
      const auth = useAuthStore()
      const { data: conv } = await chatService.getOrCreate(auth.userId, otherId)
      this.activeConversation = conv
      socket.emit('conversation:join', conv.id)
      const { data: msgs } = await chatService.listMessages(conv.id)
      this.messages = msgs
      await chatService.markRead(conv.id, auth.userId)
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
      socket.emit('chat:send', {
        ...data,
        receiverId: this.activeConversation.other?.id
      })
    },

    _onIncoming(msg) {
      if (this.activeConversation && String(msg.conversation_id) === String(this.activeConversation.id)) {
        this.messages.push(msg)
      }
      this.loadConversations()
    },

    bindSocket() {
      const auth = useAuthStore()
      if (auth.userId) {
        socket.emit('user:join', auth.userId)
      }
      socket.on('chat:new', (msg) => this._onIncoming(msg))
    }
  }
})
