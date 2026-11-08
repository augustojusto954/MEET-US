// frontend/src/boot/axios.js
import { boot } from 'quasar/wrappers'
import axios from 'axios'

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (import.meta.env.API_URL) return import.meta.env.API_URL;
  if (typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:3000/api`;
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
