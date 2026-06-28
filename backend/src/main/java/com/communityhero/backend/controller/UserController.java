package com.communityhero.backend.controller;

import com.communityhero.backend.model.User;
import com.communityhero.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id);
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }
    
    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {

        if(user.getRole() == null || user.getRole().isEmpty()){
            user.setRole("citizen");
        }

        return userRepository.save(user);
    }

    @PostMapping("/login")
    public org.springframework.http.ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        return userRepository.findAll().stream()
            .filter(u -> u.getEmail().equals(loginRequest.getEmail()) 
                   && u.getPassword().equals(loginRequest.getPassword()))
            .findFirst()
            .<org.springframework.http.ResponseEntity<?>>map(u -> 
                org.springframework.http.ResponseEntity.ok(u))
            .orElse(org.springframework.http.ResponseEntity
                .status(401).body("Invalid credentials"));
    }
}