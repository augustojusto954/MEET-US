// backend/src/routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const optionalAuth = require('../middlewares/auth').optionalAuth || ((req, res, next) => next());

router.get('/', postController.list);
router.post('/', postController.create);
router.post('/:id/like', postController.toggleLike);
router.post('/:id/comment', postController.addComment);

module.exports = router;
