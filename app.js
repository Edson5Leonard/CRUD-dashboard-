require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json()); // Necesario para parsear JSON en el req.body
app.use(express.urlencoded({ extended: true }));

// ========== RUTAS API ==========
const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

const empleadoRoutes = require('./routes/empleadoRoutes');
app.use('/api/empleados', empleadoRoutes);

// ========== SERVIDOR PARA REACT (PRODUCCIÓN) ==========
// Servir archivos estáticos del build de React (JS, CSS, imágenes)
app.use(express.static(path.join(__dirname, 'client/dist')));

// Para cualquier ruta que no sea un archivo estático o API, envía index.html
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, 'client/dist/index.html'));
  }
  next();
});

// ========== INICIAR SERVIDOR ==========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend corriendo en el puerto ${PORT}`);
});