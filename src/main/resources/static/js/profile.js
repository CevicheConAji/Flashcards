/**
 * Funcionalidad para la página de perfil de usuario
 */
document.addEventListener('DOMContentLoaded', function() {
    // 1) comprueba token/username…
    const token    = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (!token || !username) {
        window.location.href = '/login.html?redirect=profile';
        return;
    }

    // 2) inicializa UI (pone el username en el input, dark-mode…)
    setupUserInterface();

    // 3) **carga YA los datos de perfil**
    loadUserData();

    // 4) **carga YA las flashcards más usadas**
    loadPersonalizedFlashcards();

    // 5) configura los event listeners
    setupEventListeners();
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
    // Usa tu API_BASE_URL para no hardcodear “/api”
    fetch(`${window.API_BASE_URL}/auth/usuarios/${username}`)
        .then(resp => {
            if (!resp.ok) throw new Error('No se pudo cargar perfil');
            return resp.json();
        })
        .then(data => {
            document.getElementById('username').value = data.username;
            document.getElementById('email').value    = data.email;
        })
        .catch(err => {
            console.error('Error al cargar perfil:', err);
            alert('No se pudieron cargar los datos de tu perfil');
        });
}


/**
 * Carga las flashcards más usadas del usuario actual
 */
// Mejora en la función loadPersonalizedFlashcards
function loadPersonalizedFlashcards() {
    const username = localStorage.getItem('username');
    const container = document.getElementById('personal-flashcards');
    const apiUrl = `${window.API_BASE_URL}/usuarios/${username}/flashcards/mas-usadas`;

    console.log('⏳ Cargando flashcards más usadas desde:', apiUrl);

    // Mostrar spinner mientras carga
    container.innerHTML = `
        <div class="d-flex justify-content-center w-100">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
    `;

    // Realizar petición a la API
    fetch(apiUrl)
        .then(response => {
            console.log('📊 Estado de respuesta:', response.status);
            if (!response.ok) {
                throw new Error(`Error de servidor: ${response.status}`);
            }
            return response.json();
        })
        .then(flashcards => {
            console.log('📦 Datos recibidos:', flashcards);
            displayPersonalizedFlashcards(flashcards);
        })
        .catch(error => {
            console.error('❌ Error al cargar flashcards:', error);
            container.innerHTML = `
                <div class="alert alert-danger w-100" role="alert">
                    Error al cargar las flashcards: ${error.message}. Intente nuevamente.
                </div>
            `;
        });
}

// Función para probar con datos estáticos (añade esto a tu código)
function testWithStaticData() {
    const flashcards = [
        { id: 1, texto: "Perro", rutaImagen: "perro.jpg", contadorUso: 5 },
        { id: 2, texto: "Gato", rutaImagen: "gato.jpg", contadorUso: 3 }
    ];
    console.log('🧪 Probando con datos estáticos');
    displayPersonalizedFlashcards(flashcards);
}

// Añade un botón para probar con datos estáticos
document.getElementById('btn-actualizar-personalizadas').insertAdjacentHTML(
    'afterend',
    '<button class="btn btn-warning ms-2" id="btn-test-static">Probar con datos fijos</button>'
);
document.getElementById('btn-test-static').addEventListener('click', testWithStaticData);

/**
 * Muestra las flashcards más usadas en la UI
 * @param {Array} flashcards - Lista de flashcards a mostrar
 */
function displayPersonalizedFlashcards(flashcards) {
    const container = document.getElementById('personal-flashcards');

    if (!flashcards || flashcards.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info w-100" role="alert">
                Aún no has usado flashcards. ¡Comienza a practicar para ver tus flashcards más usadas aquí!
            </div>
        `;
        return;
    }

    // Crear estructura de filas similar a la página principal
    const row = document.createElement("div");
    row.className = "row";

    flashcards.forEach(card => {
        const col = document.createElement("div");
        col.className = "col-md-3 mb-3";

        const cardDiv = document.createElement("div");
        cardDiv.className = "card text-center shadow-sm popular-flashcard";
        cardDiv.onclick = () => {
            // Solo registrar el uso, sin reproducir audio
            registrarUsoFlashCard(card.id);
        };

        const img = document.createElement("img");
        img.src = `/images/${card.rutaImagen}`;
        img.className = "card-img-top img-fluid";
        img.alt = card.texto;

        const body = document.createElement("div");
        body.className = "card-body";

        const title = document.createElement("h6");
        title.className = "card-title";
        title.textContent = card.texto;

        const badge = document.createElement("span");
        badge.className = "badge bg-info";
        badge.textContent = `${card.contadorUso} usos`;

        body.appendChild(title);
        body.appendChild(badge);
        cardDiv.appendChild(img);
        cardDiv.appendChild(body);
        col.appendChild(cardDiv);
        row.appendChild(col);
    });

    container.innerHTML = "";
    container.appendChild(row);
}

/**
 * Reproduce un archivo de audio y registra el uso
 * @param {string} audioFile - Nombre del archivo de audio
 * @param {number} flashcardId - ID de la flashcard
 */
function playAudio(audioFile, flashcardId) {
    const audio = new Audio(`/audios/${audioFile}`);
    audio.play();

    // Si se proporciona ID, registrar el uso
    if (flashcardId) {
        registrarUsoFlashCard(flashcardId);
    }
}

/**
 * Registra el uso de una flashcard en la API
 * @param {number} id - ID de la flashcard
 */
function registrarUsoFlashCard(id) {
    const username = localStorage.getItem('username');

    fetch(`${window.API_BASE_URL}/usuarios/${username}/flashcards/${id}/usar`, {
        method: 'POST'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al registrar uso');
            }
            // Recargar las flashcards para mostrar el contador actualizado
            loadPersonalizedFlashcards();
        })
        .catch(error => console.error('Error:', error));
}

/**
 * Alterna el modo oscuro
 */
function toggleDarkMode() {
    const darkModeEnabled = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', darkModeEnabled ? 'enabled' : 'disabled');
}