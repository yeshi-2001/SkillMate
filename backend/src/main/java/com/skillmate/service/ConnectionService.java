package com.skillmate.service;

import com.skillmate.model.*;
import com.skillmate.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ConnectionService {
    @Autowired
    private ConnectionRequestRepository requestRepository;

    @Autowired
    private ConnectionRepository connectionRepository;

    @Autowired
    private UserRepository userRepository;

    public ConnectionRequest sendRequest(Long senderId, Long receiverId, String message) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        // Check if connection already exists
        Optional<Connection> existingConnection = connectionRepository
                .findConnectionBetweenUsers(sender, receiver);
        if (existingConnection.isPresent()) {
            throw new RuntimeException("Connection already exists between these users");
        }

        // Check if pending request already exists
        Optional<ConnectionRequest> existingRequest = requestRepository
                .findPendingRequestBetweenUsers(sender, receiver);
        if (existingRequest.isPresent()) {
            throw new RuntimeException("Connection request already pending");
        }

        ConnectionRequest request = new ConnectionRequest();
        request.setSender(sender);
        request.setReceiver(receiver);
        request.setStatus("PENDING");
        request.setMessage(message);
        
        return requestRepository.save(request);
    }

    public Connection acceptRequest(Long requestId) {
        ConnectionRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus("ACCEPTED");
        requestRepository.save(request);

        // Check if connection already exists between these users
        Optional<Connection> existingConnection = connectionRepository
                .findConnectionBetweenUsers(request.getSender(), request.getReceiver());
        
        if (existingConnection.isPresent()) {
            return existingConnection.get();
        }

        // Create new connection only if it doesn't exist
        Connection connection = new Connection();
        connection.setUser1(request.getSender());
        connection.setUser2(request.getReceiver());
        connection.setStatus("ACCEPTED");
        
        return connectionRepository.save(connection);
    }

    public void rejectRequest(Long requestId) {
        ConnectionRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus("REJECTED");
        requestRepository.save(request);
    }

    public List<ConnectionRequest> getPendingRequests(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return requestRepository.findByReceiverAndStatus(user, "PENDING");
    }

    public List<Connection> getUserConnections(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return connectionRepository.findActiveConnectionsByUser(user);
    }
}
