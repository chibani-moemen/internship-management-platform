package tn.iset.rades.internship_backend.dto;

import java.util.List;

public class CompanyMatchDto {

    private Long companyId;
    private String companyName;
    private String companyEmail;
    private String companyAddress;

    private int score; // percentage 0..100
    private List<String> matchingSkills;

    public CompanyMatchDto() {}

    public CompanyMatchDto(Long companyId, String companyName, String companyEmail, String companyAddress,
                           int score, List<String> matchingSkills) {
        this.companyId = companyId;
        this.companyName = companyName;
        this.companyEmail = companyEmail;
        this.companyAddress = companyAddress;
        this.score = score;
        this.matchingSkills = matchingSkills;
    }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getCompanyEmail() { return companyEmail; }
    public void setCompanyEmail(String companyEmail) { this.companyEmail = companyEmail; }

    public String getCompanyAddress() { return companyAddress; }
    public void setCompanyAddress(String companyAddress) { this.companyAddress = companyAddress; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public List<String> getMatchingSkills() { return matchingSkills; }
    public void setMatchingSkills(List<String> matchingSkills) { this.matchingSkills = matchingSkills; }
}
