package com.skillmate.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatMessage {
    private Long id;
    private Long senderId;
    private Long receiverId;
    private Long connectionId;
    private String content;
    private LocalDateTime timestamp;
    private boolean isRead;
}
