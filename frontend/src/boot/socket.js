// frontend/src/boot/socket.js
import { boot } from 'quasar/wrappers'
import { io } from 'socket.io-client'
import { FakeSocket } from 'src/services/fake-socket'

const USE_FAKE = (import.meta.env.VITE_USE_FAKE_API || import.meta.env.USE_FAKE_API || 'false') === 'true'

const getSocketUrl = () => {
  if (typeof window !== 'undefined') {
    // 1. Electron ou ficheiro local (file://)
    if (window.location.protocol === 'file:' || !window.location.origin || window.location.origin === 'null') {
      const savedSocket = localStorage.getItem('meetus_socket_url')
      if (savedSocket) return savedSocket
      return 'http://localhost:3000'
    }

    // 2. Se o frontend dev estiver numa porta separada (ex: 9000), direcionar para o backend na 3000
    if (window.location.port && window.location.port !== '3000' && window.location.port !== '80' && window.location.port !== '443') {
      const host = window.location.hostname || 'localhost'
      return `${window.location.protocol}//${host}:3000`
    }

    // 3. Servidor de produção unificado, túnel, ou IP de rede local
    return window.location.origin
  }
  return 'http://localhost:3000'
}

const SOCKET_URL = getSocketUrl();

let socket

if (USE_FAKE) {
  socket = new FakeSocket()
  console.log('[Socket] A usar FakeSocket (modo offline)')
} else {
  socket = io(SOCKET_URL, { autoConnect: true, transports: ['websocket', 'polling'] })
  socket.on('connect', () => {
    console.log('[Socket.IO] Conectado ao backend:', SOCKET_URL)
    const storedUser = localStorage.getItem('meetus_user')
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser)
        const uid = u?.id || u?._id
        if (uid) {
          socket.emit('user:join', String(uid))
        }
      } catch (_) {}
    }
  })
  socket.on('connect_error', (err) => console.warn('[Socket.IO] Erro de ligação:', err.message))
}

export default boot(({ app }) => {
  app.config.globalProperties.$socket = socket
})

export { socket }
