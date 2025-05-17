package es.luka.flashcards.service;

import es.luka.flashcards.model.FlashCard;
import es.luka.flashcards.model.UsoFlashcard;
import es.luka.flashcards.model.Usuario;
import es.luka.flashcards.repository.FlashCardRepository;
import es.luka.flashcards.repository.UsoFlashcardRepository;
import es.luka.flashcards.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class UsoFlashcardService {
    @Autowired
    private UsoFlashcardRepository repo;
    @Autowired private UsuarioRepository userRepo;
    @Autowired private FlashCardRepository cardRepo;

    /** 1) Incrementa el contador (o crea el registro). */
    @Transactional
    public void registrarUso(String username, Long flashcardId) {
        Usuario u = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));
        FlashCard f = cardRepo.findById(flashcardId)
                .orElseThrow(() -> new NoSuchElementException("FlashCard no existe"));

        UsoFlashcard uso = repo.findByUsuarioAndFlashCard(u,f)
                .orElseGet(() -> {
                    UsoFlashcard nuevo = new UsoFlashcard();
                    nuevo.setUsuario(u);
                    nuevo.setFlashCard(f);
                    nuevo.setContadorUso(0);
                    return nuevo;
                });

        uso.setContadorUso(uso.getContadorUso() + 1);
        repo.save(uso);
    }

    /** 2) Devuelve la lista ordenada por contador desc. */
    public List<UsoFlashcard> getMasUsadas(String username) {
        Usuario u = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));
        return repo.findByUsuarioOrderByContadorUsoDesc(u);
    }
}
