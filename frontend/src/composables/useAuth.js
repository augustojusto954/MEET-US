// frontend/src/composables/useAuth.js
import { computed } from 'vue'
import { useAuthStore } from 'src/stores/auth'

export function useAuth() {
  const auth = useAuthStore()
  return {
    user: computed(() => auth.user),
    isAuthenticated: computed(() => auth.isAuthenticated),
    login: auth.login,
    register: auth.register,
    logout: auth.logout
  }
}
