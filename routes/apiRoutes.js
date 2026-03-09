// routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const Empleado = require('../models/empleadoModel');

// Endpoint para obtener todos los datos del dashboard
router.get('/dashboard-data', async (req, res) => {
    try {
        // Ejecutar consultas en paralelo
        const [totalRows, ultimoInsertado, ultimoActualizado, graficoAreas, graficoCategorias, estados] = await Promise.all([
            Empleado.getTotalRegistros(),
            Empleado.getUltimoInsertado(),
            Empleado.getUltimoActualizado(),
            Empleado.getEmpleadosPorArea(),
            Empleado.getEmpleadosPorCategoria(),
            Empleado.getEstados()
        ]);

        res.json({
            totalRegistros: totalRows[0]?.[0]?.total || 0,
            ultimoInsertado: ultimoInsertado[0]?.[0] || null,
            ultimoActualizado: ultimoActualizado[0]?.[0] || null,
            graficoAreas: graficoAreas[0] || [],
            graficoCategorias: graficoCategorias[0] || [],
            estados: estados[0] || []
        });
    } catch (error) {
        console.error('Error en API dashboard:', error);
        res.status(500).json({ error: 'Error al obtener datos del dashboard' });
    }
});

// Endpoint para obtener selectores de áreas
router.get('/areas', async (req, res) => {
    try {
        const [areas] = await Empleado.getAreas();
        res.json(areas);
    } catch (error) {
        console.error('Error al obtener áreas:', error);
        res.status(500).json({ error: 'Error al obtener áreas' });
    }
});

// Endpoint para obtener selectores de tipos de empleado
router.get('/tipos', async (req, res) => {
    try {
        const [tipos] = await Empleado.getTipos();
        res.json(tipos);
    } catch (error) {
        console.error('Error al obtener tipos de empleado:', error);
        res.status(500).json({ error: 'Error al obtener tipos de empleado' });
    }
});

module.exports = router;