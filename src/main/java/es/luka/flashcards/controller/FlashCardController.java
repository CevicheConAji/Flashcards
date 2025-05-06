package es.luka.flashcards.controller;

import es.luka.flashcards.model.FlashCard;
import es.luka.flashcards.repository.FlashCardRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class FlashCardController {

    private final FlashCardRepository flashCardRepository;

    public FlashCardController(FlashCardRepository flashCardRepository) {
        this.flashCardRepository = flashCardRepository;
    }

    /**
     * Obtiene las flashcards más utilizadas.
     *
     * @param limit Cantidad de flashcards a obtener.
     * @return Lista de flashcards más utilizadas.
     */
    @GetMapping("/flashcards/mas-usadas")
    public ResponseEntity<List<FlashCard>> obtenerFlashCardsMasUsadas(
            @RequestParam(defaultValue = "5") int limit) {
        List<FlashCard> masUsadas = flashCardRepository.findMostUsed(PageRequest.of(0, limit));
        return ResponseEntity.ok(masUsadas);
    }

    /**
     * Registra el uso de una flashcard.
     *
     * @param id ID de la flashcard.
     * @return Información actualizada de la flashcard.
     */
    @PostMapping("/flashcards/{id}/registrar-uso")
    public ResponseEntity<?> registrarUsoFlashCard(@PathVariable Long id) {
        return flashCardRepository.findById(id)
                .map(flashcard -> {
                    flashcard.incrementarContador();
                    FlashCard actualizada = flashCardRepository.save(flashcard);

                    Map<String, Object> response = new HashMap<>();
                    response.put("mensaje", "Uso registrado correctamente");
                    response.put("contadorUso", actualizada.getContadorUso());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}