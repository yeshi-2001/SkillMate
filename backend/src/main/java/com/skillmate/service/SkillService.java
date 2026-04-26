package com.skillmate.service;

import com.skillmate.model.*;
import com.skillmate.dto.AddSkillRequest;
import com.skillmate.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SkillService {
    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private UserSkillTeachRepository userSkillTeachRepository;

    @Autowired
    private UserSkillLearnRepository userSkillLearnRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    public Skill createSkill(Skill skill) {
        // Check if skill already exists
        return skillRepository.findByName(skill.getName())
                .orElseGet(() -> skillRepository.save(skill));
    }

    public UserSkillTeach addTeachSkillFromRequest(Long userId, AddSkillRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Create or get skill
        Skill skill = skillRepository.findByName(request.getSkillName())
                .orElseGet(() -> {
                    Skill newSkill = new Skill();
                    newSkill.setName(request.getSkillName());
                    newSkill.setCategory(request.getCategory());
                    newSkill.setDescription(request.getDescription());
                    return skillRepository.save(newSkill);
                });
        
        UserSkillTeach teachSkill = new UserSkillTeach();
        teachSkill.setUser(user);
        teachSkill.setSkill(skill);
        teachSkill.setProficiencyLevel(request.getProficiencyLevel());
        teachSkill.setDescription(request.getDescription());
        
        return userSkillTeachRepository.save(teachSkill);
    }

    public UserSkillLearn addLearnSkillFromRequest(Long userId, AddSkillRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Create or get skill
        Skill skill = skillRepository.findByName(request.getSkillName())
                .orElseGet(() -> {
                    Skill newSkill = new Skill();
                    newSkill.setName(request.getSkillName());
                    newSkill.setCategory(request.getCategory());
                    newSkill.setDescription(request.getDescription());
                    return skillRepository.save(newSkill);
                });
        
        UserSkillLearn learnSkill = new UserSkillLearn();
        learnSkill.setUser(user);
        learnSkill.setSkill(skill);
        learnSkill.setDesiredLevel(request.getProficiencyLevel());
        learnSkill.setGoals(request.getDescription());
        
        return userSkillLearnRepository.save(learnSkill);
    }

    public UserSkillTeach addTeachSkill(Long userId, UserSkillTeach teachSkill) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        teachSkill.setUser(user);
        return userSkillTeachRepository.save(teachSkill);
    }

    public UserSkillLearn addLearnSkill(Long userId, UserSkillLearn learnSkill) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        learnSkill.setUser(user);
        return userSkillLearnRepository.save(learnSkill);
    }

    public List<UserSkillTeach> getUserTeachSkills(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userSkillTeachRepository.findByUser(user);
    }

    public List<UserSkillLearn> getUserLearnSkills(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userSkillLearnRepository.findByUser(user);
    }

    public void deleteTeachSkill(Long id) {
        userSkillTeachRepository.deleteById(id);
    }

    public void deleteLearnSkill(Long id) {
        userSkillLearnRepository.deleteById(id);
    }
}
