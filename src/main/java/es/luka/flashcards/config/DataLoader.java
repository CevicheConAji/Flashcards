package es.luka.flashcards.config;

import es.luka.flashcards.models.Categoria;
import es.luka.flashcards.models.FlashCard;
import es.luka.flashcards.repositories.CategoriaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


@Component
public class DataLoader implements CommandLineRunner {
    private static String MP3 = ".mp3";
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
        ArrayList<FlashCard> listaFlashCards = new ArrayList<>();
        Categoria misDatos = new Categoria();
        misDatos.setNombre("Mis Datos");

        FlashCard miNombre = new FlashCard();
        miNombre.setTexto("Mi nombre es Juan");
        miNombre.setRutaAudio("mi_nombre.mp3");
        miNombre.setCategoria(misDatos);
        listaFlashCards.add(miNombre);

        FlashCard miEdad = new FlashCard();
        miEdad.setTexto("Mi edad es 30 años");
        miEdad.setRutaAudio("mi_edad.mp3");
        miEdad.setCategoria(misDatos);
        listaFlashCards.add(miEdad);

        misDatos.setFlashCards(listaFlashCards);
        return misDatos;
    }
    //Carga lista sentimietos
    private static Categoria getSentimientos() {
        List<String> nombres =
                Arrays.asList("Aburrido", "Amor", "Asustado","Calor","Cansado", "Contento","Divertido" , "Dolor" ,
                        "Enamorado" , "Enojado" , "Feliz" , "Frio","Hambre" , "Pensando" , "Sed" , "Triste" ,
                        "Verguenza");

        List<FlashCard> listaFlashCards = new ArrayList<>();

        Categoria sentimientos = new Categoria();
        sentimientos.setNombre("Sentimientos");

        // Crear flashcards para cada sentimiento
        for (String nombre : nombres) {
            FlashCard flashCard = new FlashCard();
            flashCard.setTexto(nombre);
            flashCard.setRutaAudio(nombre + MP3);
            flashCard.setCategoria(sentimientos);
            listaFlashCards.add(flashCard);
        }
        // Asignar la lista de flashcards a la categoría
        sentimientos.setFlashCards(listaFlashCards);
        return sentimientos;
    }
}