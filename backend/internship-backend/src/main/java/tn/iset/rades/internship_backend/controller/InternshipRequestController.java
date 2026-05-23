package tn.iset.rades.internship_backend.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import tn.iset.rades.internship_backend.dto.RequestCreateDto;
import tn.iset.rades.internship_backend.entity.Company;
import tn.iset.rades.internship_backend.entity.Student;
import tn.iset.rades.internship_backend.model.InternshipRequest;
import tn.iset.rades.internship_backend.model.RequestStatus;
import tn.iset.rades.internship_backend.repository.CompanyRepository;
import tn.iset.rades.internship_backend.repository.StudentRepository;
import tn.iset.rades.internship_backend.repository.InternshipRequestRepository;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class InternshipRequestController {

    private final InternshipRequestRepository requestRepo;
    private final StudentRepository studentRepo;
    private final CompanyRepository companyRepo;

    public InternshipRequestController(InternshipRequestRepository requestRepo,
                                       StudentRepository studentRepo,
                                       CompanyRepository companyRepo) {
        this.requestRepo = requestRepo;
        this.studentRepo = studentRepo;
        this.companyRepo = companyRepo;
    }

    // ✅ (Admin) GET ALL requests
    @GetMapping
    public List<InternshipRequest> getAll() {
        return requestRepo.findAll();
    }

    // ✅ (Admin) GET requests by status: PENDING / COMPANY_ACCEPTED / ...
    @GetMapping("/status/{status}")
    public List<InternshipRequest> getByStatus(@PathVariable RequestStatus status) {
        return requestRepo.findByStatus(status);
    }

    // ✅ Student يبعث request
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InternshipRequest create(@Valid @RequestBody RequestCreateDto dto) {

        Student student = studentRepo.findById(dto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Company company = companyRepo.findById(dto.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // يمنع دوبليكاشن لنفس الشركة و الطالب وهو مازال PENDING
        requestRepo.findByStudentIdAndCompanyIdAndStatus(dto.getStudentId(), dto.getCompanyId(), RequestStatus.PENDING)
                .ifPresent(r -> { throw new RuntimeException("Request already exists (PENDING)"); });

        return requestRepo.save(new InternshipRequest(student, company));
    }

    // ✅ Student يشوف الطلبات متاعو
    @GetMapping("/student/{studentId}")
    public List<InternshipRequest> byStudent(@PathVariable Long studentId) {
        return requestRepo.findByStudentId(studentId);
    }

    // ✅ Company تشوف الطلبات اللي جاتها
    @GetMapping("/company/{companyId}")
    public List<InternshipRequest> byCompany(@PathVariable Long companyId) {
        return requestRepo.findByCompanyId(companyId);
    }

    // ✅ Company accept
    @PutMapping("/{id}/company-accept")
    public InternshipRequest companyAccept(@PathVariable Long id) {
        InternshipRequest req = requestRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (req.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Only PENDING can be accepted by company");
        }

        req.setStatus(RequestStatus.COMPANY_ACCEPTED);
        return requestRepo.save(req);
    }

    // ✅ Company reject
    @PutMapping("/{id}/company-reject")
    public InternshipRequest companyReject(@PathVariable Long id) {
        InternshipRequest req = requestRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (req.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Only PENDING can be rejected by company");
        }

        req.setStatus(RequestStatus.COMPANY_REJECTED);
        return requestRepo.save(req);
    }

    // ✅ ISET approve النهائي
    @PutMapping("/{id}/iset-approve")
    public InternshipRequest isetApprove(@PathVariable Long id) {
        InternshipRequest req = requestRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (req.getStatus() != RequestStatus.COMPANY_ACCEPTED) {
            throw new RuntimeException("Only COMPANY_ACCEPTED can be approved by ISET");
        }

        req.setStatus(RequestStatus.ISET_APPROVED);
        return requestRepo.save(req);
    }

    // ✅ ISET reject النهائي
    @PutMapping("/{id}/iset-reject")
    public InternshipRequest isetReject(@PathVariable Long id) {
        InternshipRequest req = requestRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (req.getStatus() != RequestStatus.COMPANY_ACCEPTED) {
            throw new RuntimeException("Only COMPANY_ACCEPTED can be rejected by ISET");
        }

        req.setStatus(RequestStatus.ISET_REJECTED);
        return requestRepo.save(req);
    }
}
