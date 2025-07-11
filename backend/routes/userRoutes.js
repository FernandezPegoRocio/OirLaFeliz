// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getAllUsers, createUser, updateUser } = require('../models/users');

const router = express.Router();

// Lista de nombres de artistas prohibidos
const forbiddenArtists = ['eminem', 'dua lipa', 'catriel', 'paco amoroso'];

// Ruta de registro (sin cambios)
router.post('/register', async (req, res) => {
    try {
        const { name, age, email, password, rol } = req.body;

        // Validar que el nombre no esté en la lista de artistas prohibidos
        if (forbiddenArtists.includes(name.toLowerCase())) {
            return res.status(400).json({ message: 'Este artista no está permitido.' });
        }

        // Verificar si el email ya está registrado
        const users = await getAllUsers(req.db);
        if (users.find((user) => user.email === email)) {
            return res.status(400).json({ message: 'El email ya está registrado.' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const user = {
            name,
            age,
            email,
            password: hashedPassword,
            rol: rol || 'ARTIST'
        };

        const userId = await createUser(req.db, user);
        res.status(201).json({ message: 'Usuario registrado exitosamente', userId });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
});

// Ruta de login (modificada)
router.post('/login', async (req, res) => {
    try {
        const { email, password, rol } = req.body;

        // Buscar usuario por email
        const users = await getAllUsers(req.db);
        const user = users.find((u) => u.email === email);

        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si el usuario está activo
        if (!user.active) {
            return res.status(403).json({ message: 'Usuario desactivado' });
        }

        // Verificar que el rol coincida
        if (user.rol !== rol) {
            return res.status(400).json({ message: `El usuario no tiene el rol ${rol}` });
        }

        // Comparar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { userId: user.id, rol: user.rol },
            'mi_secreto', // Usar variable de entorno en producción
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, message: 'Inicio de sesión exitoso', rol: user.rol });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});

module.exports = router;