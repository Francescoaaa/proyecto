const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

const createConnection = async () => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Conexión a MySQL establecida');
        return connection;
    } catch (error) {
        console.error('Error conectando a la base de datos:', error);
        throw error;
    }
};

module.exports = { createConnection };