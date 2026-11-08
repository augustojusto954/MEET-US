// backend/src/sockets/chatSocket.js
const { Message, Conversation, Notification } = require('../models');

function initSockets(io) {
  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join user's individual channel
    socket.on('user:join', (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
        console.log(`[Socket.IO] Socket ${socket.id} joined user:${userId}`);
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

        const payload = msg.toJSON ? msg.toJSON() : msg;

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
        io.to(`user:${targetId}`).emit('call:incoming', data);
      }
    });

    socket.on('call:offer', (data) => {
      const { targetId } = data;
      if (targetId) {
        io.to(`user:${targetId}`).emit('call:offer', data);
      }
    });

    socket.on('call:answer', (data) => {
      const { callerId, targetId } = data;
      const destination = callerId || targetId;
      if (destination) {
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
        io.to(`user:${destination}`).emit('call:rejected', data);
      }
    });

    socket.on('call:end', (data) => {
      const { targetId, callerId } = data;
      const destination = targetId || callerId;
      if (destination) {
        io.to(`user:${destination}`).emit('call:ended', data);
      }
    });

    socket.on('call:signal', (data) => {
      const { targetId } = data;
      if (targetId) {
        io.to(`user:${targetId}`).emit('call:signal', data);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
}

module.exports = initSockets;