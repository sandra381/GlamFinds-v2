const express = require('express');
const router = express.Router();
const outfitController = require('../controllers/outfit.controller');

router.post('/generar', outfitController.generateOutfit);
router.post('/guardar', outfitController.saveOutfit);
router.get('/guardados/:id_usuario', outfitController.getSavedOutfits);
router.delete('/eliminar/:id_outfit', outfitController.deleteSavedOutfit);

module.exports = router;