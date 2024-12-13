const API_BASE_URL = "http://localhost:8080/api"; // La base del backend

// Ruta para obtener las categorías
fetch(`${API_BASE_URL}/categorias`)
    .then(response => response.json())
    .then(data => console.log('Categorías:', data));

// Ruta para obtener las flash cards de una categoría
function showFlashCards(categoriaId) {
    fetch(`${API_BASE_URL}/flashcards/${categoriaId}`)
        .then(response => response.json())
        .then(data => console.log('Flash Cards:', data));
}

// Ruta para reproducir un audio
function playAudio(audioFile) {
    const audio = new Audio(`${API_BASE_URL}/audio/${audioFile}`);
    audio.play();
}


