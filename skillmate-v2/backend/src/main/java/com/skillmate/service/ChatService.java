package com.skillmate.service;

import com.skillmate.entity.*;
import com.skillmate.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final ConnectionService connectionService;
    private final SimpMessagingTemplate messagingTemplate;

    public List<Map<String, Object>> getHistory(Long userId, Long otherId) {
        return chatMessageRepository.findConversation(userId, otherId)
                .stream().map(this::toMap).toList();
    }

    public Map<String, Object> sendMessage(User sender, Long receiverId, String content) {
        if (!connectionService.areConnected(sender.getId(), receiverId))
            throw new RuntimeException("You can only chat with connected users");

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ChatMessage message = ChatMessage.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .build();
        message = chatMessageRepository.save(message);

        Map<String, Object> payload = toMap(message);

        // Push to receiver via WebSocket
        messagingTemplate.convertAndSend("/topic/messages/" + receiverId, payload);

        return payload;
    }

    private Map<String, Object> toMap(ChatMessage msg) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", msg.getId());
        map.put("senderId", msg.getSender().getId());
        map.put("senderUsername", msg.getSender().getUsername());
        map.put("receiverId", msg.getReceiver().getId());
        map.put("content", msg.getContent());
        map.put("isRead", msg.isRead());
        map.put("sentAt", msg.getSentAt());
        return map;
    }
}
