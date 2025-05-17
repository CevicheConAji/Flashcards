package es.luka.flashcards.dto;

public class FlashCardDTO {
    private Long id;
    private String texto;
    private String rutaImagen;
    private Integer contadorUso;

    // Constructores
    public FlashCardDTO() {}

    public FlashCardDTO(Long id, String texto, String rutaImagen, Integer contadorUso) {
        this.id = id;
        this.texto = texto;
        this.rutaImagen = rutaImagen;
        this.contadorUso = contadorUso;
    }

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }

    public String getRutaImagen() { return rutaImagen; }
    public void setRutaImagen(String rutaImagen) { this.rutaImagen = rutaImagen; }

    public Integer getContadorUso() { return contadorUso; }
    public void setContadorUso(Integer contadorUso) { this.contadorUso = contadorUso; }
}
