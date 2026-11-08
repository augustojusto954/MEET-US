// frontend/src/stores/profile.js
import { defineStore } from 'pinia'
import { profileService } from 'src/services/profile.service'
import { useAuthStore } from './auth'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    viewed: null,
    loading: false
  }),

  actions: {
    async loadUser(id) {
      this.loading = true
      try {
        const res = await profileService.getById(id)
        this.viewed = res.data
        return res.data
      } finally { this.loading = false }
    },

    async updateMe(patch) {
      const auth = useAuthStore()
      const res = await profileService.update(auth.user.id, patch)
      auth.user = res.data
      auth._persist()
      return res.data
    },

    async addSkill(payload) {
      const auth = useAuthStore()
      const res = await profileService.addSkill(auth.user.id, payload)
      if (!auth.user.skills) auth.user.skills = []
      auth.user.skills.push(res.data)
      auth._persist()
      return res.data
    },

    async removeSkill(id) {
      const auth = useAuthStore()
      await profileService.removeSkill(auth.user.id, id)
      if (auth.user.skills) {
        auth.user.skills = auth.user.skills.filter((s) => s.id !== id && s._id !== id)
      }
      auth._persist()
    },

    async addInterest(name) {
      const auth = useAuthStore()
      const res = await profileService.addInterest(auth.user.id, name)
      if (!auth.user.interests) auth.user.interests = []
      auth.user.interests.push(res.data?.name || name)
      auth._persist()
      return res.data
    },

    async removeInterest(name) {
      const auth = useAuthStore()
      await profileService.removeInterest(auth.user.id, name)
      if (auth.user.interests) {
        auth.user.interests = auth.user.interests.filter((i) => (typeof i === 'string' ? i : i.name) !== name)
      }
      auth._persist()
    }
  }
})
