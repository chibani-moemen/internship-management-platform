package tn.iset.rades.internship_backend.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import tn.iset.rades.internship_backend.dto.CompanyMatchDto;
import tn.iset.rades.internship_backend.dto.UpdateSkillsDto;
import tn.iset.rades.internship_backend.entity.Company;
import tn.iset.rades.internship_backend.entity.Skill;
import tn.iset.rades.internship_backend.entity.Student;
import tn.iset.rades.internship_backend.repository.CompanyRepository;
import tn.iset.rades.internship_backend.repository.SkillRepository;
import tn.iset.rades.internship_backend.repository.StudentRepository;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/companies")
@CrossOrigin(origins = "*")
public class CompanyController {

    private final CompanyRepository companyRepository;
    private final SkillRepository skillRepository;
    private final StudentRepository studentRepository;

    public CompanyController(CompanyRepository companyRepository,
                             SkillRepository skillRepository,
                             StudentRepository studentRepository) {
        this.companyRepository = companyRepository;
        this.skillRepository = skillRepository;
        this.studentRepository = studentRepository;
    }

    // ✅ GET all companies
    @GetMapping
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    // ✅ GET company by id
    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompanyById(@PathVariable Long id) {
        return companyRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ POST create company (register)
    @PostMapping
    public ResponseEntity<?> addCompany(@Valid @RequestBody Company company) {
        company.setId(null);

        if (companyRepository.findByEmail(company.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        Company savedCompany = companyRepository.save(company);
        return ResponseEntity.ok(savedCompany);
    }

    // ✅ PUT update company (password يتبدّل كان تبعث واحد جديد)
    @PutMapping("/{id}")
    public ResponseEntity<Company> updateCompany(@PathVariable Long id, @Valid @RequestBody Company body) {

        return companyRepository.findById(id).map(existing -> {

            existing.setName(body.getName());
            existing.setAddress(body.getAddress());
            existing.setEmail(body.getEmail());

            if (body.getPassword() != null && !body.getPassword().trim().isEmpty()) {
                existing.setPassword(body.getPassword());
            }

            Company updated = companyRepository.save(existing);
            return ResponseEntity.ok(updated);

        }).orElse(ResponseEntity.notFound().build());
    }

    // ✅ UPDATE COMPANY REQUIRED SKILLS
    @PutMapping("/{id}/skills")
    public ResponseEntity<?> updateRequiredSkills(@PathVariable Long id, @Valid @RequestBody UpdateSkillsDto dto) {

        Company company = companyRepository.findById(id).orElse(null);
        if (company == null) return ResponseEntity.notFound().build();

        List<Skill> skills = skillRepository.findAllById(dto.getSkillIds());
        if (skills.size() != dto.getSkillIds().size()) {
            return ResponseEntity.badRequest().body("Some skills not found");
        }

        Set<Skill> set = new HashSet<>(skills);
        company.setRequiredSkills(set);

        return ResponseEntity.ok(companyRepository.save(company));
    }

    // ✅ MATCH COMPANIES FOR A STUDENT (percentage + sorting)
    @GetMapping("/match/{studentId}")
    public ResponseEntity<?> matchCompanies(@PathVariable Long studentId) {

        Student student = studentRepository.findById(studentId).orElse(null);
        if (student == null) return ResponseEntity.notFound().build();

        Set<Skill> studentSkills = student.getSkills();
        List<Company> companies = companyRepository.findAll();

        List<CompanyMatchDto> result = companies.stream().map(company -> {

            Set<Skill> required = company.getRequiredSkills();

            int totalWeight = required.stream().mapToInt(Skill::getWeight).sum();
            if (totalWeight == 0) {
                return new CompanyMatchDto(
                        company.getId(),
                        company.getName(),
                        company.getEmail(),
                        company.getAddress(),
                        0,
                        List.of()
                );
            }

            List<Skill> matching = required.stream()
                    .filter(reqSkill ->
                            studentSkills.stream().anyMatch(s -> s.getId().equals(reqSkill.getId()))
                    )
                    .collect(Collectors.toList());

            int matchedWeight = matching.stream().mapToInt(Skill::getWeight).sum();
            int score = (int) Math.round((matchedWeight * 100.0) / totalWeight);

            List<String> matchingNames = matching.stream()
                    .map(Skill::getName)
                    .toList();

            return new CompanyMatchDto(
                    company.getId(),
                    company.getName(),
                    company.getEmail(),
                    company.getAddress(),
                    score,
                    matchingNames
            );

        }).sorted(Comparator.comparingInt(CompanyMatchDto::getScore).reversed())
          .toList();

        return ResponseEntity.ok(result);
    }

    // ✅ DELETE company
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompany(@PathVariable Long id) {
        if (!companyRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        companyRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
