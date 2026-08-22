const conn = require('../config/database');
const Vibrant = require('node-vibrant/node');
require('dotenv').config();
const axios = require('axios');

// ===== EXTRAER COLORES DE IMAGEN =====
exports.extractColors = async (req, res) => {
    const imageUrl = req.body.imageUrl;
    try {
        const palette = await Vibrant.from(imageUrl).getPalette();
        res.json(palette);
    } catch (error) {
        console.error('Error al obtener los colores:', error);
        res.status(500).json({ error: 'Error al obtener los colores' });
    }
};

// ===== FUNCIONES AUXILIARES PARA LOOKS ALEATORIOS =====
function obtenerPrendaAleatoria(tabla, callback) {
    const query = `SELECT * FROM ${tabla} ORDER BY RAND() LIMIT 1`;
    conn.query(query, (err, result) => {
        if (err) throw err;
        callback(result[0]);
    });
}

// ===== GENERAR LOOK ALEATORIO (FEMENINO) =====
exports.generateRandomLook = (req, res) => {
    let look = {};
    obtenerPrendaAleatoria('tops', (top) => {
        look.top = top;
        obtenerPrendaAleatoria('pantalones', (pantalon) => {
            look.pantalon = pantalon;
            obtenerPrendaAleatoria('accesorios', (accesorio) => {
                look.accesorio = accesorio;
                obtenerPrendaAleatoria('zapatos', (zapato) => {
                    look.zapato = zapato;
                    obtenerPrendaAleatoria('chaquetas', (chaqueta) => {
                        look.chaqueta = chaqueta;
                        res.json(look);
                    });
                });
            });
        });
    });
};

// ===== GENERAR LOOK ALEATORIO (MASCULINO) =====
exports.generateRandomLookM = (req, res) => {
    let looks = {};
    obtenerPrendaAleatoria('topsH', (topsH) => {
        looks.topM = topsH;
        obtenerPrendaAleatoria('pantalonesH', (pantalonH) => {
            looks.pantalonM = pantalonH;
            obtenerPrendaAleatoria('accesoriosH', (accesorioH) => {
                looks.accesorioM = accesorioH;
                obtenerPrendaAleatoria('zapatosH', (zapatoH) => {
                    looks.zapatoM = zapatoH;
                    obtenerPrendaAleatoria('chaquetasH', (chaquetaH) => {
                        looks.chaquetaM = chaquetaH;
                        res.json(looks);
                    });
                });
            });
        });
    });
};

// ===== OBTENER PRENDAS (para try-on) =====
exports.getPrendas = (req, res) => {
    let obtener = 'SELECT url_imagen FROM prendas';
    conn.query(obtener, (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Prendas obtenidas", datos: filas });
        }
    });
};

// ===== OBTENER IMÁGENES DE POSTS (obsoleto, pero se mantiene) =====
exports.getPostImages = (req, res) => {
    let obtener = 'SELECT imagen FROM posts_generales';
    conn.query(obtener, (error, filas) => {
        if (error) {
            res.json({ status: 0, mensaje: "No hay valores en la BD", datos: [] });
        } else {
            res.json({ status: 1, mensaje: "Imágenes obtenidas", datos: filas });
        }
    });

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

        console.error(
            'Error fetching data from NewsAPI:',
            error.message
        );

        res.status(500).json({
            message: 'Error fetching data from NewsAPI'
        });
    }
};