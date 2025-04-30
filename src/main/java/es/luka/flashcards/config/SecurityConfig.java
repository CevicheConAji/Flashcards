package es.luka.flashcards.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() // Rutas públicas de autenticación
                        .requestMatchers("/api/categorias/**", "/api/flashcards/**").permitAll() // Rutas públicas de API
                        .requestMatchers("/**").permitAll() // Recursos estáticos permitidos para todos
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login.html")
                        .permitAll()
                        .successHandler((request, response, authentication) -> {
                            ObjectMapper mapper = new ObjectMapper();
                            Map<String, Object> body = new HashMap<>();
                            body.put("mensaje", "Inicio de sesión exitoso");
                            body.put("username", authentication.getName());
                            response.setContentType("application/json");
                            mapper.writeValue(response.getOutputStream(), body);
                        })
                        .failureHandler((request, response, exception) -> {
                            ObjectMapper mapper = new ObjectMapper();
                            Map<String, Object> body = new HashMap<>();
                            body.put("error", "Credenciales incorrectas");
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            mapper.writeValue(response.getOutputStream(), body);
                        })
                )
                .logout(logout -> logout
                        .logoutSuccessHandler((request, response, authentication) -> {
                            ObjectMapper mapper = new ObjectMapper();
                            Map<String, Object> body = new HashMap<>();
                            body.put("mensaje", "Sesión cerrada correctamente");
                            response.setContentType("application/json");
                            mapper.writeValue(response.getOutputStream(), body);
                        })
                )
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, authException) -> {
                            ObjectMapper mapper = new ObjectMapper();
                            Map<String, Object> body = new HashMap<>();
                            body.put("error", "Acceso no autorizado");
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            mapper.writeValue(response.getOutputStream(), body);
                        })
                );

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*")); // Permitir todas las procedencias
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}