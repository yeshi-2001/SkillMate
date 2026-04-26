package com.skillmate.repository;

import com.skillmate.model.UserSkillLearn;
import com.skillmate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserSkillLearnRepository extends JpaRepository<UserSkillLearn, Long> {
    List<UserSkillLearn> findByUser(User user);
}
