// backend/src/routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { optionalAuth, authMiddleware } = require('../middlewares/auth');

router.get('/', optionalAuth, postController.list);
router.post('/', authMiddleware, postController.create);
router.post('/:id/like', authMiddleware, postController.toggleLike);
router.post('/:id/comment', authMiddleware, postController.addComment);
router.post('/:id/comments', authMiddleware, postController.addComment);

module.exports = router;
