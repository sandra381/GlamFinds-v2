const conn = require('../config/database');

// ===== OBTENER PERFIL DE USUARIO =====
exports.getUser = (req, res) => {
    const { id } = req.params;
    let query = 'SELECT * FROM usuarios WHERE id_user = ?';
    conn.query(query, [id], (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Info de user obtenida", datos: filas });
        }
    });
};

// ===== OBTENER POSTS GUARDADOS =====
exports.getSavedPosts = (req, res) => {
    let obtener = `
        SELECT p.id_post, p.descripcion, u.usuario, u.imagen, p.imagen, c.name_categoria, s.navegante 
        FROM save_postG s
        INNER JOIN posts_generales p ON p.id_post = s.post
        INNER JOIN usuarios u ON u.id_user = p.autor
        INNER JOIN categorias c ON c.id_categoria = p.categoria 
        WHERE s.navegante = ${req.params.id}
        UNION ALL
        SELECT pb.id_post, pb.descripcion, u2.usuario, u2.imagen, pb.imagen, c2.name_categoria, sp.navegante 
        FROM save_postP sp
        INNER JOIN posts_publicidad pb ON pb.id_post = sp.post
        INNER JOIN usuarios u2 ON u2.id_user = pb.autor
        INNER JOIN categorias c2 ON c2.id_categoria = pb.categoria 
        WHERE sp.navegante = ${req.params.id}
    `;
    conn.query(obtener, (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Posts guardados obtenidos", datos: filas });
        }
    });
};

// ===== OBTENER DESCRIPCIÓN DE USUARIO (obsoleto) =====
exports.getUserDescription = (req, res) => {
    let obtener = `SELECT usuario, imagen, descripcion FROM usuarios WHERE id_user = ${req.params.id}`;
    conn.query(obtener, (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Descripción obtenida", datos: filas });
        }
    });
};

// ===== OBTENER POSTS DEL PERFIL =====
exports.getProfilePosts = (req, res) => {
    const { id } = req.params;
    let obtener = `
        SELECT p.id_post, p.descripcion, p.imagen, u.id_user, u.usuario, c.id_categoria, c.name_categoria 
        FROM posts_generales p, usuarios u, categorias c 
        WHERE p.autor = u.id_user AND p.categoria = c.id_categoria AND u.id_user = ?
    `;
    conn.query(obtener, [id], (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Posts del perfil obtenidos", datos: filas });
        }
    });
};

// ===== OBTENER DESCRIPCIÓN POST (obsoleto) =====
exports.getPostDescription = (req, res) => {
    let obtener = `SELECT u.usuario, d.descripcion FROM descripcion d, usuarios u WHERE d.usuarios = u.id_user AND d.usuarios = ${req.params.id}`;
    conn.query(obtener, (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Descripción obtenida", datos: filas });
        }
    });
};

// ===== ACTUALIZAR PERFIL DE USUARIO =====
exports.updateProfile = (req, res) => {
    const { id } = req.params;
    const { usuario, descripcion } = req.body;
    let path_value = req.body.imagen;
    if (req.file) {
        path_value = req.file.filename;
    }
    const query = `UPDATE usuarios SET usuario = ?, descripcion = ?, imagen = ? WHERE id_user = ?`;
    conn.query(query, [usuario, descripcion, path_value, id], (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: 'Error al actualizar el perfil', datos: [] });
        } else {
            res.json({ status: 1, mensaje: 'Perfil actualizado con éxito', datos: filas });
        }
    });
};

// ===== FOLLOWS =====
exports.follow = (req, res) => {
    const { follower_id, following_id } = req.body;
    const sql = `INSERT INTO followers (follower_id, followed_id) VALUES (?, ?)`;
    conn.query(sql, [follower_id, following_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error following user" });
        }
        res.json({ message: "User followed successfully" });
    });
};

exports.unfollow = (req, res) => {
    const { follower_id, following_id } = req.body;
    const sql = `DELETE FROM followers WHERE follower_id = ? AND followed_id = ?`;
    conn.query(sql, [follower_id, following_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error unfollowing user" });
        }
        res.json({ message: "User unfollowed" });
    });
};

exports.getFollowers = (req, res) => {
    const userId = req.params.id;
    const sql = `SELECT u.id_user, u.usuario, u.nombre FROM followers f JOIN usuarios u ON f.follower_id = u.id_user WHERE f.followed_id = ?`;
    conn.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

exports.getFollowing = (req, res) => {
    const userId = req.params.id;
    const sql = `SELECT u.id_user, u.usuario, u.nombre FROM followers f JOIN usuarios u ON f.followed_id = u.id_user WHERE f.follower_id = ?`;
    conn.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

// ===== ESTADÍSTICAS DE USUARIO =====
exports.getUserStats = (req, res) => {
    const userId = req.params.id;
    const sqlFollowers = `SELECT COUNT(*) AS count FROM followers WHERE followed_id = ?`;
    const sqlFollowing = `SELECT COUNT(*) AS count FROM followers WHERE follower_id = ?`;
    const sqlPosts = `SELECT COUNT(*) AS count FROM posts_generales WHERE autor = ?`;

    conn.query(sqlFollowers, [userId], (err, followersRes) => {
        if (err) return res.status(500).json({ error: err.message });
        conn.query(sqlFollowing, [userId], (err, followingRes) => {
            if (err) return res.status(500).json({ error: err.message });
            conn.query(sqlPosts, [userId], (err, postsRes) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({
                    followers: followersRes[0].count,
                    following: followingRes[0].count,
                    posts: postsRes[0].count
                });
            });
        });
    });
};