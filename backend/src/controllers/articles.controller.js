const conn = require('../config/database');

// ===== CRUD ARTÍCULOS =====
exports.createArticle = (req, res) => {
    const { titulo, contenido, autor, categoria } = req.body;
    const query = `INSERT INTO posts_articulos (titulo, contenido, imagen, autor, categoria) VALUES (?, ?, ?, ?, ?)`;
    const values = [titulo, contenido, "", autor, categoria];
    conn.query(query, values, (error, filas) => {
        if (error) {
            console.error(error);
            return res.json({ status: 0, mensaje: "Error al insertar en la BD", datos: [] });
        } else {
            return res.json({ status: 1, mensaje: "Artículo ingresado con éxito", datos: filas });
        }
    });
};

exports.getArticles = (req, res) => {
    let obtener = 'SELECT p.id_post, p.titulo, p.contenido, p.imagen, u.id_user, u.usuario, c.id_categoria, c.name_categoria FROM posts_articulos p, usuarios u, categorias c WHERE p.autor = u.id_user AND p.categoria = c.id_categoria ORDER BY p.id_post ASC';
    conn.query(obtener, (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Artículos obtenidos con éxito", datos: filas });
        }
    });
};

// ===== INTERACCIONES ARTÍCULOS =====
exports.getCommentsART = (req, res) => {
    const { id } = req.params;
    let obtener = 'SELECT c.navegante, u.usuario, c.comments, c.id_comment FROM posts_articulos p, usuarios u, comments_articulos c WHERE p.id_post = c.post AND c.navegante = u.id_user AND p.id_post = ?';
    conn.query(obtener, [id], (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Comentarios obtenidos", datos: filas });
        }
    });
};

exports.countLikeART = (req, res) => {
    const { id } = req.params;
    let obtener = 'SELECT COUNT(*) AS cantidad FROM likes_articulos l, posts_articulos p WHERE p.id_post = l.post AND p.id_post = ?';
    conn.query(obtener, [id], (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Cantidad de likes obtenida", datos: filas });
        }
    });
};

exports.likeART = (req, res) => {
    let query = `INSERT INTO likes_articulos(post, navegante) VALUES('${req.body.post}','${req.body.navegante}')`;
    conn.query(query, (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "Error al insertar like", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Like insertado con éxito", datos: [] });
        }
    });
};

exports.saveART = (req, res) => {
    let query = `INSERT INTO save_articulos(post, navegante) VALUES('${req.body.post}','${req.body.navegante}')`;
    conn.query(query, (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "Error al guardar", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Artículo guardado con éxito", datos: [] });
        }
    });
};

exports.createCommentART = (req, res) => {
    const { post, navegante, comments } = req.body;
    let query = `INSERT INTO comments_articulos(post, navegante, comments) VALUES(?, ?, ?)`;
    conn.query(query, [post, navegante, comments], (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "Error al insertar comentario", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Comentario insertado con éxito", datos: [] });
        }
    });
};

exports.deleteLikeART = (req, res) => {
    let consulta = `DELETE FROM likes_articulos WHERE post = ${req.params.id} AND navegante = ${req.params.id2}`;
    conn.query(consulta, (err, filas) => {
        if (err) {
            res.json({ status: 0, mensaje: "Error en la eliminación", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Like eliminado", datos: [] });
        }
    });
};

exports.deleteSaveART = (req, res) => {
    let consulta = `DELETE FROM save_articulos WHERE post = ${req.params.id} AND navegante = ${req.params.id2}`;
    conn.query(consulta, (err, filas) => {
        if (err) {
            res.json({ status: 0, mensaje: "Error en la eliminación", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Save eliminado", datos: [] });
        }
    });
};

exports.updateCommentART = (req, res) => {
    let obtener = `UPDATE comments_articulos SET post = '${req.body.post}', navegante = '${req.body.navegante}', comments = '${req.body.comments}' WHERE id_comment = ${req.params.id3}`;
    conn.query(obtener, (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Comentario modificado con éxito", datos: filas });
        }
    });
};

exports.deleteCommentART = (req, res) => {
    let consulta = `DELETE FROM comments_articulos WHERE post = ${req.params.id} AND navegante = ${req.params.id2} AND id_comment = ${req.params.id3}`;
    conn.query(consulta, (err, filas) => {
        if (err) {
            res.json({ status: 0, mensaje: "Error en la eliminación", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Comentario eliminado", datos: [] });
        }
    });
};

exports.getCommentART = (req, res) => {
    let obtener = `SELECT id_comment, post, navegante, comments FROM comments_articulos WHERE post = ${req.params.id} AND navegante = ${req.params.id2} AND id_comment = ${req.params.id3}`;
    conn.query(obtener, (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Comentario obtenido", datos: filas });
        }
    });
};

exports.getSaveA = (req, res) => {
    let obtener = `
        SELECT p.id_post, p.titulo, p.contenido, u.usuario, p.imagen, c.name_categoria, s.navegante AS usuario_logueado
        FROM save_articulos s
        INNER JOIN posts_articulos p ON p.id_post = s.post
        INNER JOIN usuarios u ON u.id_user = p.autor
        INNER JOIN categorias c ON c.id_categoria = p.categoria
        WHERE s.navegante = ${req.params.id}
    `;
    conn.query(obtener, (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Artículos guardados obtenidos", datos: filas });
        }
    });
};