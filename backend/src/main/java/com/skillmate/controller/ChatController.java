package com.skillmate.controller;

import com.skillmate.dto.ChatMessage;
import com.skillmate.model.Message;
import com.skillmate.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Controller
public class ChatController {
    @Autowired
    private MessageService messageService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat")
    public void sendMessage(ChatMessage chatMessage) {
        Message message = messageService.sendMessage(
            chatMessage.getSenderId(),
            chatMessage.getReceiverId(),
            chatMessage.getConnectionId(),
            chatMessage.getContent()
        );

        ChatMessage response = new ChatMessage();
        response.setId(message.getId());
        response.setSenderId(message.getSender().getId());
        response.setReceiverId(message.getReceiver().getId());
        response.setConnectionId(message.getConnection().getId());
        response.setContent(message.getContent());
        response.setTimestamp(message.getTimestamp());
        response.setRead(message.isRead());

        messagingTemplate.convertAndSendToUser(
            chatMessage.getReceiverId().toString(),
            "/queue/messages",
            response
        );
    }

    @GetMapping("/api/messages/{connectionId}")
    @ResponseBody
    public List<Message> getMessages(@PathVariable Long connectionId) {
        return messageService.getConnectionMessages(connectionId);
    }
}
