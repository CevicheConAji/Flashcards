package es.luka.flashcards.controllers;

import es.luka.flashcards.models.Categoria;
import es.luka.flashcards.models.FlashCard;
import es.luka.flashcards.repositories.CategoriaRepository;
import es.luka.flashcards.repositories.FlashCardRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api")
public class CategoriaController {

    private final CategoriaRepository categoriaRepository;
    private final FlashCardRepository flashCardRepository;

    /**@Value("${audio.storage.path}")
    private String audioStoragePath;**/

    public CategoriaController(CategoriaRepository categoriaRepository, FlashCardRepository flashCardRepository) {
        this.categoriaRepository = categoriaRepository;
        this.flashCardRepository = flashCardRepository;
    }

    // Obtener todas las categorías
    @GetMapping("/categorias")
    public List<Categoria> getAllCategorias() {
        return categoriaRepository.findAll();
    }

    // Obtener flashcards por categoría
    @GetMapping("/flashcards/{categoriaId}")
    public ResponseEntity<List<FlashCard>> getFlashCardsByCategoria(@PathVariable Long categoriaId) {
        Categoria categoria = categoriaRepository.findById(categoriaId).orElse(null);
        if (categoria == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(categoria.getFlashCards());
    }


    // Obtener un archivo de audio por nombre
    /**@GetMapping("/audio/{fileName}")
    public ResponseEntity<File> getAudioFile(@PathVariable String fileName) {
        File file = new File(audioStoragePath + fileName);
        if (!file.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(file);
    }**/

    // Verificar si una categoría existe por nombre
    @GetMapping("/categorias/exists/{nombre}")
    public ResponseEntity<Boolean> categoriaExiste(@PathVariable String nombre) {
        boolean exists = categoriaRepository.existsByNombre(nombre);
        return ResponseEntity.ok(exists);
    }
}
