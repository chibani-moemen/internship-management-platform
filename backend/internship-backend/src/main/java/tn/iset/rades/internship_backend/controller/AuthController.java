package tn.iset.rades.internship_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import tn.iset.rades.internship_backend.repository.StudentRepository;
import tn.iset.rades.internship_backend.repository.CompanyRepository;
import tn.iset.rades.internship_backend.security.JwtService;
import tn.iset.rades.internship_backend.security.Role;
import tn.iset.rades.internship_backend.security.AuthResponse;
import tn.iset.rades.internship_backend.entity.Student;
import tn.iset.rades.internship_backend.entity.Company;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final JwtService jwtService;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;

    public AuthController(JwtService jwtService,
                          StudentRepository studentRepository,
                          CompanyRepository companyRepository) {
        this.jwtService = jwtService;
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {

        String roleStr = body.get("role");
        String email = body.get("email");
        String password = body.get("password");

        if (roleStr == null || email == null || password == null) {
            return ResponseEntity.badRequest().body("role, email, password required");
        }

        Role role;
        try {
            role = Role.valueOf(roleStr);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid role: " + roleStr);
        }

        Long userId = null;

        // ✅ ADMIN (fixed credentials)
        if (role == Role.ADMIN) {
            if (!email.equals("admin@iset.tn") || !password.equals("1234")) {
                return ResponseEntity.status(401).body("Invalid admin credentials");
            }
            userId = 0L; // ✅ optional
        }

        // ✅ STUDENT
        if (role == Role.STUDENT) {
            Student s = studentRepository.findByEmail(email).orElse(null);
            if (s == null) return ResponseEntity.status(401).body("Student not found");
            if (!s.getPassword().equals(password)) return ResponseEntity.status(401).body("Wrong password");
            userId = s.getId(); // ✅ NEW
        }

        // ✅ COMPANY
        if (role == Role.COMPANY) {
            Company c = companyRepository.findByEmail(email).orElse(null);
            if (c == null) return ResponseEntity.status(401).body("Company not found");
            if (!c.getPassword().equals(password)) return ResponseEntity.status(401).body("Wrong password");
            userId = c.getId(); // ✅ NEW
        }

        String token = jwtService.generateToken(email, role);

        return ResponseEntity.ok(new AuthResponse(
                token,
                role.name(),
                email,
                userId
        ));
    }
}
