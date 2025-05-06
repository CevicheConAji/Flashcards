package es.luka.flashcards.repository;

import es.luka.flashcards.model.FlashCard;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FlashCardRepository extends JpaRepository<FlashCard, Long> {
    @Query("SELECT f FROM FlashCard f ORDER BY f.contadorUso DESC")
    List<FlashCard> findMostUsed(Pageable pageable);
}