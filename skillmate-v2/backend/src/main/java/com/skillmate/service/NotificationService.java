package com.skillmate.service;

import com.skillmate.entity.Notification;
import com.skillmate.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public List<Map<String, Object>> getAll(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toMap).toList();
    }

    @Transactional
    public Map<String, Object> markRead(Long notifId, Long userId) {
        Notification n = notificationRepository.findById(notifId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!n.getUser().getId().equals(userId))
            throw new RuntimeException("Unauthorized");
        n.setRead(true);
        return toMap(notificationRepository.save(n));
    }

    @Transactional
    public void markAllRead(Long userId) {
        notificationRepository.markAllReadByUserId(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    private Map<String, Object> toMap(Notification n) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", n.getId());
        map.put("type", n.getType());
        map.put("message", n.getMessage());
        map.put("isRead", n.isRead());
        map.put("relatedUserId", n.getRelatedUserId());
        map.put("createdAt", n.getCreatedAt());
        return map;
    }
}
