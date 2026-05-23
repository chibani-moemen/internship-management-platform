package tn.iset.rades.internship_backend.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import tn.iset.rades.internship_backend.dto.UpdateSkillsDto;
import tn.iset.rades.internship_backend.entity.Skill;
import tn.iset.rades.internship_backend.entity.Student;
import tn.iset.rades.internship_backend.repository.SkillRepository;
import tn.iset.rades.internship_backend.repository.StudentRepository;

import java.net.URI;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:4200")
public class StudentController {

    private final StudentRepository studentRepository;
    private final SkillRepository skillRepository;

    public StudentController(StudentRepository studentRepository, SkillRepository skillRepository) {
        this.studentRepository = studentRepository;
        this.skillRepository = skillRepository;
    }

    @GetMapping
    public List<Student> getAll() {
        return studentRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getById(@PathVariable Long id) {
        return studentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Student student) {
        student.setId(null);

        if (studentRepository.findByEmail(student.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        Student saved = studentRepository.save(student);
        return ResponseEntity.created(URI.create("/api/students/" + saved.getId())).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @Valid @RequestBody Student body) {

        return studentRepository.findById(id)
                .map(existing -> {
                    existing.setFirstName(body.getFirstName());
                    existing.setLastName(body.getLastName());
                    existing.setEmail(body.getEmail());

                    if (body.getPassword() != null && !body.getPassword().trim().isEmpty()) {
                        existing.setPassword(body.getPassword());
                    }

                    Student saved = studentRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ UPDATE STUDENT SKILLS
    @PutMapping("/{id}/skills")
    public ResponseEntity<?> updateSkills(@PathVariable Long id, @Valid @RequestBody UpdateSkillsDto dto) {

        Student student = studentRepository.findById(id).orElse(null);
        if (student == null) return ResponseEntity.notFound().build();

        List<Skill> skills = skillRepository.findAllById(dto.getSkillIds());
        if (skills.size() != dto.getSkillIds().size()) {
            return ResponseEntity.badRequest().body("Some skills not found");
        }

        Set<Skill> set = new HashSet<>(skills);
        student.setSkills(set);

        return ResponseEntity.ok(studentRepository.save(student));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!studentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        studentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
