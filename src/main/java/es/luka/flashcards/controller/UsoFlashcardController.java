package es.luka.flashcards.controller;

import es.luka.flashcards.dto.FlashCardDTO;
import es.luka.flashcards.mapper.FlashCardMapper;
import es.luka.flashcards.service.UsoFlashcardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controlador REST para gestionar el uso de flashcards por usuario.
 */
@RestController
@RequestMapping("/api/usuarios/{username}/flashcards")
public class UsoFlashcardController {

    private final UsoFlashcardService usoService;
    private final FlashCardMapper mapper;

    // Inyección de dependencias por constructor
    public UsoFlashcardController(UsoFlashcardService usoService, FlashCardMapper mapper) {
        this.usoService = usoService;
        this.mapper = mapper;
    }

    /**
     * Registra el uso de una flashcard por un usuario.
     * Endpoint: POST /api/usuarios/{username}/flashcards/{id}/usar
     *
     * @param username nombre de usuario
     * @param id id de la flashcard
     * @return 204 No Content si se registra correctamente
     */
    @PostMapping("/{id}/usar")
    public ResponseEntity<Void> usar(
            @PathVariable String username,
            @PathVariable Long id) {
        usoService.registrarUso(username, id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Obtiene las flashcards más usadas por un usuario.
     * Endpoint: GET /api/usuarios/{username}/flashcards/mas-usadas
     *
     * @param username nombre de usuario
     * @return lista de FlashCardDTO con las flashcards más usadas
     */
    @GetMapping("/mas-usadas")
    public List<FlashCardDTO> masUsadas(@PathVariable String username) {
        return usoService.getMasUsadas(username).stream()
                .map(u -> mapper.toDto(u.getFlashCard(), u.getContadorUso()))
                .collect(Collectors.toList());
    }
}