// frontend/src/boot/axios.js
import { boot } from 'quasar/wrappers'
import axios from 'axios'

const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // 1. Electron ou execução a partir do sistema de ficheiros (file://)
    if (window.location.protocol === 'file:' || !window.location.origin || window.location.origin === 'null') {
      const savedApi = localStorage.getItem('meetus_api_url')
      if (savedApi) return savedApi
      return 'http://localhost:3000/api'
    }

    // 2. Se o frontend dev estiver numa porta separada (ex: 9000), direcionar para o backend na 3000
    if (window.location.port && window.location.port !== '3000' && window.location.port !== '80' && window.location.port !== '443') {
      const host = window.location.hostname || 'localhost'
      return `${window.location.protocol}//${host}:3000/api`
    }

    // 3. Servidor de produção unificado, túnel, ou IP de rede local
    return `${window.location.origin}/api`
  }
  return 'http://localhost:3000/api'
}

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

// Interceptor de response → preserva a sessão persistente do utilizador (só sai com logout explícito)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Não limpa o token em caso de falha de conexão ou 401 temporário,
    // garantindo que o utilizador permanece reconhecido sempre no instalável e web.
    return Promise.reject(error)
  }
)

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
