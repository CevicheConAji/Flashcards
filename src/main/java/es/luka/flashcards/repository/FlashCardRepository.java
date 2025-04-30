package es.luka.flashcards.repository;

import es.luka.flashcards.model.FlashCard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FlashCardRepository extends JpaRepository<FlashCard, Long> {
}
