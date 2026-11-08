// backend/src/controllers/chatController.js
const { Conversation, Message, User } = require('../models');

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
    const { conversationId, type = 'text', content, fileUrl } = req.body;

    if (!conversationId) return res.status(400).json({ message: 'conversationId é obrigatório.' });

    const msg = await Message.create({
      conversation_id: String(conversationId),
      sender_id: senderId,
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