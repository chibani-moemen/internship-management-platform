package tn.iset.rades.internship_backend.security;

public class AuthResponse {
    private String token;
    private String role;
    private String email;
    private Long userId; // ✅ NEW

    public AuthResponse(String token, String role, String email, Long userId) {
        this.token = token;
        this.role = role;
        this.email = email;
        this.userId = userId;
    }

    public String getToken() { return token; }
    public String getRole() { return role; }
    public String getEmail() { return email; }
    public Long getUserId() { return userId; }
}
