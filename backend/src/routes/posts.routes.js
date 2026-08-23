const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts.controller');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'C:\\Users\\danie\\OneDrive\\Escritorio\\GlamFinds-v2\\frontend\\src\\assets\\img');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});
const upload = multer({ storage: storage });

// Rutas principales
router.post('/agregar', upload.single('imagen'), postsController.createPost);
router.get('/obtener', postsController.getPosts);
router.get('/:id', postsController.getPostById);
router.put('/:id', postsController.updatePost);
router.delete('/:id', postsController.deletePost);


module.exports = router;