package es.luka.flashcards.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class FlashCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String texto;

    private String rutaAudio;

    private String rutaImagen;

    @ManyToOne
    @JoinColumn(name = "categoria_id") // Clave foránea hacia Categoria
    @JsonBackReference // Evita serialización cíclica en JSON
    private Categoria categoria;

    @Column(name = "contador_uso", nullable = false)
    private Integer contadorUso = 0;

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public String getRutaAudio() {
        return rutaAudio;
    }

    public void setRutaAudio(String rutaAudio) {
        this.rutaAudio = rutaAudio;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public String getRutaImagen() {
        return rutaImagen;
    }

    public void setRutaImagen(String rutaImagen) {
        this.rutaImagen = rutaImagen;
    }

    public Integer getContadorUso() {
        return contadorUso;
    }

    public void setContadorUso(Integer contadorUso) {
        this.contadorUso = contadorUso;
    }

    public void incrementarContador() {
        this.contadorUso++;
    }
}
