// backend/src/models/index.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { getStoreCollection } = require('./store');

// --- User Schema ---
const userSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  institution: { type: String, default: '' },
  course: { type: String, default: '' },
  year: { type: Number, default: 1 },
  city: { type: String, default: 'Maputo' },
  availability: { type: String, default: 'Flexível' },
  reputation: { type: Number, default: 5.0 },
  reviews_count: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  online: { type: Boolean, default: false },
  role: { type: String, enum: ['student', 'admin', 'moderator'], default: 'student' },
  skills: [
    {
      name: { type: String, required: true },
      type: { type: String, enum: ['offer', 'seek', 'both'], default: 'offer' },
      level: { type: String, default: 'Intermédio' }
    }
  ],
  interests: [{ type: String }],
  blockedUsers: [{ type: String }]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = String(ret._id);
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = String(ret._id);
      return ret;
    }
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Se a palavra-passe já estiver em formato de hash bcrypt ($2a$ ou $2b$), NÃO fazer hash novamente!
  if (this.password && (this.password.startsWith('$2a$') || this.password.startsWith('$2b$'))) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidate) {
  if (!this.password || !candidate) return false;
  if (this.password === candidate) return true;
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    try {
      return await bcrypt.compare(candidate, this.password);
    } catch (_) {
      return false;
    }
  }
  return false;
};

// --- Exchange Schema ---
const exchangeSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  requester_id: { type: String, required: true },
  provider_id: { type: String, required: true },
  skill: { type: String, required: true },
  message: { type: String, default: '' },
  scheduled_at: { type: String, default: null },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled', 'running', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// --- Conversation Schema ---
const conversationSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  user_a: { type: String, required: true },
  user_b: { type: String, required: true },
  last_message: { type: String, default: '' },
  last_message_at: { type: String, default: () => new Date().toISOString() }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// --- Message Schema ---
const messageSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  conversation_id: { type: String, required: true },
  sender_id: { type: String, required: true },
  type: { type: String, enum: ['text', 'image', 'file', 'audio', 'video'], default: 'text' },
  content: { type: String, default: '' },
  file_url: { type: String, default: '' },
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// --- Notification Schema ---
const notificationSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  user_id: { type: String, required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, default: '' },
  read: { type: Boolean, default: false },
  link: { type: String, default: '' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// --- Review Schema ---
const reviewSchema = new mongoose.Schema({
  exchange_id: { type: String, required: true },
  reviewer_id: { type: String, required: true },
  reviewed_id: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// --- Match Schema ---
const matchSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  user_a: { type: String, required: true },
  user_b: { type: String, required: true },
  score: { type: Number, default: 0 },
  status: { type: String, default: 'matched' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// --- Swipe Schema ---
const swipeSchema = new mongoose.Schema({
  swiper_id: { type: String, required: true },
  target_id: { type: String, required: true },
  action: { type: String, enum: ['like', 'pass'], required: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// --- Block Schema ---
const blockSchema = new mongoose.Schema({
  blocker_id: { type: String, required: true },
  blocked_id: { type: String, required: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// --- Report Schema ---
const reportSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  reporter_id: { type: String, required: true },
  reported_id: { type: String, required: true },
  reason: { type: String, required: true },
  details: { type: String, default: '' },
  status: { type: String, enum: ['open', 'reviewing', 'closed'], default: 'open' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// --- Post Schema ---
const postSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  author_id: { type: String, required: true },
  author_name: { type: String, default: '' },
  author_avatar: { type: String, default: '' },
  author_course: { type: String, default: '' },
  author_institution: { type: String, default: '' },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, default: 'Geral' },
  tags: [{ type: String }],
  likes_count: { type: Number, default: 0 },
  likes: [{ type: String }],
  comments: [
    {
      _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
      author_id: { type: String, required: true },
      author_name: { type: String, required: true },
      author_avatar: { type: String, default: '' },
      text: { type: String, required: true },
      created_at: { type: String, default: () => new Date().toISOString() }
    }
  ]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Smart Model Resolver
function getModel(name, schema) {
  return new Proxy({}, {
    get(target, prop) {
      const activeModel = global.__USE_MONGOOSE__
        ? (mongoose.models[name] || mongoose.model(name, schema))
        : getStoreCollection(name);
      const val = activeModel[prop];
      if (typeof val === 'function') {
        return val.bind(activeModel);
      }
      return val;
    }
  });
}

module.exports = {
  User: getModel('User', userSchema),
  Exchange: getModel('Exchange', exchangeSchema),
  Conversation: getModel('Conversation', conversationSchema),
  Message: getModel('Message', messageSchema),
  Notification: getModel('Notification', notificationSchema),
  Review: getModel('Review', reviewSchema),
  Match: getModel('Match', matchSchema),
  Swipe: getModel('Swipe', swipeSchema),
  Block: getModel('Block', blockSchema),
  Report: getModel('Report', reportSchema),
  Post: getModel('Post', postSchema)
};