package tn.iset.rades.internship_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.iset.rades.internship_backend.entity.Skill;

import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    Optional<Skill> findByNameIgnoreCase(String name);
}
