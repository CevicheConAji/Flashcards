package es.luka.flashcards.controller;

import es.luka.flashcards.dto.FlashCardDTO;
import es.luka.flashcards.mapper.FlashCardMapper;
import es.luka.flashcards.service.UsoFlashcardService;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios/{username}/flashcards")
public class UsoFlashcardController {
    @Autowired
    private UsoFlashcardService usoService;
    @Autowired private FlashCardMapper mapper; // convierte entity→DTO

    // POST /api/usuarios/{username}/flashcards/{id}/usar
    @PostMapping("/{id}/usar")
    public ResponseEntity<Void> usar(
            @PathVariable String username,
            @PathVariable Long id) {
        usoService.registrarUso(username, id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/usuarios/{username}/flashcards/mas-usadas
    @GetMapping("/mas-usadas")
    public List<FlashCardDTO> masUsadas(@PathVariable String username) {
        return usoService.getMasUsadas(username).stream()
                .map(u -> mapper.toDto(u.getFlashCard(), u.getContadorUso()))
                .collect(Collectors.toList());
    }
}
