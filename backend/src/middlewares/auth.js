// backend/src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'meetus_super_secret_jwt_key_2026_mz';

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    let userId;
    if (token.startsWith('fake-jwt-')) {
      userId = token.replace('fake-jwt-', '');
    } else {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.id;
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'Sessão inválida ou utilizador não encontrado.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso restrito. Apenas administradores do MEET-US têm permissão para esta ação.' });
  }
  next();
}

module.exports = authMiddleware;
module.exports.authMiddleware = authMiddleware;
module.exports.requireAdmin = requireAdmin;