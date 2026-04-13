package com.collabplatform.controller;

import com.collabplatform.dto.UserDTO;
import com.collabplatform.model.User;
import com.collabplatform.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUsers(@RequestParam("q") String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.ok(List.of());
        }
        
        List<User> users = userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query);
        
        List<UserDTO> dtoList = users.stream()
                .map(u -> new UserDTO(u.getId(), u.getFullName(), u.getEmail()))
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(dtoList);
    }
}
