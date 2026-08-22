const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feed.controller');

router.get('/trending', feedController.getTrending);
router.get('/following/:id', feedController.getFollowingFeed);
router.post('/actualizarPreferencias', feedController.updatePreferences);
router.get('/parati/:id', feedController.getParaTi);
router.get('/categorias', feedController.getCategories);

module.exports = router;