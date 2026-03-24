package com.skillmate.repository;

import com.skillmate.entity.SkillMatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface SkillMatchRepository extends JpaRepository<SkillMatch, Long> {

    @Query("SELECT m FROM SkillMatch m WHERE m.user1.id = :userId OR m.user2.id = :userId")
    List<SkillMatch> findAllByUserId(@Param("userId") Long userId);

    @Query("SELECT m FROM SkillMatch m WHERE (m.user1.id = :u1 AND m.user2.id = :u2) OR (m.user1.id = :u2 AND m.user2.id = :u1)")
    Optional<SkillMatch> findByUsers(@Param("u1") Long u1, @Param("u2") Long u2);
}
