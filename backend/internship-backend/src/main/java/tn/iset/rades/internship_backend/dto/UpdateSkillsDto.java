package tn.iset.rades.internship_backend.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class UpdateSkillsDto {

    @NotEmpty(message = "skillIds is required")
    private List<Long> skillIds;

    public List<Long> getSkillIds() { return skillIds; }
    public void setSkillIds(List<Long> skillIds) { this.skillIds = skillIds; }
}
