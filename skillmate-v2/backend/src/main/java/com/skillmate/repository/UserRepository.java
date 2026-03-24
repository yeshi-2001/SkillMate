package com.skillmate.repository;

import com.skillmate.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    @Query("SELECT DISTINCT u FROM User u JOIN u.skills s WHERE LOWER(s.skillName) LIKE LOWER(CONCAT('%', :skill, '%'))")
    List<User> findBySkillName(@Param("skill") String skill);
}
