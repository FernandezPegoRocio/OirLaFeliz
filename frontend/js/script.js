// frontend/js/script.js
// Configuración base
const baseURL = 'http://localhost:3000/api/users';

// Mostrar/ocultar campos de login según el rol
document.addEventListener('DOMContentLoaded', () => {
    const rolSelect = document.getElementById('rol');
    const loginFields = document.getElementById('loginFields');

    if (rolSelect) {
        rolSelect.addEventListener('change', () => {
            if (rolSelect.value) {
                loginFields.style.display = 'block';
                document.querySelector('h2').textContent = `Iniciar Sesión como ${rolSelect.value === 'ADMIN' ? 'Administrador' : 'Artista'}`;
            } else {
                loginFields.style.display = 'none';
                document.querySelector('h2').textContent = 'Iniciar Sesión en OirlaFeliz';
            }
        });
    }
});

// Manejar el login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rol = document.getElementById('rol').value;
    const messageElement = document.getElementById('message');

    try {
        const response = await fetch(`${baseURL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, rol })
        });

        const data = await response.json();

        if (!response.ok) {
            messageElement.textContent = data.message || 'Error en el inicio de sesión';
            return;
        }

        // Guardar el token y rol en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('rol', data.rol);

        // Redirigir según el rol
        if (data.rol === 'ADMIN') {
            window.location.href = 'adminDashboard.html';
        } else if (data.rol === 'ARTIST') {
            window.location.href = 'artistDashboard.html';
        }
    } catch (error) {
        console.error('Error:', error);
        messageElement.textContent = 'Error al conectar con el servidor';
    }
});

// Manejar el registro
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const age = parseInt(document.getElementById('age').value);
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rol = document.getElementById('rol').value;
    const messageElement = document.getElementById('message');

    try {
        const response = await fetch(`${baseURL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, age, email, password, rol })
        });

        const data = await response.json();

        if (!response.ok) {
            messageElement.textContent = data.message || 'Error en el registro';
            return;
        }

        messageElement.textContent = 'Registro exitoso. Redirigiendo al login...';
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } catch (error) {
        console.error('Error:', error);
        messageElement.textContent = 'Error al conectar con el servidor';
    }
});