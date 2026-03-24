package com.skillmate.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User receiver;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "is_read")
    @Builder.Default
    private boolean isRead = false;

    @Column(name = "sent_at")
    @Builder.Default
    private LocalDateTime sentAt = LocalDateTime.now();
}
