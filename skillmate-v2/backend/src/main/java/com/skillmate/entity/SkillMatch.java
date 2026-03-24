package com.skillmate.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "skill_matches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user1_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user2_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user2;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private MatchStatus status = MatchStatus.PENDING;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum MatchStatus {
        PENDING, ACTIVE
    }
}
