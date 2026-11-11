// frontend/src/stores/sessions.js
import { defineStore } from 'pinia';
import { sessionsService } from 'src/services/sessions.service';
import { socket } from 'src/boot/socket';
import { Notify } from 'quasar';

// Sessões de fallback para funcionamento offline / contingência
const FALLBACK_SESSIONS = [
  {
    id: 'session-1',
    _id: 'session-1',
    title: 'Inglês com Lúcia',
    subject: 'Inglês para Conversação Académica',
    description: 'Prática de conversação fluente, vocabulário técnico e pronúncia para entrevistas e apresentações internacionais.',
    host_id: '4',
    host_name: 'Lúcia Nhaca',
    host_avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=400&fit=crop',
    host_course: 'Ensino de Língua Inglesa (UP)',
    status: 'SCHEDULED', // AGENDADA
    scheduled_at: '2026-11-11T10:00:00.000Z',
    started_at: null,
    ended_at: null,
    participantsCount: 4,
    participants: [
      { user_id: '1', user_name: 'Edson Arnaldo', user_avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400', status: 'JOINED' },
      { user_id: '2', user_name: 'Amália Mabjaia', user_avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400', status: 'JOINED' },
      { user_id: '8', user_name: 'Samira Patel', user_avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400', status: 'JOINED' },
      { user_id: '3', user_name: 'Carlos Macuácua', user_avatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=400', status: 'JOINED' }
    ],
    chat_messages: [
      {
        _id: 'c1',
        sender_id: '4',
        sender_name: 'Lúcia Nhaca',
        sender_avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400',
        text: 'Olá a todos! Sejam bem-vindos à nossa sessão em directo.',
        time: '10:01'
      }
    ]
  },
  {
    id: 'session-2',
    _id: 'session-2',
    title: 'Programação Web com Vue 3 & Quasar',
    subject: 'Engenharia de Software',
    description: 'Construção de componentes reativos, stores Pinia, PWA e integração WebSockets em tempo real.',
    host_id: '1',
    host_name: 'Edson Arnaldo',
    host_avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=400&fit=crop',
    host_course: 'Engenharia Informática (UP)',
    status: 'SCHEDULED',
    scheduled_at: '2026-11-11T15:30:00.000Z',
    started_at: null,
    ended_at: null,
    participantsCount: 0,
    participants: []
  },
  {
    id: 'session-3',
    _id: 'session-3',
    title: 'Cálculo I: Teorema Fundamental e Integrais',
    subject: 'Matemática e Engenharia',
    description: 'Resolução passo a passo de exercícios práticos dos exames de admissão e testes semestrais.',
    host_id: '5',
    host_name: 'Hélder Tembe',
    host_avatar: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=400&h=400&fit=crop',
    host_course: 'Física Aplicada & Matemática (UEM)',
    status: 'ENDED',
    scheduled_at: '2026-11-10T14:00:00.000Z',
    started_at: '2026-11-10T14:02:00.000Z',
    ended_at: '2026-11-10T15:35:00.000Z',
    participantsCount: 1,
    participants: [
      { user_id: '1', user_name: 'Edson Arnaldo', user_avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400', status: 'JOINED' }
    ]
  }
];

export const useSessionsStore = defineStore('sessions', {
  state: () => ({
    sessions: [],
    currentSession: null,
    roomParticipants: [],
    roomMessages: [],
    loading: false,
    socketBound: false,
    handRaisedUsers: new Set()
  }),

  getters: {
    activeLiveSession: (state) => state.sessions.find(s => s.status === 'LIVE') || null,
    liveSessions: (state) => state.sessions.filter(s => s.status === 'LIVE'),
    scheduledSessions: (state) => state.sessions.filter(s => s.status === 'SCHEDULED' || s.status === 'WAITING'),
    endedSessions: (state) => state.sessions.filter(s => s.status === 'ENDED'),
    isCurrentHost: (state) => (userId) => {
      if (!state.currentSession || !userId) return false;
      return String(state.currentSession.host_id) === String(userId);
    }
  },

  actions: {
    async fetchSessions() {
      this.loading = true;
      try {
        const data = await sessionsService.getSessions();
        if (Array.isArray(data) && data.length > 0) {
          this.sessions = data;
        } else {
          this.sessions = [...FALLBACK_SESSIONS];
        }
      } catch (err) {
        console.warn('[SessionsStore] Falha ao carregar sessões da API, usando fallback:', err.message);
        if (this.sessions.length === 0) {
          this.sessions = [...FALLBACK_SESSIONS];
        }
      } finally {
        this.loading = false;
        this.initSocketListeners();
      }
    },

    async fetchSessionById(id) {
      this.loading = true;
      try {
        const data = await sessionsService.getSessionById(id);
        this.currentSession = data;
        this.roomParticipants = data.participants || [];
        this.roomMessages = data.chat_messages || [];
        return data;
      } catch (err) {
        console.warn('[SessionsStore] Erro ao carregar sessão por ID, buscando localmente:', err.message);
        const local = this.sessions.find(s => String(s.id || s._id) === String(id)) || FALLBACK_SESSIONS.find(s => String(s.id || s._id) === String(id));
        if (local) {
          this.currentSession = local;
          this.roomParticipants = local.participants || [];
          this.roomMessages = local.chat_messages || [];
          return local;
        }
        throw err;
      } finally {
        this.loading = false;
        this.initSocketListeners();
      }
    },

    initSocketListeners() {
      if (this.socketBound || !socket) return;
      this.socketBound = true;

      // Atualização de status da sessão (SCHEDULED -> LIVE -> ENDED)
      socket.on('session:status_changed', (payload) => {
        const { sessionId, status, started_at, ended_at, participantsCount, session } = payload || {};
        console.log(`[SessionsStore] Event session:status_changed: ${sessionId} -> ${status}`);

        const idx = this.sessions.findIndex(s => String(s.id || s._id) === String(sessionId));
        if (idx !== -1) {
          this.sessions[idx] = {
            ...this.sessions[idx],
            status,
            started_at: started_at || this.sessions[idx].started_at,
            ended_at: ended_at || this.sessions[idx].ended_at,
            participantsCount: typeof participantsCount === 'number' ? participantsCount : this.sessions[idx].participantsCount
          };
          this.sessions = [...this.sessions];
        } else if (session) {
          this.sessions.unshift(session);
          this.sessions = [...this.sessions];
        }

        if (this.currentSession && String(this.currentSession.id || this.currentSession._id) === String(sessionId)) {
          this.currentSession = {
            ...this.currentSession,
            status,
            started_at: started_at || this.currentSession.started_at,
            ended_at: ended_at || this.currentSession.ended_at,
            participantsCount: typeof participantsCount === 'number' ? participantsCount : this.currentSession.participantsCount
          };
        }

        // DISPARAR O SINAL DE ALERTA GLOBAL PARA TODAS AS OUTRAS PESSOAS!
        if (status === 'LIVE') {
          let currentUserId = null;
          try {
            const rawUser = localStorage.getItem('meetus_user');
            if (rawUser) currentUserId = JSON.parse(rawUser)?.id;
          } catch (_) {}

          const hostId = session?.host_id || (idx !== -1 ? this.sessions[idx]?.host_id : null);
          const hostName = session?.host_name || (idx !== -1 ? this.sessions[idx]?.host_name : 'Mentora');
          const title = session?.title || (idx !== -1 ? this.sessions[idx]?.title : 'Aula em Directo');

          // Só notifica se não for o próprio mentor que acabou de iniciar
          if (String(hostId) !== String(currentUserId)) {
            // Sinal sonoro agradável via Web Audio API
            try {
              const AudioCtx = window.AudioContext || window.webkitAudioContext;
              if (AudioCtx) {
                const ctx = new AudioCtx();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(587.33, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
                gain.gain.setValueAtTime(0.25, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
                osc.start();
                osc.stop(ctx.currentTime + 0.35);
              }
            } catch (_) {}

            Notify.create({
              type: 'negative',
              icon: 'sensors',
              position: 'top',
              timeout: 30000,
              progress: true,
              classes: 'live-alert-popup shadow-5',
              message: `🔴 AULA AO VIVO: ${hostName} iniciou a aula «${title}»!`,
              caption: 'A transmissão começou agora. Clica no botão para entrar na sala.',
              actions: [
                {
                  label: 'Entrar na Aula Agora',
                  color: 'white',
                  class: 'bg-emerald-600 text-weight-bolder q-px-md shadow-2',
                  handler: () => {
                    if (window.__MEETUS_ROUTER__) {
                      window.__MEETUS_ROUTER__.push({ name: 'live-room', params: { id: sessionId } });
                    } else {
                      window.location.href = `/live/${sessionId}`;
                    }
                  }
                },
                { label: 'Dispensar', color: 'white' }
              ]
            });
          }
        }
      });

      // Contagem dinâmica de participantes em tempo real no cartão
      socket.on('session:presence_count', (payload) => {
        const { sessionId, participantsCount } = payload || {};
        const idx = this.sessions.findIndex(s => String(s.id || s._id) === String(sessionId));
        if (idx !== -1) {
          this.sessions[idx].participantsCount = participantsCount;
        }
        if (this.currentSession && String(this.currentSession.id || this.currentSession._id) === String(sessionId)) {
          this.currentSession.participantsCount = participantsCount;
        }
      });

      // Estado completo da sala recebido ao entrar
      socket.on('session:room_state', (payload) => {
        if (payload?.participants) {
          this.roomParticipants = payload.participants;
        }
      });

      // Participante entrou na sala
      socket.on('session:participant_joined', (payload) => {
        if (payload?.participants) {
          this.roomParticipants = payload.participants;
        } else if (payload?.participant) {
          const exists = this.roomParticipants.some(p => String(p.userId) === String(payload.participant.userId));
          if (!exists) this.roomParticipants.push(payload.participant);
        }
      });

      // Participante saiu da sala
      socket.on('session:participant_left', (payload) => {
        if (payload?.participants) {
          this.roomParticipants = payload.participants;
        } else if (payload?.userId) {
          this.roomParticipants = this.roomParticipants.filter(p => String(p.userId) !== String(payload.userId));
        }
      });

      // Mensagem no chat em tempo real
      socket.on('session:new_chat', (payload) => {
        if (payload?.message) {
          this.roomMessages.push(payload.message);
        }
      });

      // Notificação de mão levantada
      socket.on('session:hand_updated', (payload) => {
        const { userId, handRaised } = payload || {};
        if (userId) {
          if (handRaised) this.handRaisedUsers.add(String(userId));
          else this.handRaisedUsers.delete(String(userId));
        }
      });

      // Live iniciada pela mentora
      socket.on('session:live_started', (payload) => {
        if (this.currentSession && String(this.currentSession.id || this.currentSession._id) === String(payload.sessionId)) {
          this.currentSession.status = 'LIVE';
        }
      });

      // Sessão finalizada
      socket.on('session:ended', (payload) => {
        if (this.currentSession && String(this.currentSession.id || this.currentSession._id) === String(payload.sessionId)) {
          this.currentSession.status = 'ENDED';
        }
      });
    },

    async startLive(sessionId, hostId) {
      try {
        await sessionsService.updateStatus(sessionId, 'LIVE');
      } catch (e) {
        console.warn('[SessionsStore] Erro na API startLive, usando socket/local:', e.message);
      }
      if (socket) {
        socket.emit('session:start_live', { sessionId, hostId });
      }
      const s = this.sessions.find(x => String(x.id || x._id) === String(sessionId));
      if (s) s.status = 'LIVE';
      if (this.currentSession) this.currentSession.status = 'LIVE';
    },

    async endLive(sessionId, hostId) {
      try {
        await sessionsService.updateStatus(sessionId, 'ENDED');
      } catch (e) {
        console.warn('[SessionsStore] Erro na API endLive, usando socket/local:', e.message);
      }
      if (socket) {
        socket.emit('session:end_live', { sessionId, hostId });
      }
      const s = this.sessions.find(x => String(x.id || x._id) === String(sessionId));
      if (s) s.status = 'ENDED';
      if (this.currentSession) this.currentSession.status = 'ENDED';
    },

    joinRoom(sessionId, user, isHost = false) {
      if (socket) {
        socket.emit('session:join_room', { sessionId, user, isHost });
      }
      sessionsService.joinSession(sessionId, { userId: user?.id, userName: user?.name, userAvatar: user?.avatar }).catch(() => {});
    },

    leaveRoom(sessionId, userId) {
      if (socket) {
        socket.emit('session:leave_room', { sessionId, userId });
      }
      sessionsService.leaveSession(sessionId, { userId }).catch(() => {});
    },

    kickParticipant(sessionId, targetUserId) {
      if (socket) {
        socket.emit('session:kick_participant', { sessionId, targetUserId });
      }
      sessionsService.kickParticipant(sessionId, targetUserId).catch(() => {});
    },

    sendChatMessage(sessionId, text, user) {
      const msg = {
        _id: String(Date.now()),
        sender_id: user?.id || user?._id || 'anon',
        sender_name: user?.name || 'Participante',
        sender_avatar: user?.avatar || '',
        text: text.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      if (socket) {
        socket.emit('session:chat_msg', { sessionId, message: msg });
      }
      sessionsService.sendChatMessage(sessionId, text).catch(() => {});
      this.roomMessages.push(msg);
    },

    toggleMedia(sessionId, userId, isMuted, videoActive) {
      if (socket) {
        socket.emit('session:toggle_media', { sessionId, userId, isMuted, videoActive });
      }
    },

    raiseHand(sessionId, userId, userName, handRaised) {
      if (socket) {
        socket.emit('session:raise_hand', { sessionId, userId, userName, handRaised });
      }
      if (handRaised) this.handRaisedUsers.add(String(userId));
      else this.handRaisedUsers.delete(String(userId));
    }
  }
});
