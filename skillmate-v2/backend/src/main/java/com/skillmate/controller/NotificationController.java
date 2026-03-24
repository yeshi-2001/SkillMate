package com.skillmate.controller;

import com.skillmate.entity.User;
import com.skillmate.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<?> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(Map.of(
                "notifications", notificationService.getAll(user.getId()),
                "unreadCount", notificationService.getUnreadCount(user.getId())
        ));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markRead(@AuthenticationPrincipal User user,
                                       @PathVariable Long id) {
        try {
            return ResponseEntity.ok(notificationService.markRead(id, user.getId()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllRead(@AuthenticationPrincipal User user) {
        notificationService.markAllRead(user.getId());
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }
}
