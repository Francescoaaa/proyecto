const { createConnection } = require('./config/database');

const migrateNotifications = async () => {
    try {
        console.log('🔄 Iniciando migración de campos de notificaciones...');
        
        const connection = await createConnection();
        
        // Verificar si los campos ya existen
        const [columns] = await connection.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'sonrisitapp' 
            AND TABLE_NAME = 'usuarios' 
            AND COLUMN_NAME IN ('email_notifications', 'promo_notifications')
        `);
        
        if (columns.length === 2) {
            console.log('✅ Los campos de notificaciones ya existen');
            await connection.end();
            return;
        }
        
        // Agregar campos si no existen
        if (columns.length === 0) {
            console.log('📝 Agregando campos de notificaciones...');
            
            await connection.execute(`
                ALTER TABLE usuarios 
                ADD COLUMN email_notifications BOOLEAN DEFAULT TRUE,
                ADD COLUMN promo_notifications BOOLEAN DEFAULT FALSE
            `);
            
            console.log('✅ Campos agregados exitosamente');
        } else {
            // Agregar campos faltantes individualmente
            const existingColumns = columns.map(col => col.COLUMN_NAME);
            
            if (!existingColumns.includes('email_notifications')) {
                await connection.execute(`
                    ALTER TABLE usuarios 
                    ADD COLUMN email_notifications BOOLEAN DEFAULT TRUE
                `);
                console.log('✅ Campo email_notifications agregado');
            }
            
            if (!existingColumns.includes('promo_notifications')) {
                await connection.execute(`
                    ALTER TABLE usuarios 
                    ADD COLUMN promo_notifications BOOLEAN DEFAULT FALSE
                `);
                console.log('✅ Campo promo_notifications agregado');
            }
        }
        
        // Verificar la migración
        const [result] = await connection.execute(`
            SELECT COUNT(*) as count 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'sonrisitapp' 
            AND TABLE_NAME = 'usuarios' 
            AND COLUMN_NAME IN ('email_notifications', 'promo_notifications')
        `);
        
        if (result[0].count === 2) {
            console.log('🎉 Migración completada exitosamente');
        } else {
            console.log('❌ Error en la migración');
        }
        
        await connection.end();
        
    } catch (error) {
        console.error('❌ Error en la migración:', error);
        process.exit(1);
    }
};

// Ejecutar si se llama directamente
if (require.main === module) {
    migrateNotifications();
}

module.exports = { migrateNotifications };