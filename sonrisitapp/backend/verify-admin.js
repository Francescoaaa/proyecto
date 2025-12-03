const bcrypt = require('bcryptjs');
const { createConnection } = require('./config/database');

async function verifyAdmin() {
    try {
        console.log('🔍 Verificando usuario administrador...');
        
        const connection = await createConnection();
        
        // Buscar usuario admin
        const [users] = await connection.execute(
            'SELECT * FROM usuarios WHERE email = ?', 
            ['admin@sonrisitapp.com']
        );
        
        if (users.length === 0) {
            console.log('❌ Usuario admin NO encontrado');
            console.log('💡 Ejecuta el script database.sql para crear el usuario admin');
            return;
        }
        
        const admin = users[0];
        console.log('✅ Usuario admin encontrado:');
        console.log('   ID:', admin.id);
        console.log('   Nombre:', admin.nombre);
        console.log('   Email:', admin.email);
        console.log('   Rol:', admin.rol);
        console.log('   Activo:', admin.activo);
        
        // Verificar contraseña
        const testPassword = 'password';
        const isValid = await bcrypt.compare(testPassword, admin.password);
        
        if (isValid) {
            console.log('✅ Contraseña "password" es CORRECTA');
        } else {
            console.log('❌ Contraseña "password" es INCORRECTA');
            console.log('💡 Regenerando contraseña...');
            
            // Regenerar contraseña
            const newHash = await bcrypt.hash('password', 10);
            await connection.execute(
                'UPDATE usuarios SET password = ? WHERE email = ?',
                [newHash, 'admin@sonrisitapp.com']
            );
            
            console.log('✅ Contraseña regenerada correctamente');
        }
        
        connection.release();
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

verifyAdmin();