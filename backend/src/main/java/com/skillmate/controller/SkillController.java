package com.skillmate.controller;

import com.skillmate.model.*;
import com.skillmate.dto.AddSkillRequest;
import com.skillmate.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {
    @Autowired
    private SkillService skillService;

    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills() {
        return ResponseEntity.ok(skillService.getAllSkills());
    }

    @PostMapping
    public ResponseEntity<Skill> createSkill(@RequestBody Skill skill) {
        return ResponseEntity.ok(skillService.createSkill(skill));
    }

    @PostMapping("/teach/{userId}")
    public ResponseEntity<UserSkillTeach> addTeachSkill(@PathVariable Long userId, @RequestBody AddSkillRequest request) {
        return ResponseEntity.ok(skillService.addTeachSkillFromRequest(userId, request));
    }

    @PostMapping("/learn/{userId}")
    public ResponseEntity<UserSkillLearn> addLearnSkill(@PathVariable Long userId, @RequestBody AddSkillRequest request) {
        return ResponseEntity.ok(skillService.addLearnSkillFromRequest(userId, request));
    }

    @GetMapping("/teach/{userId}")
    public ResponseEntity<List<UserSkillTeach>> getUserTeachSkills(@PathVariable Long userId) {
        return ResponseEntity.ok(skillService.getUserTeachSkills(userId));
    }

    @GetMapping("/learn/{userId}")
    public ResponseEntity<List<UserSkillLearn>> getUserLearnSkills(@PathVariable Long userId) {
        return ResponseEntity.ok(skillService.getUserLearnSkills(userId));
    }

    @DeleteMapping("/teach/{id}")
    public ResponseEntity<Void> deleteTeachSkill(@PathVariable Long id) {
        skillService.deleteTeachSkill(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/learn/{id}")
    public ResponseEntity<Void> deleteLearnSkill(@PathVariable Long id) {
        skillService.deleteLearnSkill(id);
        return ResponseEntity.ok().build();
    }
}
