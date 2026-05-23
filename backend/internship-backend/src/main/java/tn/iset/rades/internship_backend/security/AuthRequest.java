package tn.iset.rades.internship_backend.security;

import jakarta.validation.constraints.NotBlank;

public class AuthRequest {
    @NotBlank
    private String role;   // "ADMIN" | "STUDENT" | "COMPANY"

    @NotBlank
    private String email;

    // ADMIN فقط يستحقها
    private String password;

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
