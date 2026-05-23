package tn.iset.rades.internship_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.iset.rades.internship_backend.entity.Skill;
import tn.iset.rades.internship_backend.repository.SkillRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = "*")
public class SkillController {

    private final SkillRepository repo;

    public SkillController(SkillRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Skill> all() {
        return repo.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Skill skill) {
        if (skill.getName() == null || skill.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Skill name is required");
        }

        int w = skill.getWeight();
        if (w != 1 && w != 2) {
            return ResponseEntity.badRequest().body("weight must be 1 or 2");
        }

        String cleanName = skill.getName().trim();

        if (repo.findByNameIgnoreCase(cleanName).isPresent()) {
            return ResponseEntity.badRequest().body("Skill already exists");
        }

        skill.setName(cleanName);
        return ResponseEntity.ok(repo.save(skill));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Skill body) {
        Optional<Skill> optionalSkill = repo.findById(id);

        if (optionalSkill.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (body.getName() == null || body.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Skill name is required");
        }

        int w = body.getWeight();
        if (w != 1 && w != 2) {
            return ResponseEntity.badRequest().body("weight must be 1 or 2");
        }

        String cleanName = body.getName().trim();

        Optional<Skill> existingByName = repo.findByNameIgnoreCase(cleanName);
        if (existingByName.isPresent() && !existingByName.get().getId().equals(id)) {
            return ResponseEntity.badRequest().body("Skill already exists");
        }

        Skill skill = optionalSkill.get();
        skill.setName(cleanName);
        skill.setWeight(w);

        return ResponseEntity.ok(repo.save(skill));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<Skill> optionalSkill = repo.findById(id);

        if (optionalSkill.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        repo.deleteById(id);
        return ResponseEntity.ok("Skill deleted successfully");
    }
}