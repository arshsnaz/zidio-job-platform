package com.example.job_platform.DTO;

import java.util.Date;

import com.example.job_platform.Enum.Status;

public class ApplicationDTO {

    private Long id;
    private Long studentId;
    private Long jobId;
    private String studentName;
    private String jobTitle;
    private Status status;
    private Date appliedDate;

    public ApplicationDTO() {
    }

    public ApplicationDTO(Long id, Long studentId, Long jobId, String studentName, String jobTitle, Status status, Date appliedDate) {
        this.id = id;
        this.studentId = studentId;
        this.jobId = jobId;
        this.studentName = studentName;
        this.jobTitle = jobTitle;
        this.status = status;
        this.appliedDate = appliedDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Date getAppliedDate() {
        return appliedDate;
    }

    public void setAppliedDate(Date appliedDate) {
        this.appliedDate = appliedDate;
    }
}
