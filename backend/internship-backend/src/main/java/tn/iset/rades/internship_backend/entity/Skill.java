package tn.iset.rades.internship_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "skill")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name; // مثال: Java, Angular

    // 1 normal, 2 big skill
    private int weight = 1;

    public Skill() {}

    public Skill(String name, int weight) {
        this.name = name;
        this.weight = weight;
    }

    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getWeight() { return weight; }
    public void setWeight(int weight) { this.weight = weight; }
}
