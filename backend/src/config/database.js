const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'glamfinds',
    waitForConnections: true,
    connectionLimit: 10,        // Máximo de conexiones simultáneas
    queueLimit: 0,
    enableKeepAlive: true,      // Mantener conexión activa
    keepAliveInitialDelay: 0
});

// Probar conexión al iniciar
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error conectando a la BD:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL (pool)');
    connection.release(); // Liberar la conexión de prueba
});

// Exportar el pool (para usar con promesas)
module.exports = pool.promise();
