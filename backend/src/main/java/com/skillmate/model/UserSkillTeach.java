package com.skillmate.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_skills_teach")
@Data
public class UserSkillTeach {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(nullable = false)
    private String proficiencyLevel;

    @Column(length = 1000)
    private String description;

    private Integer yearsOfExperience;
}
