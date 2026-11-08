// backend/src/controllers/notificationController.js
const { Notification } = require('../models');

exports.list = async (req, res, next) => {
  try {
    const userId = String(req.user ? req.user.id : req.query.userId);
    const { onlyUnread, type = 'all', page = 1, limit = 20 } = req.query;

    let items = await Notification.find({ user_id: userId });
    items = items.map(n => (n.toJSON ? n.toJSON() : n));

    if (onlyUnread === 'true' || onlyUnread === true) {
      items = items.filter(n => !n.read);
    }
    if (type !== 'all') {
      items = items.filter(n => n.type === type);
    }

    items.sort((a, b) => {
      if (a.read !== b.read) return a.read ? 1 : -1;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    const total = items.length;
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.max(1, parseInt(limit, 10) || 20);
    const start = (p - 1) * l;
    const paginated = items.slice(start, start + l);

    const unreadCount = await Notification.countDocuments({ user_id: userId, read: false });

    res.json({
      items: paginated,
      total,
      unreadCount,
      page: p,
      limit: l,
      pages: Math.max(1, Math.ceil(total / l))
    });
  } catch (err) {
    next(err);
  }
};

exports.unreadCount = async (req, res, next) => {
  try {
    const userId = String(req.user ? req.user.id : req.query.userId);
    const count = await Notification.countDocuments({ user_id: userId, read: false });
    res.json({ count });
  } catch (err) {
    next(err);
  }
};

exports.markRead = async (req, res, next) => {
  try {
    const notif = await Notification.findById(req.params.id);
    if (notif) {
      notif.read = true;
      await notif.save();
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.markAllRead = async (req, res, next) => {
  try {
    const userId = String(req.user ? req.user.id : req.body.userId);
    await Notification.updateMany({ user_id: userId }, { $set: { read: true } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.clearAll = async (req, res, next) => {
  try {
    const userId = String(req.user ? req.user.id : req.body.userId);
    await Notification.deleteMany({ user_id: userId });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};