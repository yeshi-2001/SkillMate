package com.skillmate.service;

import com.skillmate.entity.User;
import com.skillmate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public Map<String, Object> getProfile(User user) {
        return toMap(user);
    }

    public Map<String, Object> updateProfile(User user, String fullName, String bio) {
        if (fullName != null) user.setFullName(fullName);
        if (bio != null) user.setBio(bio);
        return toMap(userRepository.save(user));
    }

    public Map<String, Object> updateAvatar(User user, String avatarUrl) {
        user.setAvatarUrl(avatarUrl);
        return toMap(userRepository.save(user));
    }

    public Map<String, Object> getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toPublicMap(user);
    }

    public List<Map<String, Object>> searchBySkill(String skill) {
        return userRepository.findBySkillName(skill)
                .stream().map(this::toPublicMap).toList();
    }

    public Map<String, Object> toMap(User user) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", user.getId());
        map.put("username", user.getUsername());
        map.put("email", user.getEmail());
        map.put("fullName", user.getFullName());
        map.put("bio", user.getBio());
        map.put("avatarUrl", user.getAvatarUrl());
        map.put("isOnline", user.isOnline());
        map.put("lastSeen", user.getLastSeen());
        map.put("createdAt", user.getCreatedAt());
        return map;
    }

    public Map<String, Object> toPublicMap(User user) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", user.getId());
        map.put("username", user.getUsername());
        map.put("fullName", user.getFullName());
        map.put("bio", user.getBio());
        map.put("avatarUrl", user.getAvatarUrl());
        map.put("isOnline", user.isOnline());
        return map;
    }
}
