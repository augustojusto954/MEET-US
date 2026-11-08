// backend/src/controllers/reviewController.js
const { Review, User, Exchange } = require('../models');

exports.listByUser = async (req, res, next) => {
  try {
    const userId = String(req.params.userId);
    let reviews = await Review.find({ reviewed_id: userId });
    reviews = reviews.map(r => (r.toJSON ? r.toJSON() : r));
    reviews.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const enriched = await Promise.all(
      reviews.map(async r => {
        const reviewer = await User.findById(r.reviewer_id);
        const exchange = await Exchange.findById(r.exchange_id);
        return {
          ...r,
          reviewer: reviewer ? { id: reviewer.id, name: reviewer.name, avatar: reviewer.avatar } : null,
          exchange: exchange ? { id: exchange.id, skill: exchange.skill } : null
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    next(err);
  }
};

exports.listGiven = async (req, res, next) => {
  try {
    const userId = String(req.params.userId);
    let reviews = await Review.find({ reviewer_id: userId });
    reviews = reviews.map(r => (r.toJSON ? r.toJSON() : r));
    reviews.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const enriched = await Promise.all(
      reviews.map(async r => {
        const reviewed = await User.findById(r.reviewed_id);
        const exchange = await Exchange.findById(r.exchange_id);
        return {
          ...r,
          reviewed: reviewed ? { id: reviewed.id, name: reviewed.name, avatar: reviewed.avatar } : null,
          exchange: exchange ? { id: exchange.id, skill: exchange.skill } : null
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const reviewerId = String(req.user ? req.user.id : req.body.reviewerId);
    const { exchangeId, reviewedId, rating, comment } = req.body;

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: 'Classificação inválida (deve ser entre 1 e 5).' });
    }

    const existing = await Review.findOne({
      exchange_id: String(exchangeId),
      reviewer_id: reviewerId
    });
    if (existing) {
      return res.status(400).json({ message: 'Já avaliaste esta troca.' });
    }

    const review = await Review.create({
      exchange_id: String(exchangeId),
      reviewer_id: reviewerId,
      reviewed_id: String(reviewedId),
      rating: numRating,
      comment: comment || ''
    });

    // Recalculate reputation and review count for the reviewed user
    const allReviews = (await Review.find({ reviewed_id: String(reviewedId) })).map(r => (r.toJSON ? r.toJSON() : r));
    const totalRating = allReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
    const avgRating = allReviews.length > 0 ? +(totalRating / allReviews.length).toFixed(2) : 5.0;

    const targetUser = await User.findById(reviewedId);
    if (targetUser) {
      targetUser.reputation = avgRating;
      targetUser.reviews_count = allReviews.length;
      await targetUser.save();
    }

    res.status(201).json(review.toJSON ? review.toJSON() : review);
  } catch (err) {
    next(err);
  }
};