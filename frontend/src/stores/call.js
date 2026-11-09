// frontend/src/stores/call.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCallStore = defineStore('call', () => {
  const incomingCall = ref(null)
  const isCallActive = ref(false)
  const pendingRemoteCandidates = ref([])

  // Servidores STUN públicos confiáveis para contornar NAT/Firewalls entre mobile e desktop
  const iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    { urls: 'stun:stun.cloudflare.com:3478' }
  ]

  function setIncomingCall(data) {
    incomingCall.value = data
  }

  function clearIncomingCall() {
    incomingCall.value = null
  }

  function addPendingCandidate(candidate) {
    pendingRemoteCandidates.value.push(candidate)
  }

  function clearPendingCandidates() {
    pendingRemoteCandidates.value = []
  }

  return {
    incomingCall,
    isCallActive,
    iceServers,
    pendingRemoteCandidates,
    setIncomingCall,
    clearIncomingCall,
    addPendingCandidate,
    clearPendingCandidates
  }
})
