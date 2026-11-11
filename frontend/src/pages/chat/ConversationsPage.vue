<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Mensagens & Conversas</div>
        <div class="text-caption text-grey-7">Conversas em direto com os teus parceiros de mentoria.</div>
      </div>
    </div>

    <q-card flat class="chat-main-card row no-wrap" style="border-radius: 20px; overflow: hidden;">
      <!-- Coluna da Esquerda: Lista de Conversas -->
      <div
        v-show="$q.screen.gt.sm || !selectedConversation"
        class="col-12 col-md-4 border-right column bg-white"
        style="border-right: 1px solid #E2E8F0;"
      >
        <div class="q-pa-md border-bottom" style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0;">
          <q-input
            v-model="searchConv"
            placeholder="Pesquisar conversas..."
            dense
            outlined
            clearable
            bg-color="white"
          >
            <template #prepend>
              <q-icon name="search" color="grey-6" />
            </template>
          </q-input>
        </div>

        <q-scroll-area class="col">
          <div v-if="loadingConversations" class="q-pa-lg text-center">
            <q-spinner-dots color="primary" size="32px" />
            <div class="text-caption text-grey-6 q-mt-xs">A carregar conversas reais...</div>
          </div>

          <!-- Lista de Conversas Existentes -->
          <q-list v-else-if="filteredConversations.length" separator>
            <q-item
              v-for="c in filteredConversations"
              :key="c.id"
              clickable
              v-ripple
              :active="selectedConversation?.id === c.id"
              active-class="bg-emerald-50"
              class="q-py-md"
              @click="selectConversation(c)"
            >
              <q-item-section avatar>
                <q-avatar size="48px" class="relative-position">
                  <img :src="c.avatar" />
                  <q-badge
                    v-if="c.online"
                    color="positive"
                    floating
                    rounded
                    style="top: 2px; right: 2px;"
                  />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <div class="row items-center justify-between">
                  <span class="text-subtitle2 text-weight-bold text-dark ellipsis">{{ c.name }}</span>
                  <span class="text-caption text-grey-6" style="font-size: 11px;">{{ c.lastMessageAt }}</span>
                </div>
                <div class="text-caption text-grey-7 ellipsis q-mt-xs">
                  {{ c.lastMessage }}
                </div>
              </q-item-section>

              <q-item-section side v-if="c.unreadCount">
                <q-badge color="primary" rounded>{{ c.unreadCount }}</q-badge>
              </q-item-section>
            </q-item>
          </q-list>

          <!-- Se ainda não tem conversas: Sugerir colegas reais para iniciar conversa -->
          <div v-else class="q-pa-md text-center">
            <q-icon name="forum" size="40px" color="grey-4" class="q-mb-sm" />
            <div class="text-subtitle2 text-weight-bold text-dark">Ainda não tens conversas ativas</div>
            <div class="text-caption text-grey-6 q-mb-md">Escolhe um colega abaixo para iniciar a tua primeira conversa real:</div>

            <q-list dense separator class="text-left bg-grey-1 rounded-borders q-pa-xs">
              <q-item
                v-for="st in suggestedStudents.slice(0, 5)"
                :key="st.id"
                clickable
                v-ripple
                class="rounded-borders"
                @click="startChatWith(st.id)"
              >
                <q-item-section avatar>
                  <q-avatar size="32px">
                    <img :src="st.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(st.name)}&background=059669&color=fff&size=256`" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold text-caption ellipsis">{{ st.name }}</q-item-label>
                  <q-item-label caption class="ellipsis" style="font-size: 10px;">{{ st.course || st.institution }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn round flat dense icon="chat" color="primary" size="sm" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-scroll-area>
      </div>

      <!-- Coluna Central: Janela da Conversa Ativa -->
      <div
        v-if="selectedConversation"
        v-show="$q.screen.gt.sm || selectedConversation"
        class="col-12 col-md-8 col column bg-app"
      >
        <!-- Topo da Conversa com Controles WhatsApp (Chamada de Voz e Vídeo) -->
        <div class="row items-center justify-between q-pa-sm q-pa-md-md bg-white border-bottom" style="border-bottom: 1px solid #E2E8F0;">
          <div class="row items-center">
            <!-- Botão Voltar para Mobile -->
            <q-btn
              flat
              round
              dense
              icon="arrow_back"
              color="grey-8"
              class="lt-md q-mr-xs"
              @click="selectedConversation = null"
            />
            <q-avatar size="40px" class="q-mr-sm">
              <img :src="selectedConversation.avatar" />
            </q-avatar>
            <div>
              <div class="text-subtitle2 text-weight-bold text-dark">{{ selectedConversation.name }}</div>
              <div class="text-caption row items-center">
                <q-badge :color="selectedConversation.online ? 'positive' : 'grey-5'" rounded class="q-mr-xs" />
                <span :class="selectedConversation.online ? 'text-positive' : 'text-grey-6'">
                  {{ selectedConversation.online ? 'Online agora' : 'Offline' }}
                </span>
              </div>
            </div>
          </div>

          <div class="row items-center q-gutter-xs">
            <!-- Botão Chamada de Áudio (WhatsApp Voice Call) -->
            <q-btn
              round
              dense
              unelevated
              color="positive"
              icon="call"
              class="q-mr-xs"
              :to="{ name: 'calls', query: { partnerId: partnerUserId, partner: selectedConversation.name, autostart: '1', video: '0' } }"
            >
              <q-tooltip>Chamada de Voz WhatsApp com {{ selectedConversation.name }}</q-tooltip>
            </q-btn>

            <!-- Botão Chamada de Vídeo -->
            <q-btn
              round
              dense
              unelevated
              color="primary"
              icon="videocam"
              class="q-mr-xs"
              :to="{ name: 'calls', query: { partnerId: partnerUserId, partner: selectedConversation.name, autostart: '1', video: '1' } }"
            >
              <q-tooltip>Chamada de Vídeo com {{ selectedConversation.name }}</q-tooltip>
            </q-btn>

            <!-- Toggle Painel Lateral de Informações -->
            <q-btn
              flat
              round
              dense
              color="grey-7"
              icon="info"
              class="gt-sm"
              @click="showInfoDrawer = !showInfoDrawer"
            >
              <q-tooltip>Detalhes do Contacto</q-tooltip>
            </q-btn>
          </div>
        </div>

        <!-- Mensagens em Scroll -->
        <q-scroll-area ref="messagesScrollRef" class="col q-pa-sm q-pa-md-md">
          <div v-if="loadingMessages" class="q-pa-lg text-center">
            <q-spinner-dots color="primary" size="28px" />
          </div>

          <div v-else-if="currentMessages.length === 0" class="q-pa-xl text-center text-grey-6">
            <q-icon name="waving_hand" size="36px" color="amber-7" class="q-mb-xs" />
            <div class="text-subtitle2 text-weight-bold">Diz olá a {{ selectedConversation.name }}!</div>
            <div class="text-caption">Podes trocar mensagens, gravar áudios, enviar vídeos e PDFs em direto.</div>
          </div>

          <div v-else class="column q-gutter-sm">
            <div
              v-for="msg in currentMessages"
              :key="msg.id"
              class="row"
              :class="msg.sender === 'me' ? 'justify-end' : 'justify-start'"
            >
              <div
                class="q-pa-sm q-pa-md-md shadow-1 chat-bubble"
                :class="msg.sender === 'me' ? 'bg-primary text-white' : 'bg-white text-dark'"
                style="border-radius: 14px; border: 1px solid #E2E8F0;"
              >
                <!-- Áudio (Estilo WhatsApp) -->
                <div v-if="msg.type === 'audio'" class="voice-note-container">
                  <div class="row items-center no-wrap">
                    <q-avatar
                      size="36px"
                      :color="msg.sender === 'me' ? 'white' : 'positive'"
                      :text-color="msg.sender === 'me' ? 'primary' : 'white'"
                      icon="mic"
                      class="q-mr-sm shadow-1"
                    />
                    <div class="col column">
                      <audio
                        :src="resolveFileUrl(msg.fileUrl)"
                        controls
                        preload="metadata"
                        class="custom-audio-player"
                      ></audio>
                      <div
                        class="row justify-between text-caption q-px-xs q-mt-xs"
                        :class="msg.sender === 'me' ? 'text-emerald-100' : 'text-grey-7'"
                        style="font-size: 11px;"
                      >
                        <span>{{ msg.text && msg.text !== '[audio]' ? msg.text : 'Mensagem de voz' }}</span>
                        <span v-if="msg.fileSize">{{ formatFileSize(msg.fileSize) }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Vídeo -->
                <div v-else-if="msg.type === 'video'" class="video-container">
                  <video
                    :src="resolveFileUrl(msg.fileUrl)"
                    controls
                    playsinline
                    preload="metadata"
                    class="custom-video-player"
                  ></video>
                  <div
                    v-if="msg.text && msg.text !== '[video]'"
                    class="text-body2 q-mt-xs"
                    style="word-break: break-word;"
                  >
                    {{ msg.text }}
                  </div>
                </div>

                <!-- Documento / PDF -->
                <div v-else-if="msg.type === 'file'" class="file-container">
                  <div
                    class="row items-center no-wrap q-pa-sm rounded-borders file-bubble-card cursor-pointer"
                    :class="msg.sender === 'me' ? 'bg-emerald-700 text-white' : 'bg-grey-2 text-dark'"
                    @click="openExternal(resolveFileUrl(msg.fileUrl))"
                  >
                    <q-avatar
                      size="40px"
                      :color="msg.sender === 'me' ? 'white' : 'red-1'"
                      :text-color="msg.sender === 'me' ? 'negative' : 'negative'"
                      icon="picture_as_pdf"
                      class="q-mr-sm shadow-1"
                    />
                    <div class="col ellipsis q-mr-xs">
                      <div class="text-weight-bold text-caption ellipsis">
                        {{ msg.fileName || msg.text || 'Documento PDF' }}
                      </div>
                      <div
                        class="text-caption"
                        :class="msg.sender === 'me' ? 'text-emerald-100' : 'text-grey-7'"
                        style="font-size: 11px;"
                      >
                        {{ msg.fileSize ? formatFileSize(msg.fileSize) : 'Ficheiro' }} • PDF
                      </div>
                    </div>
                    <q-btn
                      round
                      dense
                      flat
                      :color="msg.sender === 'me' ? 'white' : 'grey-8'"
                      icon="download"
                      size="sm"
                      :href="resolveFileUrl(msg.fileUrl)"
                      target="_blank"
                      download
                      @click.stop
                    >
                      <q-tooltip>Descarregar PDF</q-tooltip>
                    </q-btn>
                  </div>
                </div>

                <!-- Imagem -->
                <div v-else-if="msg.type === 'image'" class="image-container">
                  <img
                    :src="resolveFileUrl(msg.fileUrl)"
                    class="custom-image-player cursor-pointer"
                    @click="openExternal(resolveFileUrl(msg.fileUrl))"
                  />
                  <div
                    v-if="msg.text && msg.text !== '[image]'"
                    class="text-body2 q-mt-xs"
                    style="word-break: break-word;"
                  >
                    {{ msg.text }}
                  </div>
                </div>

                <!-- Mensagem Normal de Texto -->
                <div v-else class="text-body2" style="word-break: break-word; white-space: pre-wrap;">
                  {{ msg.text }}
                </div>

                <div
                  class="text-caption text-right q-mt-xs"
                  :class="msg.sender === 'me' ? 'text-emerald-100' : 'text-grey-6'"
                  style="font-size: 10px;"
                >
                  {{ msg.time }}
                </div>
              </div>
            </div>
          </div>
        </q-scroll-area>

        <!-- Barra de Uploading em Progresso -->
        <div v-if="isUploading" class="q-px-md q-py-xs bg-emerald-50 text-primary row items-center border-top">
          <q-spinner-dots size="20px" class="q-mr-sm" />
          <span class="text-caption text-weight-bold">{{ uploadProgressText || 'A processar e enviar ficheiro...' }}</span>
        </div>

        <!-- Input de Envio de Mensagem / Gravação de Áudio WhatsApp -->
        <div class="q-pa-sm q-pa-md-md bg-white border-top">
          <!-- Modo de Gravação de Áudio Estilo WhatsApp -->
          <div v-if="isRecordingAudio" class="row items-center q-gutter-sm bg-grey-2 q-pa-sm rounded-borders full-width">
            <div class="row items-center q-mr-sm">
              <span class="recording-pulse q-mr-xs">●</span>
              <span class="text-weight-bolder text-negative text-subtitle2">{{ formatAudioDuration(recordingDuration) }}</span>
            </div>

            <div class="col row items-center justify-center q-gutter-xs overflow-hidden">
              <div class="wave-bar wb-1"></div>
              <div class="wave-bar wb-2"></div>
              <div class="wave-bar wb-3"></div>
              <div class="wave-bar wb-4"></div>
              <div class="wave-bar wb-5"></div>
              <div class="wave-bar wb-6"></div>
              <div class="wave-bar wb-7"></div>
              <span class="text-caption text-grey-7 gt-xs q-ml-sm">A gravar áudio WhatsApp...</span>
            </div>

            <div class="row items-center q-gutter-xs">
              <q-btn
                round
                flat
                dense
                color="negative"
                icon="delete"
                @click="cancelAudioRecording"
              >
                <q-tooltip>Cancelar Gravação</q-tooltip>
              </q-btn>

              <q-btn
                round
                unelevated
                color="positive"
                icon="send"
                @click="stopAndSendAudioRecording"
              >
                <q-tooltip>Enviar Áudio</q-tooltip>
              </q-btn>
            </div>
          </div>

          <!-- Modo Normal (Texto / Anexo / Botão Gravar) -->
          <div v-else class="row items-center q-gutter-xs q-gutter-sm-sm full-width">
            <!-- Botão Anexar Clip (WhatsApp Style) -->
            <q-btn
              round
              flat
              dense
              color="grey-7"
              icon="attach_file"
              size="md"
            >
              <q-tooltip>Anexar Documento PDF, Vídeo ou Imagem</q-tooltip>
              <q-menu anchor="top left" self="bottom left" :offset="[0, 8]" class="shadow-6 rounded-borders">
                <q-list style="min-width: 200px;" class="q-py-xs">
                  <q-item clickable v-close-popup @click="triggerPdfPicker">
                    <q-item-section avatar>
                      <q-avatar size="32px" color="red-1" text-color="negative" icon="picture_as_pdf" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-bold">Documento (PDF)</q-item-label>
                      <q-item-label caption>Partilhar ficheiro PDF</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup @click="triggerVideoPicker">
                    <q-item-section avatar>
                      <q-avatar size="32px" color="purple-1" text-color="purple-8" icon="videocam" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-bold">Vídeo</q-item-label>
                      <q-item-label caption>Enviar vídeo</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup @click="triggerImagePicker">
                    <q-item-section avatar>
                      <q-avatar size="32px" color="blue-1" text-color="blue-8" icon="image" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-bold">Imagem / Foto</q-item-label>
                      <q-item-label caption>Enviar fotografia</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>

            <q-input
              v-model="inputMessage"
              placeholder="Escreve uma mensagem..."
              dense
              outlined
              class="col"
              bg-color="white"
              @keyup.enter="handleSend"
            />

            <!-- Se tem texto, mostra botão Enviar -->
            <q-btn
              v-if="inputMessage.trim()"
              round
              unelevated
              color="primary"
              icon="send"
              @click="handleSend"
            >
              <q-tooltip>Enviar Mensagem</q-tooltip>
            </q-btn>

            <!-- Se está vazio, mostra botão Gravar Áudio WhatsApp -->
            <q-btn
              v-else
              round
              unelevated
              color="positive"
              icon="mic"
              @click="startAudioRecording"
            >
              <q-tooltip>Gravar Áudio (WhatsApp)</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>

      <!-- Estado Vazio para Desktop se nenhuma conversa estiver aberta -->
      <div
        v-if="!selectedConversation && $q.screen.gt.sm"
        class="col column items-center justify-center bg-white text-center q-pa-lg text-grey-6"
      >
        <q-icon name="chat" size="56px" color="grey-4" class="q-mb-md" />
        <div class="text-h6 text-weight-bold">Nenhuma conversa selecionada</div>
        <div class="text-body2">Escolhe um estudante na lista para iniciar a troca de mensagens.</div>
      </div>

      <!-- Coluna da Direita: Drawer de Informações do Contacto -->
      <div
        v-if="showInfoDrawer && selectedConversation && $q.screen.gt.sm"
        class="col-12 col-md-3 border-left bg-white q-pa-md"
        style="border-left: 1px solid #E2E8F0;"
      >
        <div class="text-center q-mb-md">
          <q-avatar size="72px" class="shadow-2 q-mb-sm">
            <img :src="selectedConversation.avatar" />
          </q-avatar>
          <div class="text-h6 text-weight-bolder text-dark">{{ selectedConversation.name }}</div>
          <div class="text-caption text-grey-7">{{ selectedConversation.other?.course || 'Estudante' }}</div>
          <div class="text-caption text-grey-6">{{ selectedConversation.other?.institution || 'Moçambique' }}</div>
        </div>

        <q-separator class="q-my-md" />

        <div class="column q-gutter-sm">
          <q-btn
            unelevated
            color="positive"
            icon="call"
            label="Chamada de Voz (Áudio)"
            no-caps
            class="full-width text-weight-bold"
            :to="{ name: 'calls', query: { partnerId: partnerUserId, partner: selectedConversation.name, autostart: '1', video: '0' } }"
          />

          <q-btn
            unelevated
            color="primary"
            icon="videocam"
            label="Chamada de Vídeo"
            no-caps
            class="full-width text-weight-bold"
            :to="{ name: 'calls', query: { partnerId: partnerUserId, partner: selectedConversation.name, autostart: '1', video: '1' } }"
          />

          <q-btn
            outline
            color="grey-9"
            label="Ver Perfil Completo"
            no-caps
            class="full-width text-weight-bold"
            :to="{ name: 'profile', query: { id: partnerUserId } }"
          />
        </div>
      </div>
    </q-card>

    <!-- Inputs Ocultos para Upload de PDF, Vídeo e Imagem -->
    <input ref="pdfInputRef" type="file" accept="application/pdf,.pdf" class="hidden" @change="handleFileSelected($event, 'file')" />
    <input ref="videoInputRef" type="file" accept="video/*,.mp4,.webm,.mov,.mkv" class="hidden" @change="handleFileSelected($event, 'video')" />
    <input ref="imageInputRef" type="file" accept="image/*,.png,.jpg,.jpeg,.gif,.webp" class="hidden" @change="handleFileSelected($event, 'image')" />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { socket } from 'src/boot/socket'
import { useAuthStore } from 'src/stores/auth'
import { useMeetUsStore } from 'src/stores/meetus'
import { useChatStore } from 'src/stores/chat'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const auth = useAuthStore()
const store = useMeetUsStore()
const chatStore = useChatStore()

const searchConv = ref('')
const inputMessage = ref('')
const showInfoDrawer = ref(false)
const loadingConversations = ref(false)
const loadingMessages = ref(false)
const messagesScrollRef = ref(null)

const conversations = ref([])
const selectedConversation = ref(null)
const currentMessages = ref([])
const suggestedStudents = ref([])

// Elementos de Upload e Gravação de Áudio
const pdfInputRef = ref(null)
const videoInputRef = ref(null)
const imageInputRef = ref(null)

const isRecordingAudio = ref(false)
const recordingDuration = ref(0)
const isUploading = ref(false)
const uploadProgressText = ref('')

let mediaRecorder = null
let audioStream = null
let audioChunks = []
let recordingTimerInterval = null
let recordingCancelled = false

const partnerUserId = computed(() => {
  if (!selectedConversation.value) return ''
  const other = selectedConversation.value.other
  if (other) return String(other.id || other._id)
  return String(selectedConversation.value.participantId || '')
})

const filteredConversations = computed(() => {
  if (!searchConv.value.trim()) return conversations.value
  const q = searchConv.value.toLowerCase()
  return conversations.value.filter(c => c.name.toLowerCase().includes(q))
})

function formatTime(isoOrDate) {
  if (!isoOrDate) return ''
  try {
    const d = new Date(isoOrDate)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch (e) {
    return ''
  }
}

function formatAudioDuration(sec) {
  if (!sec || isNaN(sec)) return '00:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function formatFileSize(bytes) {
  if (!bytes || isNaN(bytes)) return ''
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function resolveFileUrl(url) {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url
  }
  if (typeof window !== 'undefined') {
    if (window.location.port && window.location.port !== '3000' && window.location.port !== '80' && window.location.port !== '443') {
      return `${window.location.protocol}//${window.location.hostname}:3000${url}`
    }
    return `${window.location.origin}${url}`
  }
  return `http://localhost:3000${url}`
}

function openExternal(url) {
  if (url) window.open(url, '_blank')
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesScrollRef.value) {
      messagesScrollRef.value.setScrollPercentage('vertical', 1.0)
    }
  })
}

function triggerPdfPicker() {
  pdfInputRef.value?.click()
}

function triggerVideoPicker() {
  videoInputRef.value?.click()
}

function triggerImagePicker() {
  imageInputRef.value?.click()
}

function getSupportedAudioMimeType() {
  if (typeof MediaRecorder === 'undefined') return ''
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4',
    'audio/aac'
  ]
  for (const t of types) {
    if (MediaRecorder.isTypeSupported(t)) return t
  }
  return ''
}

async function startAudioRecording() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    $q.notify({ type: 'negative', message: 'O teu navegador não suporta gravação de áudio.' })
    return
  }

  try {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mimeType = getSupportedAudioMimeType()
    const options = mimeType ? { mimeType } : {}

    mediaRecorder = new MediaRecorder(audioStream, options)
    audioChunks = []
    recordingCancelled = false
    recordingDuration.value = 0
    isRecordingAudio.value = true

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        audioChunks.push(e.data)
      }
    }

    mediaRecorder.onstop = async () => {
      if (recordingCancelled) {
        cleanUpAudioRecording()
        return
      }

      const finalDuration = recordingDuration.value
      cleanUpAudioRecording()

      if (audioChunks.length === 0) return

      const actualMime = mimeType || 'audio/webm'
      const audioBlob = new Blob(audioChunks, { type: actualMime })

      if (audioBlob.size < 400 || finalDuration < 1) {
        $q.notify({ type: 'warning', message: 'Áudio muito curto descartado.' })
        return
      }

      await sendMediaBlob(audioBlob, 'audio', `audio_${Date.now()}.webm`, `🎤 Áudio (${formatAudioDuration(finalDuration)})`)
    }

    mediaRecorder.start(250)

    recordingTimerInterval = setInterval(() => {
      recordingDuration.value++
    }, 1000)
  } catch (err) {
    console.error('Erro ao aceder ao microfone:', err)
    $q.notify({ type: 'negative', message: 'Permissão de microfone negada ou dispositivo indisponível.' })
    cleanUpAudioRecording()
  }
}

function cancelAudioRecording() {
  recordingCancelled = true
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop()
  } else {
    cleanUpAudioRecording()
  }
  $q.notify({ type: 'info', message: 'Gravação cancelada.' })
}

function stopAndSendAudioRecording() {
  recordingCancelled = false
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop()
  }
}

function cleanUpAudioRecording() {
  if (recordingTimerInterval) {
    clearInterval(recordingTimerInterval)
    recordingTimerInterval = null
  }
  if (audioStream) {
    audioStream.getTracks().forEach(t => t.stop())
    audioStream = null
  }
  isRecordingAudio.value = false
  recordingDuration.value = 0
}

async function sendMediaBlob(blob, type, fileName, previewText) {
  if (!selectedConversation.value) return
  const convId = selectedConversation.value.id
  const receiverId = partnerUserId.value

  isUploading.value = true
  uploadProgressText.value = type === 'audio' ? 'A enviar mensagem de áudio...' : (type === 'video' ? 'A carregar e enviar vídeo...' : 'A enviar documento PDF...')

  try {
    const formData = new FormData()
    formData.append('file', blob, fileName)

    const uploadRes = await api.post('/chat/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    const fileUrl = uploadRes.data.url
    const returnedFileName = uploadRes.data.originalName || fileName
    const returnedFileSize = uploadRes.data.size || blob.size
    const msgType = uploadRes.data.type || type

    const optimisticMsg = {
      id: `opt-${Date.now()}`,
      sender: 'me',
      text: previewText || returnedFileName,
      type: msgType,
      fileUrl,
      fileName: returnedFileName,
      fileSize: returnedFileSize,
      time: formatTime(new Date())
    }
    currentMessages.value.push(optimisticMsg)
    scrollToBottom()

    selectedConversation.value.lastMessage = previewText || returnedFileName
    selectedConversation.value.lastMessageAt = optimisticMsg.time

    const res = await api.post('/chat/messages', {
      conversationId: convId,
      type: msgType,
      content: previewText || returnedFileName,
      fileUrl,
      fileName: returnedFileName,
      fileSize: returnedFileSize
    })

    const createdMsg = res.data
    if (socket) {
      socket.emit('chat:send', {
        _id: createdMsg?._id || createdMsg?.id,
        conversationId: convId,
        senderId: auth.userId,
        receiverId,
        type: msgType,
        content: previewText || returnedFileName,
        fileUrl,
        fileName: returnedFileName,
        fileSize: returnedFileSize,
        createdAt: createdMsg?.createdAt || new Date().toISOString()
      })
    }
  } catch (err) {
    console.error('Erro ao enviar ficheiro:', err)
    $q.notify({ type: 'negative', message: 'Falha ao enviar ficheiro multimédia.' })
  } finally {
    isUploading.value = false
    uploadProgressText.value = ''
  }
}

async function handleFileSelected(event, expectedType) {
  const file = event.target?.files?.[0]
  if (!file) return
  event.target.value = ''

  if (file.size > 100 * 1024 * 1024) {
    $q.notify({ type: 'negative', message: 'O ficheiro não pode exceder 100MB.' })
    return
  }

  let previewText = ''
  if (expectedType === 'file') previewText = `📄 ${file.name}`
  else if (expectedType === 'video') previewText = `📹 ${file.name}`
  else if (expectedType === 'image') previewText = `📷 ${file.name}`

  await sendMediaBlob(file, expectedType, file.name, previewText)
}

async function loadConversations(autoSelect = true) {
  if (!auth.userId) return
  loadingConversations.value = true
  try {
    const res = await api.get('/chat/conversations', { params: { userId: auth.userId } })
    const rawList = Array.isArray(res.data) ? res.data : []

    conversations.value = rawList.map(c => {
      const other = c.other || {}
      const name = other.name || 'Colega MEET-US'
      const avatar = other.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=059669&color=fff&size=256`
      return {
        id: String(c.id || c._id),
        other,
        name,
        avatar,
        online: Boolean(other.online),
        lastMessage: c.last_message || 'Inicia uma conversa...',
        lastMessageAt: formatTime(c.last_message_at),
        unreadCount: c.unread || 0
      }
    })

    if (autoSelect && !selectedConversation.value && conversations.value.length > 0 && $q.screen.gt.sm) {
      selectConversation(conversations.value[0])
    }
  } catch (err) {
    console.error('Erro ao carregar conversas do backend:', err)
  } finally {
    loadingConversations.value = false
  }
}

async function selectConversation(conv) {
  selectedConversation.value = conv
  currentMessages.value = []
  loadingMessages.value = true

  if (socket) {
    socket.emit('conversation:join', conv.id)
  }

  try {
    const res = await api.get(`/chat/conversations/${conv.id}/messages`)
    const rawMsgs = Array.isArray(res.data) ? res.data : []

    currentMessages.value = rawMsgs.map(m => ({
      id: String(m._id || m.id),
      sender: String(m.sender_id) === String(auth.userId) ? 'me' : 'other',
      text: m.content || '',
      type: m.type || 'text',
      fileUrl: m.file_url || m.fileUrl || '',
      fileName: m.file_name || m.fileName || '',
      fileSize: m.file_size || m.fileSize || 0,
      time: formatTime(m.createdAt)
    }))

    // Marcar como lido e atualizar o badge vermelho de mensagens
    api.put(`/chat/conversations/${conv.id}/read`).then(() => {
      chatStore.loadConversations()
    }).catch(() => {})
    conv.unreadCount = 0

    scrollToBottom()
  } catch (err) {
    console.error('Erro ao carregar mensagens:', err)
  } finally {
    loadingMessages.value = false
  }
}

async function startChatWith(otherUserId) {
  if (!otherUserId || String(otherUserId) === String(auth.userId)) return
  try {
    const res = await api.post('/chat/conversations', {
      userId: auth.userId,
      otherId: String(otherUserId)
    })
    const convData = res.data

    await loadConversations(false)

    const existing = conversations.value.find(c => String(c.id) === String(convData.id || convData._id))
    if (existing) {
      selectConversation(existing)
    } else {
      let other = convData.other || store.students.find(s => String(s.id) === String(otherUserId))
      if (!other || !other.name) {
        try {
          const uRes = await api.get(`/users/${otherUserId}`)
          if (uRes.data) other = uRes.data
        } catch (_) {}
      }
      other = other || {}
      const newConv = {
        id: String(convData.id || convData._id),
        other,
        name: other.name || 'Colega',
        avatar: other.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(other.name || 'C')}&background=059669&color=fff&size=256`,
        online: Boolean(other.online),
        lastMessage: '',
        lastMessageAt: '',
        unreadCount: 0
      }
      conversations.value.unshift(newConv)
      selectConversation(newConv)
    }
  } catch (err) {
    console.error('Erro ao iniciar conversa com utilizador:', err)
    $q.notify({ type: 'negative', message: 'Não foi possível abrir conversa com este estudante.' })
  }
}

async function handleSend() {
  if (!inputMessage.value.trim() || !selectedConversation.value) return
  const text = inputMessage.value.trim()
  inputMessage.value = ''

  const convId = selectedConversation.value.id
  const receiverId = partnerUserId.value

  const optimisticMsg = {
    id: `opt-${Date.now()}`,
    sender: 'me',
    text,
    type: 'text',
    fileUrl: '',
    fileName: '',
    fileSize: 0,
    time: formatTime(new Date())
  }
  currentMessages.value.push(optimisticMsg)
  scrollToBottom()

  selectedConversation.value.lastMessage = text
  selectedConversation.value.lastMessageAt = optimisticMsg.time

  try {
    const res = await api.post('/chat/messages', {
      conversationId: convId,
      type: 'text',
      content: text
    })

    const createdMsg = res.data
    if (socket) {
      socket.emit('chat:send', {
        _id: createdMsg?._id || createdMsg?.id,
        conversationId: convId,
        senderId: auth.userId,
        receiverId,
        type: 'text',
        content: text,
        createdAt: createdMsg?.createdAt || new Date().toISOString()
      })
    }
  } catch (err) {
    console.error('Erro ao enviar mensagem:', err)
    $q.notify({ type: 'negative', message: 'Falha ao enviar mensagem.' })
  }
}

function handleIncomingMessage(msg) {
  if (!msg) return
  const convId = String(msg.conversation_id)

  if (selectedConversation.value && String(selectedConversation.value.id) === convId) {
    if (String(msg.sender_id) !== String(auth.userId)) {
      currentMessages.value.push({
        id: String(msg._id || msg.id),
        sender: 'other',
        text: msg.content || '',
        type: msg.type || 'text',
        fileUrl: msg.file_url || msg.fileUrl || '',
        fileName: msg.file_name || msg.fileName || '',
        fileSize: msg.file_size || msg.fileSize || 0,
        time: formatTime(msg.createdAt || Date.now())
      })
      scrollToBottom()
      api.put(`/chat/conversations/${convId}/read`).then(() => {
        chatStore.loadConversations()
      }).catch(() => {})
    }
  }

  // Atualizar a conversa na lista
  const targetConv = conversations.value.find(c => String(c.id) === convId)
  if (targetConv) {
    targetConv.lastMessage = msg.content || ''
    targetConv.lastMessageAt = formatTime(msg.createdAt || Date.now())
    if (!selectedConversation.value || String(selectedConversation.value.id) !== convId) {
      targetConv.unreadCount = (targetConv.unreadCount || 0) + 1
    }
  } else {
    loadConversations(false)
  }
}

onMounted(async () => {
  if (socket) {
    socket.on('chat:new', handleIncomingMessage)
    if (auth.userId) socket.emit('user:join', auth.userId)
  }

  // Carregar lista de colegas sugeridos para criar conversas imediatas
  suggestedStudents.value = store.students.filter(s => String(s.id) !== String(auth.userId))

  await loadConversations(false)

  // Se veio com parâmetro de rota :userId (/chat/:userId)
  const targetUserIdFromRoute = route.params.userId || route.query.userId
  if (targetUserIdFromRoute) {
    await startChatWith(targetUserIdFromRoute)
  } else if (conversations.value.length > 0 && $q.screen.gt.sm) {
    selectConversation(conversations.value[0])
  }
})

// Observar mudança de rota caso navegue entre diferentes utilizadores
watch(() => route.params.userId, (newUserId) => {
  if (newUserId) {
    startChatWith(newUserId)
  }
})

onUnmounted(() => {
  cleanUpAudioRecording()
  if (socket) {
    socket.off('chat:new', handleIncomingMessage)
  }
})
</script>

<style scoped>
.chat-main-card {
  height: calc(100vh - 180px);
  min-height: 480px;
}
.chat-bubble {
  max-width: 75%;
}
@media (max-width: 768px) {
  .chat-main-card {
    height: calc(100vh - 130px);
    min-height: 420px;
  }
  .chat-bubble {
    max-width: 90%;
  }
}
.border-right {
  border-right: 1px solid #EAE8FF;
}
.border-bottom {
  border-bottom: 1px solid #EAE8FF;
}
.border-top {
  border-top: 1px solid #EAE8FF;
}
.border-left {
  border-left: 1px solid #EAE8FF;
}

/* Áudio Estilo WhatsApp */
.recording-pulse {
  display: inline-block;
  color: #ef4444;
  font-size: 16px;
  animation: pulse-dot 1s infinite alternate;
}
@keyframes pulse-dot {
  0% { transform: scale(0.85); opacity: 0.5; }
  100% { transform: scale(1.3); opacity: 1; }
}

.wave-bar {
  width: 3px;
  height: 18px;
  background-color: #10b981;
  border-radius: 3px;
  animation: wave-anim 1s ease-in-out infinite alternate;
}
.wb-1 { animation-delay: 0.1s; height: 10px; }
.wb-2 { animation-delay: 0.3s; height: 18px; }
.wb-3 { animation-delay: 0.5s; height: 14px; }
.wb-4 { animation-delay: 0.2s; height: 22px; }
.wb-5 { animation-delay: 0.4s; height: 16px; }
.wb-6 { animation-delay: 0.6s; height: 20px; }
.wb-7 { animation-delay: 0.15s; height: 12px; }

@keyframes wave-anim {
  0% { transform: scaleY(0.4); }
  100% { transform: scaleY(1.3); }
}

.custom-audio-player {
  height: 38px;
  border-radius: 20px;
  outline: none;
  width: 100%;
  max-width: 260px;
}
.custom-video-player {
  width: 100%;
  max-width: 320px;
  max-height: 240px;
  border-radius: 12px;
  background: #000;
  display: block;
}
.custom-image-player {
  max-width: 100%;
  max-height: 240px;
  border-radius: 10px;
  object-fit: cover;
}
.file-bubble-card {
  transition: opacity 0.2s;
}
.file-bubble-card:hover {
  opacity: 0.92;
}
.hidden {
  display: none !important;
}
</style>
