const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const multer = require('multer');
const path = require('path');

// Configuración de multer (ajusta la ruta)
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

router.post('/register', upload.single('imagen'), authController.register);
router.post('/login', authController.login);

module.exports = router;