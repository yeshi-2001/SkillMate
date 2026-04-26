package com.skillmate.repository;

import com.skillmate.model.ConnectionRequest;
import com.skillmate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRequestRepository extends JpaRepository<ConnectionRequest, Long> {
    List<ConnectionRequest> findByReceiverAndStatus(User receiver, String status);
    List<ConnectionRequest> findBySenderAndStatus(User sender, String status);
    
    @Query("SELECT cr FROM ConnectionRequest cr WHERE ((cr.sender = ?1 AND cr.receiver = ?2) OR (cr.sender = ?2 AND cr.receiver = ?1)) AND cr.status = 'PENDING'")
    Optional<ConnectionRequest> findPendingRequestBetweenUsers(User user1, User user2);
}
