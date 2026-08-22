const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Importar rutas (aún vacías, las crearemos después)
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/users.routes');
const postRoutes = require('./routes/posts.routes');
const interactionRoutes = require('./routes/interactions.routes');
const articleRoutes = require('./routes/articles.routes');
const feedRoutes = require('./routes/feed.routes');
const outfitRoutes = require('./routes/outfit.routes');
const toolRoutes = require('./routes/tools.routes');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/outfit', outfitRoutes);
app.use('/api/tools', toolRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'GlamFinds API funcionando' });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor'
  });
});

module.exports = app;
