// URL base de la API
const API_BASE_URL = "/api";

// Función para verificar si el usuario está autenticado
async function verificarAutenticacion() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/status`);
        const data = await response.json();

        actualizarInterfazUsuario(data.authenticated, data.username);

        return data.authenticated;
    } catch (error) {
        console.error("Error al verificar autenticación:", error);
        // Si hay error, asumimos que no está autenticado
        actualizarInterfazUsuario(false);
        return false;
    }
}

// Función para actualizar la interfaz según el estado de autenticación
function actualizarInterfazUsuario(autenticado, username) {
    const authLinks = document.getElementById('auth-links');

    if (!authLinks) return;

    if (autenticado) {
        // Usuario autenticado
        authLinks.innerHTML = `
            <span class="navbar-text me-3">Hola, ${username}</span>
            <button onclick="cerrarSesion()" class="btn btn-outline-light">Cerrar Sesión</button>
        `;
    } else {
        // Usuario no autenticado
        authLinks.innerHTML = `
            <a href="/login.html" class="btn btn-outline-light me-2">Iniciar Sesión</a>
            <a href="/registry.html" class="btn btn-primary">Registrarse</a>
        `;
    }
}

// Manejo del formulario de login
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include' // Importante para mantener la sesión
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    showError(data.error);
                } else {
                    // Guardar información de sesión
                    localStorage.setItem('usuario', data.usuario);

                    // Redirigir a la página principal
                    window.location.href = '/';
                }
            })
            .catch(error => {
                showError('Error en el servidor. Intente nuevamente.');
                console.error('Error:', error);
            });
    });
}

// Manejo del formulario de registro
const registroForm = document.getElementById('registro-form');
if (registroForm) {
    registroForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            showError('Las contraseñas no coinciden');
            return;
        }

        fetch(`${API_BASE_URL}/auth/registro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password }),
            credentials: 'include' // Importante para mantener la sesión
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    showError(data.error);
                } else {
                    // Redirigir a la página de login
                    window.location.href = '/login.html?registroExitoso=true';
                }
            })
            .catch(error => {
                showError('Error en el servidor. Intente nuevamente.');
                console.error('Error:', error);
            });
    });
}

// Función para mostrar mensajes de error
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('d-none');
    }
}

// Cerrar sesión
async function cerrarSesion() {
    try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });

        // Eliminar datos de sesión del localStorage
        localStorage.removeItem('usuario');

        // Redirigir a la página principal
        window.location.href = '/';
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
}

// Verificar si hay mensaje de registro exitoso
function checkRegistroExitoso() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registroExitoso') === 'true') {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success';
        successDiv.textContent = 'Registro exitoso. Por favor inicia sesión.';

        const form = document.getElementById('login-form');
        if (form) {
            form.parentNode.insertBefore(successDiv, form);
        }
    }
}

// Ejecutar verificación cuando carga la página
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacion();
    checkRegistroExitoso();
});