package es.luka.flashcards.config;

import es.luka.flashcards.model.Categoria;
import es.luka.flashcards.model.FlashCard;
import es.luka.flashcards.repository.CategoriaRepository;
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
    private static final String CATEGORIA_COMIDA = "Comida";
    private static final String CATEGORIA_EMERGENCIA_NECESIDADES = "Emergencia y Necesidades";
    private static final String CATEGORIA_LUGARES = "Lugares";
    private static final String CATEGORIA_OBJETOS = "Objetos";
    private static final String CATEGORIA_PARTES_CUERPO = "Partes del Cuerpo";
    private static final String CATEGORIA_PERSONAS_FAMILIA_AMISTADES = "Personas, Familia y Amistades";
    private static final String CATEGORIA_VESTIMENTA = "Vestimenta";


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
     * Metodo que se ejecuta al iniciar la aplicación. Carga las categorías y sus flashcards
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
        cargarCategoriaSiNoExiste(CATEGORIA_COMIDA,this::crearCategoriaComida);
        cargarCategoriaSiNoExiste(CATEGORIA_EMERGENCIA_NECESIDADES, this::crearCategoriaEmergenciaNecesidades);
        cargarCategoriaSiNoExiste(CATEGORIA_LUGARES, this::crearCategoriaLugares);
        cargarCategoriaSiNoExiste(CATEGORIA_OBJETOS, this::crearCategoriaObjetos);
        cargarCategoriaSiNoExiste(CATEGORIA_PARTES_CUERPO, this::crearCategoriaPartesCuerpo);
        cargarCategoriaSiNoExiste(CATEGORIA_PERSONAS_FAMILIA_AMISTADES, this::crearCategoriaPersonasFamiliaAmistades);
        cargarCategoriaSiNoExiste(CATEGORIA_VESTIMENTA, this::crearCategoriaVestimenta);
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
     * Crea la categoría "Vestimenta" con sus flashcards.
     *
     * @return Categoría "Vestimenta".
     */
    private Categoria crearCategoriaVestimenta() {
        List<String> nombresVestimenta = Arrays.asList(
                "Americana", "Gafas", "Blusa", "Botas", "Bragas", "Bufanda", "Camisa","Chaqueta", "Cinturón", "Falda", "Calzoncillos",
                "Gorra", "Gorro", "Medias", "Pantalón", "Pantalones cortos", "Reloj", "Ropa deportiva", "Sujetador",
                "Sudadera", "Traje de baño", "Vaqueros", "Vestido", "Zapatillas", "Zapatos"
        );
        return crearCategoriaConFlashCards(CATEGORIA_VESTIMENTA, nombresVestimenta);
    }

    /**
     * Crea la categoría "Partes del Cuerpo" con sus flashcards.
     *
     * @return Categoría "Partes del Cuerpo".
     */
    private Categoria crearCategoriaPartesCuerpo() {
        List<String> nombresPartesCuerpo = Arrays.asList(
                "Boca", "Brazo", "Cabeza", "Cejas", "Codo", "Corazón", "Cuello", "Dedo", "Dedos", "Dientes", "Espalda",
                "Estómago", "Garganta", "Hígado", "Hombro", "Mano", "Nariz", "Ojos", "Pestañas", "Pie", "Pierna",
                "Rodilla", "Tobillo", "Pelo"
        );
        return crearCategoriaConFlashCards(CATEGORIA_PARTES_CUERPO, nombresPartesCuerpo);
    }

    /**
     * Crea la categoría "Personas, Familia y Amistades" con sus flashcards.
     *
     * @return Categoría "Personas, Familia y Amistades".
     */
    private Categoria crearCategoriaPersonasFamiliaAmistades() {
        List<String> nombresPersonas = Arrays.asList(
                "Abuela", "Abuelo", "Abuelos", "Bombero", "Dentista", "Doctora", "Doctor", "El", "Ella", "Ellas", "Ellos",
                "Hermana", "Hermano", "Hija", "Hijo", "Maestra", "Mamá", "Nosotros", "Papá", "Policía", "Vosotros", "Yo"
        );
        return crearCategoriaConFlashCards(CATEGORIA_PERSONAS_FAMILIA_AMISTADES, nombresPersonas);
    }

    /**
     * Crea la categoría "Lugares" con sus flashcards.
     *
     * @return Categoría "Lugares".
     */
    private Categoria crearCategoriaLugares() {
        List<String> nombresLugares = Arrays.asList(
                "Baile", "Baño", "Calle", "Casa", "Cine", "Cocina", "Comisaría", "Dormitorio", "Escuela", "Escalera",
                "Estadio", "Hospital", "Lavadero", "Panadería", "Patio de Escuela", "Plaza", "Pollería", "Quiosco",
                "Restaurante", "Salón", "Supermercado", "Tienda de Ropa", "Universidad",
                "Fruteria", "Zapatería"
        );
        return crearCategoriaConFlashCards(CATEGORIA_LUGARES, nombresLugares);
    }

    /**
     * Crea la categoría "Emergencia y Necesidades" con sus flashcards.
     *
     * @return Categoría "Emergencia y Necesidades".
     */
    private Categoria crearCategoriaEmergenciaNecesidades(){
        List<String> nombresEmergencia = Arrays.asList(
                "Ambulancia", "Ayuda", "Bombero", "Borracho", "Choque", "Ciego", "Discapacidad", "Doctor", "Dolor",
                "Dolor de brazo", "Dolor de cabeza", "Dolor de estómago", "Dolor de espalda", "Dolor de garganta",
                "Dolor de muela", "Dolor de oído", "Enfermera", "Escalera", "Fiebre", "Incendio", "Inyección",
                "Lastimar", "Pelea", "Policía", "Resfrío", "Robo", "Salida de emergencia", "Sordo"
        );
        return crearCategoriaConFlashCards(CATEGORIA_EMERGENCIA_NECESIDADES, nombresEmergencia);
    }
    /**
     * Crea la categoría "Objetos" con sus flashcards.
     *
     * @return Categoría "Objetos".
     */
    private Categoria crearCategoriaComida() {
        List<String> nombresComida = Arrays.asList(
                "Agua", "Arroz", "Azúcar", "Banana", "Bebida", "Café", "Caramelo", "Carne", "Cebolla", "Cerveza",
                "Chocolate", "Chuches", "Ensalada", "Fideos", "Fruta", "Hamburguesa", "Helado", "Huevos", "Jamón",
                "Lechuga", "Manzana", "Mayonesa", "Melocotón", "Mostaza", "Pan", "Papas Fritas", "Patata",
                "Perrito Caliente", "Pescado", "Pizza", "Pollo", "Queso", "Sacarina", "Salchicha", "Sandía",
                "Sándwich", "Té", "Tomate", "Torta", "Vino", "Zumo", "Zanahoria"
        );
        return crearCategoriaConFlashCards(CATEGORIA_COMIDA, nombresComida);
    }

    /**
     * Crea la categoría "Animales" con sus flashcards.
     *
     * @return Categoría "Animales".
     */
    private Categoria crearCategoriaAnimales() {
        List<String> nombresAnimales = Arrays.asList(
                "Abeja", "Águila", "Araña", "Ballena", "Búfalo", "Burro", "Caballo", "Camello", "Caracol", "Canguro",
                "Cebra", "Cerdo", "Ciervo", "Cisne", "Cocodrilo", "Cucaracha", "Dinosaurio", "Elefante", "Escarabajo",
                "Foca", "Gallina", "Gallo", "Gato", "Hipopótamo", "Hormiga", "Jirafa", "León", "Lobo", "Loro",
                "Mariposa", "Mono", "Mosca", "Mosquito", "Oso", "Oveja", "Pájaro", "Pato", "Perro", "Pingüino",
                "Pollito", "Ratón", "Tigre", "Toro", "Tortuga", "Vaca", "Zorro"
        );
        return crearCategoriaConFlashCards(CATEGORIA_ANIMALES, nombresAnimales);
    }

    /**
     * Crea la categoría "Acciones" con sus flashcards.
     *
     * @return Categoría "Acciones".
     */
    private Categoria crearCategoriaAcciones() {
        List<String> nombresAcciones = Arrays.asList("Abrir", "Acostar" , "Agarrar" , "Almorzar" , "Aprender" , "Atar"
                , "Bailar" , "Bajar" ,"Beber" , "Buscar" , "Caminar" , "Cantar" , "Cenar" , "Cerrar" ,"Comer" , "Cortar"
                , "Correr" , "Desayunar" , "Despertar" , "Dibujar" , "Dormir" , "Empujar" , "Enseñar" , "Escuchar"
                ,"Escribir" , "Estudiar" , "Guardar" , "Gritar" , "Hablar" , "Jugar" , "Leer" , "Llamar" , "Llorar"
                , "Merendar" , "Mirar" , "Morder" , "Oler", "Pensar" , "Salir", "Servir" , "Sonreir" , "Subir" , "Tocar"
                , "Vestirse"
        );
        return crearCategoriaConFlashCards(CATEGORIA_ACCIONES, nombresAcciones);
    }

    /**
     * Crea la categoría "Objetos" con sus flashcards.
     *
     * @return Categoría "Objetos".
     */
    private Categoria crearCategoriaObjetos() {
        List<String> nombresObjetos = Arrays.asList(
                "Aire Acondicionado", "Bolígrafos", "Ordenador", "Cuaderno", "Escritorio", "Lámpara", "Libro", "Lápiz",
                "Mesa", "Pelota", "Robot", "Silla", "Tablet", "Teléfono", "Televisión", "Ventilador"
        );
        return crearCategoriaConFlashCards(CATEGORIA_OBJETOS, nombresObjetos);
    }

    /**
     * Crea la categoría "Sentimientos" con sus flashcards.
     *
     * @return Categoría "Sentimientos".
     */
    private Categoria crearCategoriaSentimientos() {
        List<String> nombresSentimientos = Arrays.asList(
                "Aburrido", "Amor", "Asustado", "Calor", "Cansado", "Contento", "Divertido", "Dolor",
                "Enamorado", "Enojado", "Feliz", "Frio", "Hambre", "Pensando", "Sed", "Triste", "Vergüenza"
        );
        return crearCategoriaConFlashCards(CATEGORIA_SENTIMIENTOS, nombresSentimientos);
    }
    /**
     * Crea la categoría "Mis Datos" con sus flashcards.
     *
     * @return Categoría "Mis Datos".
     */
    private Categoria crearCategoriaMisDatos() {
        return crearCategoriaConFlashCards(CATEGORIA_MIS_DATOS, Arrays.asList(
                "Mi nombre es Juan",
                "Mi edad es 30 años"
        ));
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
            String rutaImagen = nombre.toLowerCase().replace(" ", "_") + ".png"; // Genera la ruta de la imagen
            flashCards.add(crearFlashCard(nombre, nombre + MP3_EXTENSION, rutaImagen, categoria));
        }

        categoria.setFlashCards(flashCards);
        return categoria;
    }
    /**
     * Crea una flashcard con el texto, ruta de audio y categoría especificados.
     *
     * @param texto Texto de la flashcard.
     * @param rutaAudio Ruta del archivo de audio.
     * @param categoria Categoría a la que pertenece la flashcard.
     * @return FlashCard creada.
     */
    private FlashCard crearFlashCard(String texto, String rutaAudio, String rutaImagen, Categoria categoria) {
        FlashCard flashCard = new FlashCard();
        flashCard.setTexto(texto);
        flashCard.setRutaAudio(rutaAudio);
        flashCard.setRutaImagen(rutaImagen);
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