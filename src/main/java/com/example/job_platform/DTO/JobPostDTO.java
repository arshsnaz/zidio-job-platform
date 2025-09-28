package com.example.job_platform.DTO;

import java.util.Date;

public class JobPostDTO {

    private Long id;
    private String title;
    private String description;
    private String stipend;
    private String type;
    private String location;
    private Date createdAt;
    private String recruiterEmail;
    private String companyName;    // Default constructor

    public JobPostDTO() {
    }

    // Constructor with all fields
    public JobPostDTO(Long id, String title, String description, String stipend,
            String type, String location, Date createdAt,
            String recruiterEmail, String companyName) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.stipend = stipend;
        this.type = type;
        this.location = location;
        this.createdAt = createdAt;
        this.recruiterEmail = recruiterEmail;
        this.companyName = companyName;
    }    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStipend() {
        return stipend;
    }

    public void setStipend(String stipend) {
        this.stipend = stipend;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public String getRecruiterEmail() {
        return recruiterEmail;
    }

    public void setRecruiterEmail(String recruiterEmail) {
        this.recruiterEmail = recruiterEmail;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
}
