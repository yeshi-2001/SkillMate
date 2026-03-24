package com.skillmate.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_skills")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    @Column(name = "skill_name", nullable = false)
    private String skillName;

    @Enumerated(EnumType.STRING)
    @Column(name = "skill_type", nullable = false)
    private SkillType skillType;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum SkillType {
        KNOWN, LEARNING
    }
}
