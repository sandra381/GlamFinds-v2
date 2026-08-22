require('dotenv').config();
const app = require('./src/app');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}/api`);
});
