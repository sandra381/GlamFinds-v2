const conn = require('../config/database');
const { generarOutfitIA } = require('../services/gemini.service');
const { buscarImagenPexels } = require('../services/pexels.service');

// ===== GENERAR OUTFIT =====
exports.generateOutfit = async (req, res) => {
    const { ocasion, clima, colores } = req.body;

    if (!ocasion || !clima) {
        return res.json({ status: 0, mensaje: 'Ocasión y clima son obligatorios', datos: [] });
    }

    try {
        const outfitIA = await generarOutfitIA(ocasion, clima, colores);

        const [imagenTop, imagenBottom, imagenShoes, imagenAccessory] = await Promise.all([
            buscarImagenPexels(outfitIA.top_query),
            buscarImagenPexels(outfitIA.bottom_query),
            buscarImagenPexels(outfitIA.shoes_query),
            buscarImagenPexels(outfitIA.accessory_query)
        ]);

        const resultado = {
            top: { descripcion: outfitIA.top, imagen: imagenTop },
            bottom: { descripcion: outfitIA.bottom, imagen: imagenBottom },
            shoes: { descripcion: outfitIA.shoes, imagen: imagenShoes },
            accessory: { descripcion: outfitIA.accessory, imagen: imagenAccessory },
            reason: outfitIA.reason
        };

        res.json({ status: 1, mensaje: 'Outfit generado con éxito', datos: resultado });
    } catch (error) {
        console.error('Error al generar outfit:', error.response?.data || error.message);
        res.json({ status: 0, mensaje: 'Error al generar el outfit con IA', datos: [] });
    }
};

// ===== GUARDAR OUTFIT =====
exports.saveOutfit = async (req, res) => {
    try {
        const { id_usuario, json_generado } = req.body;

        if (!id_usuario || !json_generado) {
            return res.json({ status: 0, mensaje: 'Faltan datos para guardar el outfit', datos: [] });
        }

        const jsonTexto = JSON.stringify(json_generado);
        const query = 'INSERT INTO outfits_guardados (id_usuario, json_generado) VALUES (?, ?)';
        const [result] = await conn.query(query, [id_usuario, jsonTexto]);

        res.json({ status: 1, mensaje: 'Outfit guardado con éxito', datos: { id_outfit: result.insertId } });
    } catch (error) {
        console.error('Error al guardar outfit:', error);
        res.json({ status: 0, mensaje: 'Error al guardar el outfit', datos: [] });
    }
};

// ===== OBTENER OUTFITS GUARDADOS =====
exports.getSavedOutfits = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const query = 'SELECT id_outfit, id_usuario, fecha, json_generado FROM outfits_guardados WHERE id_usuario = ? ORDER BY fecha DESC';
        const [rows] = await conn.query(query, [id_usuario]);
        res.json({ status: 1, mensaje: 'Outfits obtenidos con éxito', datos: rows });
    } catch (error) {
        console.error('Error al obtener outfits guardados:', error);
        res.json({ status: 0, mensaje: 'Error al obtener los outfits guardados', datos: [] });
    }
};

// ===== ELIMINAR OUTFIT GUARDADO =====
exports.deleteSavedOutfit = async (req, res) => {
    try {
        const { id_outfit } = req.params;
        const query = 'DELETE FROM outfits_guardados WHERE id_outfit = ?';
        await conn.query(query, [id_outfit]);
        res.json({ status: 1, mensaje: 'Outfit eliminado con éxito', datos: [] });
    } catch (error) {
        console.error('Error al eliminar outfit guardado:', error);
        res.json({ status: 0, mensaje: 'Error al eliminar el outfit', datos: [] });
    }
};