const express = require('express');
const router = express.Router();
const toolsController = require('../controllers/tools.controller');

console.log(toolsController);

router.post('/extract-colors', toolsController.extractColors);
router.get('/generar-look', toolsController.generateRandomLook);
router.get('/generar-lookM', toolsController.generateRandomLookM);
router.get('/prendas', toolsController.getPrendas);
router.get('/obtenerprenda', toolsController.getPostImages); // obsoleto
router.get('/api-fashion-trends', toolsController.getNews);

module.exports = router;