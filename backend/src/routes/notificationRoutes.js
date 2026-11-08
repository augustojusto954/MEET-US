// backend/src/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/auth');

router.get('/unread-count', authMiddleware, notificationController.unreadCount);
router.put('/read-all', authMiddleware, notificationController.markAllRead);
router.delete('/clear-all', authMiddleware, notificationController.clearAll);

router.get('/', authMiddleware, notificationController.list);
router.put('/:id/read', authMiddleware, notificationController.markRead);
router.delete('/:id', authMiddleware, notificationController.remove);

module.exports = router;