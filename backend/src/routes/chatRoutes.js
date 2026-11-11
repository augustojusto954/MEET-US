// backend/src/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/auth');

router.get('/conversations', authMiddleware, chatController.listConversations);
router.post('/conversations', authMiddleware, chatController.getOrCreate);
router.get('/conversations/:id/messages', authMiddleware, chatController.listMessages);
router.put('/conversations/:id/read', authMiddleware, chatController.markRead);
router.post('/messages', authMiddleware, chatController.sendMessage);
router.post('/upload', authMiddleware, chatController.uploadMiddleware, chatController.uploadFile);

module.exports = router;