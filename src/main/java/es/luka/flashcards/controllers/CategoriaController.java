package es.luka.flashcards.controllers;

import es.luka.flashcards.models.Categoria;
import es.luka.flashcards.models.FlashCard;
import es.luka.flashcards.repositories.CategoriaRepository;
import es.luka.flashcards.repositories.FlashCardRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controlador REST para gestionar las categorías y flashcards.
 */
@RestController
@RequestMapping("/api")
public class CategoriaController {

    private final CategoriaRepository categoriaRepository;
    private final FlashCardRepository flashCardRepository;

    /**
     * Constructor para inyectar los repositorios necesarios.
     *
     * @param categoriaRepository Repositorio de categorías.
     * @param flashCardRepository Repositorio de flashcards.
     */
    public CategoriaController(CategoriaRepository categoriaRepository, FlashCardRepository flashCardRepository) {
        this.categoriaRepository = categoriaRepository;
        this.flashCardRepository = flashCardRepository;
    }

    /**
     * Obtiene todas las categorías disponibles.
     *
     * @return Lista de todas las categorías.
     */
    @GetMapping("/categorias")
    public List<Categoria> getAllCategorias() {
        return categoriaRepository.findAll();
    }

    /**
     * Obtiene las flashcards asociadas a una categoría específica.
     *
     * @param categoriaId ID de la categoría.
     * @return Lista de flashcards de la categoría o un estado 404 si no se encuentra.
     */
    @GetMapping("/flashcards/{categoriaId}")
    public ResponseEntity<?> getFlashCardsByCategoria(@PathVariable Long categoriaId) {
        return categoriaRepository.findById(categoriaId)
                .map(categoria -> {
                    // Crear un mapa con el nombre de la categoría y las flashcards
                    Map<String, Object> respuesta = new HashMap<>();
                    respuesta.put("categoriaNombre", categoria.getNombre());
                    respuesta.put("flashcards", categoria.getFlashCards());
                    return ResponseEntity.ok(respuesta);
                }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Verifica si una categoría existe por su nombre.
     *
     * @param nombre Nombre de la categoría.
     * @return `true` si la categoría existe, `false` en caso contrario.
     */
    @GetMapping("/categorias/exists/{nombre}")
    public ResponseEntity<Boolean> categoriaExiste(@PathVariable String nombre) {
        boolean exists = categoriaRepository.existsByNombre(nombre);
        return ResponseEntity.ok(exists);
    }
}