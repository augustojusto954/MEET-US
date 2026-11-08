// backend/src/routes/exchangeRoutes.js
const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/exchangeController');
const authMiddleware = require('../middlewares/auth');

router.get('/stats', authMiddleware, exchangeController.stats);
router.get('/', authMiddleware, exchangeController.list);
router.post('/', authMiddleware, exchangeController.create);
router.get('/:id', authMiddleware, exchangeController.getById);
router.put('/:id/status', authMiddleware, exchangeController.updateStatus);

module.exports = router;