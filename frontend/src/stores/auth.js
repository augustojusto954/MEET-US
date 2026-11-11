// frontend/src/stores/auth.js
import { defineStore } from 'pinia'
import { fakeAuth } from 'src/services/fake-api'
import { api } from 'src/boot/axios'
import { socket } from 'src/boot/socket'
import { saveDatabase } from 'src/db'
import { useMeetUsStore } from 'src/stores/meetus'
import { useChatStore } from 'src/stores/chat'

const USE_FAKE = (import.meta.env.VITE_USE_FAKE_API || import.meta.env.USE_FAKE_API || 'false') === 'true'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('meetus_user') || 'null'),
    token: localStorage.getItem('meetus_token') || null,
    loading: false
  }),

  getters: {
    isAuthenticated: (s) => !!s.token,
    userId: (s) => s.user?.id || s.user?._id || null,
    isAdmin: (s) => s.user?.role === 'admin'
  },

  actions: {
    _persist() {
      if (this.token) {
        localStorage.setItem('meetus_token', this.token)
        localStorage.setItem('meetus_user', JSON.stringify(this.user))
      } else {
        localStorage.removeItem('meetus_token')
        localStorage.removeItem('meetus_user')
      }
      saveDatabase()
    },

    async login(payload) {
      this.loading = true
      try {
        let res
        if (USE_FAKE) {
          res = await fakeAuth.login(payload)
        } else {
          try {
            res = await api.post('/auth/login', payload)
          } catch (netErr) {
            // Se falhou por falta de internet, timeout ou servidor inacessível, recorrer à base offline
            const isNetworkFailure = !netErr.response || netErr.code === 'ERR_NETWORK' || netErr.code === 'ECONNABORTED' || (netErr.response && netErr.response.status >= 500)
            if (isNetworkFailure) {
              console.warn('[AUTH] Servidor backend inacessível ou modo offline. A recorrer à base local...', netErr)
              res = await fakeAuth.login(payload)
            } else {
              throw netErr
            }
          }
        }
        this.token = res.data.token
        this.user = res.data.user
        this._persist()
        try {
          const meetusStore = useMeetUsStore()
          meetusStore.setCurrentUser(this.user)
          const chatStore = useChatStore()
          chatStore.bindSocket?.()
          chatStore.loadConversations?.()
        } catch (_) {}
        if (this.userId && socket) {
          socket.emit('user:join', this.userId)
        }
        return res.data
      } finally { this.loading = false }
    },

    async register(payload) {
      this.loading = true
      try {
        let res
        if (USE_FAKE) {
          res = await fakeAuth.register(payload)
        } else {
          try {
            res = await api.post('/auth/register', payload)
          } catch (netErr) {
            const isNetworkFailure = !netErr.response || netErr.code === 'ERR_NETWORK' || netErr.code === 'ECONNABORTED' || (netErr.response && netErr.response.status >= 500)
            if (isNetworkFailure) {
              console.warn('[AUTH] Servidor backend inacessível. A registar utilizador localmente...', netErr)
              res = await fakeAuth.register(payload)
            } else {
              throw netErr
            }
          }
        }
        this.token = res.data.token
        this.user = res.data.user
        this._persist()
        try {
          const meetusStore = useMeetUsStore()
          meetusStore.setCurrentUser(this.user)
          const chatStore = useChatStore()
          chatStore.bindSocket?.()
          chatStore.loadConversations?.()
        } catch (_) {}
        if (this.userId && socket) {
          socket.emit('user:join', this.userId)
        }
        return res.data
      } finally { this.loading = false }
    },

    async fetchMe() {
      if (!this.user?.id && !this.user?._id) return
      try {
        const res = USE_FAKE ? await fakeAuth.me(this.user.id || this.user._id) : await api.get('/auth/me')
        this.user = res.data
        this._persist()
        try {
          const meetusStore = useMeetUsStore()
          meetusStore.setCurrentUser(this.user)
        } catch (_) {}
      } catch (err) {
        console.warn('fetchMe error:', err.message)
      }
    },

    logout() {
      if (this.userId && socket) {
        socket.emit('user:leave', this.userId)
      }
      this.user = null
      this.token = null
      this._persist()
      try {
        const meetusStore = useMeetUsStore()
        meetusStore.clearCurrentUser()
      } catch (_) {}
    }
  }
})
