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

            // Si estás redireccionando después de la autenticación, asegúrate
            // de mostrar la sección personalizada para el usuario autenticado
            mostrarContenidoPersonalizado(username);
        } else {
            // Si no está autenticado, muestra login/registro y oculta logout
            itemLogin.style.display = 'block';
            itemRegistro.style.display = 'block';
            itemLogout.style.display = 'none';
        }

        // Siempre asegúrate de que el botón de modo oscuro esté presente
        // Si ya existía, simplemente asegúrate que esté al final
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
// Función para cargar flashcards personalizadas
function cargarFlashcardsPersonalizadas(username) {
    // Verificar si existe la sección personalizada
    let seccionPersonalizada = document.getElementById('seccion-personalizada');

    // Si no existe la sección y tenemos un usuario, crearla
    if (!seccionPersonalizada && username) {
        seccionPersonalizada = document.createElement('section');
        seccionPersonalizada.id = 'seccion-personalizada';
        seccionPersonalizada.className = 'container my-4 animate-entrada';
        seccionPersonalizada.innerHTML = `
            <h3 class="section-title">Hola ${username}, continúa aprendiendo</h3>
            <div id="flashcards-personalizadas" class="row">
                <div class="d-flex justify-content-center w-100">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                </div>
            </div>
        `;

        // Insertar después del encabezado principal
        const mainHeader = document.querySelector('.text-center.mb-5');
        if (mainHeader) {
            mainHeader.parentNode.insertBefore(seccionPersonalizada, mainHeader.nextSibling);

            // Cargar las flashcards personalizadas
            fetch(`${window.API_BASE_URL}/flashcards/personalizadas/${username}`)
                .then(response => response.json())
                .then(data => {
                    renderizarFlashcardsPersonalizadas(data);
                })
                .catch(error => {
                    console.error('Error al cargar flashcards personalizadas:', error);
                    document.getElementById('flashcards-personalizadas').innerHTML =
                        '<p class="text-center">No se pudieron cargar tus flashcards personalizadas.</p>';
                });
        }
    }
}

// Función para renderizar las flashcards personalizadas
function renderizarFlashcardsPersonalizadas(flashcards) {
    const container = document.getElementById('flashcards-personalizadas');
    if (!container) return;

    // Limpiar el contenedor
    container.innerHTML = '';

    if (flashcards.length === 0) {
        container.innerHTML = '<p class="text-center">Aún no tienes flashcards personalizadas. Comienza a explorar categorías.</p>';
        return;
    }

    // Crear tarjetas para cada flashcard
    flashcards.forEach(card => {
        const col = document.createElement('div');
        col.className = 'col-md-3 col-sm-6 mb-4';

        const cardDiv = document.createElement('div');
        cardDiv.className = 'card h-100 flashcard';
        cardDiv.style.cursor = 'pointer';
        cardDiv.onclick = () => mostrarDetalleFlashcard(card);

        const cardImg = document.createElement('img');
        cardImg.src = card.rutaImagen || 'img/placeholder.jpg';
        cardImg.className = 'card-img-top';
        cardImg.alt = card.texto;

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        cardBody.innerHTML = `
            <h5 class="card-title">${card.texto}</h5>
            <p class="card-text"><small class="text-muted">Usado ${card.contadorUso} veces</small></p>
        `;

        cardDiv.appendChild(cardImg);
        cardDiv.appendChild(cardBody);
        col.appendChild(cardDiv);
        container.appendChild(col);
    });
}

// Modificar la función verificarAutenticacion para llamar a cargarFlashcardsPersonalizadas
function verificarAutenticacion() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('usuario');

    // Actualizar la interfaz según el estado de autenticación
    actualizarInterfazUsuario(!!username, username);

    // Si hay un usuario autenticado, cargar flashcards personalizadas
    if (username) {
        cargarFlashcardsPersonalizadas(username);
    } else {
        // Si no hay usuario, eliminar la sección personalizada si existe
        const seccionPersonalizada = document.getElementById('seccion-personalizada');
        if (seccionPersonalizada) {
            seccionPersonalizada.remove();
        }
    }
}

// Ejecutar verificación cuando carga la página
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacion();
    checkRegistroExitoso();
    checkLoginExitoso();

    // Asegurar que el modo oscuro funcione correctamente
    if (typeof cargarModoPreferido === 'function') {
        cargarModoPreferido();
    }
});