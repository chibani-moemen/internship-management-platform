package tn.iset.rades.internship_backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import tn.iset.rades.internship_backend.entity.Student;
import tn.iset.rades.internship_backend.entity.Company;

@Entity
public class InternshipRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Student student;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Company company;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public InternshipRequest() {}

    public InternshipRequest(Student student, Company company) {
        this.student = student;
        this.company = company;
        this.status = RequestStatus.PENDING;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }

    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
