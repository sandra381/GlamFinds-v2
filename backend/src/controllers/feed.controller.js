const conn = require('../config/database');

// Función auxiliar para añadir prendas
async function addPrendasToPosts(posts) {
    if (!posts || posts.length === 0) return posts;

    const postIds = posts.map(p => p.id_post);
    const placeholders = postIds.map(() => '?').join(',');
    const queryPrendas = `SELECT * FROM post_prendas WHERE id_post IN (${placeholders})`;
    const [prendasRows] = await conn.query(queryPrendas, postIds);

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

    return posts.map(post => ({
        ...post,
        prendas: prendasPorPost[post.id_post] || []
    }));
}

// ===== FEED DE TENDENCIAS =====
exports.getTrending = async (req, res) => {
    try {
        console.log('Endpoint /feed/trending llamado');
        const query = `
            SELECT 
                p.id_post, p.descripcion, p.imagen, p.autor, p.categoria,
                p.image_width, p.image_height,
                u.id_user, u.usuario,
                c.id_categoria, c.name_categoria,
                COUNT(DISTINCT l.id_like) AS likes_count,
                COUNT(DISTINCT com.id_comment) AS comments_count,
                ((COUNT(DISTINCT l.id_like) + COUNT(DISTINCT com.id_comment) * 2) / (TIMESTAMPDIFF(HOUR, p.fecha_publicacion, NOW()) + 1)) AS trending_score
            FROM posts_generales p
            JOIN usuarios u ON p.autor = u.id_user
            JOIN categorias c ON p.categoria = c.id_categoria
            LEFT JOIN likes_postG l ON p.id_post = l.post
            LEFT JOIN comments_postG com ON p.id_post = com.post
            WHERE TIMESTAMPDIFF(DAY, p.fecha_publicacion, NOW()) <= 180
            GROUP BY p.id_post, u.usuario, u.imagen, c.name_categoria
            ORDER BY trending_score DESC
            LIMIT 20
        `;
        const [posts] = await conn.query(query);
        const postsConPrendas = await addPrendasToPosts(posts);
        res.json({ status: 1, mensaje: "Tendencias obtenidas", datos: postsConPrendas });
    } catch (error) {
        console.error('Error en trending:', error);
        res.json({ status: 0, mensaje: "Error en la consulta", datos: [] });
    }
};

// ===== FEED DE SIGUIENDO =====
exports.getFollowingFeed = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT 
                p.id_post, p.descripcion, p.imagen, p.autor, p.categoria,
                p.image_width, p.image_height,
                u.id_user, u.usuario,
                c.id_categoria, c.name_categoria
            FROM posts_generales p
            JOIN usuarios u ON p.autor = u.id_user
            JOIN categorias c ON p.categoria = c.id_categoria
            JOIN followers f ON p.autor = f.followed_id
            WHERE f.follower_id = ?
            ORDER BY p.id_post DESC
        `;
        const [posts] = await conn.query(query, [id]);
        const postsConPrendas = await addPrendasToPosts(posts);
        res.json({ status: 1, mensaje: "Feed obtenido correctamente", datos: postsConPrendas });
    } catch (error) {
        console.error('Error en following feed:', error);
        res.json({ status: 0, mensaje: "Error al obtener feed", datos: [] });
    }
};

// ===== ACTUALIZAR PREFERENCIAS =====
exports.updatePreferences = async (req, res) => {
    try {
        const { id_user, id_post } = req.body;
        const queryPrendas = `SELECT label FROM post_prendas WHERE id_post = ?`;
        const [prendas] = await conn.query(queryPrendas, [id_post]);

        if (prendas.length === 0) {
            return res.json({ status: 1, mensaje: "No hay prendas para este post" });
        }

        for (const prenda of prendas) {
            const insertar = `
                INSERT INTO user_preferred_labels (id_user, label, score)
                VALUES (?, ?, 1)
                ON DUPLICATE KEY UPDATE score = score + 1
            `;
            await conn.query(insertar, [id_user, prenda.label]);
        }

        res.json({ status: 1, mensaje: "Preferencias actualizadas" });

    } catch (error) {
        console.error('Error actualizando preferencias:', error);
        res.json({ status: 0, mensaje: "Error al actualizar preferencias" });
    }
};

// ===== FEED PARA TI =====
exports.getParaTi = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT
                p.id_post, p.descripcion, p.imagen, p.autor, p.categoria,
                p.image_width, p.image_height,
                u.id_user, u.usuario,
                c.id_categoria, c.name_categoria,
                SUM(upl.score) AS relevancia
            FROM posts_generales p
            JOIN usuarios u ON p.autor = u.id_user
            JOIN categorias c ON p.categoria = c.id_categoria
            JOIN post_prendas pp ON p.id_post = pp.id_post
            JOIN user_preferred_labels upl ON pp.label = upl.label
            WHERE upl.id_user = ?
            GROUP BY p.id_post
            ORDER BY relevancia DESC, p.id_post DESC
        `;
        const [posts] = await conn.query(query, [id]);
        const postsConPrendas = await addPrendasToPosts(posts);
        res.json({ status: 1, mensaje: "OK", datos: postsConPrendas });
    } catch (error) {
        console.error('Error en parati:', error);
        res.json({ status: 0, mensaje: "Error al obtener recomendaciones", datos: [] });
    }
};

// ===== CATEGORÍAS =====
exports.getCategories = async (req, res) => {
    try {
        const query = 'SELECT id_categoria, name_categoria FROM categorias ORDER BY id_categoria';
        const [results] = await conn.query(query);
        res.json({ status: 1, mensaje: "Categorías obtenidas", datos: results });
    } catch (error) {
        console.error('Error en categorías:', error);
        res.status(500).json({ status: 0, mensaje: "Error al obtener categorías" });
    }
};