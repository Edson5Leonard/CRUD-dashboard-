// controllers/empleadoController.js
const Empleado = require('../models/empleadoModel');
const db = require('../config/db');

// LISTAR EMPLEADOS CON GRÁFICOS
exports.listar = async (req, res) => {
    try {
        const filtros = {
            nombre: req.query.nombre || '',
            tipo_id: req.query.tipo_id || '',
            area_id: req.query.area_id || ''
        };
        
        // Obtener lista de empleados
        const empleados = await Empleado.obtenerTodos(filtros);
        
        // Obtener datos para los gráficos
        const [graficoAreas] = await db.query(`
            SELECT a.nombre as label, COUNT(e.id) as value
            FROM areas a
            LEFT JOIN empleados e ON a.id = e.area_id
            GROUP BY a.id, a.nombre
            ORDER BY value DESC
        `);
        
        const [graficoCategorias] = await db.query(`
            SELECT categoria as label, COUNT(*) as value
            FROM empleados
            WHERE categoria IS NOT NULL AND categoria != ''
            GROUP BY categoria
            ORDER BY value DESC
        `);
        
        res.render('empleados', { 
            empleados: empleados,
            filtros: filtros,
            graficoAreas: graficoAreas,
            graficoCategorias: graficoCategorias,
            title: 'Lista de Empleados'
        });
        
    } catch (error) {
        console.error('Error en listar:', error);
        res.status(500).send('Error al listar empleados: ' + error.message);
    }
};

// MOSTRAR FORMULARIO CREAR
exports.mostrarFormularioCrear = (req, res) => {
    res.render('empleado-form', { 
        empleado: null, 
        action: '/empleados/crear',
        title: 'Nuevo Empleado'
    });
};

// CREAR EMPLEADO
exports.crear = async (req, res) => {
    try {
        await Empleado.crear(req.body);
        res.redirect('/empleados');
    } catch (error) {
        console.error('Error en crear:', error);
        res.status(500).send('Error al crear empleado: ' + error.message);
    }
};

// MOSTRAR FORMULARIO EDITAR
exports.mostrarFormularioEditar = async (req, res) => {
    try {
        const empleado = await Empleado.obtenerPorId(req.params.id);
        if (!empleado) {
            return res.status(404).send('Empleado no encontrado');
        }
        res.render('empleado-form', { 
            empleado: empleado, 
            action: `/empleados/${empleado.id}/actualizar`,
            title: 'Editar Empleado'
        });
    } catch (error) {
        console.error('Error en editar:', error);
        res.status(500).send('Error al cargar empleado: ' + error.message);
    }
};

// ACTUALIZAR EMPLEADO
exports.actualizar = async (req, res) => {
    try {
        await Empleado.actualizar(req.params.id, req.body);
        res.redirect('/empleados');
    } catch (error) {
        console.error('Error en actualizar:', error);
        res.status(500).send('Error al actualizar empleado: ' + error.message);
    }
};

// ELIMINAR EMPLEADO
exports.eliminar = async (req, res) => {
    try {
        await Empleado.eliminar(req.params.id);
        res.redirect('/empleados');
    } catch (error) {
        console.error('Error en eliminar:', error);
        res.status(500).send('Error al eliminar empleado: ' + error.message);
    }
};