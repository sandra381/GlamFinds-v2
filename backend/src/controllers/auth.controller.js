const conn = require('../config/database');

// Registrar usuario
exports.register = (req, res) => {
    const imagePath = req.file;
    if (!imagePath) {
        return res.json({ status: 0, mensaje: "No se proporcionó una imagen", datos: [] });
    }
    const path_value = imagePath.filename;
    const { usuario, nombre, apellido, edad, sexo, correo, contrase, descripcion } = req.body;
    const query = `INSERT INTO usuarios (usuario, nombre, apellido, edad, sexo, correo, contrase, imagen, descripcion) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [usuario, nombre, apellido, edad, sexo, correo, contrase, path_value, descripcion];
    conn.query(query, values, (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "Error al insertar usuario en la BD", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Usuario insertado con éxito", datos: filas });
        }
    });
};

// Login (verificar usuario)
exports.login = (req, res) => {
    let consulta = `SELECT id_user, usuario, contrase FROM usuarios WHERE usuario = ? AND contrase = ?`;
    conn.query(consulta, [req.body.usuario, req.body.contrase], (error, filas) => {
        if (error) {
            res.status(500).json({ status: 0, mensaje: "Err Base de datos" });
        } else {
            if (filas.length > 0) {
                res.json({ status: 1, mensaje: "Usuario exitoso", datos: filas });
            } else {
                res.status(400).json({ status: 0, mensaje: "No se encontró usuario que coincida con la clave" });
            }
        }
    });
};