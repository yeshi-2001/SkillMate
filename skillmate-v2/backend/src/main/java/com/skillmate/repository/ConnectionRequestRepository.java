package com.skillmate.repository;

import com.skillmate.entity.ConnectionRequest;
import com.skillmate.entity.ConnectionRequest.ConnectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ConnectionRequestRepository extends JpaRepository<ConnectionRequest, Long> {

    @Query("SELECT c FROM ConnectionRequest c WHERE (c.sender.id = :userId OR c.receiver.id = :userId) AND c.status = :status")
    List<ConnectionRequest> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") ConnectionStatus status);

    @Query("SELECT c FROM ConnectionRequest c WHERE (c.sender.id = :u1 AND c.receiver.id = :u2) OR (c.sender.id = :u2 AND c.receiver.id = :u1)")
    Optional<ConnectionRequest> findByUsers(@Param("u1") Long u1, @Param("u2") Long u2);

    List<ConnectionRequest> findByReceiverIdAndStatus(Long receiverId, ConnectionStatus status);
}
