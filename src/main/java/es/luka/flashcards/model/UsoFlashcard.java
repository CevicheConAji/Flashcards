package es.luka.flashcards.model;

import jakarta.persistence.*;

@Entity
@Table(name = "uso_flashcard")
public class UsoFlashcard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne @JoinColumn(name = "flashcard_id", nullable = false)
    private FlashCard flashCard;

    @Column(name = "contador_uso", nullable = false)
    private Integer contadorUso = 0;

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public FlashCard getFlashCard() {
        return flashCard;
    }

    public void setFlashCard(FlashCard flashCard) {
        this.flashCard = flashCard;
    }

    public Integer getContadorUso() {
        return contadorUso;
    }

    public void setContadorUso(Integer contadorUso) {
        this.contadorUso = contadorUso;
    }
}
