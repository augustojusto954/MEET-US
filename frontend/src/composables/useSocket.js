// frontend/src/composables/useSocket.js
import { onMounted, onUnmounted } from 'vue'
import { socket } from 'src/boot/socket'

export function useSocket(event, handler) {
  onMounted(() => socket.on(event, handler))
  onUnmounted(() => socket.off(event, handler))
  return { emit: (e, p) => socket.emit(e, p) }
}
