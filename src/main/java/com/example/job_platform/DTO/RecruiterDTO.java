package com.example.job_platform.DTO;

public class RecruiterDTO {

    private Long id;
    private String name;
    private String email;
    private String companyName;
    private String designation;

    public RecruiterDTO() {
    }

    public RecruiterDTO(Long id, String name, String email, String companyName, String designation) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.companyName = companyName;
        this.designation = designation;
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

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }
}
