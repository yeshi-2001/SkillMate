package com.skillmate.dto;

import com.skillmate.entity.UserSkill.SkillType;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

// ─── Auth DTOs ───────────────────────────────────────────────────────────────

@Data
class RegisterRequest {
    @NotBlank private String username;
    @NotBlank @Email private String email;
    @NotBlank @Size(min = 6) private String password;
    @NotBlank private String fullName;
}

@Data
class LoginRequest {
    @NotBlank private String email;
    @NotBlank private String password;
}

@Data
class AuthResponse {
    private String token;
    private UserResponse user;

    public AuthResponse(String token, UserResponse user) {
        this.token = token;
        this.user = user;
    }
}

// ─── User DTOs ────────────────────────────────────────────────────────────────

@Data
class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String bio;
    private String avatarUrl;
    private boolean isOnline;
    private LocalDateTime lastSeen;
    private LocalDateTime createdAt;
    private List<SkillResponse> skills;
}

@Data
class UpdateProfileRequest {
    private String fullName;
    private String bio;
}

// ─── Skill DTOs ───────────────────────────────────────────────────────────────

@Data
class SkillRequest {
    @NotBlank private String skillName;
    @NotNull private SkillType skillType;
}

@Data
class SkillResponse {
    private Long id;
    private String skillName;
    private SkillType skillType;
    private LocalDateTime createdAt;
}

// ─── Match DTOs ───────────────────────────────────────────────────────────────

@Data
class MatchResponse {
    private Long id;
    private UserResponse matchedUser;
    private String status;
    private LocalDateTime createdAt;
}

// ─── Connection DTOs ──────────────────────────────────────────────────────────

@Data
class ConnectionResponse {
    private Long id;
    private UserResponse user;
    private String status;
    private LocalDateTime createdAt;
}

// ─── Chat DTOs ────────────────────────────────────────────────────────────────

@Data
class ChatMessageRequest {
    @NotBlank private String content;
    @NotNull private Long receiverId;
}

@Data
class ChatMessageResponse {
    private Long id;
    private Long senderId;
    private String senderUsername;
    private Long receiverId;
    private String content;
    private boolean isRead;
    private LocalDateTime sentAt;
}

// ─── Notification DTOs ────────────────────────────────────────────────────────

@Data
class NotificationResponse {
    private Long id;
    private String type;
    private String message;
    private boolean isRead;
    private Long relatedUserId;
    private LocalDateTime createdAt;
}
