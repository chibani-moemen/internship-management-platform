package tn.iset.rades.internship_backend.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import tn.iset.rades.internship_backend.dto.InternshipCreateDto;
import tn.iset.rades.internship_backend.entity.Company;
import tn.iset.rades.internship_backend.entity.Internship;
import tn.iset.rades.internship_backend.entity.Student;
import tn.iset.rades.internship_backend.repository.CompanyRepository;
import tn.iset.rades.internship_backend.repository.InternshipRepository;
import tn.iset.rades.internship_backend.repository.StudentRepository;

@RestController
@RequestMapping("/api/internships")
@CrossOrigin(origins = "*")
public class InternshipController {

    private final InternshipRepository internshipRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;

    public InternshipController(InternshipRepository internshipRepository,
                                StudentRepository studentRepository,
                                CompanyRepository companyRepository) {
        this.internshipRepository = internshipRepository;
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
    }

    // ✅ GET ALL internships
    @GetMapping
    public List<Internship> getAllInternships() {
        return internshipRepository.findAll();
    }

    // ✅ GET internship by ID (200 / 404)
    @GetMapping("/{id}")
    public ResponseEntity<Internship> getInternshipById(@PathVariable Long id) {
        return internshipRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ POST internship (with studentId + companyId)
    @PostMapping
    public ResponseEntity<?> addInternship(@Valid @RequestBody InternshipCreateDto request) {

        // ✅ Date validation
        if (request.getEndDate().isBefore(request.getStartDate())) {
            return ResponseEntity.badRequest().body("endDate must be after startDate");
        }

        // ✅ Overlap validation (CREATE)
        if (internshipRepository.existsOverlappingForStudent(
                request.getStudentId(),
                request.getStartDate(),
                request.getEndDate()
        )) {
            return ResponseEntity.badRequest().body("Student already has an internship in this period");
        }

        Student student = studentRepository.findById(request.getStudentId()).orElse(null);
        if (student == null) {
            return ResponseEntity.badRequest().body("Student not found with id: " + request.getStudentId());
        }

        Company company = companyRepository.findById(request.getCompanyId()).orElse(null);
        if (company == null) {
            return ResponseEntity.badRequest().body("Company not found with id: " + request.getCompanyId());
        }

        Internship internship = new Internship();
        internship.setTitle(request.getTitle());
        internship.setDescription(request.getDescription());
        internship.setStartDate(request.getStartDate());
        internship.setEndDate(request.getEndDate());
        internship.setStudent(student);
        internship.setCompany(company);

        Internship saved = internshipRepository.save(internship);
        return ResponseEntity.ok(saved);
    }

    // ✅ PUT update internship (200 / 404)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateInternship(@PathVariable Long id, @Valid @RequestBody InternshipCreateDto request) {

        Internship existing = internshipRepository.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }

        // ✅ Date validation
        if (request.getEndDate().isBefore(request.getStartDate())) {
            return ResponseEntity.badRequest().body("endDate must be after startDate");
        }

        // ✅ Overlap validation (UPDATE) - نستثنيو internship الحالية
        if (internshipRepository.existsOverlappingForStudentExceptThis(
                request.getStudentId(),
                id,
                request.getStartDate(),
                request.getEndDate()
        )) {
            return ResponseEntity.badRequest().body("Student already has an internship in this period");
        }

        Student student = studentRepository.findById(request.getStudentId()).orElse(null);
        if (student == null) {
            return ResponseEntity.badRequest().body("Student not found with id: " + request.getStudentId());
        }

        Company company = companyRepository.findById(request.getCompanyId()).orElse(null);
        if (company == null) {
            return ResponseEntity.badRequest().body("Company not found with id: " + request.getCompanyId());
        }

        existing.setTitle(request.getTitle());
        existing.setDescription(request.getDescription());
        existing.setStartDate(request.getStartDate());
        existing.setEndDate(request.getEndDate());
        existing.setStudent(student);
        existing.setCompany(company);

        Internship updated = internshipRepository.save(existing);
        return ResponseEntity.ok(updated);
    }

    // ✅ DELETE internship (204 / 404)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInternship(@PathVariable Long id) {
        if (!internshipRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        internshipRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
