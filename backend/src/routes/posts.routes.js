const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts.controller');
const path = require('path');
const upload = require('../config/multer'); 

// Rutas principales
router.post('/agregar', upload.single('imagen'), postsController.createPost);
router.get('/obtener', postsController.getPosts);
router.get('/:id', postsController.getPostById);
router.put('/:id', postsController.updatePost);
router.delete('/:id', postsController.deletePost);


module.exports = router;