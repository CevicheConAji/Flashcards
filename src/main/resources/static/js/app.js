// URL base de la API
const API_BASE_URL = "http://192.168.0.20:8080/api";

// Evento que se ejecuta cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    cargarCategorias();
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
        btn.className = "btn btn-outline-primary";
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
        cardDiv.className = "card text-center shadow-sm";

        const body = document.createElement("div");
        body.className = "card-body";

        const title = document.createElement("h5");
        title.className = "card-title";
        title.textContent = card.texto;

        const playButton = document.createElement("button");
        playButton.className = "btn btn-primary mt-2";
        playButton.innerHTML = `<i class="bi bi-volume-up"></i> Escuchar`;
        playButton.onclick = () => playAudio(card.rutaAudio);

        body.appendChild(title);
        body.appendChild(playButton);
        cardDiv.appendChild(body);
        col.appendChild(cardDiv);
        container.appendChild(col);
    });

    // Cambia la vista para mostrar las flashcards
    document.getElementById("categories").style.display = "none";
    document.getElementById("flashcards").style.display = "block";
}

// Función para volver a la vista de categorías
function showCategories() {
    document.getElementById("flashcards").style.display = "none";
    document.getElementById("categories").style.display = "block";
}

// Reproduce un archivo de audio
function playAudio(audioFile) {
    const audio = new Audio(`/audios/${audioFile}`);
    audio.play();
}