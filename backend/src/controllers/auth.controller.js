const conn = require('../config/database');

// Registrar usuario
exports.register = async (req, res) => {
    try {
        const imagePath = req.file;
        if (!imagePath) {
            return res.json({ status: 0, mensaje: "No se proporcionó una imagen", datos: [] });
        }

        // Usar URL de S3
        const imageUrl = imagePath.location || imagePath.filename;

        const { usuario, nombre, apellido, edad, sexo, correo, contrase, descripcion } = req.body;

        const query = `INSERT INTO usuarios (usuario, nombre, apellido, edad, sexo, correo, contrase, imagen, descripcion) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [usuario, nombre, apellido, edad, sexo, correo, contrase, imageUrl, descripcion];

        const [result] = await conn.query(query, values);
        res.json({ status: 1, mensaje: "Usuario insertado con éxito", datos: result });

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.json({ status: 0, mensaje: "Error al insertar usuario en la BD", datos: [] });
    }
};

// Login (verificar usuario)
exports.login = async (req, res) => {
    try {
        const { usuario, contrase } = req.body;
        const query = `SELECT id_user, usuario, contrase FROM usuarios WHERE usuario = ? AND contrase = ?`;
        const [rows] = await conn.query(query, [usuario, contrase]);

        if (rows.length > 0) {
            res.json({ status: 1, mensaje: "Usuario exitoso", datos: rows });
        } else {
            res.status(400).json({ status: 0, mensaje: "No se encontró usuario que coincida con la clave" });
        }
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ status: 0, mensaje: "Error en la base de datos" });
    }
};