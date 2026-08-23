const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
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

router.get('/:id', usersController.getUser);
router.get('/getsave/:id', usersController.getSavedPosts);
router.get('/getdescripcion/:id', usersController.getUserDescription);
router.get('/PostPerfil/:id', usersController.getProfilePosts);
router.get('/PostDes/:id', usersController.getPostDescription);
router.put('/update2/:id', upload.single('imagen'), usersController.updateProfile);

// Follows
router.post('/follow', usersController.follow);
router.post('/unfollow', usersController.unfollow);
router.get('/followers/:id', usersController.getFollowers);
router.get('/following/:id', usersController.getFollowing);
router.get('/user-stats/:id', usersController.getUserStats);

module.exports = router;