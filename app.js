require('dotenv').config();
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const empleadoRoutes = require('./routes/empleadoRoutes');
app.use('/empleados', empleadoRoutes);

// app.js - Agregar después de las otras rutas
const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/dashboard', dashboardRoutes);

// También puedes agregar una redirección de la raíz al dashboard
app.get('/', (req, res) => {
    res.redirect('/dashboard');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
    console.log(`👥 Empleados: http://localhost:${PORT}/empleados`);
});