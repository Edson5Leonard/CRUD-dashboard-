// controllers/dashboardController.js
const db = require('../config/db');

const dashboardController = {
    showDashboard: async (req, res) => {
        try {
            // 1. TOTAL DE REGISTROS
            const [totalRows] = await db.query('SELECT COUNT(*) as total FROM empleados');
            
            // 2. ÚLTIMO REGISTRO INSERTADO
            const [ultimoInsertado] = await db.query(`
                SELECT nombre, email, categoria, 
                       DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') as fecha
                FROM empleados 
                ORDER BY created_at DESC 
                LIMIT 1
            `);
            
            // 3. ÚLTIMO REGISTRO ACTUALIZADO
            const [ultimoActualizado] = await db.query(`
                SELECT nombre, email, categoria,
                       DATE_FORMAT(updated_at, '%d/%m/%Y %H:%i') as fecha
                FROM empleados 
                ORDER BY updated_at DESC 
                LIMIT 1
            `);
            
            // 4. GRÁFICO 1: Empleados por Área
            const [graficoAreas] = await db.query(`
                SELECT a.nombre as label, COUNT(e.id) as value
                FROM areas a
                LEFT JOIN empleados e ON a.id = e.area_id
                GROUP BY a.id, a.nombre
                ORDER BY value DESC
            `);
            
            // 5. GRÁFICO 2: Empleados por Categoría
            const [graficoCategorias] = await db.query(`
                SELECT categoria as label, COUNT(*) as value
                FROM empleados
                WHERE categoria IS NOT NULL AND categoria != ''
                GROUP BY categoria
                ORDER BY value DESC
            `);
            
            // 6. ESTADOS
            const [estados] = await db.query(`
                SELECT estado, COUNT(*) as cantidad,
                       CONCAT(ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM empleados), 1), '%') as porcentaje
                FROM empleados 
                GROUP BY estado 
                ORDER BY cantidad DESC
            `);

            console.log('✅ Dashboard cargado con datos reales');
            console.log('📊 Áreas:', graficoAreas.length);
            console.log('📊 Categorías:', graficoCategorias.length);

            res.render('dashboard', {
                title: 'Dashboard - CRUD Empleados',
                ultimoInsertado: ultimoInsertado[0] || { 
                    nombre: 'Sin datos', 
                    email: 'N/A', 
                    categoria: 'N/A', 
                    fecha: 'N/A' 
                },
                ultimoActualizado: ultimoActualizado[0] || { 
                    nombre: 'Sin datos', 
                    email: 'N/A', 
                    categoria: 'N/A', 
                    fecha: 'N/A' 
                },
                graficoAreas: graficoAreas,
                graficoCategorias: graficoCategorias,
                totalRegistros: totalRows[0].total,
                estados: estados
            });
            
        } catch (error) {
            console.error('❌ Error en dashboard:', error);
            res.status(500).send('Error al cargar el dashboard: ' + error.message);
        }
    }
};

module.exports = dashboardController;