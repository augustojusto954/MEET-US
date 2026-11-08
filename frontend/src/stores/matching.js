// frontend/src/stores/matching.js
import { defineStore } from 'pinia'
import { matchingService } from 'src/services/matching.service'
import { useAuthStore } from './auth'

export const useMatchingStore = defineStore('matching', {
  state: () => ({
    candidates: [],
    matches: [],
    loading: false,
    lastMatch: null
  }),

  getters: {
    topCandidate: (s) => s.candidates[0] || null
  },

  actions: {
    async loadCandidates(limit = 20) {
      this.loading = true
      try {
        const auth = useAuthStore()
        const { data } = await matchingService.getCandidates(auth.userId, { limit })
        this.candidates = data
      } finally { this.loading = false }
    },

    async swipe(targetId, action) {
      const auth = useAuthStore()
      const { data } = await matchingService.swipe(auth.userId, targetId, action)
      this.candidates = this.candidates.filter((c) => c.id !== targetId && c._id !== targetId)
      if (data.matched) this.lastMatch = targetId
      return data
    },

    async loadMatches() {
      const auth = useAuthStore()
      const { data } = await matchingService.listMatches(auth.userId)
      this.matches = data
    }
  }
})
