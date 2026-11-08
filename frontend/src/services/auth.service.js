// frontend/src/services/auth.service.js
import { fakeAuth } from './fake-api'
import { api } from 'src/boot/axios'

const USE_FAKE = (import.meta.env.VITE_USE_FAKE_API || import.meta.env.USE_FAKE_API || 'false') === 'true'

export const authService = {
  login: (payload) => (USE_FAKE ? fakeAuth.login(payload) : api.post('/auth/login', payload)),
  register: (payload) => (USE_FAKE ? fakeAuth.register(payload) : api.post('/auth/register', payload)),
  me: (id) => (USE_FAKE ? fakeAuth.me(id) : api.get('/auth/me')),
  forgotPassword: (email) => (USE_FAKE ? fakeAuth.forgotPassword(email) : api.post('/auth/forgot-password', { email }))
}
