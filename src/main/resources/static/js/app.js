// URL base de la API
window.API_BASE_URL = "/api";

// Evento que se ejecuta cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    cargarCategorias();
    cargarFlashCardsMasUsadas(); // Cargar las flashcards más usadas inicialmente

    // Agregar evento al botón de actualizar flashcards más usadas
    const btnActualizarPopulares = document.getElementById('btn-actualizar-populares');
    if (btnActualizarPopulares) {
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
});

// Función para cargar las categorías desde la API
function cargarCategorias() {
    fetch(`${API_BASE_URL}/categorias`)
        .then(response => response.json())
        .then(data => renderizarCategorias(data))
        .catch(error => {
            console.error("Error cargando categorías:", error);
            alert("Ocurrió un error al cargar las categorías.");
        });
}

// Renderiza los botones de categorías en el contenedor
function renderizarCategorias(categorias) {
    const categoryContainer = document.getElementById("category-buttons");
    categoryContainer.innerHTML = ""; // Limpia el contenedor antes de agregar contenido

    categorias.forEach(categoria => {
        const btn = document.createElement("button");
        btn.className = "btn btn-outline-primary category-button"; // Agrega la clase 'category-button'
        btn.textContent = categoria.nombre;
        // Agregar atributos de accesibilidad
        btn.setAttribute("aria-label", `Seleccionar categoría ${categoria.nombre}`);
        btn.setAttribute("role", "listitem");

        btn.onclick = () => {
            console.log("Clicked category ID:", categoria.id);
            showFlashCards(categoria.id);
        };
        categoryContainer.appendChild(btn);
    });
}

// Función para mostrar las flashcards de una categoría específica
function showFlashCards(categoriaId) {
    console.log("Loading flashcards for category ID:", categoriaId);

    fetch(`${API_BASE_URL}/flashcards/${categoriaId}`)
        .then(response => {
            console.log("Flashcard response status:", response.status);
            if (!response.ok) {
                throw new Error("Error al cargar flashcards");
            }
            return response.json();
        })
        .then(data => {
            // Actualiza el nombre de la categoría
            document.getElementById("category-name").textContent = data.categoriaNombre || "Categoría desconocida";
            // Renderiza las flashcards desde el campo "flashcards"
            renderizarFlashCards(data.flashcards);
        })
        .catch(error => {
            console.error("Error cargando flashcards:", error);
            alert("Ocurrió un error al cargar las flash cards.");
        });
}

// Renderiza las flashcards en el contenedor
function renderizarFlashCards(flashcards) {
    const container = document.getElementById("flashcard-container");
    container.innerHTML = ""; // Limpia el contenedor antes de agregar contenido

    if (!Array.isArray(flashcards) || flashcards.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay flash cards para esta categoría.</p>';
        return;
    }

    // Ordena las flashcards alfabéticamente por el texto
    flashcards.sort((a, b) => a.texto.localeCompare(b.texto));

    flashcards.forEach(card => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-3";

        const cardDiv = document.createElement("div");
        cardDiv.className = "card text-center shadow-sm flashcard";
        cardDiv.onclick = () => playAudio(card.rutaAudio, card.id); // Modificado para incluir el ID

        const img = document.createElement("img");
        img.src = `/images/${card.rutaImagen}`; // Ruta de la imagen
        img.className = "card-img-top img-fluid"; // Clase de Bootstrap para imágenes en tarjetas
        img.alt = card.texto; // Texto alternativo

        const body = document.createElement("div");
        body.className = "card-body";

        const title = document.createElement("h5");
        title.className = "card-title";
        title.textContent = card.texto;

        body.appendChild(title);
        cardDiv.appendChild(img); // Agrega la imagen al cardDiv
        cardDiv.appendChild(body);
        col.appendChild(cardDiv);
        container.appendChild(col);
    });

    // Cambia la vista para mostrar las flashcards
    document.getElementById("categories").style.display = "none";
    document.getElementById("flashcards").style.display = "block";
}

// Función para cargar las flashcards más usadas (llamada inicial)
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

// Función para actualizar las flashcards más usadas (devuelve promesa para el botón)
function actualizarFlashCardsMasUsadas() {
    // Mostrar spinner en el contenedor mientras carga
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

// Renderiza las flashcards más usadas en el contenedor correspondiente
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

// Función para registrar el uso de una flashcard
function registrarUsoFlashCard(id) {
    fetch(`${API_BASE_URL}/flashcards/${id}/registrar-uso`, {
        method: 'POST'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al registrar uso');
            }
        })
        .catch(error => console.error('Error:', error));
}

// Función para volver a la vista de categorías
function showCategories() {
    document.getElementById("flashcards").style.display = "none";
    document.getElementById("categories").style.display = "block";
}

// Reproduce un archivo de audio y registra el uso
function playAudio(audioFile, flashcardId) {
    const audio = new Audio(`/audios/${audioFile}`);
    audio.play();

    // Si se proporciona ID, registrar el uso
    if (flashcardId) {
        registrarUsoFlashCard(flashcardId);
    }
}