// backend/src/controllers/userController.js
const { User, Block } = require('../models');

exports.search = async (req, res, next) => {
  try {
    const {
      q = '',
      institution = '',
      course = '',
      city = '',
      skill = '',
      skillType = '',
      availability = '',
      onlyVerified,
      onlyOnline,
      sort = 'reputation',
      page = 1,
      limit = 12
    } = req.query;

    let users = await User.find({});
    users = users.map(u => (u.toJSON ? u.toJSON() : u));

    // Filters
    if (q) {
      const qLower = q.toLowerCase();
      users = users.filter(u =>
        (u.name && u.name.toLowerCase().includes(qLower)) ||
        (u.bio && u.bio.toLowerCase().includes(qLower)) ||
        (u.course && u.course.toLowerCase().includes(qLower))
      );
    }

    if (institution) {
      users = users.filter(u => u.institution === institution);
    }
    if (course) {
      const cLower = course.toLowerCase();
      users = users.filter(u => u.course && u.course.toLowerCase().includes(cLower));
    }
    if (city) {
      users = users.filter(u => u.city === city);
    }
    if (availability) {
      users = users.filter(u => u.availability === availability);
    }
    if (onlyVerified === 'true' || onlyVerified === true) {
      users = users.filter(u => !!u.verified);
    }
    if (onlyOnline === 'true' || onlyOnline === true) {
      users = users.filter(u => !!u.online);
    }
    if (skill) {
      const sLower = skill.toLowerCase();
      users = users.filter(u => {
        if (!u.skills || !Array.isArray(u.skills)) return false;
        return u.skills.some(s => {
          const matchName = s.name && s.name.toLowerCase().includes(sLower);
          if (!matchName) return false;
          if (skillType && skillType !== 'both') {
            return s.type === skillType || s.type === 'both';
          }
          return true;
        });
      });
    }

    // Sort
    switch (sort) {
      case 'recent':
        users.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'name':
        users.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'reviews':
        users.sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0));
        break;
      default:
        users.sort((a, b) => {
          const repDiff = (b.reputation || 0) - (a.reputation || 0);
          if (repDiff !== 0) return repDiff;
          return (b.reviews_count || 0) - (a.reviews_count || 0);
        });
    }

    const total = users.length;
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.max(1, parseInt(limit, 10) || 12);
    const start = (p - 1) * l;
    const items = users.slice(start, start + l);

    res.json({
      items,
      total,
      page: p,
      limit: l,
      pages: Math.max(1, Math.ceil(total / l))
    });
  } catch (err) {
    next(err);
  }
};

exports.leaderboard = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    let users = await User.find({});
    users = users.map(u => (u.toJSON ? u.toJSON() : u));
    users.sort((a, b) => {
      const rep = (b.reputation || 0) - (a.reputation || 0);
      if (rep !== 0) return rep;
      return (b.reviews_count || 0) - (a.reviews_count || 0);
    });
    res.json(users.slice(0, limit));
  } catch (err) {
    next(err);
  }
};

exports.filterOptions = async (req, res, next) => {
  try {
    const users = (await User.find({})).map(u => (u.toJSON ? u.toJSON() : u));
    const institutions = [...new Set(users.map(u => u.institution).filter(Boolean))].sort();
    const courses = [...new Set(users.map(u => u.course).filter(Boolean))].sort();
    const cities = [...new Set(users.map(u => u.city).filter(Boolean))].sort();

    const skillSet = new Set();
    users.forEach(u => {
      if (Array.isArray(u.skills)) {
        u.skills.forEach(s => {
          if (s.name) skillSet.add(s.name);
        });
      }
    });

    res.json({
      institutions,
      courses,
      cities,
      skills: [...skillSet].sort()
    });
  } catch (err) {
    next(err);
  }
};

exports.suggestions = async (req, res, next) => {
  try {
    const userId = req.query.userId || (req.user && req.user.id);
    const limit = parseInt(req.query.limit, 10) || 6;
    const me = await User.findById(userId);
    let users = await User.find({});
    users = users
      .map(u => (u.toJSON ? u.toJSON() : u))
      .filter(u => String(u.id) !== String(userId));

    if (me) {
      users.forEach(u => {
        let score = 0;
        if (u.institution && u.institution === me.institution) score += 20;
        if (u.course === me.course) score += 10;
        if (u.city && u.city === me.city) score += 5;
        score += (u.reputation || 0) * 2;
        u.score = score;
      });
      users.sort((a, b) => (b.score || 0) - (a.score || 0));
    }

    res.json(users.slice(0, limit));
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Estudante não encontrado.' });
    }
    res.json(user.toJSON ? user.toJSON() : user);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const currentUserId = req.user?.id || req.user?._id;
    if (currentUserId && String(currentUserId) !== String(req.params.id) && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Não tem permissão para alterar o perfil de outro estudante.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilizador não encontrado.' });
    }

    const allowed = ['name', 'bio', 'institution', 'course', 'year', 'city', 'availability', 'avatar', 'online'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    if (req.body.password && typeof req.body.password === 'string' && req.body.password.trim().length >= 6) {
      user.password = req.body.password.trim();
    }

    // Nenhum estudante pode alterar o seu próprio papel ou virar admin
    if (user.role !== 'admin') {
      user.role = 'student';
    }

    await user.save();
    res.json(user.toJSON ? user.toJSON() : user);
  } catch (err) {
    next(err);
  }
};

// Skills
exports.listSkills = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilizador não encontrado.' });
    res.json(user.skills || []);
  } catch (err) {
    next(err);
  }
};

exports.addSkill = async (req, res, next) => {
  try {
    const { name, type, level } = req.body;
    if (!name || !type) return res.status(400).json({ message: 'Nome e tipo são obrigatórios.' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilizador não encontrado.' });

    if (!user.skills) user.skills = [];
    const newSkill = {
      _id: Date.now().toString(),
      name,
      type,
      level: level || 'Intermédio'
    };
    user.skills.push(newSkill);
    await user.save();

    res.status(201).json(newSkill);
  } catch (err) {
    next(err);
  }
};

exports.removeSkill = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilizador não encontrado.' });

    const skillId = String(req.params.skillId);
    user.skills = (user.skills || []).filter(s => String(s._id || s.id || s.name) !== skillId);
    await user.save();

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// Interests
exports.listInterests = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilizador não encontrado.' });
    res.json(user.interests || []);
  } catch (err) {
    next(err);
  }
};

exports.addInterest = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Nome do interesse é obrigatório.' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilizador não encontrado.' });

    if (!user.interests) user.interests = [];
    if (!user.interests.includes(name)) {
      user.interests.push(name);
      await user.save();
    }

    res.status(201).json({ name });
  } catch (err) {
    next(err);
  }
};

exports.removeInterest = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilizador não encontrado.' });

    const interestName = decodeURIComponent(req.params.name);
    user.interests = (user.interests || []).filter(i => (typeof i === 'string' ? i : i.name) !== interestName);
    await user.save();

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// Privacy / Blocking
exports.blockUser = async (req, res, next) => {
  try {
    const blockerId = req.user.id;
    const blockedId = req.params.targetId;
    await Block.create({ blocker_id: blockerId, blocked_id: blockedId });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.unblockUser = async (req, res, next) => {
  try {
    const blockerId = req.user.id;
    const blockedId = req.params.targetId;
    await Block.deleteOne({ blocker_id: blockerId, blocked_id: blockedId });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.listBlocked = async (req, res, next) => {
  try {
    const blocks = await Block.find({ blocker_id: req.user.id });
    const blockedIds = blocks.map(b => b.blocked_id);
    const users = await User.find({ _id: { $in: blockedIds } });
    res.json(users);
  } catch (err) {
    next(err);
  }
};