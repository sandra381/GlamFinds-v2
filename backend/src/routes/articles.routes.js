const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articles.controller');
const multer = require('multer');
const path = require('path');
const upload = require('../config/multer.js'); 

// CRUD
router.post('/crear', upload.single('imagen'), articlesController.createArticle);
router.get('/obtenerArticulos', articlesController.getArticles);

// Interacciones
router.get('/getComentariosART/:id', articlesController.getCommentsART);
router.get('/countLikeART/:id', articlesController.countLikeART);
router.post('/likesART', articlesController.likeART);
router.post('/saveART', articlesController.saveART);
router.post('/commentsART', articlesController.createCommentART);
router.delete('/borrarLikesART/:id/:id2', articlesController.deleteLikeART);
router.delete('/borrarSavesART/:id/:id2', articlesController.deleteSaveART);
router.post('/updateComART/:id3', articlesController.updateCommentART);
router.delete('/borrarCommentART/:id/:id2/:id3', articlesController.deleteCommentART);
router.get('/getCommentART/:id/:id2/:id3', articlesController.getCommentART);
router.get('/getsaveA/:id', articlesController.getSaveA);

module.exports = router;