// backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

router.get('/', userController.search);
router.get('/search', userController.search);
router.get('/leaderboard', userController.leaderboard);
router.get('/filter-options', userController.filterOptions);
router.get('/suggestions', userController.suggestions);

router.get('/blocked', authMiddleware, userController.listBlocked);
router.post('/block/:targetId', authMiddleware, userController.blockUser);
router.delete('/block/:targetId', authMiddleware, userController.unblockUser);

router.get('/:id', userController.getById);
router.put('/:id', authMiddleware, userController.update);

router.get('/:id/skills', userController.listSkills);
router.post('/:id/skills', authMiddleware, userController.addSkill);
router.delete('/:id/skills/:skillId', authMiddleware, userController.removeSkill);

router.get('/:id/interests', userController.listInterests);
router.post('/:id/interests', authMiddleware, userController.addInterest);
router.delete('/:id/interests/:name', authMiddleware, userController.removeInterest);

module.exports = router;