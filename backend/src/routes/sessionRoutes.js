// backend/src/routes/sessionRoutes.js
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const authMiddleware = require('../middlewares/auth');

// Listar sessões (Público / Autenticado)
router.get('/', sessionController.getSessions);

// Obter detalhes de uma sessão
router.get('/:id', sessionController.getSessionById);

// Criar nova sessão em directo (Requer auth)
router.post('/', authMiddleware, sessionController.createSession);

// Atualizar status da sessão (Requer auth)
router.put('/:id/status', authMiddleware, sessionController.updateSessionStatus);

// Participante entra na aula
router.post('/:id/join', authMiddleware, sessionController.joinSession);

// Participante sai da aula
router.post('/:id/leave', authMiddleware, sessionController.leaveSession);

// Mentor remove participante (Kick)
router.post('/:id/kick', authMiddleware, sessionController.kickParticipant);

// Enviar mensagem no chat da sessão
router.post('/:id/chat', authMiddleware, sessionController.sendChatMessage);

module.exports = router;
