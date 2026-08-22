const conn = require('../config/database');
const multer = require('multer');
const path = require('path');
const axios = require('axios');

// Configuración de multer (ajusta la ruta según tu proyecto)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'C:\\Users\\danie\\OneDrive\\Escritorio\\Proyecto Privado\\GlamFinds\\src\\assets\\img');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});
const upload = multer({ storage: storage });

// Función auxiliar para obtener prendas de un post
function obtenerPrendas(id_post) {
    return new Promise((resolve, reject) => {
        const queryPrendas = `
            SELECT 
                label, label_id, confidence,
                bbox_x1, bbox_y1, bbox_x2, bbox_y2,
                color_vibrant_r, color_vibrant_g, color_vibrant_b,
                color_muted_r, color_muted_g, color_muted_b,
                color_third_r, color_third_g, color_third_b,
                mask_b64
            FROM post_prendas
            WHERE id_post = ?
        `;
        conn.query(queryPrendas, [id_post], (err, filas) => {
            if (err) reject(err);
            else {
                const prendasFormateadas = filas.map(p => ({
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
                }));
                resolve(prendasFormateadas);
            }
        });
    });
}

// Función auxiliar para obtener zonas de maquillaje
function obtenerMaquillaje(id_post) {
    return new Promise((resolve, reject) => {
        const queryMakeup = `
            SELECT
                id, zone, has_makeup, distance_to_skin, color_name, product_link,
                vibrant_r, vibrant_g, vibrant_b,
                muted_r, muted_g, muted_b,
                third_r, third_g, third_b
            FROM post_makeup_zones
            WHERE id_post = ?
        `;
        conn.query(queryMakeup, [id_post], (err, filas) => {
            if (err) reject(err);
            else {
                const maquillajeFormateado = filas.map(m => ({
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
                }));
                resolve(maquillajeFormateado);
            }
        });
    });
}

// Crear post (con segmentación IA)
exports.createPost = async (req, res) => {
    const mediaPath = req.file;
    if (!mediaPath) {
        return res.json({ status: 0, mensaje: "No se proporcionó una imagen o video", datos: [] });
    }
    const path_value = mediaPath.filename;
    const { descripcion, autor, categoria } = req.body;
    const fileExtension = path.extname(path_value).toLowerCase();

    if (fileExtension === '.jpg' || fileExtension === '.jpeg' || fileExtension === '.png' || fileExtension === '.gif') {
        const fullPath = path.join(
            'C:\\Users\\danie\\OneDrive\\Escritorio\\Proyecto Privado\\GlamFinds\\src\\assets\\img',
            path_value
        );
        try {
            // Llamar al microservicio
            let garments = [];
            let makeupZones = [];
            let image_width = null;
            let image_height = null;
            let face_detected = false;
            let skin_ref_rgb = null;

            try {
                const aiResponse = await axios.post("http://127.0.0.1:8000/analyze-outfit", {
                    image_path: fullPath
                });
                garments = aiResponse.data.garments || [];
                makeupZones = aiResponse.data.makeup_zones || [];
                image_width = aiResponse.data.image_width || null;
                image_height = aiResponse.data.image_height || null;
                face_detected = aiResponse.data.face_detected || false;
                skin_ref_rgb = aiResponse.data.skin_reference_color || null;
                console.log(`Prendas: ${garments.length}, Zonas maquillaje: ${makeupZones.length}`);
            } catch (error) {
                console.error("Error llamando al microservicio:", error.message);
            }

            // Insertar post
            let skin_r = null, skin_g = null, skin_b = null;
            if (skin_ref_rgb && Array.isArray(skin_ref_rgb) && skin_ref_rgb.length === 3) {
                [skin_r, skin_g, skin_b] = skin_ref_rgb;
            }

            const insertQuery = `
                INSERT INTO posts_generales 
                (descripcion, imagen, autor, categoria, image_width, image_height,
                 face_detected, skin_ref_r, skin_ref_g, skin_ref_b)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const insertValues = [
                descripcion, path_value, autor, categoria,
                image_width, image_height,
                face_detected ? 1 : 0,
                skin_r, skin_g, skin_b
            ];

            const insertResult = await new Promise((resolve, reject) => {
                conn.query(insertQuery, insertValues, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
            const postId = insertResult.insertId;

            // Insertar prendas
            for (const g of garments) {
                const [x1, y1, x2, y2] = g.bbox;
                const insertPrendaQuery = `
                    INSERT INTO post_prendas 
                    (id_post, label, label_id, confidence, bbox_x1, bbox_y1, bbox_x2, bbox_y2,
                     color_vibrant_r, color_vibrant_g, color_vibrant_b,
                     color_muted_r, color_muted_g, color_muted_b,
                     color_third_r, color_third_g, color_third_b, mask_b64)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                const valuesPrenda = [
                    postId, g.label, g.label_id, g.confidence,
                    x1, y1, x2, y2,
                    g.colors.vibrant[0], g.colors.vibrant[1], g.colors.vibrant[2],
                    g.colors.muted[0], g.colors.muted[1], g.colors.muted[2],
                    g.colors.third[0], g.colors.third[1], g.colors.third[2],
                    g.mask_b64 || null
                ];
                await new Promise((resolve, reject) => {
                    conn.query(insertPrendaQuery, valuesPrenda, (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                });
            }

            // Insertar zonas de maquillaje
            for (const zone of makeupZones) {
                const vibrant = zone.colors?.vibrant || [0, 0, 0];
                const muted = zone.colors?.muted || [0, 0, 0];
                const third = zone.colors?.third || [0, 0, 0];

                const insertMakeupQuery = `
                    INSERT INTO post_makeup_zones
                    (id_post, zone, has_makeup, distance_to_skin, color_name, product_link,
                     vibrant_r, vibrant_g, vibrant_b,
                     muted_r, muted_g, muted_b,
                     third_r, third_g, third_b)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                const valuesMakeup = [
                    postId, zone.zone, zone.has_makeup ? 1 : 0,
                    zone.distance_to_skin, zone.color_name || null, zone.product_link || null,
                    vibrant[0], vibrant[1], vibrant[2],
                    muted[0], muted[1], muted[2],
                    third[0], third[1], third[2]
                ];
                await new Promise((resolve, reject) => {
                    conn.query(insertMakeupQuery, valuesMakeup, (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                });
            }

            return res.json({
                status: 1,
                mensaje: "Publicación creada correctamente",
                datos: { postId, prendas_detectadas: garments.length, zonas_maquillaje: makeupZones.length }
            });

        } catch (error) {
            console.error("Error procesando imagen:", error);
            return res.status(500).json({ status: 0, mensaje: "Error al procesar la imagen", datos: [] });
        }
    } else if (fileExtension === '.mp4' || fileExtension === '.avi' || fileExtension === '.mov') {
        const query = `INSERT INTO posts_generales (descripcion, imagen, autor, categoria) VALUES (?, ?, ?, ?)`;
        const values = [descripcion, path_value, autor, categoria];
        conn.query(query, values, (error, filas) => {
            if (error) {
                console.error(error);
                return res.json({ status: 0, mensaje: "Error al insertar el video en la BD", datos: [] });
            }
            return res.json({ status: 1, mensaje: "Video insertado con éxito", datos: filas });
        });
    } else {
        return res.json({ status: 0, mensaje: "Formato de archivo no soportado", datos: [] });
    }
};

// Obtener todos los posts (feed unificado)
exports.getPosts = (req, res) => {
    const queryPosts = `
        SELECT 
            p.id_post, p.descripcion, p.imagen, p.autor, p.categoria,
            p.image_width, p.image_height,
            p.face_detected, p.skin_ref_r, p.skin_ref_g, p.skin_ref_b,
            u.id_user, u.usuario,
            c.id_categoria, c.name_categoria
        FROM posts_generales p
        JOIN usuarios u ON p.autor = u.id_user
        JOIN categorias c ON p.categoria = c.id_categoria
        ORDER BY p.id_post DESC
    `;

    conn.query(queryPosts, async (error, posts) => {
        if (error) {
            console.error('Error en query de posts:', error);
            return res.json({ status: 0, mensaje: "Error en BD", datos: [] });
        }

        try {
            const resultado = await Promise.all(
                posts.map(async (post) => {
                    const prendas = await obtenerPrendas(post.id_post);
                    const maquillaje = await obtenerMaquillaje(post.id_post);
                    return {
                        ...post,
                        face_detected: Boolean(post.face_detected),
                        skin_reference_color: post.skin_ref_r !== null ? [post.skin_ref_r, post.skin_ref_g, post.skin_ref_b] : null,
                        prendas: prendas,
                        makeup_zones: maquillaje
                    };
                })
            );
            res.json({ status: 1, mensaje: "Info obtenida", datos: resultado });
        } catch (err) {
            console.error('Error al obtener prendas o maquillaje:', err);
            res.json({ status: 0, mensaje: "Error al cargar información", datos: [] });
        }
    });
};

// Obtener post por ID (para editar)
exports.getPostById = (req, res) => {
    let obtener = `SELECT descripcion, imagen, autor, categoria FROM posts_generales WHERE id_post = ${req.params.id}`;
    conn.query(obtener, (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Info obtenida con éxito", datos: filas });
        }
    });
};

// Actualizar post
exports.updatePost = (req, res) => {
    let obtener = `UPDATE posts_generales SET descripcion = '${req.body.descripcion}', imagen = '${req.body.imagen}', categoria = '${req.body.categoria}' WHERE id_post = ${req.params.id}`;
    conn.query(obtener, (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Post actualizado con éxito", datos: filas });
        }
    });
};

// Eliminar post
exports.deletePost = (req, res) => {
    let consulta = `DELETE FROM posts_generales WHERE id_post = ${req.params.id}`;
    conn.query(consulta, (err, filas) => {
        if (err) {
            res.json({ status: 0, mensaje: "Error en la eliminación", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Dato eliminado satisfactoriamente", datos: [] });
        }
    });
};