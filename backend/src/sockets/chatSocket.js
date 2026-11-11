// backend/src/sockets/chatSocket.js
const { Message, Conversation, Notification, User, Session } = require('../models');

// Rastreamento em memória de utilizadores ativos conectados em tempo real
const activeUsers = new Map(); // userId -> Set of socketId
const socketToUser = new Map(); // socketId -> userId

// Rastreamento em memória de participantes nas salas de aulas em directo (Live Sessions)
const liveSessionRooms = new Map(); // sessionId -> Map(userId -> participantData)

function initSockets(io) {
  // Limpar estados residuais de utilizadores offline ao inicializar o socket server
  User.updateMany({}, { online: false }).catch(err => {
    console.warn('[Socket.IO] Aviso ao redefinir estado online inicial:', err.message);
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join user's individual channel e registo de presença REAL
    socket.on('user:join', async (rawUserId) => {
      if (!rawUserId) return;
      const userId = String(rawUserId);

      socket.userId = userId;
      socketToUser.set(socket.id, userId);

      if (!activeUsers.has(userId)) {
        activeUsers.set(userId, new Set());
      }
      activeUsers.get(userId).add(socket.id);

      socket.join(`user:${userId}`);
      console.log(`[Socket.IO] User ${userId} is ONLINE (Sockets: ${activeUsers.get(userId).size})`);

      try {
        await User.findByIdAndUpdate(userId, { online: true });
        // Transmite o novo estado online a todos os clientes conectados
        io.emit('user:presence', { userId, online: true });
      } catch (e) {
        console.error('[Socket.IO] Erro ao marcar user online:', e.message);
      }

      // Envia imediatamente a lista de todos os utilizadores online ao novo cliente
      socket.emit('users:online_list', Array.from(activeUsers.keys()));
    });

    // Saída voluntária (Logout)
    socket.on('user:leave', async (rawUserId) => {
      const userId = rawUserId ? String(rawUserId) : socket.userId;
      if (!userId) return;

      activeUsers.delete(userId);
      socketToUser.delete(socket.id);

      try {
        await User.findByIdAndUpdate(userId, { online: false });
        io.emit('user:presence', { userId, online: false });
        console.log(`[Socket.IO] User ${userId} logged out -> OFFLINE`);
      } catch (e) {
        console.error('[Socket.IO] Erro ao marcar user offline no logout:', e.message);
      }
    });

    // Solicitação direta de utilizadores online
    socket.on('users:get_online', (callback) => {
      const list = Array.from(activeUsers.keys());
      if (typeof callback === 'function') {
        callback(list);
      } else {
        socket.emit('users:online_list', list);
      }
    });

    // Join conversation channel
    socket.on('conversation:join', (conversationId) => {
      if (conversationId) {
        socket.join(`conv:${conversationId}`);
      }
    });

    // Send chat message
    socket.on('chat:send', async (data) => {
      try {
        const { conversationId, senderId, receiverId, type = 'text', content, fileUrl, fileName, fileSize } = data;
        if (!conversationId || !senderId) return;

        let payload = null;
        if (data._id || data.id) {
          payload = data;
        } else {
          let previewText = content;
          if (!previewText) {
            if (type === 'audio') previewText = '🎤 Mensagem de voz';
            else if (type === 'video') previewText = '📹 Vídeo';
            else if (type === 'file') previewText = `📄 ${fileName || 'Documento PDF'}`;
            else if (type === 'image') previewText = '📷 Foto';
            else previewText = `[${type}]`;
          }

          const msg = await Message.create({
            conversation_id: String(conversationId),
            sender_id: String(senderId),
            type,
            content: content || '',
            file_url: fileUrl || '',
            file_name: fileName || '',
            file_size: fileSize || 0,
            status: 'sent'
          });

          const conv = await Conversation.findById(conversationId);
          if (conv) {
            conv.last_message = previewText;
            conv.last_message_at = new Date().toISOString();
            await conv.save();
          }

          payload = msg.toJSON ? msg.toJSON() : msg;
        }

        // Broadcast to conversation room
        io.to(`conv:${conversationId}`).emit('chat:new', payload);

        // Also notify receiver directly if specified
        if (receiverId) {
          io.to(`user:${receiverId}`).emit('chat:new', payload);
        }
      } catch (err) {
        console.error('[Socket.IO] Error in chat:send:', err);
      }
    });

    // Typing indicators
    socket.on('chat:typing', ({ conversationId, userId, isTyping }) => {
      socket.to(`conv:${conversationId}`).emit('chat:typing', { userId, isTyping });
    });

    // WebRTC / Call events (Chamadas de Voz e Vídeo P2P em tempo real)
    socket.on('call:start', (data) => {
      const { targetId } = data;
      if (targetId) {
        console.log(`[Socket.IO] call:start from ${data.callerId} -> user:${targetId}`);
        io.to(`user:${targetId}`).emit('call:incoming', data);
      }
    });

    socket.on('call:offer', (data) => {
      const { targetId } = data;
      if (targetId) {
        console.log(`[Socket.IO] call:offer from ${data.callerId} (${data.callerName}) -> user:${targetId}`);
        io.to(`user:${targetId}`).emit('call:incoming', data);
        io.to(`user:${targetId}`).emit('call:offer', data);
      }
    });

    socket.on('call:answer', (data) => {
      const { callerId, targetId } = data;
      const destination = callerId || targetId;
      if (destination) {
        console.log(`[Socket.IO] call:answer from ${data.targetId} -> user:${destination}`);
        io.to(`user:${destination}`).emit('call:answered', data);
        io.to(`user:${destination}`).emit('call:answer', data);
      }
    });

    socket.on('call:ice-candidate', (data) => {
      const { targetId } = data;
      if (targetId) {
        io.to(`user:${targetId}`).emit('call:ice-candidate', data);
      }
    });

    socket.on('call:reject', (data) => {
      const { callerId, targetId } = data;
      const destination = callerId || targetId;
      if (destination) {
        console.log(`[Socket.IO] call:reject -> user:${destination}`);
        io.to(`user:${destination}`).emit('call:rejected', data);
      }
    });

    socket.on('call:end', (data) => {
      const { targetId, callerId } = data;
      const destination = targetId || callerId;
      if (destination) {
        console.log(`[Socket.IO] call:end -> user:${destination}`);
        io.to(`user:${destination}`).emit('call:ended', data);
      }
    });

    socket.on('call:signal', (data) => {
      const { targetId } = data;
      if (targetId) {
        io.to(`user:${targetId}`).emit('call:signal', data);
      }
    });

    // --- LIVE SESSIONS (AULAS EM DIRECTO) ---
    socket.on('session:join_room', async (data) => {
      const { sessionId, user } = data || {};
      if (!sessionId) return;
      const room = `session:${sessionId}`;
      socket.join(room);
      socket.currentSessionId = sessionId;

      if (!liveSessionRooms.has(sessionId)) {
        liveSessionRooms.set(sessionId, new Map());
      }
      const roomParticipants = liveSessionRooms.get(sessionId);

      const userId = user?.id || user?._id || socket.userId || socket.id;
      const participantInfo = {
        userId: String(userId),
        socketId: socket.id,
        name: user?.name || 'Estudante',
        avatar: user?.avatar || '',
        course: user?.course || '',
        isHost: Boolean(data?.isHost),
        isMuted: false,
        videoActive: true,
        handRaised: false,
        joinedAt: new Date().toISOString()
      };
      roomParticipants.set(String(userId), participantInfo);

      const list = Array.from(roomParticipants.values());
      const count = list.length;

      console.log(`[Socket.IO] User ${participantInfo.name} joined session ${sessionId} (${count} participants)`);

      // Envia a lista atual de participantes ao novo entrante
      socket.emit('session:room_state', {
        sessionId,
        participants: list,
        count
      });

      // Transmite a entrada a todos dentro da sala
      io.to(room).emit('session:participant_joined', {
        sessionId,
        participant: participantInfo,
        participants: list,
        count
      });

      // Notifica todos globalmente sobre a nova contagem dinâmica no calendário
      io.emit('session:presence_count', {
        sessionId,
        participantsCount: count
      });
    });

    socket.on('session:leave_room', (data) => {
      const { sessionId, userId } = data || {};
      const targetSessionId = sessionId || socket.currentSessionId;
      if (!targetSessionId) return;

      const room = `session:${targetSessionId}`;
      socket.leave(room);

      const uId = String(userId || socket.userId || socket.id);
      if (liveSessionRooms.has(targetSessionId)) {
        const roomParticipants = liveSessionRooms.get(targetSessionId);
        roomParticipants.delete(uId);
        const list = Array.from(roomParticipants.values());
        const count = list.length;

        io.to(room).emit('session:participant_left', {
          sessionId: targetSessionId,
          userId: uId,
          participants: list,
          count
        });

        io.emit('session:presence_count', {
          sessionId: targetSessionId,
          participantsCount: count
        });
      }
    });

    socket.on('session:start_live', async (data) => {
      const { sessionId, hostId } = data || {};
      if (!sessionId) return;
      try {
        const session = await Session.findById(sessionId);
        if (session) {
          session.status = 'LIVE';
          if (!session.started_at) session.started_at = new Date().toISOString();
          await session.save();
        }
        console.log(`[Socket.IO] Live started for session ${sessionId} by host ${hostId}`);

        const sessionDoc = session ? (session.toJSON ? session.toJSON() : session) : null;

        // Broadcast global: todos os calendários mudam para AO VIVO sem reload!
        io.emit('session:status_changed', {
          sessionId,
          status: 'LIVE',
          started_at: session?.started_at || new Date().toISOString(),
          participantsCount: liveSessionRooms.has(sessionId) ? liveSessionRooms.get(sessionId).size : 1,
          session: sessionDoc
        });

        // Notifica a sala de espera que a transmissão começou
        io.to(`session:${sessionId}`).emit('session:live_started', {
          sessionId,
          status: 'LIVE',
          session: sessionDoc
        });
      } catch (e) {
        console.error('[Socket.IO] Erro ao iniciar live:', e.message);
      }
    });

    socket.on('session:end_live', async (data) => {
      const { sessionId, hostId } = data || {};
      if (!sessionId) return;
      try {
        const session = await Session.findById(sessionId);
        if (session) {
          session.status = 'ENDED';
          session.ended_at = new Date().toISOString();
          await session.save();
        }
        console.log(`[Socket.IO] Live ended for session ${sessionId} by host ${hostId}`);

        io.emit('session:status_changed', {
          sessionId,
          status: 'ENDED',
          ended_at: session?.ended_at || new Date().toISOString()
        });

        io.to(`session:${sessionId}`).emit('session:ended', {
          sessionId,
          title: session?.title || 'Aula em Directo',
          hostName: session?.host_name || 'Mentora'
        });

        liveSessionRooms.delete(sessionId);
      } catch (e) {
        console.error('[Socket.IO] Erro ao terminar live:', e.message);
      }
    });

    socket.on('session:kick_participant', (data) => {
      const { sessionId, targetUserId } = data || {};
      if (!sessionId || !targetUserId) return;

      if (liveSessionRooms.has(sessionId)) {
        const roomParticipants = liveSessionRooms.get(sessionId);
        const p = roomParticipants.get(String(targetUserId));
        if (p) {
          io.to(p.socketId).emit('session:kicked', { sessionId, message: 'Foste removido da sala pelo mentor.' });
          roomParticipants.delete(String(targetUserId));
          const list = Array.from(roomParticipants.values());
          io.to(`session:${sessionId}`).emit('session:participant_left', {
            sessionId,
            userId: targetUserId,
            participants: list,
            count: list.length
          });
          io.emit('session:presence_count', {
            sessionId,
            participantsCount: list.length
          });
        }
      }
    });

    socket.on('session:toggle_media', (data) => {
      const { sessionId, userId, isMuted, videoActive } = data || {};
      if (!sessionId || !userId) return;
      if (liveSessionRooms.has(sessionId)) {
        const p = liveSessionRooms.get(sessionId).get(String(userId));
        if (p) {
          if (typeof isMuted === 'boolean') p.isMuted = isMuted;
          if (typeof videoActive === 'boolean') p.videoActive = videoActive;
          io.to(`session:${sessionId}`).emit('session:media_updated', {
            sessionId,
            userId,
            isMuted: p.isMuted,
            videoActive: p.videoActive
          });
        }
      }
    });

    socket.on('session:raise_hand', (data) => {
      const { sessionId, userId, userName, handRaised } = data || {};
      if (!sessionId || !userId) return;
      if (liveSessionRooms.has(sessionId)) {
        const p = liveSessionRooms.get(sessionId).get(String(userId));
        if (p) p.handRaised = handRaised;
        io.to(`session:${sessionId}`).emit('session:hand_updated', {
          sessionId,
          userId,
          userName,
          handRaised
        });
      }
    });

    socket.on('session:chat_msg', (data) => {
      const { sessionId, message } = data || {};
      if (!sessionId || !message) return;
      io.to(`session:${sessionId}`).emit('session:new_chat', {
        sessionId,
        message
      });
    });

    // WebRTC Signalling entre mentor e alunos na sala em directo
    socket.on('session:webrtc_signal', (data) => {
      const { sessionId, targetSocketId, signal, senderId } = data || {};
      if (targetSocketId) {
        io.to(targetSocketId).emit('session:webrtc_signal', {
          senderSocketId: socket.id,
          senderId,
          signal
        });
      } else if (sessionId) {
        socket.to(`session:${sessionId}`).emit('session:webrtc_signal', {
          senderSocketId: socket.id,
          senderId,
          signal
        });
      }
    });

    socket.on('disconnect', async () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
      const userId = socket.userId || socketToUser.get(socket.id);
      socketToUser.delete(socket.id);

      // Limpeza de sala em directo se o utilizador estiver numa sessão
      if (socket.currentSessionId && liveSessionRooms.has(socket.currentSessionId)) {
        const roomParticipants = liveSessionRooms.get(socket.currentSessionId);
        const uId = String(userId || socket.id);
        if (roomParticipants.has(uId)) {
          roomParticipants.delete(uId);
          const list = Array.from(roomParticipants.values());
          io.to(`session:${socket.currentSessionId}`).emit('session:participant_left', {
            sessionId: socket.currentSessionId,
            userId: uId,
            participants: list,
            count: list.length
          });
          io.emit('session:presence_count', {
            sessionId: socket.currentSessionId,
            participantsCount: list.length
          });
        }
      }

      if (userId && activeUsers.has(userId)) {
        const userSockets = activeUsers.get(userId);
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          activeUsers.delete(userId);
          console.log(`[Socket.IO] User ${userId} has no more sockets -> OFFLINE`);
          try {
            await User.findByIdAndUpdate(userId, { online: false });
            io.emit('user:presence', { userId, online: false });
          } catch (e) {
            console.error('[Socket.IO] Erro ao marcar user offline:', e.message);
          }
        }
      }
    });
  });
}

module.exports = initSockets;