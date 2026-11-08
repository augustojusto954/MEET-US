// backend/src/routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const authMiddleware = require('../middlewares/auth');

router.get('/candidates', authMiddleware, matchController.getCandidates);
router.post('/swipe', authMiddleware, matchController.swipe);
router.get('/matches', authMiddleware, matchController.listMatches);

module.exports = router;