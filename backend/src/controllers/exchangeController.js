// backend/src/controllers/exchangeController.js
const { Exchange, User, Review, Notification } = require('../models');

const VALID_STATUS = ['pending', 'accepted', 'rejected', 'cancelled', 'running', 'completed'];

async function enrichExchange(ex) {
  if (!ex) return null;
  const raw = ex.toJSON ? ex.toJSON() : ex;
  const requester = await User.findById(raw.requester_id);
  const provider = await User.findById(raw.provider_id);
  const review = await Review.findOne({ exchange_id: String(raw.id || raw._id) });

  return {
    ...raw,
    requester: requester ? { id: requester.id, name: requester.name, avatar: requester.avatar, institution: requester.institution } : null,
    provider: provider ? { id: provider.id, name: provider.name, avatar: provider.avatar, institution: provider.institution } : null,
    review: review ? (review.toJSON ? review.toJSON() : review) : null
  };
}

exports.list = async (req, res, next) => {
  try {
    const userId = String(req.user ? req.user.id : req.query.userId);
    const { role = 'all', status = 'all', q = '', page = 1, limit = 10 } = req.query;

    let items = await Exchange.find({});
    items = items.map(i => (i.toJSON ? i.toJSON() : i));

    // Role filter
    if (role === 'requester') {
      items = items.filter(i => String(i.requester_id) === userId);
    } else if (role === 'provider') {
      items = items.filter(i => String(i.provider_id) === userId);
    } else {
      items = items.filter(i => String(i.requester_id) === userId || String(i.provider_id) === userId);
    }

    // Status filter
    if (status !== 'all') {
      items = items.filter(i => i.status === status);
    }

    // Skill search
    if (q) {
      const qLower = q.toLowerCase();
      items = items.filter(i => i.skill && i.skill.toLowerCase().includes(qLower));
    }

    // Sort order: pending first, running, accepted, completed, rejected, cancelled
    const statusOrder = { pending: 0, running: 1, accepted: 2, completed: 3, rejected: 4, cancelled: 5 };
    items.sort((a, b) => {
      const orderA = statusOrder[a.status] ?? 6;
      const orderB = statusOrder[b.status] ?? 6;
      if (orderA !== orderB) return orderA - orderB;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    const total = items.length;
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.max(1, parseInt(limit, 10) || 10);
    const start = (p - 1) * l;
    const paginated = items.slice(start, start + l);

    const enriched = await Promise.all(paginated.map(enrichExchange));

    res.json({
      items: enriched,
      total,
      page: p,
      limit: l,
      pages: Math.max(1, Math.ceil(total / l))
    });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const ex = await Exchange.findById(req.params.id);
    if (!ex) return res.status(404).json({ message: 'Pedido de troca não encontrado.' });
    res.json(await enrichExchange(ex));
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const requesterId = String(req.user ? req.user.id : req.body.requesterId);
    const { providerId, skill, message, scheduledAt } = req.body;

    if (!skill) return res.status(400).json({ message: 'A habilidade é obrigatória.' });
    if (requesterId === String(providerId)) {
      return res.status(400).json({ message: 'Não podes criar um pedido para ti mesmo.' });
    }

    // Check duplicate pending request
    const existing = await Exchange.findOne({
      requester_id: requesterId,
      provider_id: String(providerId),
      skill,
      status: { $in: ['pending', 'accepted', 'running'] }
    });

    if (existing) {
      return res.status(400).json({ message: 'Já existe um pedido ativo para esta habilidade.' });
    }

    const ex = await Exchange.create({
      requester_id: requesterId,
      provider_id: String(providerId),
      skill,
      message: message || '',
      scheduled_at: scheduledAt || null,
      status: 'pending'
    });

    // Notify provider
    await Notification.create({
      user_id: String(providerId),
      type: 'exchange',
      title: 'Novo pedido de troca',
      body: `Recebeste um pedido para "${skill}".`,
      link: `/exchanges/${ex.id}`
    });

    res.status(201).json(await enrichExchange(ex));
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const actorId = String(req.user ? req.user.id : req.body.actorId);

    if (!VALID_STATUS.includes(status)) {
      return res.status(400).json({ message: 'Estado inválido.' });
    }

    const ex = await Exchange.findById(req.params.id);
    if (!ex) return res.status(404).json({ message: 'Pedido não encontrado.' });

    const isRequester = String(ex.requester_id) === actorId;
    const isProvider = String(ex.provider_id) === actorId;
    if (!isRequester && !isProvider) {
      return res.status(403).json({ message: 'Sem permissão.' });
    }

    const currentStatus = ex.status;
    const allowed = {
      pending: ['accepted', 'rejected', 'cancelled'],
      accepted: ['running', 'cancelled'],
      running: ['completed', 'cancelled'],
      completed: [],
      rejected: [],
      cancelled: []
    };

    if (!allowed[currentStatus]?.includes(status)) {
      return res.status(400).json({ message: `Não podes passar de "${currentStatus}" para "${status}".` });
    }

    if ((status === 'accepted' || status === 'rejected') && !isProvider) {
      return res.status(403).json({ message: 'Apenas quem recebe o pedido pode aceitar ou rejeitar.' });
    }
    if (status === 'cancelled' && currentStatus === 'pending' && !isRequester) {
      return res.status(403).json({ message: 'Apenas quem criou o pedido o pode cancelar.' });
    }

    ex.status = status;
    await ex.save();

    // Notify other party
    const targetUserId = isRequester ? ex.provider_id : ex.requester_id;
    await Notification.create({
      user_id: String(targetUserId),
      type: 'exchange',
      title: 'Estado do pedido atualizado',
      body: `O pedido "${ex.skill}" está agora "${status}".`,
      link: `/exchanges/${ex.id}`
    });

    res.json(await enrichExchange(ex));
  } catch (err) {
    next(err);
  }
};

exports.stats = async (req, res, next) => {
  try {
    const userId = String(req.user ? req.user.id : req.query.userId);
    const items = (await Exchange.find({})).map(i => (i.toJSON ? i.toJSON() : i));
    const userItems = items.filter(i => String(i.requester_id) === userId || String(i.provider_id) === userId);

    const out = { pending: 0, accepted: 0, running: 0, completed: 0, rejected: 0, cancelled: 0 };
    userItems.forEach(i => {
      if (out[i.status] !== undefined) out[i.status]++;
    });
    out.total = Object.values(out).reduce((a, b) => a + b, 0);

    res.json(out);
  } catch (err) {
    next(err);
  }
};