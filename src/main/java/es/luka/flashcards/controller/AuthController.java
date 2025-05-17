package es.luka.flashcards.controller;

import es.luka.flashcards.model.Usuario;
import es.luka.flashcards.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controlador REST para gestionar la autenticación de usuarios.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private AuthenticationManager authenticationManager;

    /**
     * Endpoint para registrar un nuevo usuario.
     *
     * @param usuario Datos del usuario a registrar.
     * @return Respuesta con información del usuario registrado.
     */
    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario usuario) {
        try {
            Usuario nuevoUsuario = usuarioService.registrarUsuario(usuario);

            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Usuario registrado correctamente");
            response.put("username", nuevoUsuario.getUsername());
            response.put("email", nuevoUsuario.getEmail());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Endpoint para iniciar sesión.
     *
     * @param credenciales Objeto con las credenciales (username y password).
     * @return Respuesta con información de autenticación.
     */
    @PostMapping("/login")
    public ResponseEntity<?> autenticarUsuario(@RequestBody Map<String, String> credenciales) {
        try {
            String username = credenciales.get("username");
            String password = credenciales.get("password");

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Inicio de sesión exitoso");
            response.put("username", username);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Credenciales inválidas");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }
    /**
     * Endpoint para cerrar sesión.
     *
     * @return Respuesta con confirmación del cierre de sesión.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> cerrarSesion() {
        // Obtener la autenticación actual
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null) {
            // Limpiar el contexto de seguridad
            SecurityContextHolder.clearContext();
        }

        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "Sesión cerrada correctamente");

        return ResponseEntity.ok(response);
    }
    // Agregar este métod o al AuthController o crear un nuevo UserController
    @GetMapping("/usuarios/{username}")
    public ResponseEntity<?> obtenerDatosUsuario(@PathVariable String username) {
        return usuarioService.buscarPorUsername(username)
                .map(usuario -> {
                    Map<String, Object> datos = new HashMap<>();
                    datos.put("username", usuario.getUsername());
                    datos.put("email", usuario.getEmail());
                    return ResponseEntity.ok(datos);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}