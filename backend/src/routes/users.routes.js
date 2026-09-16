const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const multer = require('multer');
const path = require('path');
const upload = require('../config/multer'); 

router.get('/:id', usersController.getUser);
router.get('/getsave/:id', usersController.getSavedPosts);
router.get('/getdescripcion/:id', usersController.getUserDescription);
router.get('/PostPerfil/:id', usersController.getProfilePosts);
router.get('/PostDes/:id', usersController.getPostDescription);
router.put('/update2/:id', upload.single('imagen'), usersController.updateProfile);

// Follows
router.post('/follow', usersController.follow);
router.post('/unfollow', usersController.unfollow);
router.get('/is-following/:follower_id/:following_id', usersController.isFollowing);
router.get('/followers/:id', usersController.getFollowers);
router.get('/following/:id', usersController.getFollowing);
router.get('/user-stats/:id', usersController.getUserStats);

module.exports = router;