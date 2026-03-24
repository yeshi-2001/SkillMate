package com.skillmate.repository;

import com.skillmate.entity.UserSkill;
import com.skillmate.entity.UserSkill.SkillType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
    List<UserSkill> findByUserId(Long userId);
    List<UserSkill> findByUserIdAndSkillType(Long userId, SkillType skillType);
    List<UserSkill> findBySkillNameIgnoreCaseAndSkillType(String skillName, SkillType skillType);
}
