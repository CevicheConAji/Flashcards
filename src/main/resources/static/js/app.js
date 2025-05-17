/**
 * CONFIGURACIÓN INICIAL
 */

// URL base para todas las llamadas a la API
window.API_BASE_URL = "/api";

/**
 * INICIALIZACIÓN DE LA APLICACIÓN
 */

// Evento principal que se ejecuta cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    inicializarInterfaz();
    inicializarPaginaPrincipal();
});

/**
 * Inicializa los elementos comunes de la interfaz en todas las páginas
 */
function inicializarInterfaz() {
    // Configuración del tema oscuro/claro
    cargarModoPreferido();
    agregarBotonModoOscuro();
}

/**
 * Inicializa elementos específicos de la página principal
 */
function inicializarPaginaPrincipal() {
    // Verificar si estamos en la página principal
    const esIndexPage = window.location.pathname === '/' ||
        window.location.pathname === '/index.html';

    if (!esIndexPage) return;

    // Cargar datos iniciales
    cargarCategorias();
    cargarFlashCardsMasUsadas();

    // Configurar botón de actualización de flashcards populares
    configurarBotonActualizarPopulares();
}

/**
 * Configura el comportamiento del botón para actualizar las flashcards populares
 */
function configurarBotonActualizarPopulares() {
    const btnActualizarPopulares = document.getElementById('btn-actualizar-populares');
    if (!btnActualizarPopulares) return;

    btnActualizarPopulares.addEventListener('click', () => {
        // Cambiar el icono a un spinner mientras se carga
        btnActualizarPopulares.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Actualizando...';
        btnActualizarPopulares.disabled = true;

        // Cargar flashcards más usadas
        actualizarFlashCardsMasUsadas()
            .finally(() => {
                // Restaurar el botón después de la carga
                setTimeout(() => {
                    btnActualizarPopulares.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Actualizar';
                    btnActualizarPopulares.disabled = false;
                }, 500);
            });
    });
}

/**
 * FUNCIONES PARA MANEJO DE CATEGORÍAS
 */

/**
 * Carga las categorías desde la API y las muestra en la interfaz
 */
function cargarCategorias() {
    fetch(`${window.API_BASE_URL}/categorias`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(categorias => {
            renderizarCategorias(categorias);
        })
        .catch(error => {
            console.error('Error al cargar categorías:', error);
            const categoriesContainer = document.getElementById('categories');
            if (categoriesContainer) {
                categoriesContainer.innerHTML = '<p class="text-center text-danger">Ocurrió un error al cargar las categorías.</p>';
            }
        });
}

/**
 * Renderiza los botones de categorías en el contenedor
 * @param {Array} categorias - Lista de objetos categoría
 */
function renderizarCategorias(categorias) {
    const categoryContainer = document.getElementById("category-buttons");
    if (!categoryContainer) return;

    categoryContainer.innerHTML = ""; // Limpia el contenedor

    categorias.forEach(categoria => {
        const btn = document.createElement("button");
        btn.className = "btn btn-outline-primary category-button";
        btn.textContent = categoria.nombre;
        // Atributos de accesibilidad
        btn.setAttribute("aria-label", `Seleccionar categoría ${categoria.nombre}`);
        btn.setAttribute("role", "listitem");

        btn.onclick = () => showFlashCards(categoria.id);
        categoryContainer.appendChild(btn);
    });
}

/**
 * FUNCIONES PARA MANEJO DE FLASHCARDS
 */

/**
 * Carga y muestra las flashcards de una categoría específica
 * @param {number} categoriaId - ID de la categoría
 */
function showFlashCards(categoriaId) {
    fetch(`${API_BASE_URL}/flashcards/${categoriaId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar flashcards");
            }
            return response.json();
        })
        .then(data => {
            // Actualiza el nombre de la categoría
            document.getElementById("category-name").textContent = data.categoriaNombre || "Categoría desconocida";
            // Renderiza las flashcards
            renderizarFlashCards(data.flashcards);
        })
        .catch(error => {
            console.error("Error cargando flashcards:", error);
            alert("Ocurrió un error al cargar las flash cards.");
        });
}

/**
 * Renderiza las flashcards en el contenedor
 * @param {Array} flashcards - Lista de objetos flashcard
 */
function renderizarFlashCards(flashcards) {
    const container = document.getElementById("flashcard-container");
    if (!container) return;

    container.innerHTML = "";

    if (!Array.isArray(flashcards) || flashcards.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay flash cards para esta categoría.</p>';
        return;
    }

    // Ordenar las flashcards alfabéticamente
    flashcards.sort((a, b) => a.texto.localeCompare(b.texto));

    flashcards.forEach(card => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-3";

        const cardDiv = document.createElement("div");
        cardDiv.className = "card text-center shadow-sm flashcard";
        cardDiv.onclick = () => playAudio(card.rutaAudio, card.id);

        const img = document.createElement("img");
        img.src = `/images/${card.rutaImagen}`;
        img.className = "card-img-top img-fluid";
        img.alt = card.texto;

        const body = document.createElement("div");
        body.className = "card-body";

        const title = document.createElement("h5");
        title.className = "card-title";
        title.textContent = card.texto;

        body.appendChild(title);
        cardDiv.appendChild(img);
        cardDiv.appendChild(body);
        col.appendChild(cardDiv);
        container.appendChild(col);
    });

    // Cambiar la vista para mostrar las flashcards
    document.getElementById("categories").style.display = "none";
    document.getElementById("flashcards").style.display = "block";
}

/**
 * Vuelve a la vista de categorías
 */
function showCategories() {
    document.getElementById("flashcards").style.display = "none";
    document.getElementById("categories").style.display = "block";
}

/**
 * FUNCIONES PARA FLASHCARDS POPULARES
 */

/**
 * Carga las flashcards más usadas (llamada inicial)
 */
function cargarFlashCardsMasUsadas() {
    fetch(`${API_BASE_URL}/flashcards/mas-usadas?limit=8`)
        .then(response => response.json())
        .then(data => {
            renderizarFlashCardsMasUsadas(data);
        })
        .catch(error => {
            console.error("Error cargando flashcards más usadas:", error);
            const container = document.getElementById("most-used-flashcards");
            if (container) {
                container.innerHTML = '<p class="text-danger">Error al cargar las flashcards más populares.</p>';
            }
        });
}

/**
 * Actualiza las flashcards más usadas (con feedback visual)
 * @returns {Promise} - Promesa que se resuelve cuando termina la carga
 */
function actualizarFlashCardsMasUsadas() {
    // Mostrar spinner mientras carga
    const container = document.getElementById("most-used-flashcards");
    if (container) {
        container.innerHTML = `
            <div class="d-flex justify-content-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
            </div>
        `;
    }

    return fetch(`${API_BASE_URL}/flashcards/mas-usadas?limit=8`)
        .then(response => response.json())
        .then(data => {
            renderizarFlashCardsMasUsadas(data);
            return data;
        })
        .catch(error => {
            console.error("Error cargando flashcards más usadas:", error);
            if (container) {
                container.innerHTML = '<p class="text-danger">Error al cargar las flashcards más populares.</p>';
            }
            throw error;
        });
}

/**
 * Renderiza las flashcards más usadas en el contenedor
 * @param {Array} flashcards - Lista de objetos flashcard con contador de uso
 */
function renderizarFlashCardsMasUsadas(flashcards) {
    const container = document.getElementById("most-used-flashcards");
    if (!container) return;

    container.innerHTML = "";

    if (!flashcards || flashcards.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay datos disponibles.</p>';
        return;
    }

    const row = document.createElement("div");
    row.className = "row";

    flashcards.forEach(card => {
        const col = document.createElement("div");
        col.className = "col-md-3 mb-3";

        const cardDiv = document.createElement("div");
        cardDiv.className = "card text-center shadow-sm popular-flashcard";
        cardDiv.onclick = () => {
            playAudio(card.rutaAudio, card.id);
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

    container.appendChild(row);
}

/**
 * FUNCIONES DE INTERACCIÓN Y REGISTRO
 */

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
 * Registra el uso de una flashcard cuando el usuario interactúa con ella
 * @param {number} id - ID de la flashcard
 */
function registrarUsoFlashCard(id) {
    // Solo registrar si el usuario está autenticado
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    if (!username || !token) {
        console.log('Usuario no autenticado, no se registra el uso');
        return;
    }

    console.log(`📝 Registrando uso de flashcard ${id} para usuario ${username}`);

    fetch(`${window.API_BASE_URL}/usuarios/${username}/flashcards/${id}/usar`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al registrar uso: ${response.status}`);
            }
            console.log(`✅ Uso de flashcard ${id} registrado correctamente`);
        })
        .catch(error => console.error('❌ Error:', error));
}

/**
 * FUNCIONES PARA GESTIÓN DE TEMA OSCURO/CLARO
 */

/**
 * Alterna entre modo claro y oscuro
 */
function toggleModoOscuro() {
    document.body.classList.toggle('dark-mode');
    const modoActual = document.body.classList.contains('dark-mode') ? 'oscuro' : 'claro';
    localStorage.setItem('modoPreferido', modoActual);

    // Actualizar el icono
    actualizarIconoModoOscuro(document.body.classList.contains('dark-mode'));
}

/**
 * Detecta la preferencia de color del sistema
 * @returns {string} - 'oscuro' o 'claro' según la preferencia del sistema
 */
function detectarPreferenciaDelSistema() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'oscuro';
    }
    return 'claro';
}

/**
 * Carga la preferencia de tema guardada o utiliza la del sistema
 */
function cargarModoPreferido() {
    let modoGuardado = localStorage.getItem('modoPreferido');

    // Si no hay preferencia guardada, usar la del sistema
    if (!modoGuardado) {
        modoGuardado = detectarPreferenciaDelSistema();
        localStorage.setItem('modoPreferido', modoGuardado);
    }

    if (modoGuardado === 'oscuro') {
        document.body.classList.add('dark-mode');
        actualizarIconoModoOscuro(true);
    }
}

/**
 * Actualiza el icono según el modo actual
 * @param {boolean} esModoOscuro - Indica si está activo el modo oscuro
 */
function actualizarIconoModoOscuro(esModoOscuro) {
    const modeIcon = document.querySelector('.mode-toggle-icon');
    if (modeIcon) {
        modeIcon.className = esModoOscuro ?
            'bi bi-sun mode-toggle-icon' : 'bi bi-moon mode-toggle-icon';
    }
}

/**
 * Agrega el botón de modo oscuro a la barra de navegación
 */
function agregarBotonModoOscuro() {
    const navbarNav = document.querySelector('.navbar-nav');
    if (!navbarNav) return;

    // Crear elemento para el botón
    const modeToggleItem = document.createElement('li');
    modeToggleItem.className = 'nav-item';
    modeToggleItem.id = 'mode-toggle';

    // Determinar el icono inicial según el modo actual
    const iconClass = document.body.classList.contains('dark-mode') ?
        'bi bi-sun mode-toggle-icon' : 'bi bi-moon mode-toggle-icon';

    modeToggleItem.innerHTML = `
        <a class="nav-link" href="#" aria-label="Cambiar modo oscuro/claro">
            <i class="${iconClass}"></i>
        </a>
    `;

    // Agregar evento al botón
    modeToggleItem.addEventListener('click', (e) => {
        e.preventDefault();
        toggleModoOscuro();
    });

    // Insertar al final de la barra de navegación
    navbarNav.appendChild(modeToggleItem);
}