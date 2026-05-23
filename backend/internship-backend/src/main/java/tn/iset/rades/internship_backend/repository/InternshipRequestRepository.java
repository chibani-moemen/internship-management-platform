package tn.iset.rades.internship_backend.repository;

import tn.iset.rades.internship_backend.model.InternshipRequest;
import tn.iset.rades.internship_backend.model.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InternshipRequestRepository
        extends JpaRepository<InternshipRequest, Long> {

    List<InternshipRequest> findByCompanyId(Long companyId);

    List<InternshipRequest> findByStudentId(Long studentId);

    Optional<InternshipRequest> findByStudentIdAndCompanyIdAndStatus(
            Long studentId,
            Long companyId,
            RequestStatus status
    );

    // ✅ لازمها هاذي
    List<InternshipRequest> findByStatus(RequestStatus status);
}
