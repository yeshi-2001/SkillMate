package com.skillmate.service;

import com.skillmate.entity.*;
import com.skillmate.entity.ConnectionRequest.ConnectionStatus;
import com.skillmate.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final SkillMatchRepository skillMatchRepository;
    private final UserService userService;

    public List<Map<String, Object>> getMyMatches(Long userId) {
        return skillMatchRepository.findAllByUserId(userId).stream().map(match -> {
            User matchedUser = match.getUser1().getId().equals(userId) ? match.getUser2() : match.getUser1();
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", match.getId());
            map.put("matchedUser", userService.toPublicMap(matchedUser));
            map.put("status", match.getStatus());
            map.put("createdAt", match.getCreatedAt());
            return map;
        }).toList();
    }
}
