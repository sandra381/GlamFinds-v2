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
        const userId = req.params.id;

        // 1. Posts generales guardados
        const queryPosts = `
            SELECT 
                p.id_post, p.descripcion, p.imagen AS imagen,
                p.autor AS id_user,
                p.image_width, p.image_height,
                p.face_detected, p.skin_ref_r, p.skin_ref_g, p.skin_ref_b,
                u.usuario, u.imagen AS autor_imagen,
                c.id_categoria, c.name_categoria,
                s.navegante
            FROM save_postG s
            INNER JOIN posts_generales p ON p.id_post = s.post
            INNER JOIN usuarios u ON u.id_user = p.autor
            INNER JOIN categorias c ON c.id_categoria = p.categoria
            WHERE s.navegante = ?
        `;
        const [postsGenerales] = await conn.query(queryPosts, [userId]);

        // 2. Posts de publicidad guardados
        const queryPub = `
            SELECT 
                pb.id_post, pb.descripcion, pb.imagen AS imagen,
                pb.autor AS id_user,
                u2.usuario, u2.imagen AS autor_imagen,
                c2.id_categoria, c2.name_categoria,
                sp.navegante
            FROM save_postP sp
            INNER JOIN posts_publicidad pb ON pb.id_post = sp.post
            INNER JOIN usuarios u2 ON u2.id_user = pb.autor
            INNER JOIN categorias c2 ON c2.id_categoria = pb.categoria
            WHERE sp.navegante = ?
        `;
        const [postsPub] = await conn.query(queryPub, [userId]);

        const todosPosts = [...postsGenerales, ...postsPub];

        // 3. Traer prendas y maquillaje
        let prendasPorPost = {};
        let makeupPorPost = {};

        if (todosPosts.length > 0) {
            const postIds = todosPosts.map(p => p.id_post);
            const placeholders = postIds.map(() => '?').join(',');

            const [prendasRows] = await conn.query(
                `SELECT * FROM post_prendas WHERE id_post IN (${placeholders})`,
                postIds
            );
            prendasRows.forEach(p => {
                if (!prendasPorPost[p.id_post]) prendasPorPost[p.id_post] = [];
                prendasPorPost[p.id_post].push({
                    label: p.label,
                    label_id: p.label_id,
                    confidence: p.confidence,
                    bbox: [p.bbox_x1, p.bbox_y1, p.bbox_x2, p.bbox_y2],
                    colors: {
                        vibrant: [p.color_vibrant_r, p.color_vibrant_g, p.color_vibrant_b],
                        muted: [p.color_muted_r, p.color_muted_g, p.color_muted_b],
                        third: [p.color_third_r, p.color_third_g, p.color_third_b]
                    },
                    mask_b64: p.mask_b64
                });
            });

            const [makeupRows] = await conn.query(
                `SELECT * FROM post_makeup_zones WHERE id_post IN (${placeholders})`,
                postIds
            );
            makeupRows.forEach(m => {
                if (!makeupPorPost[m.id_post]) makeupPorPost[m.id_post] = [];
                makeupPorPost[m.id_post].push({
                    id: m.id,
                    zone: m.zone,
                    has_makeup: Boolean(m.has_makeup),
                    distance_to_skin: m.distance_to_skin,
                    color_name: m.color_name,
                    product_link: m.product_link,
                    colors: {
                        vibrant: [m.vibrant_r, m.vibrant_g, m.vibrant_b],
                        muted: [m.muted_r, m.muted_g, m.muted_b],
                        third: [m.third_r, m.third_g, m.third_b]
                    }
                });
            });
        }

        const resultado = todosPosts.map(post => ({
            ...post,
            face_detected: Boolean(post.face_detected),
            skin_reference_color: post.skin_ref_r !== null && post.skin_ref_r !== undefined
                ? [post.skin_ref_r, post.skin_ref_g, post.skin_ref_b]
                : null,
            prendas: prendasPorPost[post.id_post] || [],
            makeup_zones: makeupPorPost[post.id_post] || []
        }));

        res.json({ status: 1, mensaje: "Posts guardados obtenidos", datos: resultado });

    } catch (error) {
        console.error('Error en getSavedPosts:', error);
        res.json({ status: 0, mensaje: "Error al cargar guardados", datos: [] });
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

// ===== OBTENER POSTS DEL PERFIL (con prendas y maquillaje) =====
exports.getProfilePosts = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Obtener los posts del usuario
        const query = `
            SELECT 
                p.id_post, p.descripcion, p.imagen, p.autor AS id_user,
                p.image_width, p.image_height,
                p.face_detected, p.skin_ref_r, p.skin_ref_g, p.skin_ref_b,
                u.usuario,
                c.id_categoria, c.name_categoria
            FROM posts_generales p
            JOIN usuarios u ON p.autor = u.id_user
            JOIN categorias c ON p.categoria = c.id_categoria
            WHERE p.autor = ?
            ORDER BY p.id_post DESC
        `;
        const [posts] = await conn.query(query, [id]);

        if (posts.length === 0) {
            return res.json({ status: 1, mensaje: "Sin publicaciones", datos: [] });
        }

        const postIds = posts.map(p => p.id_post);
        const placeholders = postIds.map(() => '?').join(',');

        // 2. Traer prendas
        const [prendasRows] = await conn.query(
            `SELECT * FROM post_prendas WHERE id_post IN (${placeholders})`,
            postIds
        );

        const prendasPorPost = {};
        prendasRows.forEach(p => {
            if (!prendasPorPost[p.id_post]) prendasPorPost[p.id_post] = [];
            prendasPorPost[p.id_post].push({
                label: p.label,
                label_id: p.label_id,
                confidence: p.confidence,
                bbox: [p.bbox_x1, p.bbox_y1, p.bbox_x2, p.bbox_y2],
                colors: {
                    vibrant: [p.color_vibrant_r, p.color_vibrant_g, p.color_vibrant_b],
                    muted: [p.color_muted_r, p.color_muted_g, p.color_muted_b],
                    third: [p.color_third_r, p.color_third_g, p.color_third_b]
                },
                mask_b64: p.mask_b64
            });
        });

        // 3. Traer zonas de maquillaje
        const [makeupRows] = await conn.query(
            `SELECT * FROM post_makeup_zones WHERE id_post IN (${placeholders})`,
            postIds
        );

        const makeupPorPost = {};
        makeupRows.forEach(m => {
            if (!makeupPorPost[m.id_post]) makeupPorPost[m.id_post] = [];
            makeupPorPost[m.id_post].push({
                id: m.id,
                zone: m.zone,
                has_makeup: Boolean(m.has_makeup),
                distance_to_skin: m.distance_to_skin,
                color_name: m.color_name,
                product_link: m.product_link,
                colors: {
                    vibrant: [m.vibrant_r, m.vibrant_g, m.vibrant_b],
                    muted: [m.muted_r, m.muted_g, m.muted_b],
                    third: [m.third_r, m.third_g, m.third_b]
                }
            });
        });

        // 4. Combinar todo
        const resultado = posts.map(post => ({
            ...post,
            face_detected: Boolean(post.face_detected),
            skin_reference_color: post.skin_ref_r !== null && post.skin_ref_r !== undefined
                ? [post.skin_ref_r, post.skin_ref_g, post.skin_ref_b]
                : null,
            prendas: prendasPorPost[post.id_post] || [],
            makeup_zones: makeupPorPost[post.id_post] || []
        }));

        res.json({ status: 1, mensaje: "Posts del perfil obtenidos", datos: resultado });

    } catch (error) {
        console.error('Error en getProfilePosts:', error);
        res.json({ status: 0, mensaje: "Error al cargar posts", datos: [] });
    }
};

// ===== OBTENER DESCRIPCIÓN POST (obsoleto) =====
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
        if (!follower_id || !following_id) {
            return res.status(400).json({ error: 'follower_id y following_id son requeridos' });
        }
        const query = `INSERT IGNORE INTO followers (follower_id, followed_id) VALUES (?, ?)`;
        await conn.query(query, [follower_id, following_id]);
        res.json({ success: true, message: "User followed successfully" });
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
        res.json({ success: true, message: "User unfollowed" });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ error: "Error unfollowing user" });
    }
};

exports.isFollowing = async (req, res) => {
    try {
        const { follower_id, following_id } = req.params;
        const query = `SELECT 1 FROM followers WHERE follower_id = ? AND followed_id = ? LIMIT 1`;
        const [rows] = await conn.query(query, [follower_id, following_id]);
        res.json({ isFollowing: rows.length > 0 });
    } catch (error) {
        console.error('Error checking follow:', error);
        res.status(500).json({ error: error.message });
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