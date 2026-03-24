package com.skillmate.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "connection_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConnectionRequest {

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

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ConnectionStatus status = ConnectionStatus.PENDING;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum ConnectionStatus {
        PENDING, ACCEPTED, REJECTED
    }
}
