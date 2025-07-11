
const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'oirlafeliz',          
    password: '48416lafeliz',    
    database: 'oirlafeliz_db',   
    waitForConnections: true,    
    connectionLimit: 30,         
    queueLimit: 0                
});

module.exports = db;