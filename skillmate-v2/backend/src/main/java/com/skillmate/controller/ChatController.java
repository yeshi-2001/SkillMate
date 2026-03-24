package com.skillmate.controller;

import com.skillmate.entity.User;
import com.skillmate.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/messages/{userId}")
    public ResponseEntity<?> getHistory(@AuthenticationPrincipal User user,
                                         @PathVariable Long userId) {
        return ResponseEntity.ok(chatService.getHistory(user.getId(), userId));
    }

    @PostMapping("/messages")
    public ResponseEntity<?> sendMessage(@AuthenticationPrincipal User user,
                                          @RequestBody Map<String, Object> body) {
        try {
            Long receiverId = Long.valueOf(body.get("receiverId").toString());
            String content = body.get("content").toString();
            return ResponseEntity.ok(chatService.sendMessage(user, receiverId, content));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
