// frontend/src/boot/socket.js
import { boot } from 'quasar/wrappers'
import { io } from 'socket.io-client'
import { FakeSocket } from 'src/services/fake-socket'

const USE_FAKE = (import.meta.env.VITE_USE_FAKE_API || import.meta.env.USE_FAKE_API || 'false') === 'true'

const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) return import.meta.env.VITE_SOCKET_URL;
  if (import.meta.env.SOCKET_URL) return import.meta.env.SOCKET_URL;
  if (typeof window !== 'undefined') {
    // Se acedido via ngrok, domínio de produção ou na porta do servidor unificado
    if (window.location.hostname.includes('ngrok') || window.location.port === '3000' || !window.location.port) {
      return window.location.origin;
    }
    // Se acedido via IP na rede local (dev server na porta 9000)
    if (window.location.hostname && window.location.hostname !== 'localhost') {
      return `http://${window.location.hostname}:3000`;
    }
  }
  return 'http://localhost:3000';
};

const SOCKET_URL = getSocketUrl();

let socket

if (USE_FAKE) {
  socket = new FakeSocket()
  console.log('[Socket] A usar FakeSocket (modo offline)')
} else {
  socket = io(SOCKET_URL, { autoConnect: true, transports: ['websocket', 'polling'] })
  socket.on('connect', () => console.log('[Socket.IO] Conectado ao backend:', SOCKET_URL))
  socket.on('connect_error', (err) => console.warn('[Socket.IO] Erro de ligação:', err.message))
}

export default boot(({ app }) => {
  app.config.globalProperties.$socket = socket
})

export { socket }
