package es.luka.flashcards.repositories;

import es.luka.flashcards.models.FlashCard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FlashCardRepository extends JpaRepository<FlashCard, Long> {
}
