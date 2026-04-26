package com.skillmate.repository;

import com.skillmate.model.UserSkillTeach;
import com.skillmate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserSkillTeachRepository extends JpaRepository<UserSkillTeach, Long> {
    List<UserSkillTeach> findByUser(User user);
}
