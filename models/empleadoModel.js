// models/empleadoModel.js
const db = require('../config/db');

class Empleado {
    constructor({ id, nombre, email, salario, fecha_ingreso, tipo_id, area_id, 
                  categoria, estado, created_at, updated_at, tipo, area }) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.salario = salario;
        this.fecha_ingreso = fecha_ingreso;
        this.tipo_id = tipo_id;
        this.area_id = area_id;
        this.categoria = categoria || 'Junior';
        this.estado = estado || 'Activo';
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.tipo = tipo;
        this.area = area;
    }

    // Obtener todos con filtros opcionales
    static async obtenerTodos(filtros = {}) {
        let sql = `
            SELECT e.*, t.nombre AS tipo, a.nombre AS area
            FROM empleados e
            LEFT JOIN tipos_empleado t ON e.tipo_id = t.id
            LEFT JOIN areas a ON e.area_id = a.id
            WHERE 1=1
        `;
        const valores = [];
        if (filtros.nombre) {
            sql += ' AND e.nombre LIKE ?';
            valores.push(`%${filtros.nombre}%`);
        }
        if (filtros.tipo_id) {
            sql += ' AND e.tipo_id = ?';
            valores.push(filtros.tipo_id);
        }
        if (filtros.area_id) {
            sql += ' AND e.area_id = ?';
            valores.push(filtros.area_id);
        }
        if (filtros.estado) {
            sql += ' AND e.estado = ?';
            valores.push(filtros.estado);
        }
        if (filtros.categoria) {
            sql += ' AND e.categoria = ?';
            valores.push(filtros.categoria);
        }
        
        sql += ' ORDER BY e.id DESC';
        
        const [rows] = await db.query(sql, valores);
        return rows.map(row => new Empleado(row));
    }

    static async obtenerPorId(id) {
        const [rows] = await db.query(`
            SELECT e.*, t.nombre AS tipo, a.nombre AS area
            FROM empleados e
            LEFT JOIN tipos_empleado t ON e.tipo_id = t.id
            LEFT JOIN areas a ON e.area_id = a.id
            WHERE e.id = ?
        `, [id]);
        return rows.length ? new Empleado(rows[0]) : null;
    }

    static async crear(empleado) {
        const sql = `
            INSERT INTO empleados 
            (nombre, email, salario, fecha_ingreso, tipo_id, area_id, categoria, estado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(sql, [
            empleado.nombre,
            empleado.email,
            empleado.salario,
            empleado.fecha_ingreso || new Date(),
            empleado.tipo_id,
            empleado.area_id,
            empleado.categoria || 'Junior',
            empleado.estado || 'Activo'
        ]);
        return result.insertId;
    }

    static async actualizar(id, empleado) {
        const sql = `
            UPDATE empleados
            SET nombre = ?, 
                email = ?, 
                salario = ?, 
                fecha_ingreso = ?, 
                tipo_id = ?, 
                area_id = ?,
                categoria = ?,
                estado = ?
            WHERE id = ?
        `;
        await db.query(sql, [
            empleado.nombre,
            empleado.email,
            empleado.salario,
            empleado.fecha_ingreso,
            empleado.tipo_id,
            empleado.area_id,
            empleado.categoria,
            empleado.estado,
            id
        ]);
    }

    static async eliminar(id) {
        await db.query('DELETE FROM empleados WHERE id = ?', [id]);
    }

    // ============ NUEVOS MÉTODOS PARA EL DASHBOARD ============

    // ÚLTIMO REGISTRO INSERTADO
    static async getUltimoInsertado() {
        const query = `
            SELECT 
                id,
                nombre,
                email,
                categoria,
                'insertado' as accion,
                DATE_FORMAT(created_at, '%d/%m/%Y %H:%i:%s') as fecha,
                created_at as fecha_orden
            FROM empleados 
            ORDER BY created_at DESC 
            LIMIT 1
        `;
        return await db.query(query);
    }

    // ÚLTIMO REGISTRO ACTUALIZADO (EDITADO)
    static async getUltimoActualizado() {
        const query = `
            SELECT 
                id,
                nombre,
                email,
                categoria,
                'actualizado' as accion,
                DATE_FORMAT(updated_at, '%d/%m/%Y %H:%i:%s') as fecha,
                updated_at as fecha_orden
            FROM empleados 
            ORDER BY updated_at DESC 
            LIMIT 1
        `;
        return await db.query(query);
    }

    // GRÁFICO 1: Empleados por Área (para gráfico de pastel)
    static async getEmpleadosPorArea() {
        const query = `
            SELECT 
                a.nombre as label,
                COUNT(e.id) as value,
                a.id
            FROM areas a
            LEFT JOIN empleados e ON a.id = e.area_id
            GROUP BY a.id, a.nombre
            ORDER BY value DESC
        `;
        return await db.query(query);
    }

    // GRÁFICO 2: Empleados por Categoría (para gráfico de barras)
    static async getEmpleadosPorCategoria() {
        const query = `
            SELECT 
                categoria as label,
                COUNT(*) as value,
                CASE 
                    WHEN categoria = 'Trainee' THEN 1
                    WHEN categoria = 'Junior' THEN 2
                    WHEN categoria = 'Semi Senior' THEN 3
                    WHEN categoria = 'Senior' THEN 4
                    WHEN categoria = 'Senior Plus' THEN 5
                    ELSE 6
                END as orden
            FROM empleados
            WHERE categoria IS NOT NULL
            GROUP BY categoria
            ORDER BY orden
        `;
        return await db.query(query);
    }

    // TOTAL DE REGISTROS
    static async getTotalRegistros() {
        const query = 'SELECT COUNT(*) as total FROM empleados';
        return await db.query(query);
    }

    // ÁREAS (Para selector)
    static async getAreas() {
        const query = 'SELECT id, nombre FROM areas ORDER BY nombre ASC';
        return await db.query(query);
    }

    // TIPOS (Para selector)
    static async getTipos() {
        const query = 'SELECT id, nombre FROM tipos_empleado ORDER BY nombre ASC';
        return await db.query(query);
    }

    // ESTADOS
    static async getEstados() {
        const query = `
            SELECT 
                estado,
                COUNT(*) as cantidad,
                CONCAT(ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM empleados), 1), '%') as porcentaje
            FROM empleados 
            GROUP BY estado 
            ORDER BY cantidad DESC
        `;
        return await db.query(query);
    }
}

module.exports = Empleado;