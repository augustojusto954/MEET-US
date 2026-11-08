// frontend/src/stores/notifications.js
import { defineStore } from 'pinia'
import { notificationsService } from 'src/services/notifications.service'
import { useAuthStore } from './auth'
import { socket } from 'src/boot/socket'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    items: [],
    total: 0,
    unreadCount: 0,
    page: 1,
    limit: 10,
    pages: 1,
    filters: {
      type: 'all',
      onlyUnread: false
    },
    loading: false
  }),

  actions: {
    async load(overrides = {}) {
      const auth = useAuthStore()
      if (!auth.userId) return
      this.loading = true
      try {
        Object.assign(this.filters, overrides)
        const { data } = await notificationsService.list(auth.userId, {
          ...this.filters,
          page: this.page,
          limit: this.limit
        })
        this.items = data.items
        this.total = data.total
        this.pages = data.pages
        this.unreadCount = data.unreadCount
      } finally {
        this.loading = false
      }
    },

    async fetchUnreadCount() {
      const auth = useAuthStore()
      if (!auth.userId) return
      const { data } = await notificationsService.unreadCount(auth.userId)
      this.unreadCount = data.count
    },

    async markRead(id) {
      await notificationsService.markRead(id)
      const n = this.items.find((x) => x.id === id)
      if (n && !n.read) {
        n.read = 1
        if (this.unreadCount > 0) this.unreadCount--
      }
    },

    async markAllRead() {
      const auth = useAuthStore()
      if (!auth.userId) return
      await notificationsService.markAllRead(auth.userId)
      this.items.forEach((n) => (n.read = 1))
      this.unreadCount = 0
    },

    async remove(id) {
      await notificationsService.remove(id)
      this.items = this.items.filter((x) => x.id !== id)
      this.total = Math.max(0, this.total - 1)
    },

    async clearAll() {
      const auth = useAuthStore()
      if (!auth.userId) return
      await notificationsService.clearAll(auth.userId)
      this.items = []
      this.total = 0
      this.unreadCount = 0
    },

    bindSocket() {
      // Listener para notificações em tempo real
      socket.on('notification:new', (notif) => {
        this.items.unshift(notif)
        this.unreadCount++
      })
    }
  }
})
