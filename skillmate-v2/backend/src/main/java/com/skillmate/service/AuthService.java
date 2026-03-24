package com.skillmate.service;

import com.skillmate.config.JwtUtil;
import com.skillmate.entity.User;
import com.skillmate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public Map<String, Object> register(String username, String email, String password, String fullName) {
        if (userRepository.existsByEmail(email))
            throw new RuntimeException("Email already registered");
        if (userRepository.existsByUsername(username))
            throw new RuntimeException("Username already taken");

        User user = User.builder()
                .username(username)
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .fullName(fullName)
                .build();

        user = userRepository.save(user);
        String token = jwtUtil.generateToken(user.getId(), user.getUsername());

        return buildAuthResponse(token, user);
    }

    public Map<String, Object> login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPasswordHash()))
            throw new RuntimeException("Invalid email or password");

        String token = jwtUtil.generateToken(user.getId(), user.getUsername());
        return buildAuthResponse(token, user);
    }

    private Map<String, Object> buildAuthResponse(String token, User user) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("username", user.getUsername());
        userMap.put("email", user.getEmail());
        userMap.put("fullName", user.getFullName());
        userMap.put("bio", user.getBio());
        userMap.put("avatarUrl", user.getAvatarUrl());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", userMap);
        return response;
    }
}
