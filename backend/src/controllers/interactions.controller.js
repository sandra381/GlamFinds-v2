const conn = require('../config/database');
const axios = require('axios');

// ===== LIKES =====
exports.countLike = (req, res) => {
    const { id } = req.params;
    let obtener = 'SELECT COUNT(*) AS cantidad FROM likes_postG l, posts_generales p WHERE p.id_post = l.post AND p.id_post = ?';
    conn.query(obtener, [id], (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Cantidad de likes obtenida", datos: filas });
        }
    });
};

exports.like = (req, res) => {
    let query = `INSERT INTO likes_postG(post, navegante) VALUES('${req.body.post}','${req.body.navegante}')`;
    conn.query(query, (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "Error al insertar like", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Like insertado con éxito", datos: [] });
        }
    });
};

exports.deleteLike = (req, res) => {
    let consulta = `DELETE FROM likes_postg WHERE post = ${req.params.id} AND navegante = ${req.params.id2}`;
    conn.query(consulta, (err, filas) => {
        if (err) {
            res.json({ status: 0, mensaje: "Error en la eliminación", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Like eliminado", datos: [] });
        }
    });
};

// ===== SAVES =====
exports.save = (req, res) => {
    let query = `INSERT INTO save_postG(post, navegante) VALUES('${req.body.post}','${req.body.navegante}')`;
    conn.query(query, (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "Error al guardar", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Post guardado con éxito", datos: [] });
        }
    });
};

exports.deleteSave = (req, res) => {
    let consulta = `DELETE FROM save_postg WHERE post = ${req.params.id} AND navegante = ${req.params.id2}`;
    conn.query(consulta, (err, filas) => {
        if (err) {
            res.json({ status: 0, mensaje: "Error en la eliminación", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Save eliminado", datos: [] });
        }
    });
};

// ===== COMENTARIOS =====
exports.getComments = (req, res) => {
    const { id } = req.params;
    let obtener = 'SELECT c.post, c.navegante, u.usuario, c.comments, c.id_comment FROM posts_generales p, usuarios u, comments_postG c WHERE p.id_post = c.post AND c.navegante = u.id_user AND p.id_post = ?';
    conn.query(obtener, [id], (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Comentarios obtenidos", datos: filas });
        }
    });
};

exports.createComment = async (req, res) => {
    const { post, navegante, comments } = req.body;
    try {
        // Intentar moderación (si el servicio está disponible)
        try {
            const moderationResponse = await axios.post("http://127.0.0.1:8000/moderate", { text: comments });
            const moderation = moderationResponse.data;
            if (moderation.status === "bloqueado") {
                return res.json({ status: 0, mensaje: "Comentario inapropiado detectado", datos: [] });
            }
        } catch (modError) {
            console.warn("Servicio de moderación no disponible, continuando sin moderación");
        }

        let query = `INSERT INTO comments_postG(post, navegante, comments) VALUES(?, ?, ?)`;
        conn.query(query, [post, navegante, comments], (error, filas) => {
            if (error) {
                return res.json({ status: 0, mensaje: "Error al insertar en la BD", datos: [] });
            }
            res.json({ status: 1, mensaje: "Comentario insertado con éxito", datos: [] });
        });
    } catch (error) {
        console.error("ERROR:", error.message);
        res.json({ status: 0, mensaje: "Error al procesar comentario", datos: [] });
    }
};

exports.updateComment = (req, res) => {
    let obtener = `UPDATE comments_postg SET post = '${req.body.post}', navegante = '${req.body.navegante}', comments = '${req.body.comments}' WHERE id_comment = ${req.params.id3}`;
    conn.query(obtener, (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Comentario modificado con éxito", datos: filas });
        }
    });
};

exports.deleteComment = (req, res) => {
    let consulta = `DELETE FROM comments_postg WHERE post = ${req.params.id} AND navegante = ${req.params.id2} AND id_comment = ${req.params.id3}`;
    conn.query(consulta, (err, filas) => {
        if (err) {
            res.json({ status: 0, mensaje: "Error en la eliminación", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Comentario eliminado", datos: [] });
        }
    });
};

exports.getComment = (req, res) => {
    let obtener = `SELECT id_comment, post, navegante, comments FROM comments_postG WHERE post = ${req.params.id} AND navegante = ${req.params.id2} AND id_comment = ${req.params.id3}`;
    conn.query(obtener, (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Comentario obtenido", datos: filas });
        }
    });
};

// ===== INTERACCIONES PARA PUBLICIDAD (sufijo P) =====
exports.countLikeP = (req, res) => {
    let obtener = `SELECT COUNT(*) AS cantidads FROM likes_postp l, posts_publicidad p WHERE p.id_post = l.post AND p.id_post = ${req.params.id}`;
    conn.query(obtener, (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Cantidad de likes obtenida", datos: filas });
        }
    });
};

exports.getCommentsP = (req, res) => {
    const { id } = req.params;
    let obtener = 'SELECT c.post, c.navegante, u.usuario, c.comments, c.id_comment FROM posts_publicidad p, usuarios u, comments_postP c WHERE p.id_post = c.post AND c.navegante = u.id_user AND p.id_post = ?';
    conn.query(obtener, [id], (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Comentarios obtenidos", datos: filas });
        }
    });
};

exports.createCommentP = (req, res) => {
    let query = `INSERT INTO comments_postp(post, navegante, comments) VALUES('${req.body.post}','${req.body.navegante}','${req.body.comments}')`;
    conn.query(query, (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "Error al insertar comentario", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Comentario insertado con éxito", datos: [] });
        }
    });
};

exports.likeP = (req, res) => {
    let query = `INSERT INTO likes_postp(post, navegante) VALUES('${req.body.post}','${req.body.navegante}')`;
    conn.query(query, (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "Error al insertar like", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Like insertado con éxito", datos: [] });
        }
    });
};

exports.saveP = (req, res) => {
    let query = `INSERT INTO save_postp(post, navegante) VALUES('${req.body.post}','${req.body.navegante}')`;
    conn.query(query, (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "Error al guardar", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Post guardado con éxito", datos: [] });
        }
    });
};

exports.deleteLikeP = (req, res) => {
    let consulta = `DELETE FROM likes_postp WHERE post = ${req.params.id} AND navegante = ${req.params.id2}`;
    conn.query(consulta, (err, filas) => {
        if (err) {
            res.json({ status: 0, mensaje: "Error en la eliminación", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Like eliminado", datos: [] });
        }
    });
};

exports.deleteSaveP = (req, res) => {
    let consulta = `DELETE FROM save_postp WHERE post = ${req.params.id} AND navegante = ${req.params.id2}`;
    conn.query(consulta, (err, filas) => {
        if (err) {
            res.json({ status: 0, mensaje: "Error en la eliminación", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Save eliminado", datos: [] });
        }
    });
};

exports.updateCommentP = (req, res) => {
    let obtener = `UPDATE comments_postp SET post = '${req.body.post}', navegante = '${req.body.navegante}', comments = '${req.body.comments}' WHERE id_comment = ${req.params.id3}`;
    conn.query(obtener, (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Comentario modificado con éxito", datos: filas });
        }
    });
};

exports.deleteCommentP = (req, res) => {
    let consulta = `DELETE FROM comments_postp WHERE post = ${req.params.id} AND navegante = ${req.params.id2} AND id_comment = ${req.params.id3}`;
    conn.query(consulta, (err, filas) => {
        if (err) {
            res.json({ status: 0, mensaje: "Error en la eliminación", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Comentario eliminado", datos: [] });
        }
    });
};

exports.getCommentP = (req, res) => {
    let obtener = `SELECT id_comment, post, navegante, comments FROM comments_postp WHERE post = ${req.params.id} AND navegante = ${req.params.id2} AND id_comment = ${req.params.id3}`;
    conn.query(obtener, (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Comentario obtenido", datos: filas });
        }
    });
};