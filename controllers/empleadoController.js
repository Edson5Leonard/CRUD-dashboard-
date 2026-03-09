// controllers/empleadoController.js
const Empleado = require('../models/empleadoModel');

// LISTAR EMPLEADOS
exports.listar = async (req, res) => {
    try {
        const filtros = {
            nombre: req.query.nombre || '',
            tipo_id: req.query.tipo_id || '',
            area_id: req.query.area_id || ''
        };
        
        // Obtener lista de empleados
        const empleados = await Empleado.obtenerTodos(filtros);
        res.json(empleados);
        
    } catch (error) {
        console.error('Error en listar:', error);
        res.status(500).json({ error: 'Error al listar empleados: ' + error.message });
    }
};

// OBTENER EMPLEADO POR ID
exports.obtener = async (req, res) => {
    try {
        const empleado = await Empleado.obtenerPorId(req.params.id);
        if (!empleado) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        res.json(empleado);
    } catch (error) {
        console.error('Error en obtener:', error);
        res.status(500).json({ error: 'Error al cargar empleado: ' + error.message });
    }
};

// CREAR EMPLEADO
exports.crear = async (req, res) => {
    try {
        const resultado = await Empleado.crear(req.body);
        res.status(201).json({ message: 'Empleado creado exitosamente', id: resultado });
    } catch (error) {
        console.error('Error en crear:', error);
        res.status(500).json({ error: 'Error al crear empleado: ' + error.message });
    }
};

// ACTUALIZAR EMPLEADO
exports.actualizar = async (req, res) => {
    try {
        await Empleado.actualizar(req.params.id, req.body);
        res.json({ message: 'Empleado actualizado exitosamente' });
    } catch (error) {
        console.error('Error en actualizar:', error);
        res.status(500).json({ error: 'Error al actualizar empleado: ' + error.message });
    }
};

// ELIMINAR EMPLEADO
exports.eliminar = async (req, res) => {
    try {
        await Empleado.eliminar(req.params.id);
        res.json({ message: 'Empleado eliminado exitosamente' });
    } catch (error) {
        console.error('Error en eliminar:', error);
        res.status(500).json({ error: 'Error al eliminar empleado: ' + error.message });
    }
};