// backend/src/controllers/chatController.js
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { Conversation, Message, User } = require('../models');

// Garantir diretório de uploads
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuração do Multer para armazenamento de áudio, vídeo, imagens e ficheiros/PDFs
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, `${cleanBase || 'media'}-${uniqueSuffix}${ext || ''}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100 MB
});

exports.uploadMiddleware = upload.single('file');

exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum ficheiro fornecido no upload.' });
    }

    const mime = (req.file.mimetype || '').toLowerCase();
    let type = 'file';
    if (mime.startsWith('audio/') || req.file.originalname.match(/\.(webm|mp3|ogg|wav|m4a|aac)$/i)) {
      type = 'audio';
    } else if (mime.startsWith('video/') || req.file.originalname.match(/\.(mp4|webm|mov|mkv|avi)$/i)) {
      type = 'video';
    } else if (mime.startsWith('image/') || req.file.originalname.match(/\.(png|jpe?g|gif|webp|svg)$/i)) {
      type = 'image';
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    res.json({
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      type
    });
  } catch (err) {
    next(err);
  }
};

exports.listConversations = async (req, res, next) => {
  try {
    const userId = String(req.user ? req.user.id : req.query.userId);

    const convs = (await Conversation.find({
      $or: [{ user_a: userId }, { user_b: userId }]
    })).map(c => (c.toJSON ? c.toJSON() : c));

    convs.sort((a, b) => new Date(b.last_message_at || 0) - new Date(a.last_message_at || 0));

    const enriched = await Promise.all(
      convs.map(async c => {
        const otherId = c.user_a === userId ? c.user_b : c.user_a;
        const other = await User.findById(otherId);

        const unreadCount = await Message.countDocuments({
          conversation_id: String(c.id || c._id),
          sender_id: { $ne: userId },
          status: { $ne: 'read' }
        });

        return {
          ...c,
          other: other ? (other.toJSON ? other.toJSON() : other) : null,
          unread: unreadCount
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    next(err);
  }
};

exports.getOrCreate = async (req, res, next) => {
  try {
    const userId = String(req.user ? req.user.id : req.body.userId);
    const otherId = String(req.body.otherId);

    if (!otherId) return res.status(400).json({ message: 'otherId é obrigatório.' });

    const userA = userId < otherId ? userId : otherId;
    const userB = userId > otherId ? userId : otherId;

    let conv = await Conversation.findOne({ user_a: userA, user_b: userB });
    if (!conv) {
      conv = await Conversation.create({
        user_a: userA,
        user_b: userB,
        last_message: '',
        last_message_at: new Date().toISOString()
      });
    }

    res.json(conv.toJSON ? conv.toJSON() : conv);
  } catch (err) {
    next(err);
  }
};

exports.listMessages = async (req, res, next) => {
  try {
    const conversationId = String(req.params.id);
    const limit = parseInt(req.query.limit, 10) || 50;

    let messages = await Message.find({ conversation_id: conversationId });
    messages = messages.map(m => (m.toJSON ? m.toJSON() : m));
    messages.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));

    res.json(messages.slice(0, limit));
  } catch (err) {
    next(err);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const senderId = String(req.user ? req.user.id : req.body.senderId);
    const { conversationId, type = 'text', content, fileUrl, fileName, fileSize } = req.body;

    if (!conversationId) return res.status(400).json({ message: 'conversationId é obrigatório.' });

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
      sender_id: senderId,
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

    res.status(201).json(msg.toJSON ? msg.toJSON() : msg);
  } catch (err) {
    next(err);
  }
};

exports.markRead = async (req, res, next) => {
  try {
    const conversationId = String(req.params.id);
    const userId = String(req.user ? req.user.id : req.body.userId);

    await Message.updateMany(
      { conversation_id: conversationId, sender_id: { $ne: userId } },
      { $set: { status: 'read' } }
    );

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};