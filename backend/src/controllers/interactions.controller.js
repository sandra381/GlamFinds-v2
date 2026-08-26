const conn = require('../config/database');
const axios = require('axios');

// ===== LIKES =====
exports.countLike = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `SELECT COUNT(*) AS cantidad FROM likes_postG l, posts_generales p WHERE p.id_post = l.post AND p.id_post = ?`;
        const [rows] = await conn.query(query, [id]);
        res.json({ status: 1, mensaje: "Cantidad de likes obtenida", datos: rows });
    } catch (error) {
        res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
    }
};

exports.like = async (req, res) => {
    try {
        const query = `INSERT INTO likes_postG(post, navegante) VALUES(?, ?)`;
        const [result] = await conn.query(query, [req.body.post, req.body.navegante]);
        res.json({ status: 1, mensaje: "Like insertado con éxito", datos: [] });
    } catch (error) {
        res.json({ status: 0, mensaje: "Error al insertar like", datos: [] });
    }
};

exports.deleteLike = async (req, res) => {
    try {
        const query = `DELETE FROM likes_postg WHERE post = ? AND navegante = ?`;
        const [result] = await conn.query(query, [req.params.id, req.params.id2]);
        res.json({ status: 1, mensaje: "Like eliminado", datos: [] });
    } catch (error) {
        res.json({ status: 0, mensaje: "Error en la eliminación", datos: [] });
    }
};

// ===== SAVES =====
exports.save = async (req, res) => {
    try {
        const query = `INSERT INTO save_postG(post, navegante) VALUES(?, ?)`;
        const [result] = await conn.query(query, [req.body.post, req.body.navegante]);
        res.json({ status: 1, mensaje: "Post guardado con éxito", datos: [] });
    } catch (error) {
        res.json({ status: 0, mensaje: "Error al guardar", datos: [] });
    }
};

exports.deleteSave = async (req, res) => {
    try {
        const query = `DELETE FROM save_postg WHERE post = ? AND navegante = ?`;
        const [result] = await conn.query(query, [req.params.id, req.params.id2]);
        res.json({ status: 1, mensaje: "Save eliminado", datos: [] });
    } catch (error) {
        res.json({ status: 0, mensaje: "Error en la eliminación", datos: [] });
    }
};

// ===== COMENTARIOS =====
exports.getComments = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `SELECT c.post, c.navegante, u.usuario, c.comments, c.id_comment 
                       FROM posts_generales p, usuarios u, comments_postG c 
                       WHERE p.id_post = c.post AND c.navegante = u.id_user AND p.id_post = ?`;
        const [rows] = await conn.query(query, [id]);
        res.json({ status: 1, mensaje: "Comentarios obtenidos", datos: rows });
    } catch (error) {
        res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
    }
};

exports.createComment = async (req, res) => {
    try {
        const { post, navegante, comments } = req.body;

        // Intentar moderación
        try {
            const moderationResponse = await axios.post("http://127.0.0.1:8000/moderate", { text: comments });
            if (moderationResponse.data.status === "bloqueado") {
                return res.json({ status: 0, mensaje: "Comentario inapropiado detectado", datos: [] });
            }
        } catch (modError) {
            console.warn("Servicio de moderación no disponible");
        }

        const query = `INSERT INTO comments_postG(post, navegante, comments) VALUES(?, ?, ?)`;
        const [result] = await conn.query(query, [post, navegante, comments]);
        res.json({ status: 1, mensaje: "Comentario insertado con éxito", datos: [] });

    } catch (error) {
        console.error("ERROR:", error.message);
        res.json({ status: 0, mensaje: "Error al procesar comentario", datos: [] });
    }
};

exports.updateComment = async (req, res) => {
    try {
        const { post, navegante, comments } = req.body;
        const query = `UPDATE comments_postg SET post = ?, navegante = ?, comments = ? WHERE id_comment = ?`;
        const [result] = await conn.query(query, [post, navegante, comments, req.params.id3]);
        res.json({ status: 1, mensaje: "Comentario modificado con éxito", datos: [] });
    } catch (error) {
        res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const query = `DELETE FROM comments_postg WHERE post = ? AND navegante = ? AND id_comment = ?`;
        const [result] = await conn.query(query, [req.params.id, req.params.id2, req.params.id3]);
        res.json({ status: 1, mensaje: "Comentario eliminado", datos: [] });
    } catch (error) {
        res.json({ status: 0, mensaje: "Error en la eliminación", datos: [] });
    }
};

exports.getComment = async (req, res) => {
    try {
        const query = `SELECT id_comment, post, navegante, comments FROM comments_postG WHERE post = ? AND navegante = ? AND id_comment = ?`;
        const [rows] = await conn.query(query, [req.params.id, req.params.id2, req.params.id3]);
        res.json({ status: 1, mensaje: "Comentario obtenido", datos: rows });
    } catch (error) {
        res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
    }
};

// ===== INTERACCIONES PARA PUBLICIDAD (P) =====
// (Usan la misma lógica, solo cambia la tabla)

exports.countLikeP = async (req, res) => {
    try {
        const query = `SELECT COUNT(*) AS cantidads FROM likes_postp l, posts_publicidad p WHERE p.id_post = l.post AND p.id_post = ?`;
        const [rows] = await conn.query(query, [req.params.id]);
        res.json({ status: 1, mensaje: "Cantidad de likes obtenida", datos: rows });
    } catch (error) {
        res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
    }
};

exports.getCommentsP = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `SELECT c.post, c.navegante, u.usuario, c.comments, c.id_comment 
                       FROM posts_publicidad p, usuarios u, comments_postP c 
                       WHERE p.id_post = c.post AND c.navegante = u.id_user AND p.id_post = ?`;
        const [rows] = await conn.query(query, [id]);
        res.json({ status: 1, mensaje: "Comentarios obtenidos", datos: rows });
    } catch (error) {
        res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
    }
};

exports.createCommentP = async (req, res) => {
    try {
        const query = `INSERT INTO comments_postp(post, navegante, comments) VALUES(?, ?, ?)`;
        const [result] = await conn.query(query, [req.body.post, req.body.navegante, req.body.comments]);
        res.json({ status: 1, mensaje: "Comentario insertado con éxito", datos: [] });
    } catch (error) {
        res.json({ status: 0, mensaje: "Error al insertar comentario", datos: [] });
    }
};

exports.likeP = async (req, res) => {
    try {
        const query = `INSERT INTO likes_postp(post, navegante) VALUES(?, ?)`;
        const [result] = await conn.query(query, [req.body.post, req.body.navegante]);
        res.json({ status: 1, mensaje: "Like insertado con éxito", datos: [] });
    } catch (error) {
        res.json({ status: 0, mensaje: "Error al insertar like", datos: [] });
    }
};

exports.saveP = async (req, res) => {
    try {
        const query = `INSERT INTO save_postp(post, navegante) VALUES(?, ?)`;
        const [result] = await conn.query(query, [req.body.post, req.body.navegante]);
        res.json({ status: 1, mensaje: "Post guardado con éxito", datos: [] });
    } catch (error) {
        res.json({ status: 0, mensaje: "Error al guardar", datos: [] });
    }
};

exports.deleteLikeP = async (req, res) => {
    try {
        const query = `DELETE FROM likes_postp WHERE post = ? AND navegante = ?`;
        const [result] = await conn.query(query, [req.params.id, req.params.id2]);
        res.json({ status: 1, mensaje: "Like eliminado", datos: [] });
    } catch (error) {
        res.json({ status: 0, mensaje: "Error en la eliminación", datos: [] });
    }
};

exports.deleteSaveP = async (req, res) => {
    try {
        const query = `DELETE FROM save_postp WHERE post = ? AND navegante = ?`;
        const [result] = await conn.query(query, [req.params.id, req.params.id2]);
        res.json({ status: 1, mensaje: "Save eliminado", datos: [] });
    } catch (error) {
        res.json({ status: 0, mensaje: "Error en la eliminación", datos: [] });
    }
};

exports.updateCommentP = async (req, res) => {
    try {
        const { post, navegante, comments } = req.body;
        const query = `UPDATE comments_postp SET post = ?, navegante = ?, comments = ? WHERE id_comment = ?`;
        const [result] = await conn.query(query, [post, navegante, comments, req.params.id3]);
        res.json({ status: 1, mensaje: "Comentario modificado con éxito", datos: [] });
    } catch (error) {
        res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
    }
};

exports.deleteCommentP = async (req, res) => {
    try {
        const query = `DELETE FROM comments_postp WHERE post = ? AND navegante = ? AND id_comment = ?`;
        const [result] = await conn.query(query, [req.params.id, req.params.id2, req.params.id3]);
        res.json({ status: 1, mensaje: "Comentario eliminado", datos: [] });
    } catch (error) {
        res.json({ status: 0, mensaje: "Error en la eliminación", datos: [] });
    }
};

exports.getCommentP = async (req, res) => {
    try {
        const query = `SELECT id_comment, post, navegante, comments FROM comments_postp WHERE post = ? AND navegante = ? AND id_comment = ?`;
        const [rows] = await conn.query(query, [req.params.id, req.params.id2, req.params.id3]);
        res.json({ status: 1, mensaje: "Comentario obtenido", datos: rows });
    } catch (error) {
        res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
    }
};