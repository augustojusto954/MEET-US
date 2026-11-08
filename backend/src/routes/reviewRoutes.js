// backend/src/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/auth');

router.get('/user/:userId', reviewController.listByUser);
router.get('/given/:userId', reviewController.listGiven);
router.post('/', authMiddleware, reviewController.create);

module.exports = router;