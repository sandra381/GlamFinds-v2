const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articles.controller');

// CRUD
router.post('/', articlesController.createArticle);
router.get('/', articlesController.getArticles);

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