// backend/src/sockets/chatSocket.js
const { Message, Conversation, Notification, User } = require('../models');

// Rastreamento em memória de utilizadores ativos conectados em tempo real
const activeUsers = new Map(); // userId -> Set of socketId
const socketToUser = new Map(); // socketId -> userId

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
        const { conversationId, senderId, receiverId, type = 'text', content, fileUrl } = data;
        if (!conversationId || !senderId) return;

        let payload = null;
        if (data._id || data.id) {
          payload = data;
        } else {
          const msg = await Message.create({
            conversation_id: String(conversationId),
            sender_id: String(senderId),
            type,
            content: content || '',
            file_url: fileUrl || '',
            status: 'sent'
          });

          const conv = await Conversation.findById(conversationId);
          if (conv) {
            conv.last_message = content || `[${type}]`;
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

    socket.on('disconnect', async () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
      const userId = socket.userId || socketToUser.get(socket.id);
      socketToUser.delete(socket.id);

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