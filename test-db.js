// test-db.js
const db = require('./config/db');

async function testConnection() {
    try {
        console.log('🔄 Probando conexión a MySQL...');
        
        // Prueba simple
        const [result] = await db.query('SELECT 1 + 1 AS suma');
        console.log('✅ Conexión a MySQL exitosa!');
        console.log('📊 Resultado de prueba:', result[0].suma);
        
        // Verificar tablas
        const [tablas] = await db.query('SHOW TABLES');
        console.log('\n📋 Tablas en la base de datos:');
        tablas.forEach(tabla => {
            console.log('   - ' + Object.values(tabla)[0]);
        });
        
        // Contar empleados
        const [empleados] = await db.query('SELECT COUNT(*) as total FROM empleados');
        console.log('\n👥 Total de empleados:', empleados[0].total);
        
        // Mostrar primeros 3 empleados
        const [primeros] = await db.query('SELECT id, nombre, email, categoria, estado FROM empleados LIMIT 3');
        console.log('\n📝 Primeros 3 empleados:');
        console.table(primeros);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        console.error('\n🔧 Posibles soluciones:');
        console.error('1. Verifica que MySQL esté corriendo');
        console.error('2. Revisa tus credenciales en el archivo .env');
        console.error('3. Asegúrate que la base de datos "gestion_empleados" exista');
        process.exit(1);
    }
}

testConnection();