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
    const username = localStorage.getItem('username');

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
    localStorage.removeItem('username');
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
 * @param {Event} e
 */
function manejarFormularioLogin(e) {
    e.preventDefault();
    // 1) Leer redirect de la URL (o / si no viene)
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect') || '/';
    console.log('👉 Login form submitted, redirect param:', redirect);

    // 2) Datos de login
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const submitButton = document.querySelector('#login-form button[type="submit"]');
    const originalText = submitButton.innerHTML;

    // 3) Mostrar loader
    toggleBotonCarga(submitButton, true);

    // 4) Petición al API
    fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(response => {
            if (!response.ok) throw new Error('Credenciales inválidas');
            return response.json();
        })
        .then(data => {
            // 5) Guardar token/usuario
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', username);

            // 6) Redirigir a donde nos pidieron
            const sep = redirect.includes('?') ? '&' : '?';
            const finalURL = `${redirect}${sep}loginExitoso=true`;
            console.log('👉 Navegando a:', finalURL);
            window.location.href = finalURL;
        })
        .catch(err => {
            console.error('Error login:', err);
            showError(err.message);
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
    // Crear el contenedor de la alerta con estilos mejorados
    const alertContainer = document.createElement('div');
    alertContainer.style.position = 'fixed';
    alertContainer.style.top = '80px'; // Debajo de la barra de navegación
    alertContainer.style.left = '50%';
    alertContainer.style.transform = 'translateX(-50%)';
    alertContainer.style.zIndex = '1050';
    alertContainer.style.width = '80%';
    alertContainer.style.maxWidth = '500px';

    // Crear la alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} shadow-lg`;
    alertDiv.role = 'alert';
    alertDiv.style.textAlign = 'center';

    // Añadir icono según el tipo de alerta
    let icon = '';
    if (tipo === 'success') {
        icon = '<i class="bi bi-check-circle-fill me-2"></i>';
    } else if (tipo === 'warning') {
        icon = '<i class="bi bi-exclamation-triangle-fill me-2"></i>';
    } else if (tipo === 'danger') {
        icon = '<i class="bi bi-x-circle-fill me-2"></i>';
    }

    // Añadir contenido HTML a la alerta
    alertDiv.innerHTML = `${icon}${mensaje}`;

    // Añadir la alerta al contenedor
    alertContainer.appendChild(alertDiv);

    // Añadir el contenedor al body
    document.body.appendChild(alertContainer);

    // Añadir animación de entrada
    alertContainer.style.opacity = '0';
    alertContainer.style.transition = 'opacity 0.3s ease-in-out';

    setTimeout(() => {
        alertContainer.style.opacity = '1';
    }, 10);

    // Eliminar el mensaje después de 5 segundos con animación de salida
    setTimeout(() => {
        alertContainer.style.opacity = '0';

        // Eliminar el elemento después de completar la animación
        setTimeout(() => {
            alertContainer.remove();
        }, 300);

        // Limpiar el parámetro de la URL
        const url = new URL(window.location.href);
        url.searchParams.delete(parametro);
        window.history.replaceState({}, document.title, url);
    }, 5000);
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

function actualizarNavegacion(autenticado) {
    const loginItem = document.querySelector('.nav-link[href="/login.html"]').parentElement;
    const registryItem = document.querySelector('.nav-link[href="/registry.html"]').parentElement;
    const logoutItem = document.getElementById('logout-item');
    const profileItem = document.getElementById('profile-item');

    if (autenticado) {
        // Si está autenticado: ocultar login y registro, mostrar cerrar sesión y perfil
        loginItem.classList.add('d-none');
        registryItem.classList.add('d-none');
        logoutItem.classList.remove('d-none');
        profileItem.classList.remove('d-none');
    } else {
        // Si no está autenticado: mostrar login y registro, ocultar cerrar sesión y perfil
        loginItem.classList.remove('d-none');
        registryItem.classList.remove('d-none');
        logoutItem.classList.add('d-none');
        profileItem.classList.add('d-none');
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