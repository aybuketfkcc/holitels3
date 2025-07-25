const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT|| 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('✅ Veritabanı bağlantı havuzu oluşturuldu.');

module.exports = connection;
