package com.skillmate.repository;

import com.skillmate.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    @Query("SELECT m FROM ChatMessage m WHERE (m.sender.id = :u1 AND m.receiver.id = :u2) OR (m.sender.id = :u2 AND m.receiver.id = :u1) ORDER BY m.sentAt ASC")
    List<ChatMessage> findConversation(@Param("u1") Long u1, @Param("u2") Long u2);
}
