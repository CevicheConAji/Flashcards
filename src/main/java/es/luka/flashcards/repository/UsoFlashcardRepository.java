package es.luka.flashcards.repository;

import es.luka.flashcards.model.FlashCard;
import es.luka.flashcards.model.UsoFlashcard;
import es.luka.flashcards.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface UsoFlashcardRepository
        extends JpaRepository<UsoFlashcard, Long> {
    Optional<UsoFlashcard> findByUsuarioAndFlashCard(Usuario u, FlashCard f);
    List<UsoFlashcard> findByUsuarioOrderByContadorUsoDesc(Usuario u);
}
