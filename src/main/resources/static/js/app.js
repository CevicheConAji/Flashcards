const API_BASE_URL = "http://localhost:8080/api"; // La base del backend

// Selecciona los contenedores del DOM
const categoryContainer = document.querySelector('.category-container');
const flashcardContainer = document.querySelector('.flashcard-container');
const categoriesSection = document.getElementById('categories');
const flashcardsSection = document.getElementById('flashcards');

// Mostrar las categorías dinámicamente
fetch(`${API_BASE_URL}/categorias`)
    .then(response => response.json())
    .then(data => {
        // Limpia el contenedor antes de renderizar
        categoryContainer.innerHTML = '';

        // Renderiza las categorías
        data.forEach(categoria => {
            const div = document.createElement('div');
            div.className = 'category';
            div.innerText = categoria.nombre; // Nombre de la categoría
            div.onclick = () => showFlashCards(categoria.id); // Conecta la categoría con su función
            categoryContainer.appendChild(div);
        });
    })
    .catch(error => console.error('Error al obtener categorías:', error));


// Mostrar las flashcards de una categoría
function showFlashCards(categoriaId) {
    flashcardContainer.innerHTML = ''; // Limpia las flashcards previas
    fetch(`${API_BASE_URL}/flashcards/${categoriaId}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(flashcard => {
                const div = document.createElement('div');
                div.className = 'flashcard';
                div.innerText = flashcard.texto; // Texto de la flashcard
                div.onclick = () => playAudio(flashcard.rutaAudio); // Conecta el audio con la función
                flashcardContainer.appendChild(div);
            });
            // Cambiar a la sección de flashcards
            categoriesSection.style.display = 'none';
            flashcardsSection.style.display = 'block';
        })
        .catch(error => console.error('Error al obtener flashcards:', error));
}

// Reproducir audio
function playAudio(audioFile) {
    const audio = new Audio(`/audios/${audioFile}`);
    audio.play();
}

// Volver a las categorías
function showCategories() {
    flashcardsSection.style.display = 'none';
    categoriesSection.style.display = 'block';
}




