/**
 * Módulo de autenticación y gestión de usuarios
 */

// Configuración de la URL base API
if (typeof window.API_BASE_URL === 'undefined') {
    window.API_BASE_URL = "/api";
}

/**
 * GESTIÓN DE AUTENTICACIÓN
 */

/**
 * Verifica el estado de autenticación del usuario y actualiza la UI
 */
function verificarAutenticacion() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('usuario');

    // Actualizar la interfaz según el estado de autenticación
    actualizarInterfazUsuario(!!username, username);
}

/**
 * Actualiza los elementos de la interfaz según el estado de autenticación
 * @param {boolean} autenticado - Indica si el usuario está autenticado
 * @param {string} username - Nombre de usuario
 */
function actualizarInterfazUsuario(autenticado, username) {
    const itemLogin = document.querySelector('.navbar-nav .nav-link[href="/login.html"]')?.parentNode;
    const itemRegistro = document.querySelector('.navbar-nav .nav-link[href="/registry.html"]')?.parentNode;
    const itemLogout = document.getElementById('logout-item');
    const navbarNav = document.querySelector('.navbar-nav');

    // Guarda el botón de modo oscuro si ya existe para reutilizarlo
    const modeToggleItem = document.getElementById('mode-toggle');

    if (navbarNav && itemLogin && itemRegistro && itemLogout) {
        if (autenticado) {
            // Si está autenticado, oculta login/registro y muestra logout
            itemLogin.style.display = 'none';
            itemRegistro.style.display = 'none';
            itemLogout.style.display = 'block';
        } else {
            // Si no está autenticado, muestra login/registro y oculta logout
            itemLogin.style.display = 'block';
            itemRegistro.style.display = 'block';
            itemLogout.style.display = 'none';
        }

        // Gestionar el botón de modo oscuro
        gestionarBotonModoOscuro(navbarNav, modeToggleItem);
    }
}

/**
 * Gestiona la presencia del botón de modo oscuro
 * @param {Element} navbarNav - Elemento de navegación
 * @param {Element|null} modeToggleItem - Botón existente de modo oscuro
 */
function gestionarBotonModoOscuro(navbarNav, modeToggleItem) {
    if (modeToggleItem) {
        // Quitar y volver a agregar al final
        navbarNav.appendChild(modeToggleItem);
    } else {
        // Si no existe, crear uno nuevo usando la función de app.js
        if (typeof agregarBotonModoOscuro === 'function') {
            agregarBotonModoOscuro();
        }
    }
}

/**
 * Cierra la sesión del usuario
 */
function logout() {
    // Llamar al endpoint de cierre de sesión
    fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(() => {
            finalizarSesion();
        })
        .catch(error => {
            console.error('Error en logout:', error);
            // Incluso si hay error, finalizar sesión localmente
            finalizarSesion();
        });
}

/**
 * Finaliza la sesión limpiando el almacenamiento local y redirigiendo
 */
function finalizarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/';
}

/**
 * FORMULARIOS DE AUTENTICACIÓN
 */

// Inicializar los formularios cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarFormularios);

/**
 * Inicializa los formularios de login y registro
 */
function inicializarFormularios() {
    // Inicializar el formulario de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', manejarFormularioLogin);
    }

    // Inicializar el formulario de registro
    const registroForm = document.getElementById('registro-form');
    if (registroForm) {
        registroForm.addEventListener('submit', manejarFormularioRegistro);
    }
}

/**
 * Maneja el envío del formulario de login
 * @param {Event} e - Evento del formulario
 */
function manejarFormularioLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const submitButton = document.querySelector('#login-form button[type="submit"]');

    // Mostrar indicador de carga
    const originalText = submitButton.innerHTML;
    toggleBotonCarga(submitButton, true);

    // Limpiar mensajes de error previos
    ocultarError();

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
            showError(error.message);
        })
        .finally(() => {
            toggleBotonCarga(submitButton, false, originalText);
        });
}

/**
 * Maneja el envío del formulario de registro
 * @param {Event} e - Evento del formulario
 */
function manejarFormularioRegistro(e) {
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

    const submitButton = document.querySelector('#registro-form button[type="submit"]');
    const originalText = submitButton.innerHTML;

    // Mostrar indicador de carga
    toggleBotonCarga(submitButton, true);

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
            toggleBotonCarga(submitButton, false, originalText);
        });
}

/**
 * UTILIDADES
 */

/**
 * Muestra un mensaje de error
 * @param {string} message - Mensaje de error
 */
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('d-none');

        // Hacer scroll al mensaje de error
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

/**
 * Oculta el mensaje de error
 */
function ocultarError() {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) errorDiv.classList.add('d-none');
}

/**
 * Activa/desactiva el estado de carga en un botón
 * @param {HTMLElement} button - Elemento botón
 * @param {boolean} isLoading - Estado de carga
 * @param {string} originalText - Texto original del botón
 */
function toggleBotonCarga(button, isLoading, originalText = null) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';
    } else {
        button.disabled = false;
        button.innerHTML = originalText;
    }
}

/**
 * Muestra una alerta temporal en la página
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de alerta (success, warning, danger)
 * @param {string} parametro - Parámetro URL a eliminar
 */
function mostrarAlerta(mensaje, tipo, parametro) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} mb-4`;
    alertDiv.role = 'alert';
    alertDiv.textContent = mensaje;

    const container = document.querySelector('.container');
    if (container && container.firstChild) {
        container.insertBefore(alertDiv, container.firstChild);

        // Eliminar el mensaje después de 5 segundos
        setTimeout(() => {
            alertDiv.remove();
            // Limpiar el parámetro de la URL
            const url = new URL(window.location.href);
            url.searchParams.delete(parametro);
            window.history.replaceState({}, document.title, url);
        }, 5000);
    }
}

/**
 * Verifica mensajes de éxito en la URL
 */
function verificarMensajesExito() {
    const urlParams = new URLSearchParams(window.location.search);

    // Verificar registro exitoso
    if (urlParams.get('registroExitoso') === 'true') {
        mostrarAlerta('¡Registro exitoso! Ya puedes iniciar sesión.', 'success', 'registroExitoso');
    }

    // Verificar login exitoso
    if (urlParams.get('loginExitoso') === 'true') {
        mostrarAlerta('¡Has iniciado sesión correctamente!', 'success', 'loginExitoso');
    }
}

// Inicialización cuando carga la página
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacion();
    verificarMensajesExito();

    // Asegurar que el modo oscuro funcione correctamente
    if (typeof cargarModoPreferido === 'function') {
        cargarModoPreferido();
    }
});