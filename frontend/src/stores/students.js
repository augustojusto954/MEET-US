// frontend/src/stores/students.js
import { defineStore } from 'pinia'
import { studentsService } from 'src/services/students.service'
import { useAuthStore } from './auth'

export const useStudentsStore = defineStore('students', {
  state: () => ({
    items: [],
    total: 0,
    page: 1,
    limit: 12,
    pages: 1,
    filters: {
      q: '',
      institution: '',
      course: '',
      city: '',
      skill: '',
      skillType: '',
      availability: '',
      onlyVerified: false,
      onlyOnline: false,
      sort: 'reputation'
    },
    filterOptions: {
      institutions: [],
      courses: [],
      cities: [],
      skills: []
    },
    loading: false,
    viewed: null
  }),

  actions: {
    async search(overrides = {}) {
      this.loading = true
      try {
        Object.assign(this.filters, overrides)
        const { data } = await studentsService.search({
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

    async loadMore() {
      if (this.page >= this.pages) return
      this.page++
      const { data } = await studentsService.search({
        ...this.filters,
        page: this.page,
        limit: this.limit
      })
      this.items.push(...data.items)
    },

    resetFilters() {
      this.filters = {
        q: '',
        institution: '',
        course: '',
        city: '',
        skill: '',
        skillType: '',
        availability: '',
        onlyVerified: false,
        onlyOnline: false,
        sort: 'reputation'
      }
      this.page = 1
    },

    async loadFilterOptions() {
      if (this.filterOptions.institutions.length) return
      const { data } = await studentsService.filterOptions()
      this.filterOptions = data
    },

    async loadUser(id) {
      this.loading = true
      try {
        const { data } = await studentsService.getById(id)
        this.viewed = data
        return data
      } finally {
        this.loading = false
      }
    },

    async loadSuggestions(limit = 6) {
      const auth = useAuthStore()
      const { data } = await studentsService.suggestions(auth.userId, limit)
      return data
    }
  }
})
