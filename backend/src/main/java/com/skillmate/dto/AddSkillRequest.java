package com.skillmate.dto;

import lombok.Data;

@Data
public class AddSkillRequest {
    private String skillName;
    private String category;
    private String proficiencyLevel;
    private String description;
}
