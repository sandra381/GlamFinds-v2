const conn = require('../config/database');

// ===== OBTENER PERFIL DE USUARIO =====
exports.getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM usuarios WHERE id_user = ?';
        const [rows] = await conn.query(query, [id]);
        res.json({ status: 1, mensaje: "Info de user obtenida", datos: rows });
    } catch (error) {
        res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
    }
};

// ===== OBTENER POSTS GUARDADOS =====
exports.getSavedPosts = async (req, res) => {
    try {
        const query = `
            SELECT p.id_post, p.descripcion, u.usuario, u.imagen, p.imagen, c.name_categoria, s.navegante 
            FROM save_postG s
            INNER JOIN posts_generales p ON p.id_post = s.post
            INNER JOIN usuarios u ON u.id_user = p.autor
            INNER JOIN categorias c ON c.id_categoria = p.categoria 
            WHERE s.navegante = ?
            UNION ALL
            SELECT pb.id_post, pb.descripcion, u2.usuario, u2.imagen, pb.imagen, c2.name_categoria, sp.navegante 
            FROM save_postP sp
            INNER JOIN posts_publicidad pb ON pb.id_post = sp.post
            INNER JOIN usuarios u2 ON u2.id_user = pb.autor
            INNER JOIN categorias c2 ON c2.id_categoria = pb.categoria 
            WHERE sp.navegante = ?
        `;
        const [rows] = await conn.query(query, [req.params.id, req.params.id]);
        res.json({ status: 1, mensaje: "Posts guardados obtenidos", datos: rows });
    } catch (error) {
        res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
    }
};

// ===== OBTENER DESCRIPCIÓN DE USUARIO =====
exports.getUserDescription = async (req, res) => {
    try {
        const query = `SELECT usuario, imagen, descripcion FROM usuarios WHERE id_user = ?`;
        const [rows] = await conn.query(query, [req.params.id]);
        res.json({ status: 1, mensaje: "Descripción obtenida", datos: rows });
    } catch (error) {
        res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
    }
};

// ===== OBTENER POSTS DEL PERFIL =====
exports.getProfilePosts = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT p.id_post, p.descripcion, p.imagen, u.id_user, u.usuario, c.id_categoria, c.name_categoria 
            FROM posts_generales p, usuarios u, categorias c 
            WHERE p.autor = u.id_user AND p.categoria = c.id_categoria AND u.id_user = ?
        `;
        const [rows] = await conn.query(query, [id]);
        res.json({ status: 1, mensaje: "Posts del perfil obtenidos", datos: rows });
    } catch (error) {
        res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
    }
};

// ===== OBTENER DESCRIPCIÓN POST =====
exports.getPostDescription = async (req, res) => {
    try {
        const query = `SELECT u.usuario, d.descripcion FROM descripcion d, usuarios u WHERE d.usuarios = u.id_user AND d.usuarios = ?`;
        const [rows] = await conn.query(query, [req.params.id]);
        res.json({ status: 1, mensaje: "Descripción obtenida", datos: rows });
    } catch (error) {
        res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
    }
};

// ===== ACTUALIZAR PERFIL DE USUARIO =====
exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { usuario, descripcion } = req.body;
        let imageUrl = req.body.imagen;

        if (req.file) {
            imageUrl = req.file.location || req.file.filename;
        }

        const query = `UPDATE usuarios SET usuario = ?, descripcion = ?, imagen = ? WHERE id_user = ?`;
        const [result] = await conn.query(query, [usuario, descripcion, imageUrl, id]);
        res.json({ status: 1, mensaje: 'Perfil actualizado con éxito', datos: result });
    } catch (error) {
        console.error('Error actualizando perfil:', error);
        res.json({ status: 0, mensaje: 'Error al actualizar el perfil', datos: [] });
    }
};

// ===== FOLLOWS =====
exports.follow = async (req, res) => {
    try {
        const { follower_id, following_id } = req.body;
        const query = `INSERT INTO followers (follower_id, followed_id) VALUES (?, ?)`;
        await conn.query(query, [follower_id, following_id]);
        res.json({ message: "User followed successfully" });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ error: "Error following user" });
    }
};

exports.unfollow = async (req, res) => {
    try {
        const { follower_id, following_id } = req.body;
        const query = `DELETE FROM followers WHERE follower_id = ? AND followed_id = ?`;
        await conn.query(query, [follower_id, following_id]);
        res.json({ message: "User unfollowed" });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ error: "Error unfollowing user" });
    }
};

exports.getFollowers = async (req, res) => {
    try {
        const userId = req.params.id;
        const query = `SELECT u.id_user, u.usuario, u.nombre FROM followers f JOIN usuarios u ON f.follower_id = u.id_user WHERE f.followed_id = ?`;
        const [rows] = await conn.query(query, [userId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFollowing = async (req, res) => {
    try {
        const userId = req.params.id;
        const query = `SELECT u.id_user, u.usuario, u.nombre FROM followers f JOIN usuarios u ON f.followed_id = u.id_user WHERE f.follower_id = ?`;
        const [rows] = await conn.query(query, [userId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ===== ESTADÍSTICAS DE USUARIO =====
exports.getUserStats = async (req, res) => {
    try {
        const userId = req.params.id;
        const [followers] = await conn.query('SELECT COUNT(*) AS count FROM followers WHERE followed_id = ?', [userId]);
        const [following] = await conn.query('SELECT COUNT(*) AS count FROM followers WHERE follower_id = ?', [userId]);
        const [posts] = await conn.query('SELECT COUNT(*) AS count FROM posts_generales WHERE autor = ?', [userId]);

        res.json({
            followers: followers[0].count,
            following: following[0].count,
            posts: posts[0].count
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};