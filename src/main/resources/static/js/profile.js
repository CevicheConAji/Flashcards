/**
 * Funcionalidad para la página de perfil de usuario
 */
document.addEventListener('DOMContentLoaded', function() {
    // Comprobación inicial de autenticación
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (!token || !username) {
        window.location.href = '/login.html?redirect=profile';
        return;
    }

    // Inicializar la interfaz
    setupUserInterface();

    // Configurar eventos
    setupEventListeners();

    // Cargar datos de usuario y flashcards
    loadUserData();
    loadPersonalizedFlashcards();
});

/**
 * Configura la interfaz de usuario
 */
function setupUserInterface() {
    // Mostrar nombre de usuario
    document.getElementById('username').value = localStorage.getItem('username');

    // Configurar switch de modo oscuro
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    darkModeSwitch.checked = document.body.classList.contains('dark-mode');
}

/**
 * Configura los event listeners
 */
function setupEventListeners() {
    // Formulario de perfil
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }

    // Switch de modo oscuro
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    if (darkModeSwitch) {
        darkModeSwitch.addEventListener('change', toggleDarkMode);
    }

    // Botón de actualizar flashcards personalizadas
    const btnActualizar = document.getElementById('btn-actualizar-personalizadas');
    if (btnActualizar) {
        btnActualizar.addEventListener('click', loadPersonalizedFlashcards);
    }
}

/**
 * Maneja la actualización del perfil
 * @param {Event} event - Evento de submit del formulario
 */
function handleProfileUpdate(event) {
    event.preventDefault();

    const errorMsgElement = document.getElementById('error-message');
    const successMsgElement = document.getElementById('success-message');

    // Ocultar mensajes previos
    errorMsgElement.classList.add('d-none');
    successMsgElement.classList.add('d-none');

    // Obtener datos del formulario
    const email = document.getElementById('email').value;
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validaciones básicas
    if (newPassword && newPassword !== confirmPassword) {
        errorMsgElement.textContent = "Las contraseñas nuevas no coinciden";
        errorMsgElement.classList.remove('d-none');
        return;
    }

    // Preparar datos según lo que se está actualizando
    const userData = { email };

    if (newPassword && currentPassword) {
        userData.currentPassword = currentPassword;
        userData.newPassword = newPassword;
    }

    // Simulamos actualización exitosa (aquí se implementaría la llamada API real)
    successMsgElement.textContent = "Perfil actualizado correctamente";
    successMsgElement.classList.remove('d-none');

    // Limpiar campos de contraseña
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
}

/**
 * Carga los datos del usuario
 */
function loadUserData() {
    const username = localStorage.getItem('username');

    // Simulamos datos cargados (aquí se implementaría la llamada API real)
    document.getElementById('username').value = username;
    document.getElementById('email').value = `${username}@example.com`;
}

/**
 * Carga las flashcards personalizadas del usuario
 */
function loadPersonalizedFlashcards() {
    const username = localStorage.getItem('username');
    const container = document.getElementById('personal-flashcards');

    // Mostrar spinner mientras carga
    container.innerHTML = `
        <div class="d-flex justify-content-center w-100">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
    `;

    // Realizar petición al endpoint personalizado
    fetch(`/api/flashcards/personalizadas/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar flashcards personalizadas');
            }
            return response.json();
        })
        .then(flashcards => {
            displayPersonalizedFlashcards(flashcards);
        })
        .catch(error => {
            console.error('Error:', error);
            container.innerHTML = `
                <div class="alert alert-danger w-100" role="alert">
                    Error al cargar las flashcards. Intente nuevamente.
                </div>
            `;
        });
}

/**
 * Muestra las flashcards personalizadas en la UI
 * @param {Array} flashcards - Lista de flashcards a mostrar
 */
function displayPersonalizedFlashcards(flashcards) {
    const container = document.getElementById('personal-flashcards');

    if (!flashcards || flashcards.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info w-100" role="alert">
                Aún no hay flashcards personalizadas para mostrar. ¡Usa más flashcards para verlas aquí!
            </div>
        `;
        return;
    }

    // Construir HTML para cada flashcard
    let html = '';
    flashcards.forEach(card => {
        html += `
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-body text-center">
                        <h5 class="card-title">${card.categoria ? card.categoria.nombre : 'Sin categoría'}</h5>
                        <p class="card-text">${card.texto}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <span class="badge bg-primary">Usos: ${card.contadorUso}</span>
                            <button class="btn btn-sm btn-outline-primary" 
                                onclick="registrarUso(${card.id})">
                                Usar flashcard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

/**
 * Registra el uso de una flashcard
 * @param {number} id - ID de la flashcard
 */
function registrarUso(id) {
    fetch(`/api/flashcards/${id}/registrar-uso`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) throw new Error('Error al registrar uso');
            return response.json();
        })
        .then(data => {
            // Recargar las flashcards para mostrar el contador actualizado
            loadPersonalizedFlashcards();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al registrar el uso de la flashcard');
        });
}

/**
 * Alterna el modo oscuro
 */
function toggleDarkMode() {
    const darkModeEnabled = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', darkModeEnabled ? 'enabled' : 'disabled');
}