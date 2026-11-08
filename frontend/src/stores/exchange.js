// frontend/src/stores/exchange.js
import { defineStore } from 'pinia'
import { exchangeService } from 'src/services/exchange.service'
import { useAuthStore } from './auth'

export const useExchangeStore = defineStore('exchange', {
  state: () => ({
    items: [],
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
    filters: {
      role: 'all',    // all | requester | provider
      status: 'all',
      q: ''
    },
    stats: { pending: 0, accepted: 0, running: 0, completed: 0, rejected: 0, cancelled: 0, total: 0 },
    viewed: null,
    loading: false
  }),

  getters: {
    pendingCount: (s) => s.stats.pending,
    activeCount: (s) => s.stats.accepted + s.stats.running
  },

  actions: {
    async load(overrides = {}) {
      this.loading = true
      try {
        Object.assign(this.filters, overrides)
        const auth = useAuthStore()
        const { data } = await exchangeService.list(auth.userId, {
          ...this.filters,
          page: this.page,
          limit: this.limit
        })
        this.items = data.items
        this.total = data.total
        this.pages = data.pages
      } finally {
        this.loading = false
      }
    },

    async loadStats() {
      const auth = useAuthStore()
      const { data } = await exchangeService.stats(auth.userId)
      this.stats = data
    },

    async loadOne(id) {
      this.loading = true
      try {
        const { data } = await exchangeService.getById(id)
        this.viewed = data
        return data
      } finally {
        this.loading = false
      }
    },

    async create(payload) {
      const auth = useAuthStore()
      const { data } = await exchangeService.create({ requesterId: auth.userId, ...payload })
      this.items.unshift(data)
      await this.loadStats()
      return data
    },

    async updateStatus(id, status) {
      const auth = useAuthStore()
      const { data } = await exchangeService.updateStatus(id, status, auth.userId)
      const idx = this.items.findIndex((x) => x.id === id)
      if (idx !== -1) this.items[idx] = data
      if (this.viewed?.id === id) this.viewed = data
      await this.loadStats()
      return data
    },

    resetFilters() {
      this.filters = { role: 'all', status: 'all', q: '' }
      this.page = 1
    }
  }
})
