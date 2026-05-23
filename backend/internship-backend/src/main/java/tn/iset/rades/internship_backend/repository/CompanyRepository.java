package tn.iset.rades.internship_backend.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import tn.iset.rades.internship_backend.entity.Company;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByEmail(String email);
}
