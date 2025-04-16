const API_BASE_URL = "http://localhost:8080/api";

document.addEventListener("DOMContentLoaded", () => {
    fetch(`${API_BASE_URL}/categorias`)
        .then(response => response.json())
        .then(data => {
            const categoryContainer = document.getElementById("category-buttons");
            data.forEach(category => {
                const btn = document.createElement("button");
                btn.className = "btn btn-outline-primary";
                btn.textContent = category.nombre;
                btn.onclick = () => showFlashCards(category.id);
                categoryContainer.appendChild(btn);
            });
        });
    btn.onclick = () => {
        console.log("Clicked category ID:", category.id);
        showFlashCards(category.id);
    };
});

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
            console.log("Flashcard data received:", data);

            data.sort((a, b) => a.texto.localeCompare(b.texto));

            const container = document.getElementById("flashcard-container");
            container.innerHTML = "";

            if (!Array.isArray(data) || data.length === 0) {
                container.innerHTML = '<p class="text-muted">No hay flash cards para esta categoría.</p>';
                return;
            }

            data.forEach(card => {
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

            document.getElementById("categories").style.display = "none";
            document.getElementById("flashcards").style.display = "block";
        })
        .catch(error => {
            console.error("Error cargando flashcards:", error);
            alert("Ocurrió un error al cargar las flash cards.");
        });
}


function showCategories() {
    document.getElementById("flashcards").style.display = "none";
    document.getElementById("categories").style.display = "block";
}

function playAudio(audioFile) {
    const audio = new Audio(`/audios/${audioFile}`);
    audio.play();
}
