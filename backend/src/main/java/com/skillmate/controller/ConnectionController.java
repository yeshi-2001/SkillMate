package com.skillmate.controller;

import com.skillmate.model.*;
import com.skillmate.service.ConnectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/connections")
public class ConnectionController {
    @Autowired
    private ConnectionService connectionService;

    @PostMapping("/request")
    public ResponseEntity<ConnectionRequest> sendRequest(@RequestBody Map<String, Object> payload) {
        Long senderId = Long.valueOf(payload.get("senderId").toString());
        Long receiverId = Long.valueOf(payload.get("receiverId").toString());
        String message = (String) payload.get("message");
        return ResponseEntity.ok(connectionService.sendRequest(senderId, receiverId, message));
    }

    @PostMapping("/accept/{requestId}")
    public ResponseEntity<Connection> acceptRequest(@PathVariable Long requestId) {
        return ResponseEntity.ok(connectionService.acceptRequest(requestId));
    }

    @PostMapping("/reject/{requestId}")
    public ResponseEntity<Void> rejectRequest(@PathVariable Long requestId) {
        connectionService.rejectRequest(requestId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/requests/{userId}")
    public ResponseEntity<List<ConnectionRequest>> getPendingRequests(@PathVariable Long userId) {
        return ResponseEntity.ok(connectionService.getPendingRequests(userId));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Connection>> getUserConnections(@PathVariable Long userId) {
        return ResponseEntity.ok(connectionService.getUserConnections(userId));
    }
}
