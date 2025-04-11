package es.luka.flashcards.config;

import es.luka.flashcards.models.Categoria;
import es.luka.flashcards.models.FlashCard;
import es.luka.flashcards.repositories.CategoriaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
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
            Categoria sentimientos = getSentimientos();
            categoriaRepository.save(sentimientos);
        }

        if (!categoriaRepository.existsByNombre("Mis Datos")) {
            Categoria misDatos = getMisDatos();
            categoriaRepository.save(misDatos);
        }
    }

    private static Categoria getMisDatos() {
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
        return misDatos;
    }
    //Carga lista sentimietos
    private static Categoria getSentimientos() {
        ArrayList<FlashCard> listaSentimintos = new ArrayList<>();

        Categoria sentimientos = new Categoria();
        sentimientos.setNombre("Sentimientos");

        FlashCard aburrido = new FlashCard();
        aburrido.setTexto("Aburrido");
        aburrido.setRutaAudio("aburrido.mp3");
        aburrido.setCategoria(sentimientos);
        listaSentimintos.add(aburrido);

        FlashCard amor = new FlashCard();
        amor.setTexto("Amor");
        amor.setRutaAudio("amor.mp3");
        amor.setCategoria(sentimientos);
        listaSentimintos.add(amor);

        FlashCard enojado = new FlashCard();
        enojado.setTexto("Enojado");
        enojado.setRutaAudio("enojado.mp3");
        enojado.setCategoria(sentimientos);
        listaSentimintos.add(enojado);


        FlashCard feliz = new FlashCard();
        feliz.setTexto("Feliz");
        feliz.setRutaAudio("feliz.mp3");
        feliz.setCategoria(sentimientos);
        listaSentimintos.add(feliz);


        FlashCard triste = new FlashCard();
        triste.setTexto("Triste");
        triste.setRutaAudio("triste.mp3");
        triste.setCategoria(sentimientos);
        listaSentimintos.add(triste);

        sentimientos.setFlashCards(listaSentimintos);
        return sentimientos;
    }
}
