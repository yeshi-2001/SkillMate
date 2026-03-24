package com.skillmate.controller;

import com.skillmate.entity.User;
import com.skillmate.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<?> getMe(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.getProfile(user));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMe(@AuthenticationPrincipal User user,
                                       @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(userService.updateProfile(user, body.get("fullName"), body.get("bio")));
    }

    @PostMapping("/me/avatar")
    public ResponseEntity<?> updateAvatar(@AuthenticationPrincipal User user,
                                           @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(userService.updateAvatar(user, body.get("avatarUrl")));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(userService.getUserById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam String skill) {
        return ResponseEntity.ok(userService.searchBySkill(skill));
    }
}
