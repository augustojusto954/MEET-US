// frontend/src/composables/useMediaDevices.js
import { ref } from 'vue'

export function useMediaDevices() {
  const stream = ref(null)
  const error = ref(null)

  async function request({ audio = true, video = false } = {}) {
    try {
      stream.value = await navigator.mediaDevices.getUserMedia({ audio, video })
    } catch (e) {
      error.value = e.message
    }
    return stream.value
  }

  function stop() {
    stream.value?.getTracks().forEach((t) => t.stop())
    stream.value = null
  }

  return { stream, error, request, stop }
}
