<template>
  <q-page class="column text-white live-room-container" style="height: calc(100vh - 50px); overflow: hidden; background-color: #0F172A;">
    <!-- ========================================== -->
    <!-- ESTADO 1: SALA DE ESPERA (WAITING ROOM)    -->
    <!-- ========================================== -->
    <div
      v-if="sessionState === 'WAITING' || (sessionState === 'SCHEDULED' && !isHost)"
      class="col column items-center justify-center q-pa-lg text-center relative-position"
      style="background: radial-gradient(circle at center, #1E293B 0%, #0F172A 100%);"
    >
      <!-- Radar Pulsante de Espera -->
      <div class="relative-position q-mb-lg flex flex-center">
        <div class="radar-pulse"></div>
        <q-avatar size="110px" class="shadow-5" style="border: 3px solid #0B825B; z-index: 2;">
          <img :src="session?.host_avatar || 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&fit=crop'" />
        </q-avatar>
        <q-badge color="primary" floating rounded class="q-pa-xs shadow-2" style="z-index: 3;">
          <q-icon name="hourglass_empty" color="white" size="18px" />
        </q-badge>
      </div>

      <div class="text-h4 text-weight-bolder text-white q-mb-xs">
        {{ session?.title || 'Inglês com Lúcia' }}
      </div>
      <div class="text-subtitle1 text-emerald-400 text-weight-medium q-mb-md">
        Mentora: {{ session?.host_name || 'Lúcia Nhaca' }} • {{ session?.subject || 'Ensino Superior' }}
      </div>

      <q-card flat class="q-pa-md q-mb-lg text-left" style="max-width: 540px; background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px;">
        <div class="row items-center text-weight-bold text-amber-4 text-subtitle2 q-mb-xs">
          <q-icon name="schedule" size="18px" class="q-mr-xs" />
          A aula ainda não começou
        </div>
        <div class="text-caption text-grey-4">
          A mentora está a preparar os materiais da transmissão. Assim que a aula for iniciada, entrarás automaticamente na sala com vídeo e áudio!
        </div>

        <div class="q-mt-md row items-center justify-between text-caption text-grey-4 border-top-dim q-pt-sm">
          <span>Estudantes a aguardar na fila:</span>
          <span class="text-weight-bold text-emerald-400">{{ queueCount }} colegas online</span>
        </div>
      </q-card>

      <!-- Controlos de Pré-Visualização (Microfone e Câmara) -->
      <div class="row q-gutter-md items-center justify-center q-mb-lg">
        <q-btn
          round
          :color="micEnabled ? 'primary' : 'negative'"
          :icon="micEnabled ? 'mic' : 'mic_off'"
          size="lg"
          @click="toggleMic"
        >
          <q-tooltip>{{ micEnabled ? 'Microfone Ativo' : 'Microfone Silenciado' }}</q-tooltip>
        </q-btn>

        <q-btn
          round
          :color="cameraEnabled ? 'primary' : 'negative'"
          :icon="cameraEnabled ? 'videocam' : 'videocam_off'"
          size="lg"
          @click="toggleCamera"
        >
          <q-tooltip>{{ cameraEnabled ? 'Câmara Ativa' : 'Câmara Desligada' }}</q-tooltip>
        </q-btn>
      </div>

      <!-- Botão para o mentor iniciar a Live -->
      <div v-if="isHost" class="q-mt-sm">
        <q-btn
          unelevated
          rounded
          color="positive"
          size="lg"
          icon="sensors"
          label="Iniciar Transmissão Agora"
          class="text-weight-bold shadow-4"
          :loading="isStartingLive"
          @click="handleMentorStartLive"
        />
        <div class="text-caption text-grey-5 q-mt-xs">Como mentora da aula, clica acima para abrir a transmissão para todos os inscritos.</div>
      </div>

      <!-- Se for estudante, pode aguardar ou testar transmissão como mentor -->
      <div v-else class="column items-center q-gutter-sm">
        <q-btn
          outline
          rounded
          color="grey-4"
          icon="hourglass_empty"
          label="Aguardar início da aula"
          disable
          class="text-weight-bold"
        />

        <q-btn
          unelevated
          rounded
          color="positive"
          size="sm"
          icon="sensors"
          label="Iniciar Aula (Modo Mentor / Testes)"
          class="text-weight-bold q-mt-xs shadow-2"
          :loading="isStartingLive"
          @click="handleMentorStartLive"
        >
          <q-tooltip>Iniciar transmissão agora para testar o sistema</q-tooltip>
        </q-btn>

        <q-btn
          flat
          rounded
          color="grey-4"
          icon="arrow_back"
          label="Voltar ao Calendário"
          :to="{ name: 'calendar' }"
        />
      </div>
    </div>

    <!-- ========================================== -->
    <!-- ESTADO 2: AULA EM DIRECTO (LIVE SESSION)   -->
    <!-- ========================================== -->
    <div v-else-if="sessionState === 'LIVE' || (sessionState === 'SCHEDULED' && isHost)" class="col column no-wrap full-height overflow-hidden">
      <!-- Barra Superior da Live -->
      <div class="row items-center q-px-md q-py-sm shadow-2 live-header" style="background: #0B1120; border-bottom: 1px solid rgba(255, 255, 255, 0.08); z-index: 10;">
        <q-btn flat round dense icon="arrow_back" color="grey-4" @click="confirmLeaveSession" />

        <div class="q-ml-sm">
          <div class="row items-center q-gutter-xs">
            <span class="text-subtitle1 text-weight-bold text-white">{{ session?.title || 'Inglês com Lúcia' }}</span>
            <q-badge color="negative" class="q-px-xs text-weight-bold live-badge">
              <span class="blink-dot q-mr-xs">●</span> AO VIVO
            </q-badge>
          </div>
          <div class="text-caption text-grey-4">
            Mentora: {{ session?.host_name || 'Lúcia Nhaca' }} • {{ durationFormatted }}
          </div>
        </div>

        <q-space />

        <!-- Contador Dinâmico de Participantes -->
        <q-btn
          flat
          dense
          rounded
          class="q-px-sm q-py-xs bg-dark-glass text-white"
          @click="activeDrawer = activeDrawer === 'participants' ? null : 'participants'"
        >
          <q-icon name="groups" color="positive" size="18px" class="q-mr-xs" />
          <span class="text-weight-bold text-caption">{{ participantsList.length }} na sala</span>
        </q-btn>

        <!-- Botão Abrir Chat -->
        <q-btn
          flat
          round
          dense
          icon="chat"
          color="grey-4"
          class="q-ml-xs"
          @click="activeDrawer = activeDrawer === 'chat' ? null : 'chat'"
        >
          <q-badge v-if="unreadChatCount > 0" color="primary" floating rounded>{{ unreadChatCount }}</q-badge>
        </q-btn>
      </div>

      <!-- Palco Principal de Vídeo e Painel Lateral -->
      <div class="col row no-wrap relative-position full-width" style="overflow: hidden;">
        <!-- Palco de Vídeo -->
        <div class="col column items-center justify-center relative-position bg-black full-height overflow-hidden">
          <div class="full-width full-height relative-position flex flex-center bg-grey-10">
            <!-- 1. Se for Host e tiver stream da câmara física ativa -->
            <video
              v-if="isHost && hostStreamActive"
              ref="hostVideoEl"
              autoplay
              playsinline
              webkit-playsinline
              muted
              class="main-live-video"
            />

            <!-- 2. Se for Estudante e o Mentor estiver a transmitir vídeo via WebRTC -->
            <video
              v-else-if="!isHost && remoteHostStreamActive"
              ref="remoteVideoEl"
              autoplay
              playsinline
              webkit-playsinline
              class="main-live-video"
            />

            <!-- 3. Palco Digital Dinâmico (Canvas 60fps de alta fidelidade para Estudantes e Fallback) -->
            <div v-else class="full-width full-height relative-position flex flex-center stage-canvas-container">
              <canvas ref="stageCanvasEl" class="stage-canvas full-width full-height"></canvas>

              <!-- Informações Centrais do Mentor no Palco -->
              <div class="stage-overlay-center column items-center text-center q-pa-md pointer-events-none">
                <div class="relative-position q-mb-md">
                  <q-avatar size="130px" class="shadow-5 avatar-live-halo">
                    <img :src="session?.host_avatar || 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&fit=crop'" />
                  </q-avatar>
                  <q-badge color="positive" floating rounded class="q-pa-xs shadow-2">
                    <q-icon name="mic" color="white" size="16px" />
                  </q-badge>
                </div>

                <div class="text-h5 text-weight-bolder text-white">{{ session?.host_name || 'Lúcia Nhaca' }}</div>
                <div class="text-subtitle2 text-emerald-400 q-mt-xs text-weight-bold">
                  {{ session?.title || 'Inglês com Lúcia' }}
                </div>
                <div class="text-caption text-grey-4 q-mt-xs">
                  Transmissão em Directo de Alta Fidelidade • Baixo Consumo de Dados
                </div>
              </div>

              <!-- Botão de Desbloquear Áudio em Mobile (se autoplay foi bloqueado pelo browser) -->
              <div v-if="audioBlocked && !isHost" class="absolute-bottom q-mb-xl q-pb-lg row justify-center z-top">
                <q-btn
                  unelevated
                  rounded
                  color="positive"
                  icon="volume_up"
                  label="Toque para Ativar Áudio da Aula"
                  class="text-weight-bolder shadow-5 animate-bounce q-px-lg q-py-sm"
                  @click="unlockAudio"
                />
              </div>
            </div>

            <!-- Overlay de Transmissão Ativa no Canto Superior Esquerdo -->
            <div class="absolute-top-left q-ma-md row items-center q-gutter-xs pointer-events-none" style="z-index: 5;">
              <q-chip dense color="black" text-color="white" style="opacity: 0.85;">
                <q-icon name="sensors" color="negative" size="14px" class="q-mr-xs" />
                HD 720p • Directo WebRTC
              </q-chip>
            </div>

            <!-- Picture-in-Picture Local (Câmara do Estudante se ativada) -->
            <div
              v-if="cameraEnabled && !isHost"
              class="absolute-bottom-right q-ma-md local-pip-box shadow-4 rounded-borders overflow-hidden"
            >
              <video
                ref="localPipVideoEl"
                autoplay
                playsinline
                webkit-playsinline
                muted
                class="full-width full-height object-cover"
              />
              <div class="absolute-bottom-left q-px-xs text-caption bg-black-dim" style="font-size: 10px;">Você</div>
            </div>

            <!-- Notificação Toast de Mão Levantada no Topo -->
            <transition name="fade">
              <div v-if="lastHandRaisedNotification" class="absolute-top q-mt-md hand-raised-toast shadow-3">
                <q-icon name="pan_tool" color="amber-4" size="18px" class="q-mr-xs" />
                <span><b>{{ lastHandRaisedNotification }}</b> levantou a mão para falar!</span>
              </div>
            </transition>
          </div>
        </div>

        <!-- GAVETA LATERAL RETRÁTIL: PARTICIPANTES OU CHAT -->
        <transition name="slide-left">
          <div
            v-if="activeDrawer"
            class="side-panel column shadow-4"
            style="width: 320px; background: #1E293B; border-left: 1px solid rgba(255, 255, 255, 0.08);"
          >
            <!-- Abas do Painel Lateral -->
            <div class="row items-center justify-between q-pa-sm bg-slate-900 border-bottom-dim">
              <q-tabs
                v-model="activeDrawer"
                dense
                class="text-grey-4"
                active-color="primary"
                indicator-color="primary"
                align="left"
              >
                <q-tab name="participants" icon="groups" :label="`Participantes (${participantsList.length})`" />
                <q-tab name="chat" icon="chat" label="Chat da Aula" />
              </q-tabs>
              <q-btn flat round dense icon="close" size="sm" color="grey-4" @click="activeDrawer = null" />
            </div>

            <!-- ABA DE PARTICIPANTES -->
            <div v-if="activeDrawer === 'participants'" class="col column overflow-hidden">
              <div class="q-pa-sm text-caption text-grey-4 bg-slate-800">
                Lista de participantes presentes em direto na transmissão.
              </div>

              <q-scroll-area class="col q-pa-sm">
                <q-list separator>
                  <!-- Mentora / Host -->
                  <q-item class="rounded-borders q-my-xs bg-slate-800">
                    <q-item-section avatar>
                      <q-avatar size="36px">
                        <img :src="session?.host_avatar || 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&fit=crop'" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-bold text-white text-caption">
                        {{ session?.host_name || 'Lúcia Nhaca' }}
                        <q-badge color="primary" class="q-ml-xs" style="font-size: 9px;">MENTORA</q-badge>
                      </q-item-label>
                      <q-item-label caption class="text-grey-4">Transmissão Principal</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="mic" color="positive" size="18px" />
                    </q-item-section>
                  </q-item>

                  <!-- Outros Participantes / Estudantes -->
                  <q-item
                    v-for="p in participantsList"
                    :key="p.userId || p.user_id"
                    class="rounded-borders q-my-xs"
                    :class="{ 'bg-slate-700': isCurrentUser(p) }"
                  >
                    <q-item-section avatar>
                      <q-avatar size="32px">
                        <img :src="p.avatar || p.user_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || p.user_name || 'E')}&background=059669&color=fff`" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-medium text-white text-caption">
                        {{ p.name || p.user_name }}
                        <span v-if="isCurrentUser(p)" class="text-emerald-400 font-bold"> (Você)</span>
                      </q-item-label>
                      <q-item-label caption class="text-grey-4">{{ p.course || p.user_course || 'Estudante' }}</q-item-label>
                    </q-item-section>
                    <q-item-section side class="row items-center no-wrap q-gutter-xs">
                      <!-- Indicador de Mão Levantada -->
                      <q-icon
                        v-if="p.handRaised || store.handRaisedUsers.has(String(p.userId || p.user_id))"
                        name="pan_tool"
                        color="amber-4"
                        size="18px"
                      >
                        <q-tooltip>Mão levantada para falar</q-tooltip>
                      </q-icon>

                      <!-- Controlos Exclusivos do Mentor (Remover Participante) -->
                      <q-btn
                        v-if="isHost && !isCurrentUser(p)"
                        flat
                        round
                        dense
                        color="negative"
                        icon="person_remove"
                        size="sm"
                        @click="handleKickParticipant(p)"
                      >
                        <q-tooltip>Remover estudante da aula</q-tooltip>
                      </q-btn>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-scroll-area>
            </div>

            <!-- ABA DE CHAT DA AULA -->
            <div v-if="activeDrawer === 'chat'" class="col column overflow-hidden">
              <q-scroll-area ref="chatScrollEl" class="col q-pa-sm">
                <div v-for="(msg, mIdx) in store.roomMessages" :key="mIdx" class="q-mb-sm">
                  <div class="row items-center q-gutter-xs">
                    <span class="text-weight-bold text-caption text-emerald-400">{{ msg.sender_name }}:</span>
                    <span class="text-grey-5 text-caption" style="font-size: 10px;">{{ msg.time }}</span>
                  </div>
                  <div class="text-caption text-grey-2 bg-slate-800 q-pa-xs rounded-borders q-mt-xs" style="word-break: break-word;">
                    {{ msg.text }}
                  </div>
                </div>
              </q-scroll-area>

              <!-- Caixa de Envio de Mensagem -->
              <div class="q-pa-sm bg-slate-900 row items-center q-gutter-xs border-top-dim">
                <q-input
                  v-model="newChatMessage"
                  placeholder="Escreve uma pergunta ou comentário..."
                  outlined
                  dense
                  dark
                  color="primary"
                  class="col text-caption"
                  @keyup.enter="handleSendChat"
                />
                <q-btn flat round dense icon="send" color="primary" @click="handleSendChat" />
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Barra Inferior de Controlos em Directo -->
      <div class="row items-center justify-center q-pa-sm q-gutter-sm live-footer" style="background: #0B1120; border-top: 1px solid rgba(255, 255, 255, 0.08); z-index: 10;">
        <!-- Microfone -->
        <q-btn
          round
          :color="micEnabled ? 'white' : 'negative'"
          :text-color="micEnabled ? 'dark' : 'white'"
          :icon="micEnabled ? 'mic' : 'mic_off'"
          size="md"
          @click="toggleMic"
        >
          <q-tooltip>{{ micEnabled ? 'Silenciar Microfone' : 'Ativar Microfone' }}</q-tooltip>
        </q-btn>

        <!-- Câmara -->
        <q-btn
          round
          :color="cameraEnabled ? 'white' : 'negative'"
          :text-color="cameraEnabled ? 'dark' : 'white'"
          :icon="cameraEnabled ? 'videocam' : 'videocam_off'"
          size="md"
          @click="toggleCamera"
        >
          <q-tooltip>{{ cameraEnabled ? 'Desligar Câmara' : 'Ligar Câmara' }}</q-tooltip>
        </q-btn>

        <!-- Partilha de Ecrã (Principalmente para o Mentor) -->
        <q-btn
          round
          :color="screenSharing ? 'positive' : 'white'"
          :text-color="screenSharing ? 'white' : 'dark'"
          icon="screen_share"
          size="md"
          @click="toggleScreenShare"
        >
          <q-tooltip>{{ screenSharing ? 'Parar Partilha' : 'Partilhar Ecrã / Apresentação' }}</q-tooltip>
        </q-btn>

        <!-- Levantar a Mão (Para Estudantes) -->
        <q-btn
          v-if="!isHost"
          round
          :color="handRaised ? 'amber-8' : 'white'"
          :text-color="handRaised ? 'white' : 'dark'"
          icon="pan_tool"
          size="md"
          @click="toggleRaiseHand"
        >
          <q-tooltip>{{ handRaised ? 'Baixar a mão' : 'Levantar a mão para intervir' }}</q-tooltip>
        </q-btn>

        <!-- Alternar Gaveta de Participantes -->
        <q-btn
          round
          :color="activeDrawer === 'participants' ? 'primary' : 'white'"
          :text-color="activeDrawer === 'participants' ? 'white' : 'dark'"
          icon="groups"
          size="md"
          @click="activeDrawer = activeDrawer === 'participants' ? null : 'participants'"
        >
          <q-tooltip>Ver Participantes</q-tooltip>
        </q-btn>

        <!-- Alternar Gaveta de Chat -->
        <q-btn
          round
          :color="activeDrawer === 'chat' ? 'primary' : 'white'"
          :text-color="activeDrawer === 'chat' ? 'white' : 'dark'"
          icon="chat"
          size="md"
          @click="activeDrawer = activeDrawer === 'chat' ? null : 'chat'"
        >
          <q-tooltip>Abrir Chat</q-tooltip>
        </q-btn>

        <q-separator vertical dark class="q-mx-sm" />

        <!-- BOTÃO PARA O MENTOR: TERMINAR AULA -->
        <q-btn
          v-if="isHost"
          unelevated
          rounded
          color="negative"
          icon="stop_circle"
          label="Terminar Aula"
          class="text-weight-bold shadow-2 q-px-md"
          @click="handleMentorEndLive"
        />

        <!-- BOTÃO PARA O ESTUDANTE: SAIR DA AULA -->
        <q-btn
          v-else
          unelevated
          rounded
          color="grey-8"
          icon="logout"
          label="Sair da Aula"
          class="text-weight-bold q-px-md"
          @click="confirmLeaveSession"
        />
      </div>
    </div>

    <!-- ========================================== -->
    <!-- ESTADO 3: AULA TERMINADA (ENDED SESSION)   -->
    <!-- ========================================== -->
    <div
      v-else-if="sessionState === 'ENDED'"
      class="col column items-center justify-center q-pa-lg text-center"
      style="background: radial-gradient(circle at center, #1E293B 0%, #0F172A 100%);"
    >
      <q-avatar size="90px" color="positive" text-color="white" class="shadow-4 q-mb-md">
        <q-icon name="check_circle" size="56px" />
      </q-avatar>

      <div class="text-h4 text-weight-bolder text-white q-mb-xs">
        Aula Concluída com Sucesso!
      </div>
      <div class="text-subtitle1 text-grey-4 q-mb-lg">
        A transmissão de «{{ session?.title || 'Inglês com Lúcia' }}» foi encerrada pela mentora.
      </div>

      <q-card flat class="q-pa-lg q-mb-lg text-left" style="max-width: 480px; width: 100%; background: #1E293B; border-radius: 18px; border: 1px solid rgba(255, 255, 255, 0.1);">
        <div class="text-subtitle2 text-weight-bold text-white q-mb-md">Resumo da Participação</div>

        <div class="row justify-between text-caption q-my-xs">
          <span class="text-grey-4">Mentora:</span>
          <span class="text-weight-bold text-white">{{ session?.host_name || 'Lúcia Nhaca' }}</span>
        </div>
        <div class="row justify-between text-caption q-my-xs">
          <span class="text-grey-4">Duração da Aula:</span>
          <span class="text-weight-bold text-emerald-400">{{ durationFormatted || '45 minutos' }}</span>
        </div>
        <div class="row justify-between text-caption q-my-xs">
          <span class="text-grey-4">Pontos de Estudo Ganhos:</span>
          <span class="text-weight-bold text-amber-4">+50 Pontos de Mérito</span>
        </div>

        <q-separator dark class="q-my-md" />

        <div class="text-caption text-grey-4 q-mb-sm text-center">Avalia a mentoria da aula:</div>
        <div class="row justify-center q-mb-md">
          <q-rating v-model="sessionRating" size="2em" :max="5" color="amber-4" icon="star_border" icon-selected="star" />
        </div>

        <q-btn
          unelevated
          rounded
          color="primary"
          label="Submeter Avaliação e Concluir"
          class="full-width text-weight-bold"
          @click="submitRatingAndBack"
        />
      </q-card>

      <q-btn
        flat
        rounded
        color="grey-4"
        icon="event"
        label="Voltar para a Lista de Aulas"
        :to="{ name: 'calendar' }"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useSessionsStore } from 'src/stores/sessions';
import { useAuthStore } from 'src/stores/auth';
import { socket } from 'src/boot/socket';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const store = useSessionsStore();
const auth = useAuthStore();

const sessionId = computed(() => route.params.id);

const session = computed(() => store.currentSession);
const sessionState = computed(() => session.value?.status || 'SCHEDULED');

const hostVideoEl = ref(null);
const localPipVideoEl = ref(null);
const stageCanvasEl = ref(null);
const remoteVideoEl = ref(null);
const remoteHostStream = ref(null);
const remoteHostStreamActive = ref(false);
const peerConnections = new Map();
let studentPeerConnection = null;

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun.cloudflare.com:3478' }
];

const activeDrawer = ref(null); // 'participants' | 'chat' | null
const micEnabled = ref(true);
const cameraEnabled = ref(false);
const screenSharing = ref(false);
const handRaised = ref(false);
const isStartingLive = ref(false);
const hostStreamActive = ref(false);
const audioBlocked = ref(false);

const newChatMessage = ref('');
const unreadChatCount = ref(0);
const sessionRating = ref(5);
const queueCount = ref(4);

const lastHandRaisedNotification = ref(null);
let handNotificationTimer = null;

const durationSeconds = ref(0);
let durationInterval = null;
let animFrameId = null;

let hostMediaStream = null;
let studentLocalStream = null;

// Verifica se o utilizador logado é o mentor da aula
const isHost = computed(() => {
  const currentUserId = auth.user?.id || auth.user?._id;
  if (!currentUserId || !session.value) return false;
  return String(session.value.host_id) === String(currentUserId) ||
    session.value.host_name?.toLowerCase().includes(auth.user?.name?.toLowerCase() || '---');
});

const isCurrentUser = (p) => {
  const cId = auth.user?.id || auth.user?._id;
  return String(p.userId || p.user_id) === String(cId);
};

const participantsList = computed(() => {
  if (store.roomParticipants && store.roomParticipants.length > 0) {
    return store.roomParticipants;
  }
  return session.value?.participants || [];
});

const durationFormatted = computed(() => {
  const m = Math.floor(durationSeconds.value / 60);
  const s = durationSeconds.value % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
});

// Observar mudança de estado para LIVE ou ENDED
watch(sessionState, (newStatus, oldStatus) => {
  if (newStatus === 'LIVE' && oldStatus !== 'LIVE') {
    $q.notify({
      type: 'positive',
      icon: 'sensors',
      message: 'A transmissão foi iniciada pela mentora! A entrar no palco da aula...'
    });
    nextTick(() => {
      initStage();
    });
  } else if (newStatus === 'ENDED') {
    $q.notify({
      type: 'info',
      icon: 'done_all',
      message: 'A aula foi encerrada pela mentora.'
    });
    stopMediaStreams();
  }
});

onMounted(async () => {
  try {
    await store.fetchSessionById(sessionId.value);
  } catch (err) {
    console.warn('Erro ao carregar sessão:', err.message);
  }

  // Registar entrada na sala no backend e WebSockets
  store.joinRoom(sessionId.value, auth.user, isHost.value);

  // Inicializar temporizador
  durationInterval = setInterval(() => {
    durationSeconds.value++;
  }, 1000);

  // Se já estiver LIVE ou for o Host a preparar, montar o palco
  if (sessionState.value === 'LIVE' || isHost.value) {
    nextTick(() => {
      initStage();
    });
  }

  // Escutar eventos específicos da sala via Socket
  if (socket) {
    socket.on('session:live_started', (payload) => {
      if (String(payload?.sessionId) === String(sessionId.value)) {
        if (store.currentSession) store.currentSession.status = 'LIVE';
      }
    });

    socket.on('session:kicked', (payload) => {
      if (String(payload?.sessionId) === String(sessionId.value)) {
        $q.notify({ type: 'negative', icon: 'gavel', message: payload.message || 'Foste removido da sala pelo mentor.' });
        router.push({ name: 'calendar' });
      }
    });

    socket.on('session:hand_updated', (payload) => {
      if (payload?.handRaised && payload.userId !== auth.user?.id) {
        lastHandRaisedNotification.value = payload.userName || 'Um estudante';
        clearTimeout(handNotificationTimer);
        handNotificationTimer = setTimeout(() => {
          lastHandRaisedNotification.value = null;
        }, 5000);
      }
    });

    socket.on('session:webrtc_signal', (payload) => {
      handleStudentWebRtcSignal(payload);
    });

    socket.on('session:participant_joined', (payload) => {
      if (isHost.value && hostMediaStream && payload.participant?.socketId && payload.participant.socketId !== socket.id) {
        createPeerConnectionForParticipant(payload.participant.socketId);
      }
    });
  }
});

onUnmounted(() => {
  store.leaveRoom(sessionId.value, auth.user?.id);
  clearInterval(durationInterval);
  clearTimeout(handNotificationTimer);
  stopMediaStreams();
});

// Mentor cria ligação WebRTC direta com cada estudante na sala
async function createPeerConnectionForParticipant(targetSocketId) {
  if (!hostMediaStream || !targetSocketId) return;
  if (peerConnections.has(targetSocketId)) {
    try { peerConnections.get(targetSocketId).close(); } catch (e) {}
  }

  const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
  peerConnections.set(targetSocketId, pc);

  hostMediaStream.getTracks().forEach(track => {
    pc.addTrack(track, hostMediaStream);
  });

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('session:webrtc_signal', {
        sessionId: sessionId.value,
        targetSocketId,
        senderId: auth.user?.id,
        signal: { type: 'candidate', candidate: event.candidate }
      });
    }
  };

  try {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit('session:webrtc_signal', {
      sessionId: sessionId.value,
      targetSocketId,
      senderId: auth.user?.id,
      signal: { type: 'offer', sdp: pc.localDescription }
    });
  } catch (err) {
    console.warn('[WebRTC Live] Erro ao criar oferta:', err);
  }
}

// Estudante processa sinal de vídeo e áudio em directo vindo do Mentor
async function handleStudentWebRtcSignal(payload) {
  const { senderSocketId, signal } = payload || {};
  if (!signal) return;

  if (signal.type === 'offer') {
    if (studentPeerConnection) {
      try { studentPeerConnection.close(); } catch (e) {}
    }
    studentPeerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    studentPeerConnection.ontrack = (event) => {
      console.log('[WebRTC Live] Transmissão em directo da mentora recebida com sucesso!');
      remoteHostStream.value = event.streams[0];
      remoteHostStreamActive.value = true;
      nextTick(() => {
        if (remoteVideoEl.value) {
          remoteVideoEl.value.srcObject = event.streams[0];
          remoteVideoEl.value.play().catch(e => {
            console.warn('[WebRTC Live] Autoplay de áudio bloqueado pelo browser:', e);
            audioBlocked.value = true;
          });
        }
      });
    };

    studentPeerConnection.onicecandidate = (event) => {
      if (event.candidate && senderSocketId) {
        socket.emit('session:webrtc_signal', {
          sessionId: sessionId.value,
          targetSocketId: senderSocketId,
          senderId: auth.user?.id,
          signal: { type: 'candidate', candidate: event.candidate }
        });
      }
    };

    try {
      await studentPeerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      const answer = await studentPeerConnection.createAnswer();
      await studentPeerConnection.setLocalDescription(answer);
      socket.emit('session:webrtc_signal', {
        sessionId: sessionId.value,
        targetSocketId: senderSocketId,
        senderId: auth.user?.id,
        signal: { type: 'answer', sdp: studentPeerConnection.localDescription }
      });
    } catch (err) {
      console.warn('[WebRTC Live] Erro ao responder oferta:', err);
    }
  } else if (signal.type === 'answer' && isHost.value) {
    const pc = peerConnections.get(senderSocketId);
    if (pc && pc.signalingState !== 'closed') {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      } catch (err) {
        console.warn('[WebRTC Live] Erro ao aplicar answer:', err);
      }
    }
  } else if (signal.type === 'candidate') {
    const pc = isHost.value ? peerConnections.get(senderSocketId) : studentPeerConnection;
    if (pc && pc.remoteDescription && signal.candidate) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
      } catch (err) {
        console.warn('[WebRTC Live] Erro ao adicionar candidato ICE:', err);
      }
    }
  } else if (signal.type === 'host_stopped') {
    remoteHostStreamActive.value = false;
    remoteHostStream.value = null;
  }
}

// Inicialização segura do Palco (Diferenciando Mentor vs Estudante)
function initStage() {
  if (isHost.value) {
    // Mentor: tenta aceder à câmara física para transmissão
    initHostCamera();
  } else {
    // Estudante: renderiza imediatamente o palco animado da aula
    startStageCanvas();
  }
}

async function initHostCamera() {
  try {
    if (navigator.mediaDevices?.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      hostMediaStream = stream;
      hostStreamActive.value = true;
      nextTick(() => {
        if (hostVideoEl.value) {
          hostVideoEl.value.srcObject = stream;
        }
      });

      // Se já houver participantes na sala, conectar imediatamente via WebRTC
      if (store.roomParticipants) {
        store.roomParticipants.forEach(p => {
          if (p.socketId && p.socketId !== socket.id) {
            createPeerConnectionForParticipant(p.socketId);
          }
        });
      }
      return;
    }
  } catch (err) {
    console.warn('Câmara física do host indisponível, usando palco digital:', err.message);
  }
  // Se falhar a câmara física do host, usa o palco digital
  hostStreamActive.value = false;
  startStageCanvas();
}

// Canvas animado interativo a 60fps (compatível com 100% dos telemóveis e desktops)
function startStageCanvas() {
  nextTick(() => {
    const canvas = stageCanvasEl.value;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.clientWidth || 1280);
    let height = (canvas.height = canvas.clientHeight || 720);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.clientWidth || 1280;
      height = canvas.height = canvas.clientHeight || 720;
    };
    window.addEventListener('resize', handleResize);

    let tick = 0;
    const waveCount = 36;

    function draw() {
      tick += 0.04;
      ctx.clearRect(0, 0, width, height);

      // Fundo Gradiente Escuro Slate
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#0B1120');
      bgGrad.addColorStop(0.5, '#0F172A');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Grelha geométrica subtil
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Onda de Frequência Sonora da Aula (Verde Esmeralda e Cyan)
      const baseWaveY = height - 90;
      const step = width / waveCount;

      ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let i = 0; i <= waveCount; i++) {
        const x = i * step;
        const waveH = Math.sin(tick + i * 0.4) * 22 + Math.cos(tick * 0.8 + i * 0.3) * 16;
        ctx.lineTo(x, baseWaveY + waveH);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // Linha de onda superior nítida
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i <= waveCount; i++) {
        const x = i * step;
        const waveH = Math.sin(tick + i * 0.4) * 22 + Math.cos(tick * 0.8 + i * 0.3) * 16;
        if (i === 0) ctx.moveTo(x, baseWaveY + waveH);
        else ctx.lineTo(x, baseWaveY + waveH);
      }
      ctx.stroke();

      animFrameId = requestAnimationFrame(draw);
    }

    if (animFrameId) cancelAnimationFrame(animFrameId);
    draw();
  });
}

function unlockAudio() {
  audioBlocked.value = false;
  if (remoteVideoEl.value) {
    remoteVideoEl.value.muted = false;
    remoteVideoEl.value.play().catch(e => console.warn(e));
  }
  $q.notify({ type: 'positive', icon: 'volume_up', message: 'Áudio da aula ativado!' });
}

function stopMediaStreams() {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
  if (hostMediaStream) {
    hostMediaStream.getTracks().forEach(t => t.stop());
    hostMediaStream = null;
  }
  if (studentLocalStream) {
    studentLocalStream.getTracks().forEach(t => t.stop());
    studentLocalStream = null;
  }
  peerConnections.forEach(pc => {
    try { pc.close(); } catch (e) {}
  });
  peerConnections.clear();

  if (studentPeerConnection) {
    try { studentPeerConnection.close(); } catch (e) {}
    studentPeerConnection = null;
  }

  remoteHostStreamActive.value = false;
  remoteHostStream.value = null;

  if (hostVideoEl.value) hostVideoEl.value.srcObject = null;
  if (remoteVideoEl.value) remoteVideoEl.value.srcObject = null;
  if (localPipVideoEl.value) localPipVideoEl.value.srcObject = null;
}

function toggleMic() {
  micEnabled.value = !micEnabled.value;
  store.toggleMedia(sessionId.value, auth.user?.id, !micEnabled.value, cameraEnabled.value);
  $q.notify({
    type: 'info',
    message: micEnabled.value ? 'Microfone ativado' : 'Microfone silenciado',
    timeout: 1000
  });
}

async function toggleCamera() {
  cameraEnabled.value = !cameraEnabled.value;
  store.toggleMedia(sessionId.value, auth.user?.id, !micEnabled.value, cameraEnabled.value);

  if (isHost.value) {
    if (cameraEnabled.value) {
      await initHostCamera();
    } else {
      hostStreamActive.value = false;
      if (hostMediaStream) {
        hostMediaStream.getTracks().forEach(t => t.stop());
        hostMediaStream = null;
      }
      startStageCanvas();
    }
  } else {
    // Estudante ativa apenas câmara local no PiP
    if (cameraEnabled.value) {
      try {
        if (navigator.mediaDevices?.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          studentLocalStream = stream;
          nextTick(() => {
            if (localPipVideoEl.value) {
              localPipVideoEl.value.srcObject = stream;
            }
          });
          $q.notify({ type: 'positive', message: 'Câmara do participante ativada' });
        }
      } catch (err) {
        console.warn('Erro ao aceder à câmara local:', err);
        $q.notify({ type: 'warning', message: 'Não foi possível aceder à câmara.' });
        cameraEnabled.value = false;
      }
    } else {
      if (studentLocalStream) {
        studentLocalStream.getTracks().forEach(t => t.stop());
        studentLocalStream = null;
      }
      if (localPipVideoEl.value) localPipVideoEl.value.srcObject = null;
      $q.notify({ type: 'info', message: 'Câmara desligada' });
    }
  }
}

function toggleScreenShare() {
  screenSharing.value = !screenSharing.value;
  $q.notify({
    type: screenSharing.value ? 'positive' : 'info',
    message: screenSharing.value ? 'A partilhar ecrã da apresentação' : 'Partilha de ecrã encerrada',
    timeout: 1500
  });
}

function toggleRaiseHand() {
  handRaised.value = !handRaised.value;
  store.raiseHand(sessionId.value, auth.user?.id, auth.user?.name, handRaised.value);
  $q.notify({
    type: 'warning',
    icon: 'pan_tool',
    message: handRaised.value ? 'Levantaste a mão para intervir na aula!' : 'Mão abaixada',
    timeout: 1500
  });
}

// Iniciar transmissão pelo Mentor
async function handleMentorStartLive() {
  isStartingLive.value = true;
  try {
    const hostId = auth.user?.id || session.value?.host_id || '1';
    await store.startLive(sessionId.value, hostId);
    $q.notify({
      type: 'positive',
      icon: 'sensors',
      message: 'A transmissão foi iniciada com sucesso! A sala está AO VIVO.'
    });
    nextTick(() => {
      initStage();
    });
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Erro ao iniciar live: ' + err.message });
  } finally {
    isStartingLive.value = false;
  }
}

// Encerrar transmissão pelo Mentor
function handleMentorEndLive() {
  $q.dialog({
    title: 'Encerrar Aula em Directo?',
    message: 'Desejas finalizar esta sessão? Todos os participantes serão desconectados da transmissão e levados para o ecrã de avaliação.',
    cancel: true,
    persistent: true,
    ok: { label: 'Sim, Encerrar Aula', color: 'negative', rounded: true, unelevated: true }
  }).onOk(async () => {
    try {
      await store.endLive(sessionId.value, auth.user?.id || session.value?.host_id);
      $q.notify({ type: 'info', icon: 'done_all', message: 'Aula terminada com sucesso.' });
    } catch (err) {
      $q.notify({ type: 'negative', message: 'Erro ao encerrar: ' + err.message });
    }
  });
}

// Mentor remove participante (Kick)
function handleKickParticipant(participant) {
  const pName = participant.name || participant.user_name || 'Estudante';
  const pId = participant.userId || participant.user_id;

  $q.dialog({
    title: 'Remover Participante?',
    message: `Tens a certeza de que desejas remover «${pName}» desta sessão?`,
    cancel: true,
    ok: { label: 'Remover', color: 'negative', rounded: true, unelevated: true }
  }).onOk(() => {
    store.kickParticipant(sessionId.value, pId);
    $q.notify({ type: 'info', message: `${pName} foi removido da sala.` });
  });
}

function handleSendChat() {
  if (!newChatMessage.value.trim()) return;
  store.sendChatMessage(sessionId.value, newChatMessage.value, auth.user);
  newChatMessage.value = '';
}

function confirmLeaveSession() {
  $q.dialog({
    title: 'Sair da Sala?',
    message: 'Desejas sair da transmissão em directo e voltar ao calendário?',
    cancel: true,
    ok: { label: 'Sim, Sair', color: 'primary', rounded: true }
  }).onOk(() => {
    router.push({ name: 'calendar' });
  });
}

function submitRatingAndBack() {
  $q.notify({
    type: 'positive',
    icon: 'star',
    message: 'Avaliação submetida! Obrigado por participar no MEET-US.'
  });
  router.push({ name: 'calendar' });
}
</script>

<style scoped>
.live-room-container {
  font-family: inherit;
}

.main-live-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.stage-canvas-container {
  background: #0B1120;
}

.stage-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.stage-overlay-center {
  position: relative;
  z-index: 2;
}

.local-pip-box {
  width: 150px;
  height: 105px;
  background: #1E293B;
  border: 2px solid #0B825B;
  z-index: 6;
}

.avatar-live-halo {
  border: 4px solid #10B981;
  box-shadow: 0 0 35px rgba(16, 185, 129, 0.4);
}

.radar-pulse {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: rgba(11, 130, 91, 0.2);
  animation: radarAnim 2s infinite ease-out;
  z-index: 1;
}

@keyframes radarAnim {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(1.6); opacity: 0; }
}

.live-badge {
  border-radius: 12px;
  font-size: 11px;
  letter-spacing: 0.5px;
}

.blink-dot {
  animation: blinkAnim 1s infinite alternate;
}

@keyframes blinkAnim {
  0% { opacity: 1; }
  100% { opacity: 0.2; }
}

.bg-dark-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
}

.border-bottom-dim {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.border-top-dim {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.bg-black-dim {
  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
}

.hand-raised-toast {
  background: rgba(245, 158, 11, 0.95);
  color: #000;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  z-index: 10;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
