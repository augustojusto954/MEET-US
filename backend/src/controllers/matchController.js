// backend/src/controllers/matchController.js
const { User, Match, Swipe, Block } = require('../models');

function computeScore(me, other) {
  let score = 0;
  const myOffers = (me.skills || []).filter(s => s.type !== 'seek').map(s => s.name);
  const mySeeks = (me.skills || []).filter(s => s.type !== 'offer').map(s => s.name);

  const otherOffers = (other.skills || []).filter(s => s.type !== 'seek').map(s => s.name);
  const otherSeeks = (other.skills || []).filter(s => s.type !== 'offer').map(s => s.name);

  // Skills que eu procuro e outro oferece
  score += otherOffers.filter(s => mySeeks.includes(s)).length * 25;
  // Skills que outro procura e eu ofereço
  score += myOffers.filter(s => otherSeeks.includes(s)).length * 25;
  // Interesses comuns
  const myInt = me.interests || [];
  const otherInt = other.interests || [];
  score += myInt.filter(i => otherInt.includes(i)).length * 10;
  // Mesma instituicao
  if (me.institution && me.institution === other.institution) score += 10;
  // Reputacao
  score += (other.reputation || 0) * 2;

  return Math.min(100, Math.round(score));
}

exports.getCandidates = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : req.query.userId;
    const limit = parseInt(req.query.limit, 10) || 20;

    const me = await User.findById(userId);
    if (!me) return res.json([]);

    const swipes = await Swipe.find({ swiper_id: String(userId) });
    const swipedTargets = swipes.map(s => String(s.target_id));

    const blocks = await Block.find({ blocker_id: String(userId) });
    const blockedTargets = blocks.map(b => String(b.blocked_id));

    const exclude = new Set([String(userId), ...swipedTargets, ...blockedTargets]);

    let users = await User.find({});
    users = users
      .map(u => (u.toJSON ? u.toJSON() : u))
      .filter(u => !exclude.has(String(u.id)));

    const candidates = users
      .map(u => ({
        ...u,
        score: computeScore(me, u)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    res.json(candidates);
  } catch (err) {
    next(err);
  }
};

exports.swipe = async (req, res, next) => {
  try {
    const swiperId = req.user ? req.user.id : req.body.swiperId;
    const { targetId, action } = req.body;

    if (!targetId || !action) {
      return res.status(400).json({ message: 'targetId e action são obrigatórios.' });
    }

    await Swipe.deleteOne({ swiper_id: String(swiperId), target_id: String(targetId) });
    await Swipe.create({
      swiper_id: String(swiperId),
      target_id: String(targetId),
      action
    });

    if (action === 'like') {
      const reciprocal = await Swipe.findOne({
        swiper_id: String(targetId),
        target_id: String(swiperId),
        action: 'like'
      });

      if (reciprocal) {
        const userA = String(swiperId) < String(targetId) ? String(swiperId) : String(targetId);
        const userB = String(swiperId) > String(targetId) ? String(swiperId) : String(targetId);

        let existingMatch = await Match.findOne({ user_a: userA, user_b: userB });
        if (!existingMatch) {
          existingMatch = await Match.create({
            user_a: userA,
            user_b: userB,
            score: 100,
            status: 'matched'
          });
        }
        return res.json({ matched: true, match: existingMatch });
      }
    }

    res.json({ matched: false });
  } catch (err) {
    next(err);
  }
};

exports.listMatches = async (req, res, next) => {
  try {
    const userId = String(req.user ? req.user.id : req.query.userId);

    const matches = await Match.find({
      $or: [{ user_a: userId }, { user_b: userId }]
    });

    const enriched = await Promise.all(
      matches.map(async m => {
        const raw = m.toJSON ? m.toJSON() : m;
        const otherId = raw.user_a === userId ? raw.user_b : raw.user_a;
        const other = await User.findById(otherId);
        return {
          ...raw,
          other: other ? (other.toJSON ? other.toJSON() : other) : null
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    next(err);
  }
};