// backend/src/controllers/sessionController.js
const { Session, User } = require('../models');

// Obter todas as sessões / aulas em directo
exports.getSessions = async (req, res, next) => {
  try {
    const { status, host_id } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (host_id) filter.host_id = host_id;

    const sessions = await Session.find(filter).sort({ scheduled_at: -1, createdAt: -1 });

    const formatted = sessions.map(s => {
      const doc = s.toJSON ? s.toJSON() : s;
      const joinedCount = (doc.participants || []).filter(p => p.status === 'JOINED').length;
      return {
        ...doc,
        id: doc._id || doc.id,
        participantsCount: joinedCount,
        isLive: doc.status === 'LIVE',
        isWaiting: doc.status === 'WAITING',
        isScheduled: doc.status === 'SCHEDULED',
        isEnded: doc.status === 'ENDED'
      };
    });

    res.json(formatted);
  } catch (err) {
    next(err);
  }
};

// Obter detalhes de uma sessão específica
exports.getSessionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: 'Sessão em directo não encontrada.' });
    }

    const doc = session.toJSON ? session.toJSON() : session;
    const joinedCount = (doc.participants || []).filter(p => p.status === 'JOINED').length;

    res.json({
      ...doc,
      id: doc._id || doc.id,
      participantsCount: joinedCount,
      isLive: doc.status === 'LIVE',
      isWaiting: doc.status === 'WAITING',
      isScheduled: doc.status === 'SCHEDULED',
      isEnded: doc.status === 'ENDED'
    });
  } catch (err) {
    next(err);
  }
};

// Criar nova sessão de aula em directo
exports.createSession = async (req, res, next) => {
  try {
    const {
      title,
      subject,
      description,
      scheduled_at,
      max_participants = 50,
      settings
    } = req.body;

    const userId = req.user?.id || req.user?._id || '1';
    const user = await User.findById(userId);

    const newSession = await Session.create({
      title: title || 'Aula em Directo MEET-US',
      subject: subject || 'Competências Universitárias',
      description: description || '',
      host_id: String(userId),
      host_name: user?.name || 'Mentor MEET-US',
      host_avatar: user?.avatar || 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=400&fit=crop',
      host_course: user?.course ? `${user.course} (${user.institution || 'Moçambique'})` : 'Ensino Superior',
      status: 'SCHEDULED',
      scheduled_at: scheduled_at || new Date().toISOString(),
      started_at: null,
      ended_at: null,
      max_participants: Number(max_participants) || 50,
      participants: [],
      chat_messages: [],
      settings: settings || { allow_mic: true, allow_camera: true, allow_chat: true }
    });

    const doc = newSession.toJSON ? newSession.toJSON() : newSession;

    // Notificar via WebSocket a todos os clientes
    const io = req.app.get('io');
    if (io) {
      io.emit('session:created', doc);
      io.emit('session:status_changed', { sessionId: doc._id || doc.id, status: doc.status, session: doc });
    }

    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

// Atualizar estado da sessão (SCHEDULED -> WAITING -> LIVE -> ENDED)
exports.updateSessionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: 'Sessão não encontrada.' });
    }

    session.status = status;
    if (status === 'LIVE' && !session.started_at) {
      session.started_at = new Date().toISOString();
    } else if (status === 'ENDED') {
      session.ended_at = new Date().toISOString();
    }

    await session.save();

    const doc = session.toJSON ? session.toJSON() : session;
    const joinedCount = (doc.participants || []).filter(p => p.status === 'JOINED').length;
    doc.participantsCount = joinedCount;

    // Emissão global para que todos os calendários mudem instantaneamente
    const io = req.app.get('io');
    if (io) {
      console.log(`[Socket.IO] Session ${id} status changed to ${status}`);
      io.emit('session:status_changed', {
        sessionId: id,
        status,
        started_at: session.started_at,
        ended_at: session.ended_at,
        participantsCount: joinedCount,
        session: doc
      });

      // Se a sessão iniciou a transmissão ao vivo, avisar sala de espera
      if (status === 'LIVE') {
        io.to(`session:${id}`).emit('session:live_started', {
          sessionId: id,
          status: 'LIVE',
          session: doc
        });
      }

      // Se a sessão terminou, avisar os participantes dentro da sala
      if (status === 'ENDED') {
        io.to(`session:${id}`).emit('session:ended', {
          sessionId: id,
          title: session.title,
          host_name: session.host_name,
          duration: session.started_at ? Math.round((new Date() - new Date(session.started_at)) / 1000) : 0
        });
      }
    }

    res.json(doc);
  } catch (err) {
    next(err);
  }
};

// Participante entra na aula
exports.joinSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id || req.body.userId;
    const user = await User.findById(userId);

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: 'Sessão não encontrada.' });
    }

    let participant = (session.participants || []).find(p => String(p.user_id) === String(userId));
    if (participant) {
      participant.status = 'JOINED';
      participant.joined_at = new Date().toISOString();
    } else {
      if (!session.participants) session.participants = [];
      session.participants.push({
        user_id: String(userId),
        user_name: user?.name || req.body.userName || 'Estudante',
        user_avatar: user?.avatar || req.body.userAvatar || '',
        user_course: user?.course || '',
        status: 'JOINED',
        is_muted: false,
        video_active: true,
        hand_raised: false,
        joined_at: new Date().toISOString()
      });
    }

    await session.save();

    const doc = session.toJSON ? session.toJSON() : session;
    const joinedCount = (doc.participants || []).filter(p => p.status === 'JOINED').length;
    doc.participantsCount = joinedCount;

    const io = req.app.get('io');
    if (io) {
      io.to(`session:${id}`).emit('session:participant_joined', {
        sessionId: id,
        userId,
        userName: user?.name || 'Estudante',
        participantsCount: joinedCount,
        participants: doc.participants
      });
      io.emit('session:presence_count', {
        sessionId: id,
        participantsCount: joinedCount
      });
    }

    res.json({ success: true, participantsCount: joinedCount, session: doc });
  } catch (err) {
    next(err);
  }
};

// Participante sai da aula
exports.leaveSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id || req.body.userId;

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: 'Sessão não encontrada.' });

    let participant = (session.participants || []).find(p => String(p.user_id) === String(userId));
    if (participant) {
      participant.status = 'LEFT';
      await session.save();
    }

    const doc = session.toJSON ? session.toJSON() : session;
    const joinedCount = (doc.participants || []).filter(p => p.status === 'JOINED').length;

    const io = req.app.get('io');
    if (io) {
      io.to(`session:${id}`).emit('session:participant_left', {
        sessionId: id,
        userId,
        participantsCount: joinedCount,
        participants: doc.participants
      });
      io.emit('session:presence_count', {
        sessionId: id,
        participantsCount: joinedCount
      });
    }

    res.json({ success: true, participantsCount: joinedCount });
  } catch (err) {
    next(err);
  }
};

// Mentor remove participante (Kick)
exports.kickParticipant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { targetUserId } = req.body;

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: 'Sessão não encontrada.' });

    let participant = (session.participants || []).find(p => String(p.user_id) === String(targetUserId));
    if (participant) {
      participant.status = 'KICKED';
      await session.save();
    }

    const doc = session.toJSON ? session.toJSON() : session;
    const joinedCount = (doc.participants || []).filter(p => p.status === 'JOINED').length;

    const io = req.app.get('io');
    if (io) {
      io.to(`user:${targetUserId}`).emit('session:kicked', { sessionId: id, reason: 'Removido pelo mentor' });
      io.to(`session:${id}`).emit('session:participant_kicked', {
        sessionId: id,
        targetUserId,
        participantsCount: joinedCount,
        participants: doc.participants
      });
      io.emit('session:presence_count', {
        sessionId: id,
        participantsCount: joinedCount
      });
    }

    res.json({ success: true, message: 'Participante removido da aula.' });
  } catch (err) {
    next(err);
  }
};

// Enviar mensagem no chat da aula
exports.sendChatMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user?.id || req.user?._id || req.body.userId;
    const user = await User.findById(userId);

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: 'Sessão não encontrada.' });

    const messageObj = {
      _id: String(Date.now()),
      sender_id: String(userId),
      sender_name: user?.name || req.body.userName || 'Participante',
      sender_avatar: user?.avatar || req.body.userAvatar || '',
      text: text || '',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (!session.chat_messages) session.chat_messages = [];
    session.chat_messages.push(messageObj);
    await session.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`session:${id}`).emit('session:new_chat', {
        sessionId: id,
        message: messageObj
      });
    }

    res.json(messageObj);
  } catch (err) {
    next(err);
  }
};
