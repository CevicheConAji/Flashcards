package es.luka.flashcards.service;

import es.luka.flashcards.model.Usuario;
import es.luka.flashcards.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

/**
 * Implementación de UserDetailsService para cargar los datos del usuario
 * utilizados por Spring Security durante la autenticación
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    // Repositorio para acceder a los datos de usuario
    private final UsuarioRepository usuarioRepository;

    /**
     * Constructor con inyección de dependencias
     *
     * @param usuarioRepository Repositorio para acceder a los usuarios
     */
    @Autowired
    public UserDetailsServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Carga los detalles del usuario por su nombre de usuario
     *
     * @param username Nombre de usuario a buscar
     * @return Objeto UserDetails con la información del usuario
     * @throws UsernameNotFoundException Si no se encuentra el usuario
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Buscar el usuario en la base de datos
        Usuario usuario = findUsuarioByUsername(username);

        // Convertir el usuario de la aplicación a un UserDetails para Spring Security
        return createUserDetails(usuario);
    }

    /**
     * Busca un usuario en la base de datos
     *
     * @param username Nombre de usuario a buscar
     * @return El usuario encontrado
     * @throws UsernameNotFoundException Si no se encuentra el usuario
     */
    private Usuario findUsuarioByUsername(String username) {
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Usuario no encontrado: " + username));
    }

    /**
     * Crea un objeto UserDetails a partir de un Usuario
     *
     * @param usuario Usuario de la aplicación
     * @return UserDetails para Spring Security
     */
    private UserDetails createUserDetails(Usuario usuario) {
        // Definir las autoridades/roles del usuario
        List<SimpleGrantedAuthority> authorities =
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));

        return new User(
                usuario.getUsername(),
                usuario.getPassword(),
                usuario.isActivo(),  // enabled
                true,               // accountNonExpired
                true,               // credentialsNonExpired
                true,               // accountNonLocked
                authorities
        );
    }
}