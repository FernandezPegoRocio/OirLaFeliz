// backend/server.js
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const { createUserTable } = require('./models/users');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const db = mysql.createPool({
  host: 'localhost',
  user: 'oirlafeliz',
  password: '48416lafeliz',
  database: 'oirlafeliz_db',
  waitForConnections: true,
  connectionLimit: 30,
  queueLimit: 0,
});

// Crear tabla de usuarios si no existe
(async () => {
  try {
    await createUserTable(db);
    console.log('OK: Tabla "Users" creada o ya existe.');
  } catch (err) {
    console.error('Error al crear tabla Users:', err);
  }
})();

// Inyectamos `db` en cada request
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Conectamos las rutas
app.use('/api', userRoutes);

// Escuchamos en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});