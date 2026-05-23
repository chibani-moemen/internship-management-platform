package tn.iset.rades.internship_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.iset.rades.internship_backend.entity.Internship;

import java.time.LocalDate;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InternshipRepository extends JpaRepository<Internship, Long> {

    // ✅ Overlap check (CREATE)
    @Query("""
        SELECT COUNT(i) > 0
        FROM Internship i
        WHERE i.student.id = :studentId
          AND i.startDate <= :endDate
          AND i.endDate >= :startDate
    """)
    boolean existsOverlappingForStudent(
            @Param("studentId") Long studentId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // ✅ Overlap check (UPDATE) - نستثنيو internship الحالية
    @Query("""
        SELECT COUNT(i) > 0
        FROM Internship i
        WHERE i.student.id = :studentId
          AND i.id <> :internshipId
          AND i.startDate <= :endDate
          AND i.endDate >= :startDate
    """)
    boolean existsOverlappingForStudentExceptThis(
            @Param("studentId") Long studentId,
            @Param("internshipId") Long internshipId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
