// Alternativa (al inicio de auth.js)
if (typeof window.API_BASE_URL === 'undefined') {
    window.API_BASE_URL = "/api";
}


// Función para verificar el estado de autenticación del usuario
function verificarAutenticacion() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('usuario');

    // Actualizar la interfaz según el estado de autenticación
    actualizarInterfazUsuario(!!username, username);
}

// Función para actualizar la interfaz según el estado de autenticación
function actualizarInterfazUsuario(autenticado, username) {
    const navbarNav = document.getElementById('navbarNav');
    const itemLogin = document.querySelector('a[href="/login.html"]')?.parentElement;
    const itemRegistro = document.querySelector('a[href="/registry.html"]')?.parentElement;
    const itemLogout = document.getElementById('logout-item');

    if (navbarNav && itemLogin && itemRegistro && itemLogout) {
        if (autenticado) {
            // Usuario autenticado: ocultar login/registro, mostrar logout y nombre de usuario
            itemLogin.style.display = 'none';
            itemRegistro.style.display = 'none';
            itemLogout.style.display = 'block';

            // Agregar nombre de usuario si no existe
            let userInfoItem = document.getElementById('user-info-item');
            if (!userInfoItem) {
                userInfoItem = document.createElement('li');
                userInfoItem.id = 'user-info-item';
                userInfoItem.className = 'nav-item';
                userInfoItem.innerHTML = `<span class="nav-link">Hola, ${username}</span>`;
                navbarNav.insertBefore(userInfoItem, itemLogout);
            }
        } else {
            // Usuario no autenticado: mostrar login/registro, ocultar logout
            itemLogin.style.display = 'block';
            itemRegistro.style.display = 'block';
            itemLogout.style.display = 'none';

            // Eliminar nombre de usuario si existe
            const userInfoItem = document.getElementById('user-info-item');
            if (userInfoItem) {
                userInfoItem.remove();
            }
        }
    }
}

// Manejo del formulario de login
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Mostrar indicador de carga
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';

        // Limpiar mensajes de error previos
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) errorDiv.classList.add('d-none');

        fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Credenciales inválidas');
                }
                return response.json();
            })
            .then(data => {
                // Guardar información de sesión
                localStorage.setItem('token', 'jwt-token-simulado');
                localStorage.setItem('usuario', data.username);

                // Redirigir a la página principal
                window.location.href = '/?loginExitoso=true';
            })
            .catch(error => {
                console.error('Error:', error);
                if (errorDiv) {
                    errorDiv.textContent = error.message;
                    errorDiv.classList.remove('d-none');
                }
            })
            .finally(() => {
                // Restaurar el botón
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
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

        // Mostrar indicador de carga
        const submitButton = registroForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';

        fetch(`${API_BASE_URL}/auth/registro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                // Redirigir a la página de login con un mensaje de éxito
                window.location.href = '/login.html?registroExitoso=true';
            })
            .catch(error => {
                showError(error.message);
            })
            .finally(() => {
                // Restaurar el botón
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            });
    });
}

// Función para mostrar mensajes de error
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('d-none');

        // Hacer scroll al mensaje de error
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Función unificada para cerrar sesión
function logout() {
    // Llamar al endpoint de cierre de sesión
    fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(() => {
            // Limpiar datos de sesión local
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');

            // Redirigir a la página principal
            window.location.href = '/';
        })
        .catch(error => {
            console.error('Error en logout:', error);

            // Incluso si hay error, intentar limpiar datos locales
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '/';
        });
}

// Verificar si hay mensaje de registro exitoso
function checkRegistroExitoso() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registroExitoso') === 'true') {
        // Mostrar mensaje de éxito
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success mb-4';
        alertDiv.role = 'alert';
        alertDiv.textContent = '¡Registro exitoso! Ya puedes iniciar sesión.';

        const container = document.querySelector('.container');
        if (container && container.firstChild) {
            container.insertBefore(alertDiv, container.firstChild);

            // Eliminar el mensaje después de 5 segundos
            setTimeout(() => {
                alertDiv.remove();
                // Limpiar el parámetro de la URL
                const url = new URL(window.location.href);
                url.searchParams.delete('registroExitoso');
                window.history.replaceState({}, document.title, url);
            }, 5000);
        }
    }
}

// Función para verificar si el inicio de sesión fue exitoso
function checkLoginExitoso() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('loginExitoso') === 'true') {
        // Mostrar mensaje de éxito
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success mb-4';
        alertDiv.role = 'alert';
        alertDiv.textContent = '¡Has iniciado sesión correctamente!';

        const container = document.querySelector('.container');
        if (container && container.firstChild) {
            container.insertBefore(alertDiv, container.firstChild);

            // Eliminar el mensaje después de 5 segundos
            setTimeout(() => {
                alertDiv.remove();
                // Limpiar el parámetro de la URL
                const url = new URL(window.location.href);
                url.searchParams.delete('loginExitoso');
                window.history.replaceState({}, document.title, url);
            }, 5000);
        }
    }
}

// Ejecutar verificación cuando carga la página
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacion();
    checkRegistroExitoso();
    checkLoginExitoso();
});