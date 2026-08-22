const express = require('express');
const router = express.Router();
const interactionsController = require('../controllers/interactions.controller');

// Likes
router.get('/countLike/:id', interactionsController.countLike);
router.post('/likes', interactionsController.like);
router.delete('/borrarLikes/:id/:id2', interactionsController.deleteLike);

// Saves
router.post('/save', interactionsController.save);
router.delete('/borrarSaves/:id/:id2', interactionsController.deleteSave);

// Comentarios
router.get('/getComentarios/:id', interactionsController.getComments);
router.post('/comments', interactionsController.createComment);
router.post('/updateCom/:id3', interactionsController.updateComment);
router.delete('/borrarComment/:id/:id2/:id3', interactionsController.deleteComment);
router.get('/getComment/:id/:id2/:id3', interactionsController.getComment);

// Publicidad (P)
router.get('/countLikeP/:id', interactionsController.countLikeP);
router.get('/getCommentsP/:id', interactionsController.getCommentsP);
router.post('/commentsP', interactionsController.createCommentP);
router.post('/likesP', interactionsController.likeP);
router.post('/saveP', interactionsController.saveP);
router.delete('/borrarLikesP/:id/:id2', interactionsController.deleteLikeP);
router.delete('/borrarSavesP/:id/:id2', interactionsController.deleteSaveP);
router.post('/updateComP/:id3', interactionsController.updateCommentP);
router.delete('/borrarCommentP/:id/:id2/:id3', interactionsController.deleteCommentP);
router.get('/getCommentP/:id/:id2/:id3', interactionsController.getCommentP);

module.exports = router;