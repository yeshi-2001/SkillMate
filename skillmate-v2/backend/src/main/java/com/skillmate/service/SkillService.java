package com.skillmate.service;

import com.skillmate.entity.*;
import com.skillmate.entity.UserSkill.SkillType;
import com.skillmate.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final UserSkillRepository userSkillRepository;
    private final SkillMatchRepository skillMatchRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public List<Map<String, Object>> getMySkills(Long userId) {
        return userSkillRepository.findByUserId(userId)
                .stream().map(this::toMap).toList();
    }

    @Transactional
    public Map<String, Object> addSkill(User user, String skillName, SkillType skillType) {
        UserSkill skill = UserSkill.builder()
                .user(user)
                .skillName(skillName.toLowerCase().trim())
                .skillType(skillType)
                .build();
        skill = userSkillRepository.save(skill);
        runMatchingAlgorithm(user);
        return toMap(skill);
    }

    @Transactional
    public void deleteSkill(Long skillId, Long userId) {
        UserSkill skill = userSkillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));
        if (!skill.getUser().getId().equals(userId))
            throw new RuntimeException("Unauthorized");
        userSkillRepository.delete(skill);
        runMatchingAlgorithm(skill.getUser());
    }

    // Matching Algorithm: mutual skill exchange
    private void runMatchingAlgorithm(User currentUser) {
        List<UserSkill> myLearning = userSkillRepository.findByUserIdAndSkillType(currentUser.getId(), SkillType.LEARNING);
        List<UserSkill> myKnown = userSkillRepository.findByUserIdAndSkillType(currentUser.getId(), SkillType.KNOWN);

        for (UserSkill learningSkill : myLearning) {
            // Find users who KNOW what I want to LEARN
            List<UserSkill> potentialTeachers = userSkillRepository
                    .findBySkillNameIgnoreCaseAndSkillType(learningSkill.getSkillName(), SkillType.KNOWN);

            for (UserSkill teacherSkill : potentialTeachers) {
                User otherUser = teacherSkill.getUser();
                if (otherUser.getId().equals(currentUser.getId())) continue;

                // Check if other user wants to LEARN something I KNOW
                boolean mutualMatch = myKnown.stream().anyMatch(myKnown1 ->
                        userSkillRepository.findByUserIdAndSkillType(otherUser.getId(), SkillType.LEARNING)
                                .stream().anyMatch(theirLearning ->
                                        theirLearning.getSkillName().equalsIgnoreCase(myKnown1.getSkillName()))
                );

                if (mutualMatch) {
                    // Create match if not exists
                    Optional<SkillMatch> existing = skillMatchRepository.findByUsers(currentUser.getId(), otherUser.getId());
                    if (existing.isEmpty()) {
                        SkillMatch match = SkillMatch.builder()
                                .user1(currentUser)
                                .user2(otherUser)
                                .status(SkillMatch.MatchStatus.ACTIVE)
                                .build();
                        skillMatchRepository.save(match);

                        // Notify both users
                        createAndPushNotification(currentUser, otherUser, "NEW_MATCH",
                                "You have a new skill match with " + otherUser.getFullName());
                        createAndPushNotification(otherUser, currentUser, "NEW_MATCH",
                                "You have a new skill match with " + currentUser.getFullName());
                    }
                }
            }
        }
    }

    private void createAndPushNotification(User recipient, User relatedUser, String type, String message) {
        Notification notification = Notification.builder()
                .user(recipient)
                .type(type)
                .message(message)
                .relatedUserId(relatedUser.getId())
                .build();
        notification = notificationRepository.save(notification);

        // Push via WebSocket
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("id", notification.getId());
        payload.put("type", notification.getType());
        payload.put("message", notification.getMessage());
        payload.put("relatedUserId", notification.getRelatedUserId());
        payload.put("createdAt", notification.getCreatedAt());

        messagingTemplate.convertAndSend("/topic/notifications/" + recipient.getId(), payload);
    }

    private Map<String, Object> toMap(UserSkill skill) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", skill.getId());
        map.put("skillName", skill.getSkillName());
        map.put("skillType", skill.getSkillType());
        map.put("createdAt", skill.getCreatedAt());
        return map;
    }
}
