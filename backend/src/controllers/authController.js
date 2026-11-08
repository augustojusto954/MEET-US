// backend/src/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'meetus_super_secret_jwt_key_2026_mz';

function createToken(user) {
  return jwt.sign({ id: user.id || user._id, email: user.email, role: user.role || 'student' }, JWT_SECRET, {
    expiresIn: '7d'
  });
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, institution, course, year } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Preenche todos os campos obrigatórios.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Este e-mail já está registado.' });
    }

    let hashedPassword = password;
    if (!password.startsWith('$2a$') && !password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'student',
      institution: institution || '',
      course: course || '',
      year: year || 1,
      avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=400&fit=crop&crop=faces',
      bio: '',
      city: 'Maputo',
      availability: 'Flexível',
      skills: [],
      interests: []
    });

    const token = createToken(user);
    res.status(201).json({ token, user: user.toJSON ? user.toJSON() : user });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e palavra-passe são obrigatórios.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = createToken(user);
    res.json({ token, user: user.toJSON ? user.toJSON() : user });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    res.json(req.user.toJSON ? req.user.toJSON() : req.user);
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Informe o e-mail.' });
    }
    res.json({ message: 'Se o e-mail existir, enviámos instruções para recuperação.' });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { current, next: newPassword } = req.body;
    if (!current || !newPassword) {
      return res.status(400).json({ message: 'Preenche a palavra-passe atual e nova.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utilizador não encontrado.' });

    const isMatch = await user.comparePassword(current);
    if (!isMatch) {
      return res.status(400).json({ message: 'A palavra-passe atual está incorreta.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ success: true, message: 'Palavra-passe alterada com sucesso!' });
  } catch (err) {
    next(err);
  }
};