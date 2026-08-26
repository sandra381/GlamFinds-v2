const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const multer = require('multer');
const path = require('path');
const upload = require('../config/multer'); 

router.post('/register', upload.single('imagen'), authController.register);
router.post('/login', authController.login);

module.exports = router;