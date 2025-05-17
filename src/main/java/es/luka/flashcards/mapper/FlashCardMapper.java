package es.luka.flashcards.mapper;

import es.luka.flashcards.dto.FlashCardDTO;
import es.luka.flashcards.model.FlashCard;
import org.springframework.stereotype.Component;

@Component
public class FlashCardMapper {

    /**
     * Mapea la entidad FlashCard y su contador de uso a un DTO.
     */
    public FlashCardDTO toDto(FlashCard flashCard, int contadorUso) {
        return new FlashCardDTO(
                flashCard.getId(),
                flashCard.getTexto(),
                flashCard.getRutaImagen(),
                contadorUso
        );
    }

}
