package com.skillmate.controller;

import com.skillmate.entity.ConnectionRequest.ConnectionStatus;
import com.skillmate.entity.User;
import com.skillmate.service.ConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/connections")
@RequiredArgsConstructor
public class ConnectionController {

    private final ConnectionService connectionService;

    @PostMapping("/request/{matchedUserId}")
    public ResponseEntity<?> sendRequest(@AuthenticationPrincipal User user,
                                          @PathVariable Long matchedUserId) {
        try {
            return ResponseEntity.ok(connectionService.sendRequest(user, matchedUserId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/request/{requestId}/accept")
    public ResponseEntity<?> accept(@AuthenticationPrincipal User user,
                                     @PathVariable Long requestId) {
        try {
            return ResponseEntity.ok(connectionService.respondToRequest(requestId, user, ConnectionStatus.ACCEPTED));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/request/{requestId}/reject")
    public ResponseEntity<?> reject(@AuthenticationPrincipal User user,
                                     @PathVariable Long requestId) {
        try {
            return ResponseEntity.ok(connectionService.respondToRequest(requestId, user, ConnectionStatus.REJECTED));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getConnections(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(connectionService.getConnections(user.getId()));
    }
}
