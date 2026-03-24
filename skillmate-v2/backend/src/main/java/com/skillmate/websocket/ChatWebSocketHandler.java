package com.skillmate.websocket;

import com.skillmate.entity.User;
import com.skillmate.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketHandler {

    private final ChatService chatService;

    @MessageMapping("/chat.send")
    public void handleMessage(@Payload Map<String, Object> payload, Authentication auth) {
        User sender = (User) auth.getPrincipal();
        Long receiverId = Long.valueOf(payload.get("receiverId").toString());
        String content = payload.get("content").toString();
        chatService.sendMessage(sender, receiverId, content);
    }
}
