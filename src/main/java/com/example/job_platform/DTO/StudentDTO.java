package com.example.job_platform.DTO;

public class StudentDTO {

    private Long id;
    private String name;
    private String email;
    private String skills;
    private String education;
    private String resumeUrl;

    public StudentDTO() {
    }

    public StudentDTO(Long id, String name, String email, String skills, String education, String resumeUrl) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.skills = skills;
        this.education = education;
        this.resumeUrl = resumeUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }
}
