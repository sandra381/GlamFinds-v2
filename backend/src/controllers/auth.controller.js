const conn = require('../config/database');
const bcrypt = require('bcryptjs');

// Registrar usuario
exports.register = async (req, res) => {
    try {
        const imagePath = req.file;
        if (!imagePath) {
            return res.json({ status: 0, mensaje: "No se proporcionó una imagen", datos: [] });
        }
        const imageUrl = imagePath.location || imagePath.filename;
        const { usuario, nombre, apellido, edad, sexo, correo, contrase, descripcion } = req.body;
        const hashedPassword = await bcrypt.hash(contrase, 10);
        const query = `INSERT INTO usuarios (usuario, nombre, apellido, edad, sexo, correo, contrase, imagen, descripcion) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [usuario, nombre, apellido, edad, sexo, correo, hashedPassword, imageUrl, descripcion];
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
        const query = `SELECT id_user, usuario, contrase, nombre, imagen FROM usuarios WHERE usuario = ?`;
        const [rows] = await conn.query(query, [usuario]);
        if (rows.length === 0) {
            return res.status(400).json({ status: 0, mensaje: "No se encontró usuario que coincida con la clave" });
        }
        const user = rows[0];
        const storedPassword = user.contrase;
        const isHashed = storedPassword && storedPassword.startsWith('$2');
        let passwordMatch = false;
        if (isHashed) {
            passwordMatch = await bcrypt.compare(contrase, storedPassword);
        } else {
            passwordMatch = (contrase === storedPassword);
            if (passwordMatch) {
                const newHash = await bcrypt.hash(contrase, 10);
                await conn.query('UPDATE usuarios SET contrase = ? WHERE id_user = ?', [newHash, user.id_user]);
                console.log(`🔄 Contraseña migrada a hash para usuario: ${usuario}`);
            }
        }
        if (passwordMatch) {
            res.json({status: 1,mensaje: "Usuario exitoso", datos: [{ id_user: user.id_user, usuario: user.usuario, nombre: user.nombre, imagen: user.imagen }]
            });
        } else {
            res.status(400).json({ status: 0, mensaje: "No se encontró usuario que coincida con la clave" });
        }
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ status: 0, mensaje: "Error en la base de datos" });
    }
};