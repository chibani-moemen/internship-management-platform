package tn.iset.rades.internship_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "company")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "company name is required")
    private String name;

    @NotBlank(message = "address is required")
    private String address;

    @NotBlank(message = "email is required")
    @Email(message = "email must be valid")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "password is required")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    // ✅ Required Skills
    @ManyToMany
    @JoinTable(
            name = "company_required_skills",
            joinColumns = @JoinColumn(name = "company_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private Set<Skill> requiredSkills = new HashSet<>();

    // ✅ internships متاعها يتفسخوا وقت تتفسخ company
    @JsonIgnore
    @OneToMany(mappedBy = "company", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Internship> internships = new ArrayList<>();

    public Company() {}

    public Company(String name, String address, String email) {
        this.name = name;
        this.address = address;
        this.email = email;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public List<Internship> getInternships() { return internships; }
    public void setInternships(List<Internship> internships) { this.internships = internships; }

    public Set<Skill> getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(Set<Skill> requiredSkills) { this.requiredSkills = requiredSkills; }
}
