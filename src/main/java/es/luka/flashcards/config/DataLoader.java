package es.luka.flashcards.config;

import es.luka.flashcards.models.Categoria;
import es.luka.flashcards.models.FlashCard;
import es.luka.flashcards.repositories.CategoriaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;


@Component
public class DataLoader implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;

    public DataLoader(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    public void run(String... args) {
        System.out.println("Ejecutando DataLoader...");

        if (!categoriaRepository.existsByNombre("Sentimientos")) {
            Categoria sentimientos = new Categoria();
            sentimientos.setNombre("Sentimientos");

            FlashCard feliz = new FlashCard();
            feliz.setTexto("Feliz");
            feliz.setRutaAudio("feliz.mp3");
            feliz.setCategoria(sentimientos);

            FlashCard triste = new FlashCard();
            triste.setTexto("Triste");
            triste.setRutaAudio("triste.mp3");
            triste.setCategoria(sentimientos);

            sentimientos.setFlashCards(Arrays.asList(feliz, triste));
            categoriaRepository.save(sentimientos);
        }

        if (!categoriaRepository.existsByNombre("Mis Datos")) {
            Categoria misDatos = new Categoria();
            misDatos.setNombre("Mis Datos");

            FlashCard miNombre = new FlashCard();
            miNombre.setTexto("Mi nombre es Juan");
            miNombre.setRutaAudio("mi_nombre.mp3");
            miNombre.setCategoria(misDatos);

            FlashCard miEdad = new FlashCard();
            miEdad.setTexto("Mi edad es 30 años");
            miEdad.setRutaAudio("mi_edad.mp3");
            miEdad.setCategoria(misDatos);

            misDatos.setFlashCards(Arrays.asList(miNombre, miEdad));
            categoriaRepository.save(misDatos);
        }
    }
}
