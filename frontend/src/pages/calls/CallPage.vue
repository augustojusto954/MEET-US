<template>
  <q-page class="column text-white" style="height: calc(100vh - 50px); overflow: hidden; background-color: #211B50;">
    <!-- Barra Superior da Chamada (Deep Purple) -->
    <div class="row items-center q-px-md q-py-sm shadow-2" style="z-index: 10; background-color: #171338; border-bottom: 1px solid rgba(140, 133, 244, 0.2);">
      <q-btn flat round dense icon="arrow_back" @click="handleEndCall" />
      <q-avatar size="36px" class="q-ml-sm shadow-1">
        <img :src="targetUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&fit=crop'" />
      </q-avatar>
      <div class="q-ml-sm">
        <div class="text-subtitle2 text-weight-bold">{{ targetUser?.name || 'Sessão de Estudo MEET-US' }}</div>
        <div class="text-caption row items-center" :class="connectionStateClass">
          <q-badge :color="connectionBadgeColor" rounded class="q-mr-xs" />
          {{ statusLabel }}
        </div>
      </div>
      <q-space />
      <div v-if="inCall" class="row items-center q-gutter-xs">
        <q-chip dense :color="isAudioOnlyCall ? 'positive' : 'deep-purple'" text-color="white" size="sm" class="gt-xs">
          <q-icon :name="isAudioOnlyCall ? 'call' : 'videocam'" size="14px" class="q-mr-xs" />
          {{ isAudioOnlyCall ? 'Chamada de Voz WhatsApp' : 'Chamada de Vídeo' }}
        </q-chip>
        <q-chip dense color="primary" text-color="white" size="sm">
          {{ formattedDuration }}
        </q-chip>
      </div>
    </div>

    <!-- Área Principal de Vídeo / Chamada -->
    <div class="col row no-wrap relative-position" style="overflow: hidden;">
      <!-- Palco de Vídeo Remoto -->
      <div class="col column items-center justify-center relative-position bg-black full-height overflow-hidden">
        <!-- Tela de Espera / Iniciar Chamada -->
        <div v-if="!inCall" class="column items-center text-center q-pa-lg">
          <q-avatar size="110px" class="shadow-4 q-mb-md border-white" style="border: 3px solid #5B55D6;">
            <img :src="targetUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&fit=crop'" />
          </q-avatar>
          <div class="text-h5 text-weight-bolder">{{ targetUser?.name || 'Colega de Estudo' }}</div>
          <div class="text-caption text-grey-4 q-mb-lg">{{ targetUser?.course || 'Ensino Superior' }} • {{ targetUser?.institution || 'Moçambique' }}</div>

          <div class="row q-gutter-md justify-center">
            <q-btn
              color="positive"
              icon="videocam"
              label="Iniciar Chamada de Vídeo"
              rounded
              unelevated
              size="md"
              class="text-weight-bold"
              :loading="isConnecting"
              @click="startCall(true)"
            />
            <q-btn
              color="primary"
              icon="call"
              label="Apenas Áudio"
              rounded
              unelevated
              size="md"
              class="text-weight-bold"
              :loading="isConnecting"
              @click="startCall(false)"
            />
          </div>
        </div>

        <!-- Chamada em Curso -->
        <div v-else class="full-width full-height relative-position flex flex-center bg-black overflow-hidden">
          <!-- Feed de Vídeo Remoto Real -->
          <video
            ref="remoteVideoEl"
            autoplay
            playsinline
            class="remote-video-feed"
            v-show="hasRemoteVideo"
          />

          <!-- Fallback de Avatar se o participante remoto não tiver câmara ativa ou se for chamada de voz -->
          <div v-show="!hasRemoteVideo" class="column items-center text-center q-pa-md">
            <div class="relative-position q-mb-md">
              <q-avatar size="140px" class="shadow-5 relative-position" :class="{ 'pulse-ring': isSpeaking || inCall }">
                <img :src="targetUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&fit=crop'" />
              </q-avatar>
              <q-badge color="positive" floating rounded class="q-pa-xs">
                <q-icon name="phone_in_talk" color="white" size="16px" />
              </q-badge>
            </div>
            <div class="text-h5 text-weight-bolder">{{ targetUser?.name }}</div>
            <div class="text-subtitle2 text-emerald-300 q-mt-xs">
              <q-icon :name="isAudioOnlyCall ? 'call' : 'videocam'" size="16px" class="q-mr-xs" />
              {{ isAudioOnlyCall ? 'Chamada de Voz WhatsApp' : 'Chamada de Estudo MEET-US' }}
            </div>
            <div class="text-caption text-grey-4 q-mt-xs">
              {{ isPeerConnected ? `Conectado em tempo real • ${formattedDuration}` : 'A estabelecer ligação segura...' }}
            </div>
          </div>

          <!-- Video Local Picture-in-Picture (PiP) apenas quando o vídeo estiver ativo -->
          <div
            v-if="videoEnabled || hasRemoteVideo"
            class="absolute-bottom-right q-ma-sm q-ma-md-md local-pip bg-grey-9 shadow-4 rounded-borders overflow-hidden"
          >
            <video
              ref="localVideoEl"
              autoplay
              playsinline
              muted
              class="local-video-feed"
              v-show="videoEnabled"
            />
            <div
              v-show="!videoEnabled"
              class="full-width full-height column items-center justify-center bg-grey-9 text-center q-pa-xs"
            >
              <q-avatar size="36px">
                <img :src="auth.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user?.name || 'Você')}&background=059669&color=fff&size=256`" />
              </q-avatar>
              <div class="text-caption text-grey-5 q-mt-xs" style="font-size: 10px;">Câmara desligada</div>
            </div>
            <div class="absolute-bottom-left q-px-xs text-caption bg-black-dim" style="font-size: 11px;">Você</div>
          </div>
        </div>
      </div>

      <!-- Chat / Notas Durante a Chamada -->
      <div
        v-if="showInCallChat"
        class="bg-white text-dark column in-call-chat-drawer"
      >
        <div class="row items-center justify-between q-pa-md bg-grey-1 border-bottom">
          <div class="text-subtitle2 text-weight-bold text-dark">Chat da Sessão</div>
          <q-btn flat round dense icon="close" size="sm" @click="showInCallChat = false" />
        </div>

        <q-scroll-area class="col q-pa-sm">
          <div v-for="(m, i) in callMessages" :key="i" class="q-mb-xs">
            <span class="text-weight-bold text-caption text-primary">{{ m.sender }}: </span>
            <span class="text-caption text-grey-9">{{ m.text }}</span>
          </div>
        </q-scroll-area>

        <div class="q-pa-sm bg-grey-1 row items-center q-gutter-xs">
          <input
            v-model="newCallMsg"
            placeholder="Mensagem na chamada..."
            class="in-call-input col"
            @keyup.enter="sendCallMessage"
          />
          <q-btn flat round dense icon="send" color="primary" size="sm" @click="sendCallMessage" />
        </div>
      </div>
    </div>

    <!-- Barra de Controlos Inferior -->
    <div class="row items-center justify-center q-pa-sm q-pa-md-md q-gutter-sm q-gutter-md-md" style="background-color: #171338; z-index: 10;">
      <q-btn
        round
        :color="audioEnabled ? 'white' : 'negative'"
        :text-color="audioEnabled ? 'dark' : 'white'"
        :icon="audioEnabled ? 'mic' : 'mic_off'"
        size="md"
        @click="toggleAudio"
      >
        <q-tooltip>{{ audioEnabled ? 'Silenciar Microfone' : 'Ativar Microfone' }}</q-tooltip>
      </q-btn>

      <q-btn
        round
        :color="videoEnabled ? 'white' : 'negative'"
        :text-color="videoEnabled ? 'dark' : 'white'"
        :icon="videoEnabled ? 'videocam' : 'videocam_off'"
        size="md"
        @click="toggleVideo"
      >
        <q-tooltip>{{ videoEnabled ? 'Desligar Câmara' : 'Ligar Câmara' }}</q-tooltip>
      </q-btn>

      <q-btn
        round
        :color="screenSharing ? 'positive' : 'white'"
        :text-color="screenSharing ? 'white' : 'dark'"
        icon="screen_share"
        size="md"
        @click="toggleScreenShare"
      >
        <q-tooltip>{{ screenSharing ? 'Parar Partilha de Ecrã' : 'Partilhar Ecrã' }}</q-tooltip>
      </q-btn>

      <q-btn
        round
        :color="showInCallChat ? 'primary' : 'white'"
        :text-color="showInCallChat ? 'white' : 'dark'"
        icon="chat"
        size="md"
        @click="showInCallChat = !showInCallChat"
      >
        <q-tooltip>Chat da Sessão</q-tooltip>
      </q-btn>

      <q-btn
        v-if="inCall"
        round
        color="negative"
        icon="call_end"
        size="lg"
        class="q-ml-sm q-ml-md-md"
        @click="handleEndCall"
      >
        <q-tooltip>Terminar Chamada</q-tooltip>
      </q-btn>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { useAuthStore } from 'src/stores/auth'
import { useMeetUsStore } from 'src/stores/meetus'
import { useCallStore } from 'src/stores/call'
import { socket } from 'src/boot/socket'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const store = useMeetUsStore()
const callStore = useCallStore()

const localVideoEl = ref(null)
const remoteVideoEl = ref(null)

const targetUser = ref(null)
const targetUserId = ref('')
const inCall = ref(false)
const isConnecting = ref(false)
const isPeerConnected = ref(false)
const hasRemoteVideo = ref(false)
const audioEnabled = ref(true)
const videoEnabled = ref(true)
const screenSharing = ref(false)
const isSpeaking = ref(false)
const showInCallChat = ref(false)
const isAudioOnlyCall = ref(false)

const durationSeconds = ref(0)
const timerInterval = ref(null)

const localStream = ref(null)
const remoteStream = ref(null)
let peerConnection = null

const callMessages = ref([
  { sender: 'Sistema', text: 'Sessão de estudo MEET-US iniciada com WebRTC P2P.' }
])
const newCallMsg = ref('')

const formattedDuration = computed(() => {
  const m = Math.floor(durationSeconds.value / 60)
  const s = durationSeconds.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const statusLabel = computed(() => {
  if (!inCall.value) return 'Pronto para conectar'
  if (isPeerConnected.value) return `Em chamada • ${formattedDuration.value}`
  return 'A ligar ao colega...'
})

const connectionBadgeColor = computed(() => {
  if (!inCall.value) return 'grey-5'
  if (isPeerConnected.value) return 'positive'
  return 'warning'
})

const connectionStateClass = computed(() => {
  if (isPeerConnected.value) return 'text-positive'
  if (inCall.value) return 'text-warning'
  return 'text-grey-4'
})

// Gerar stream de fallback caso o dispositivo não tenha câmara/microfone físico disponível
function createSyntheticMediaStream(withVideo = true) {
  const canvas = document.createElement('canvas')
  canvas.width = 640
  canvas.height = 480
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#1e1b4b'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#10b981'
  ctx.font = '24px sans-serif'
  ctx.fillText('MEET-US Vídeo Ativo', 200, 240)

  const stream = canvas.captureStream ? canvas.captureStream(25) : new MediaStream()

  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = audioCtx.createOscillator()
    const dst = audioCtx.createMediaStreamDestination()
    osc.connect(dst)
    osc.start()
    const audioTrack = dst.stream.getAudioTracks()[0]
    if (audioTrack) stream.addTrack(audioTrack)
  } catch (e) {
    // AudioContext não suportado ou bloqueado
  }

  return stream
}

async function obtainLocalMedia(withVideo = true) {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      localStream.value = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: withVideo ? { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } : false
      })
    } catch (err1) {
      console.warn('[WebRTC] Tentativa 1 com constraints ideais falhou, a tentar constraints básicas:', err1)
      try {
        localStream.value = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: withVideo ? true : false
        })
      } catch (err2) {
        console.warn('[WebRTC] Tentativa 2 falhou, a tentar apenas áudio:', err2)
        try {
          localStream.value = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
          videoEnabled.value = false
        } catch (err3) {
          console.warn('[WebRTC] Câmara e microfone inacessíveis, a ativar fallback sintético:', err3)
          localStream.value = createSyntheticMediaStream(withVideo)
        }
      }
    }
  } else {
    localStream.value = createSyntheticMediaStream(withVideo)
  }

  await nextTick()
  if (localVideoEl.value && localStream.value) {
    localVideoEl.value.srcObject = localStream.value
    localVideoEl.value.play().catch(() => {})
  }
  return localStream.value
}

function initializePeerConnection() {
  if (peerConnection) {
    try { peerConnection.close() } catch (e) {}
  }

  peerConnection = new RTCPeerConnection({
    iceServers: callStore.iceServers
  })

  // Adicionar faixas locais ao PeerConnection
  if (localStream.value) {
    localStream.value.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream.value)
    })
  }

  // Receção de faixa remota
  peerConnection.ontrack = (event) => {
    console.log('[WebRTC] Faixa remota recebida:', event.track.kind)
    if (!remoteStream.value) {
      remoteStream.value = new MediaStream()
    }
    remoteStream.value.addTrack(event.track)

    nextTick(() => {
      if (remoteVideoEl.value) {
        remoteVideoEl.value.srcObject = remoteStream.value
        remoteVideoEl.value.play().catch(e => console.warn('[WebRTC] Autoplay bloqueado pelo browser:', e))
      }
      if (event.track.kind === 'video') {
        hasRemoteVideo.value = true
      }
    })
    isPeerConnected.value = true
  }

  // Envio de ICE Candidate
  peerConnection.onicecandidate = (event) => {
    if (event.candidate && targetUserId.value) {
      socket.emit('call:ice-candidate', {
        targetId: targetUserId.value,
        candidate: event.candidate
      })
    }
  }

  peerConnection.onconnectionstatechange = () => {
    console.log('[WebRTC] Connection state:', peerConnection.connectionState)
    if (peerConnection.connectionState === 'connected') {
      isPeerConnected.value = true
      isConnecting.value = false
    } else if (peerConnection.connectionState === 'disconnected' || peerConnection.connectionState === 'failed') {
      isPeerConnected.value = false
    }
  }

  return peerConnection
}

async function startCall(withVideo = true) {
  isConnecting.value = true
  videoEnabled.value = withVideo
  inCall.value = true
  durationSeconds.value = 0

  timerInterval.value = setInterval(() => {
    durationSeconds.value++
  }, 1000)

  await obtainLocalMedia(withVideo)
  const pc = initializePeerConnection()

  try {
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    socket.emit('call:offer', {
      targetId: targetUserId.value,
      callerId: auth.userId,
      callerName: auth.user?.name || 'Estudante MEET-US',
      callerAvatar: auth.user?.avatar,
      isVideo: withVideo,
      sdp: offer
    })

    $q.notify({
      type: 'info',
      message: `A ligar para ${targetUser.value?.name || 'colega'}...`,
      icon: 'phone_forwarded'
    })
  } catch (err) {
    console.error('[WebRTC] Erro ao criar oferta:', err)
  }
}

async function answerCall(withVideo = true, offerSdp = null) {
  isConnecting.value = true
  videoEnabled.value = withVideo
  inCall.value = true
  durationSeconds.value = 0

  timerInterval.value = setInterval(() => {
    durationSeconds.value++
  }, 1000)

  await obtainLocalMedia(withVideo)
  const pc = initializePeerConnection()

  const sdpToUse = offerSdp || callStore.incomingCall?.sdp

  if (sdpToUse) {
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(sdpToUse))

      // Processar eventuais candidatos ICE pendentes
      for (const cand of callStore.pendingRemoteCandidates) {
        try { await pc.addIceCandidate(new RTCIceCandidate(cand)) } catch (e) {}
      }
      callStore.clearPendingCandidates()

      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)

      socket.emit('call:answer', {
        callerId: targetUserId.value,
        targetId: auth.userId,
        sdp: answer
      })
      isPeerConnected.value = true
      isConnecting.value = false
    } catch (err) {
      console.error('[WebRTC] Erro ao responder à chamada:', err)
    }
  }
}

function toggleAudio() {
  audioEnabled.value = !audioEnabled.value
  if (localStream.value) {
    localStream.value.getAudioTracks().forEach(t => { t.enabled = audioEnabled.value })
  }
}

function toggleVideo() {
  videoEnabled.value = !videoEnabled.value
  if (localStream.value) {
    localStream.value.getVideoTracks().forEach(t => { t.enabled = videoEnabled.value })
  }
}

async function toggleScreenShare() {
  if (!screenSharing.value) {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
        const screenTrack = screenStream.getVideoTracks()[0]

        if (peerConnection) {
          const sender = peerConnection.getSenders().find(s => s.track && s.track.kind === 'video')
          if (sender) {
            sender.replaceTrack(screenTrack)
          }
        }

        screenTrack.onended = () => {
          stopScreenShare()
        }

        screenSharing.value = true
        $q.notify({ type: 'positive', message: 'Partilha de ecrã iniciada.' })
      }
    } catch (e) {
      console.warn('[ScreenShare] Cancelado ou erro:', e)
    }
  } else {
    stopScreenShare()
  }
}

function stopScreenShare() {
  screenSharing.value = false
  if (peerConnection && localStream.value) {
    const videoTrack = localStream.value.getVideoTracks()[0]
    const sender = peerConnection.getSenders().find(s => s.track && s.track.kind === 'video')
    if (sender && videoTrack) {
      sender.replaceTrack(videoTrack)
    }
  }
  $q.notify({ type: 'info', message: 'Partilha de ecrã terminada.' })
}

function sendCallMessage() {
  if (!newCallMsg.value.trim()) return
  const msgText = newCallMsg.value.trim()
  callMessages.value.push({ sender: 'Você', text: msgText })

  socket.emit('chat:send', {
    receiverId: targetUserId.value,
    senderId: auth.userId,
    content: `[Chamada] ${msgText}`,
    type: 'text'
  })

  newCallMsg.value = ''
}

function handleEndCall() {
  if (targetUserId.value) {
    socket.emit('call:end', {
      targetId: targetUserId.value,
      callerId: auth.userId
    })
  }

  cleanupCall()
  $q.notify({ type: 'info', message: 'Chamada terminada.' })
  router.push({ name: 'dashboard' })
}

function cleanupCall() {
  if (timerInterval.value) clearInterval(timerInterval.value)
  if (localStream.value) {
    localStream.value.getTracks().forEach(t => t.stop())
    localStream.value = null
  }
  if (peerConnection) {
    try { peerConnection.close() } catch (e) {}
    peerConnection = null
  }
  inCall.value = false
  isPeerConnected.value = false
  isConnecting.value = false
  hasRemoteVideo.value = false
  callStore.clearIncomingCall()
}

// Configuração dos Eventos Socket.IO para WebRTC
function setupSocketListeners() {
  if (auth.userId) {
    socket.emit('user:join', auth.userId)
  }

  socket.on('call:answer', async (data) => {
    console.log('[WebRTC] Resposta recebida do colega:', data)
    if (peerConnection && data.sdp) {
      try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp))
        isPeerConnected.value = true
        isConnecting.value = false

        for (const cand of callStore.pendingRemoteCandidates) {
          try { await peerConnection.addIceCandidate(new RTCIceCandidate(cand)) } catch (e) {}
        }
        callStore.clearPendingCandidates()
      } catch (err) {
        console.error('[WebRTC] Erro ao aplicar remote description:', err)
      }
    }
  })

  socket.on('call:ice-candidate', async (data) => {
    if (data.candidate) {
      if (peerConnection && peerConnection.remoteDescription) {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate))
        } catch (e) {
          console.warn('[WebRTC] Erro ao adicionar ICE candidate:', e)
        }
      } else {
        callStore.addPendingCandidate(data.candidate)
      }
    }
  })

  socket.on('call:rejected', () => {
    $q.notify({ type: 'warning', message: 'O colega recusou a chamada.' })
    cleanupCall()
    router.push({ name: 'dashboard' })
  })

  socket.on('call:ended', () => {
    $q.notify({ type: 'info', message: 'A chamada foi terminada pelo colega.' })
    cleanupCall()
    router.push({ name: 'dashboard' })
  })
}

onMounted(async () => {
  setupSocketListeners()

  const partnerIdFromQuery = route.query.partnerId
  const partnerNameFromQuery = route.query.partner
  const isIncoming = route.query.incoming === '1' || route.query.incoming === 'true'
  const isVideo = route.query.video !== '0' && route.query.video !== 'false'
  isAudioOnlyCall.value = !isVideo
  const autoStart = route.query.autostart === '1' || route.query.autostart === 'true'

  // Resolver utilizador alvo
  if (partnerIdFromQuery) {
    targetUserId.value = String(partnerIdFromQuery)
    const found = store.students.find(s => String(s.id || s._id) === String(partnerIdFromQuery))
    if (found) {
      targetUser.value = found
    } else {
      try {
        const uRes = await api.get(`/users/${partnerIdFromQuery}`)
        if (uRes.data) {
          targetUser.value = {
            id: String(uRes.data._id || uRes.data.id),
            name: uRes.data.name,
            institution: uRes.data.institution || 'Universidade Eduardo Mondlane',
            course: uRes.data.course || 'Ensino Superior',
            avatar: uRes.data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(uRes.data.name)}&background=059669&color=fff&size=256`
          }
        }
      } catch (_) {}
    }
  }

  if (!targetUser.value && partnerNameFromQuery) {
    const found = store.students.find(s => s.name.toLowerCase().includes(partnerNameFromQuery.toLowerCase()))
    if (found) {
      targetUser.value = found
      targetUserId.value = String(found.id || found._id)
    } else {
      targetUser.value = {
        id: targetUserId.value || 'partner',
        name: partnerNameFromQuery,
        institution: 'Universidade',
        course: 'Estudante MEET-US',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(partnerNameFromQuery)}&background=059669&color=fff&size=256`
      }
    }
  }

  if (!targetUser.value) {
    targetUser.value = store.students[1] || {
      id: '2',
      name: 'Amália Mondlane',
      institution: 'Universidade Eduardo Mondlane',
      course: 'Design de Comunicação',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&fit=crop'
    }
    if (!targetUserId.value) targetUserId.value = String(targetUser.value.id || '2')
  }

  // Se entrou através de uma chamada a receber (incoming)
  if (isIncoming) {
    await answerCall(isVideo)
  } else if (autoStart) {
    await startCall(isVideo)
  }
})

onUnmounted(() => {
  cleanupCall()
  socket.off('call:answer')
  socket.off('call:ice-candidate')
  socket.off('call:rejected')
  socket.off('call:ended')
})
</script>

<style scoped>
.remote-video-feed {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: #000000;
}

.local-pip {
  width: 180px;
  height: 125px;
  border: 2px solid #5B55D6;
  z-index: 5;
  border-radius: 12px;
}

@media (max-width: 599px) {
  .local-pip {
    width: 110px;
    height: 80px;
  }
}

.local-video-feed {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1);
}

.bg-black-dim {
  background: rgba(0, 0, 0, 0.65);
  border-radius: 4px;
}

.in-call-chat-drawer {
  width: 320px;
  border-left: 1px solid #EAE8FF;
}

@media (max-width: 768px) {
  .in-call-chat-drawer {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 20;
    width: 280px;
    box-shadow: -4px 0 16px rgba(0,0,0,0.3);
  }
}

.in-call-input {
  height: 36px;
  border: 1px solid #EAE8FF;
  border-radius: 8px;
  background: #F8FAFC;
  color: #0F172A;
  padding: 0 12px;
  outline: none;
  font-size: 13px;
}

.pulse-ring {
  box-shadow: 0 0 0 0 rgba(91, 85, 214, 0.7);
  animation: pulse 2s infinite cubic-bezier(0.66, 0, 0, 1);
}

@keyframes pulse {
  to {
    box-shadow: 0 0 0 25px rgba(91, 85, 214, 0);
  }
}
</style>
