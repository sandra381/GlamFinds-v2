const conn = require('../config/database');

// ===== CRUD ARTÍCULOS =====
exports.createArticle = async (req, res) => {
    try {
        const { titulo, contenido, autor, categoria } = req.body;

        if (!titulo || !contenido || !autor || !categoria) {
            return res.status(400).json({
                status: 0,
                mensaje: "Faltan campos obligatorios: titulo, contenido, autor, categoria"
            });
        }

        const imagen = req.file ? (req.file.location || req.file.filename) : '';

        const query = `INSERT INTO posts_articulos (titulo, contenido, imagen, autor, categoria) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await conn.query(query, [titulo, contenido, imagen, autor, categoria]);

        return res.json({ status: 1, mensaje: "Artículo ingresado con éxito", datos: result });
    } catch (error) {
        console.error('Error al crear artículo:', error);
        return res.status(500).json({ status: 0, mensaje: "Error al insertar en la BD", error: error.message });
    }
};

exports.getArticles = async (req, res) => {
    try {
        const query = `
            SELECT p.id_post, p.titulo, p.contenido, p.imagen, 
                   u.id_user, u.usuario, c.id_categoria, c.name_categoria
            FROM posts_articulos p
            JOIN usuarios u ON p.autor = u.id_user
            JOIN categorias c ON p.categoria = c.id_categoria
            ORDER BY p.id_post DESC
        `;
        const [rows] = await conn.query(query);
        res.json({ status: 1, mensaje: "Artículos obtenidos con éxito", datos: rows });
    } catch (error) {
        res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
    }
};

// ===== INTERACCIONES ARTÍCULOS =====
exports.getCommentsART = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT 
                c.navegante, u.usuario, c.comments, c.id_comment,
                u.imagen AS usuario_imagen
            FROM comments_articulos c
            JOIN usuarios u ON c.navegante = u.id_user
            WHERE c.post = ?
        `;
        const [rows] = await conn.query(query, [id]);
        res.json({ status: 1, mensaje: "Comentarios obtenidos", datos: rows });
    } catch (error) {
        res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
    }
};

exports.countLikeART = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT COUNT(*) AS cantidad FROM likes_articulos WHERE post = ?';
        const [rows] = await conn.query(query, [id]);
        res.json({ status: 1, mensaje: "Cantidad de likes obtenida", datos: rows });
    } catch (error) {
        res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
    }
};

exports.likeART = async (req, res) => {
    try {
        const query = `INSERT INTO likes_articulos(post, navegante) VALUES(?, ?)`;
        await conn.query(query, [req.body.post, req.body.navegante]);
        res.json({ status: 1, mensaje: "Like insertado con éxito", datos: [] });
    } catch (error) {
        res.json({ status: 0, mensaje: "Error al insertar like", datos: [] });
    }
};

exports.saveART = async (req, res) => {
    try {
        const query = `INSERT INTO save_articulos(post, navegante) VALUES(?, ?)`;
        await conn.query(query, [req.body.post, req.body.navegante]);
        res.json({ status: 1, mensaje: "Artículo guardado con éxito", datos: [] });
    } catch (error) {
        res.json({ status: 0, mensaje: "Error al guardar", datos: [] });
    }
};

exports.createCommentART = async (req, res) => {
    try {
        const { post, navegante, comments } = req.body;
        const query = `INSERT INTO comments_articulos(post, navegante, comments) VALUES(?, ?, ?)`;
        await conn.query(query, [post, navegante, comments]);
        res.json({ status: 1, mensaje: "Comentario insertado con éxito", datos: [] });
    } catch (error) {
        res.json({ status: 0, mensaje: "Error al insertar comentario", datos: [] });
    }
};

exports.deleteLikeART = async (req, res) => {
    try {
        const query = `DELETE FROM likes_articulos WHERE post = ? AND navegante = ?`;
        await conn.query(query, [req.params.id, req.params.id2]);
        res.json({ status: 1, mensaje: "Like eliminado", datos: [] });
    } catch (error) {
        res.json({ status: 0, mensaje: "Error en la eliminación", datos: [] });
    }
};

exports.deleteSaveART = async (req, res) => {
    try {
        const query = `DELETE FROM save_articulos WHERE post = ? AND navegante = ?`;
        await conn.query(query, [req.params.id, req.params.id2]);
        res.json({ status: 1, mensaje: "Save eliminado", datos: [] });
    } catch (error) {
        res.json({ status: 0, mensaje: "Error en la eliminación", datos: [] });
    }
};

exports.updateCommentART = async (req, res) => {
    try {
        const { post, navegante, comments } = req.body;
        const query = `UPDATE comments_articulos SET post = ?, navegante = ?, comments = ? WHERE id_comment = ?`;
        await conn.query(query, [post, navegante, comments, req.params.id3]);
        res.json({ status: 1, mensaje: "Comentario modificado con éxito", datos: [] });
    } catch (error) {
        res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
    }
};

exports.deleteCommentART = async (req, res) => {
    try {
        const query = `DELETE FROM comments_articulos WHERE post = ? AND navegante = ? AND id_comment = ?`;
        await conn.query(query, [req.params.id, req.params.id2, req.params.id3]);
        res.json({ status: 1, mensaje: "Comentario eliminado", datos: [] });
    } catch (error) {
        res.json({ status: 0, mensaje: "Error en la eliminación", datos: [] });
    }
};

exports.getCommentART = async (req, res) => {
    try {
        const query = `SELECT id_comment, post, navegante, comments FROM comments_articulos WHERE post = ? AND navegante = ? AND id_comment = ?`;
        const [rows] = await conn.query(query, [req.params.id, req.params.id2, req.params.id3]);
        res.json({ status: 1, mensaje: "Comentario obtenido", datos: rows });
    } catch (error) {
        res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
    }
};

exports.getSaveA = async (req, res) => {
    try {
        const query = `
            SELECT p.id_post, p.titulo, p.contenido, u.usuario, p.imagen, c.name_categoria, s.navegante AS usuario_logueado
            FROM save_articulos s
            INNER JOIN posts_articulos p ON p.id_post = s.post
            INNER JOIN usuarios u ON u.id_user = p.autor
            INNER JOIN categorias c ON c.id_categoria = p.categoria
            WHERE s.navegante = ?
        `;
        const [rows] = await conn.query(query, [req.params.id]);
        res.json({ status: 1, mensaje: "Artículos guardados obtenidos", datos: rows });
    } catch (error) {
        res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
    }
};