import mysql from 'mysql2/promise';//importa mysql2 com suporte a promises
import dotenv from 'dotenv'
dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

export async function conectarBanco() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Conectando ao MYSQL');
        return connection;
    } catch (error) {
        console.error('Erro ao conectar: ', error.message);
        throw error;
    }
}
export default conectarBanco;