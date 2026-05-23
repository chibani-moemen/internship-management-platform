package tn.iset.rades.internship_backend.dto;

import jakarta.validation.constraints.NotNull;

public class RequestCreateDto {

    @NotNull
    private Long studentId;

    @NotNull
    private Long companyId;

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }
}
