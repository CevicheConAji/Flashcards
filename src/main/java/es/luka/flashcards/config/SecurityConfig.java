package es.luka.flashcards.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Configuración de seguridad para la aplicación.
 * Define los ajustes de autenticación, autorización, CORS y manejo de respuestas.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final String[] PUBLIC_ENDPOINTS = {
            "/api/auth/**",
            "/api/categorias/**",
            "/api/flashcards/**"
    };

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    /**
     * Configura el codificador de contraseñas para la aplicación.
     *
     * @return Una instancia de BCryptPasswordEncoder para codificar contraseñas.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configura el gestor de autenticación.
     *
     * @param config Configuración de autenticación proporcionada por Spring.
     * @return El gestor de autenticación configurado.
     * @throws Exception Si ocurre un error al obtener el gestor de autenticación.
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Configura la cadena de filtros de seguridad principal.
     *
     * @param http Configuración de seguridad HTTP.
     * @return La cadena de filtros de seguridad configurada.
     * @throws Exception Si ocurre un error durante la configuración.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                        .requestMatchers("/**").permitAll() // Recursos estáticos
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login.html")
                        .permitAll()
                        .successHandler((request, response, authentication) ->
                                writeJsonResponse(response, HttpServletResponse.SC_OK, createSuccessResponse(authentication.getName())))
                        .failureHandler((request, response, exception) ->
                                writeJsonResponse(response, HttpServletResponse.SC_UNAUTHORIZED, createErrorResponse("Credenciales incorrectas")))
                )
                .logout(logout -> logout
                        .logoutSuccessHandler((request, response, authentication) ->
                                writeJsonResponse(response, HttpServletResponse.SC_OK, createSuccessResponse("Sesión cerrada correctamente")))
                )
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, authException) ->
                                writeJsonResponse(response, HttpServletResponse.SC_UNAUTHORIZED, createErrorResponse("Acceso no autorizado")))
                )
                .build();
    }

    /**
     * Configura la fuente de configuración CORS.
     *
     * @return La fuente de configuración CORS.
     */
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*")); // Permitir todas las procedencias
        configuration.setAllowedMethods(Arrays.asList(
                HttpMethod.GET.name(),
                HttpMethod.POST.name(),
                HttpMethod.PUT.name(),
                HttpMethod.DELETE.name(),
                HttpMethod.OPTIONS.name()
        ));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Crea un mapa de respuesta de éxito con un mensaje personalizado.
     *
     * @param mensaje El mensaje a incluir en la respuesta.
     * @return Mapa con la respuesta de éxito.
     */
    private Map<String, Object> createSuccessResponse(String mensaje) {
        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", mensaje);
        return response;
    }

    /**
     * Crea un mapa de respuesta de error con un mensaje personalizado.
     *
     * @param mensaje El mensaje de error a incluir.
     * @return Mapa con la respuesta de error.
     */
    private Map<String, Object> createErrorResponse(String mensaje) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", mensaje);
        return response;
    }

    /**
     * Escribe una respuesta JSON en el flujo de salida de la respuesta HTTP.
     *
     * @param response La respuesta HTTP.
     * @param status El código de estado HTTP.
     * @param body El cuerpo de la respuesta.
     */
    private void writeJsonResponse(HttpServletResponse response, int status, Map<String, Object> body) {
        try {
            response.setStatus(status);
            response.setContentType("application/json");
            OBJECT_MAPPER.writeValue(response.getOutputStream(), body);
        } catch (Exception e) {
            // Registrar excepción si es necesario
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}