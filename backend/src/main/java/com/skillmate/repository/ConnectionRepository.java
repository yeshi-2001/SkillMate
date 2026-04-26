package com.skillmate.repository;

import com.skillmate.model.Connection;
import com.skillmate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    @Query("SELECT c FROM Connection c WHERE (c.user1 = ?1 OR c.user2 = ?1) AND c.status = 'ACCEPTED'")
    List<Connection> findActiveConnectionsByUser(User user);
    
    @Query("SELECT c FROM Connection c WHERE ((c.user1 = ?1 AND c.user2 = ?2) OR (c.user1 = ?2 AND c.user2 = ?1)) AND c.status = 'ACCEPTED'")
    Optional<Connection> findConnectionBetweenUsers(User user1, User user2);
}
