package es.luka.flashcards.config;

import es.luka.flashcards.models.Categoria;
import es.luka.flashcards.models.FlashCard;
import es.luka.flashcards.repositories.CategoriaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Clase que carga datos iniciales en la base de datos al iniciar la aplicación.
 * Implementa la interfaz {@link CommandLineRunner} para ejecutar código al inicio.
 */
@Component
public class DataLoader implements CommandLineRunner {

    private static final String MP3_EXTENSION = ".mp3"; // Constante para la extensión de los archivos de audio
    private static final String CATEGORIA_ACCIONES = "Acciones";
    private static final String CATEGORIA_SENTIMIENTOS = "Sentimientos";
    private static final String CATEGORIA_MIS_DATOS = "Mis Datos";
    private static final String CATEGORIA_ANIMALES = "Animales";

    private final CategoriaRepository categoriaRepository;

    /**
     * Constructor para inyectar el repositorio de categorías.
     *
     * @param categoriaRepository Repositorio de categorías.
     */
    public DataLoader(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    /**
     * Método que se ejecuta al iniciar la aplicación. Carga las categorías y sus flashcards
     * en la base de datos si no existen previamente.
     *
     * @param args Argumentos de línea de comandos.
     */
    @Override
    public void run(String... args) {
        System.out.println("Ejecutando DataLoader...");

        // Verifica si las categorías ya existen antes de crearlas
        cargarCategoriaSiNoExiste(CATEGORIA_ACCIONES, this::crearCategoriaAcciones);
        cargarCategoriaSiNoExiste(CATEGORIA_MIS_DATOS, this::crearCategoriaMisDatos);
        cargarCategoriaSiNoExiste(CATEGORIA_SENTIMIENTOS, this::crearCategoriaSentimientos);
        cargarCategoriaSiNoExiste(CATEGORIA_ANIMALES, this::crearCategoriaAnimales);
    }

    /**
     * Carga una categoría en la base de datos si no existe.
     *
     * @param nombreCategoria Nombre de la categoría.
     * @param categoriaSupplier Proveedor que genera la categoría.
     */
    private void cargarCategoriaSiNoExiste(String nombreCategoria, CategoriaSupplier categoriaSupplier) {
        if (!categoriaRepository.existsByNombre(nombreCategoria)) {
            Categoria categoria = categoriaSupplier.get();
            categoriaRepository.save(categoria);
        }
    }

    /**
     * Crea la categoría "Animales" con sus flashcards.
     *
     * @return Categoría "Animales".
     */
    private Categoria crearCategoriaAnimales() {
        List<String> nombresAnimales = Arrays.asList("Perro", "Gato", "Elefante", "León");
        return crearCategoriaConFlashCards(CATEGORIA_ANIMALES, nombresAnimales);
    }

    /**
     * Crea la categoría "Acciones" con sus flashcards.
     *
     * @return Categoría "Acciones".
     */
    private Categoria crearCategoriaAcciones() {
        List<String> nombresAcciones = Arrays.asList("Abrir", "Acostar" , "Agarrar" , "Almorzar" , "Aprender" , "Atar");
        return crearCategoriaConFlashCards(CATEGORIA_ACCIONES, nombresAcciones);
    }

    /**
     * Crea la categoría "Sentimientos" con sus flashcards.
     *
     * @return Categoría "Sentimientos".
     */
    private Categoria crearCategoriaSentimientos() {
        List<String> nombresSentimientos = Arrays.asList(
                "Aburrido", "Amor", "Asustado", "Calor", "Cansado", "Contento", "Divertido", "Dolor",
                "Enamorado", "Enojado", "Feliz", "Frio", "Hambre", "Pensando", "Sed", "Triste", "Verguenza"
        );
        return crearCategoriaConFlashCards(CATEGORIA_SENTIMIENTOS, nombresSentimientos);
    }

    /**
     * Crea la categoría "Mis Datos" con sus flashcards.
     *
     * @return Categoría "Mis Datos".
     */
    private Categoria crearCategoriaMisDatos() {
        Categoria misDatos = new Categoria();
        misDatos.setNombre(CATEGORIA_MIS_DATOS);

        List<FlashCard> flashCards = new ArrayList<>();
        flashCards.add(crearFlashCard("Mi nombre es Juan", "mi_nombre.mp3", misDatos));
        flashCards.add(crearFlashCard("Mi edad es 30 años", "mi_edad.mp3", misDatos));

        misDatos.setFlashCards(flashCards);
        return misDatos;
    }

    /**
     * Crea una categoría con una lista de nombres y genera flashcards para cada nombre.
     *
     * @param nombreCategoria Nombre de la categoría.
     * @param nombres Lista de nombres para las flashcards.
     * @return Categoría con las flashcards generadas.
     */
    private Categoria crearCategoriaConFlashCards(String nombreCategoria, List<String> nombres) {
        Categoria categoria = new Categoria();
        categoria.setNombre(nombreCategoria);

        List<FlashCard> flashCards = new ArrayList<>();
        for (String nombre : nombres) {
            flashCards.add(crearFlashCard(nombre, nombre + MP3_EXTENSION, categoria));
        }

        categoria.setFlashCards(flashCards);
        return categoria;
    }

    /**
     * Crea una flashcard con el texto, ruta de audio y categoría asociada.
     *
     * @param texto Texto de la flashcard.
     * @param rutaAudio Ruta del archivo de audio.
     * @param categoria Categoría a la que pertenece la flashcard.
     * @return Flashcard creada.
     */
    private FlashCard crearFlashCard(String texto, String rutaAudio, Categoria categoria) {
        FlashCard flashCard = new FlashCard();
        flashCard.setTexto(texto);
        flashCard.setRutaAudio(rutaAudio);
        flashCard.setCategoria(categoria);
        return flashCard;
    }

    /**
     * Interfaz funcional para suministrar categorías.
     */
    @FunctionalInterface
    private interface CategoriaSupplier {
        Categoria get();
    }
}