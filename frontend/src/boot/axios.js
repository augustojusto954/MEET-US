// frontend/src/boot/axios.js
import { boot } from 'quasar/wrappers'
import axios from 'axios'

const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // Se o frontend dev estiver numa porta separada (ex: 9000), direcionar para o backend na 3000
    if (window.location.port && window.location.port !== '3000' && window.location.port !== '80' && window.location.port !== '443') {
      const host = window.location.hostname || 'localhost';
      return `${window.location.protocol}//${host}:3000/api`;
    }
    // Servidor de produção unificado, ngrok, ou IP direto
    return `${window.location.origin}/api`;
  }
  return 'http://localhost:3000/api';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000
})

// Interceptor de request → injeta JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('meetus_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Interceptor de response → trata 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('meetus_token')
      localStorage.removeItem('meetus_user')
      if (!window.location.pathname.startsWith('/auth/login')) {
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
