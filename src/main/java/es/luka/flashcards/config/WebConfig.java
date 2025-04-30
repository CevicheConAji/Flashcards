package es.luka.flashcards.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración web para la aplicación de flashcards.
 * Define la configuración de enrutamiento y gestión de recursos estáticos.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Configura los controladores de vistas.
     * Redirige la ruta raíz ("/") hacia el archivo index.html.
     *
     * @param registry Registro de controladores de vistas
     */
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/index.html");
    }

    /**
     * Configura los manejadores de recursos estáticos.
     * Permite servir todos los recursos estáticos desde la carpeta classpath:/static/.
     *
     * @param registry Registro de manejadores de recursos
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
    }

    /**
     * Controlador para gestionar las rutas no encontradas en el backend.
     * Permite el correcto funcionamiento del enrutamiento de SPA (Single Page Application).
     */
    @Controller
    static class FallbackController {
        /**
         * Redirige todas las rutas que no contienen extensión al index.html.
         * Esto permite que las rutas del frontend sean manejadas por el router del cliente.
         *
         * @return Redirección hacia index.html
         */
        @RequestMapping(value = "/**/{path:[^\\.]*}")
        public String forward() {
            return "forward:/index.html";
        }
    }
}