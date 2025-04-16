package es.luka.flashcards.models;

public class FlashCardDTO {
    private String texto;
    private String rutaAudio;
    private String categoria;

    public FlashCardDTO(String texto, String rutaAudio, String categoria) {
        this.texto = texto;
        this.rutaAudio = rutaAudio;
        this.categoria = categoria;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getRutaAudio() {
        return rutaAudio;
    }

    public void setRutaAudio(String rutaAudio) {
        this.rutaAudio = rutaAudio;
    }
}
