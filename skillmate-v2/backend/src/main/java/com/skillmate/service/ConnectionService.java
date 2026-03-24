package com.skillmate.service;

import com.skillmate.entity.*;
import com.skillmate.entity.ConnectionRequest.ConnectionStatus;
import com.skillmate.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ConnectionService {

    private final ConnectionRequestRepository connectionRequestRepository;
    private final UserRepository userRepository;
    private final SkillMatchRepository skillMatchRepository;
    private final UserService userService;

    @Transactional
    public Map<String, Object> sendRequest(User sender, Long receiverId) {
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Must be matched first
        skillMatchRepository.findByUsers(sender.getId(), receiverId)
                .orElseThrow(() -> new RuntimeException("You can only connect with matched users"));

        // Check if request already exists
        connectionRequestRepository.findByUsers(sender.getId(), receiverId).ifPresent(r -> {
            throw new RuntimeException("Connection request already exists");
        });

        ConnectionRequest request = ConnectionRequest.builder()
                .sender(sender)
                .receiver(receiver)
                .build();
        request = connectionRequestRepository.save(request);

        return toMap(request, userService.toPublicMap(receiver));
    }

    @Transactional
    public Map<String, Object> respondToRequest(Long requestId, User currentUser, ConnectionStatus status) {
        ConnectionRequest request = connectionRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!request.getReceiver().getId().equals(currentUser.getId()))
            throw new RuntimeException("Unauthorized");

        request.setStatus(status);
        request = connectionRequestRepository.save(request);
        return toMap(request, userService.toPublicMap(request.getSender()));
    }

    public List<Map<String, Object>> getConnections(Long userId) {
        return connectionRequestRepository.findByUserIdAndStatus(userId, ConnectionStatus.ACCEPTED)
                .stream().map(req -> {
                    User other = req.getSender().getId().equals(userId) ? req.getReceiver() : req.getSender();
                    return toMap(req, userService.toPublicMap(other));
                }).toList();
    }

    public boolean areConnected(Long u1, Long u2) {
        return connectionRequestRepository.findByUsers(u1, u2)
                .map(r -> r.getStatus() == ConnectionStatus.ACCEPTED)
                .orElse(false);
    }

    private Map<String, Object> toMap(ConnectionRequest req, Map<String, Object> userMap) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", req.getId());
        map.put("user", userMap);
        map.put("status", req.getStatus());
        map.put("createdAt", req.getCreatedAt());
        return map;
    }
}
