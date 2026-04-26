package com.skillmate.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_skills_learn")
@Data
public class UserSkillLearn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    private String desiredLevel;

    @Column(length = 1000)
    private String goals;
}
