package com.skillmate.controller;

import com.skillmate.entity.User;
import com.skillmate.entity.UserSkill.SkillType;
import com.skillmate.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    @GetMapping
    public ResponseEntity<?> getSkills(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(skillService.getMySkills(user.getId()));
    }

    @PostMapping
    public ResponseEntity<?> addSkill(@AuthenticationPrincipal User user,
                                       @RequestBody Map<String, String> body) {
        try {
            SkillType type = SkillType.valueOf(body.get("skillType").toUpperCase());
            return ResponseEntity.ok(skillService.addSkill(user, body.get("skillName"), type));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSkill(@AuthenticationPrincipal User user,
                                          @PathVariable Long id) {
        try {
            skillService.deleteSkill(id, user.getId());
            return ResponseEntity.ok(Map.of("message", "Skill deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
