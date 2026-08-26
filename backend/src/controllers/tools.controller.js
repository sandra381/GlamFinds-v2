const conn = require('../config/database');
const Vibrant = require('node-vibrant/node');
require('dotenv').config();
const axios = require('axios');

// ===== EXTRAER COLORES DE IMAGEN =====
exports.extractColors = async (req, res) => {
    try {
        const imageUrl = req.body.imageUrl;
        const palette = await Vibrant.from(imageUrl).getPalette();
        res.json(palette);
    } catch (error) {
        console.error('Error al obtener los colores:', error);
        res.status(500).json({ error: 'Error al obtener los colores' });
    }
};

// ===== FUNCIONES AUXILIARES PARA LOOKS ALEATORIOS =====
async function obtenerPrendaAleatoria(tabla) {
    const query = `SELECT * FROM ${tabla} ORDER BY RAND() LIMIT 1`;
    const [rows] = await conn.query(query);
    return rows[0];
}

// ===== GENERAR LOOK ALEATORIO (FEMENINO) =====
exports.generateRandomLook = async (req, res) => {
    try {
        const look = {
            top: await obtenerPrendaAleatoria('tops'),
            pantalon: await obtenerPrendaAleatoria('pantalones'),
            accesorio: await obtenerPrendaAleatoria('accesorios'),
            zapato: await obtenerPrendaAleatoria('zapatos'),
            chaqueta: await obtenerPrendaAleatoria('chaquetas')
        };
        res.json(look);
    } catch (error) {
        console.error('Error generando look aleatorio:', error);
        res.status(500).json({ error: 'Error generando look' });
    }
};

// ===== GENERAR LOOK ALEATORIO (MASCULINO) =====
exports.generateRandomLookM = async (req, res) => {
    try {
        const looks = {
            topM: await obtenerPrendaAleatoria('topsH'),
            pantalonM: await obtenerPrendaAleatoria('pantalonesH'),
            accesorioM: await obtenerPrendaAleatoria('accesoriosH'),
            zapatoM: await obtenerPrendaAleatoria('zapatosH'),
            chaquetaM: await obtenerPrendaAleatoria('chaquetasH')
        };
        res.json(looks);
    } catch (error) {
        console.error('Error generando look masculino:', error);
        res.status(500).json({ error: 'Error generando look' });
    }
};

// ===== OBTENER PRENDAS (para try-on) =====
exports.getPrendas = async (req, res) => {
    try {
        const query = 'SELECT url_imagen FROM prendas';
        const [rows] = await conn.query(query);
        res.json({ status: 1, mensaje: "Prendas obtenidas", datos: rows });
    } catch (error) {
        res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
    }
};

// ===== OBTENER IMÁGENES DE POSTS (obsoleto) =====
exports.getPostImages = async (req, res) => {
    try {
        const query = 'SELECT imagen FROM posts_generales';
        const [rows] = await conn.query(query);
        res.json({ status: 1, mensaje: "Imágenes obtenidas", datos: rows });
    } catch (error) {
        res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
    }
};

// ===== OBTENER NOTICIAS DE MODA =====
exports.getNews = async (req, res) => {
    try {
        const response = await axios.get(
            `https://newsapi.org/v2/everything?q=fashion%20AND%20moda&sortBy=popularity&language=es&apiKey=${process.env.NEWS_API_KEY}`
        );
        const articles = response.data.articles.map(article => ({
            title: article.title,
            description: article.description,
            link: article.url,
            image: article.urlToImage,
            source: article.source.name
        }));
        res.json(articles);
    } catch (error) {
        console.error('Error fetching data from NewsAPI:', error.message);
        res.status(500).json({ message: 'Error fetching data from NewsAPI' });
    }
};