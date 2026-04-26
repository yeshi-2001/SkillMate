package com.skillmate.service;

import com.skillmate.model.*;
import com.skillmate.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.*;

@Service
public class MatchingService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSkillTeachRepository teachRepository;

    @Autowired
    private UserSkillLearnRepository learnRepository;

    @Value("${groq.api.key}")
    private String groqApiKey;

    @Value("${groq.api.url}")
    private String groqApiUrl;

    @Value("${groq.model}")
    private String groqModel;

    public List<Map<String, Object>> findMatches(Long userId) {
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<UserSkillLearn> userLearnSkills = learnRepository.findByUser(currentUser);
        List<User> allUsers = userRepository.findAll();
        List<Map<String, Object>> matches = new ArrayList<>();

        for (User candidate : allUsers) {
            if (candidate.getId().equals(userId)) continue;

            List<UserSkillTeach> candidateTeachSkills = teachRepository.findByUser(candidate);
            
            // Calculate basic match score
            int matchScore = calculateMatchScore(userLearnSkills, candidateTeachSkills);
            List<String> matchingSkills = getMatchingSkills(userLearnSkills, candidateTeachSkills);

            // Try to enhance with AI if API key is available
            if (groqApiKey != null && !groqApiKey.equals("your-groq-api-key-here") && matchScore > 0) {
                try {
                    int aiScore = getAIMatchScore(userLearnSkills, candidateTeachSkills);
                    matchScore = (matchScore + aiScore) / 2; // Average of basic and AI score
                } catch (Exception e) {
                    System.out.println("AI matching failed, using basic score: " + e.getMessage());
                }
            }

            if (matchScore > 0) {
                Map<String, Object> match = new HashMap<>();
                match.put("userId", candidate.getId());
                match.put("name", candidate.getName());
                match.put("email", candidate.getEmail());
                match.put("bio", candidate.getBio());
                match.put("matchScore", matchScore);
                match.put("matchingSkills", matchingSkills);
                matches.add(match);
            }
        }

        matches.sort((a, b) -> ((Integer) b.get("matchScore")).compareTo((Integer) a.get("matchScore")));
        return matches;
    }

    private int calculateMatchScore(List<UserSkillLearn> learnSkills, List<UserSkillTeach> teachSkills) {
        int score = 0;
        for (UserSkillLearn learn : learnSkills) {
            for (UserSkillTeach teach : teachSkills) {
                if (learn.getSkill().getName().equalsIgnoreCase(teach.getSkill().getName())) {
                    score += 40;
                } else if (learn.getSkill().getCategory() != null && 
                          teach.getSkill().getCategory() != null &&
                          learn.getSkill().getCategory().equals(teach.getSkill().getCategory())) {
                    score += 15;
                }
            }
        }
        return Math.min(score, 100);
    }

    private List<String> getMatchingSkills(List<UserSkillLearn> learnSkills, List<UserSkillTeach> teachSkills) {
        List<String> matching = new ArrayList<>();
        for (UserSkillLearn learn : learnSkills) {
            for (UserSkillTeach teach : teachSkills) {
                if (learn.getSkill().getName().equalsIgnoreCase(teach.getSkill().getName())) {
                    matching.add(learn.getSkill().getName());
                }
            }
        }
        return matching;
    }

    private int getAIMatchScore(List<UserSkillLearn> learnSkills, List<UserSkillTeach> teachSkills) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqApiKey);

            // Build skill descriptions
            StringBuilder learnDesc = new StringBuilder();
            for (UserSkillLearn skill : learnSkills) {
                learnDesc.append(skill.getSkill().getName())
                        .append(" (").append(skill.getDesiredLevel()).append("), ");
            }

            StringBuilder teachDesc = new StringBuilder();
            for (UserSkillTeach skill : teachSkills) {
                teachDesc.append(skill.getSkill().getName())
                        .append(" (").append(skill.getProficiencyLevel()).append("), ");
            }

            String prompt = String.format(
                "Analyze skill compatibility between two users. User A wants to learn: %s. User B can teach: %s. " +
                "Rate their compatibility from 0-100 based on skill overlap, complementary skills, and learning potential. " +
                "Respond with ONLY a number between 0 and 100, nothing else.",
                learnDesc.toString(), teachDesc.toString()
            );

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", groqModel);
            
            List<Map<String, String>> messages = new ArrayList<>();
            Map<String, String> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);
            messages.add(message);
            
            requestBody.put("messages", messages);
            requestBody.put("temperature", 0.3);
            requestBody.put("max_tokens", 10);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(groqApiUrl, request, String.class);

            // Parse response
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            String content = root.path("choices").get(0).path("message").path("content").asText();
            
            // Extract number from response
            String numberStr = content.replaceAll("[^0-9]", "");
            if (!numberStr.isEmpty()) {
                int score = Integer.parseInt(numberStr);
                return Math.min(Math.max(score, 0), 100);
            }
        } catch (Exception e) {
            System.err.println("Error calling Groq API: " + e.getMessage());
        }
        return 0;
    }
}
