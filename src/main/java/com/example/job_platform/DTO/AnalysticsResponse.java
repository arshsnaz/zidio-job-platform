package com.example.job_platform.DTO;

public class AnalysticsResponse {

    public Long totalAuth;
    public Long totalStudents;
    public Long totalRecruiters;
    public Long totalJobPosts;
    public Long totalApplications;
    public Long totalAdmins;
    public Long totalFileUpload;
    public Long totalEmails;
    public Long totalSubscriptionPlan;
    public Long totalPayment;
    public Long totalUserPaymentStatus;

    public AnalysticsResponse() {
    }

    public AnalysticsResponse(Long totalAuth,
            Long totalStudents,
            Long totalRecruiters,
            Long totalJobPosts,
            Long totalApplications,
            Long totalAdmins,
            Long totalFileUplaod,
            Long totalEmails,
            Long totalSubscriptionPlan,
            Long totalPayment,
            Long totalUserPaymentStatus) {

        this.totalAuth = totalAuth;
        this.totalStudents = totalStudents;
        this.totalRecruiters = totalRecruiters;
        this.totalJobPosts = totalJobPosts;
        this.totalApplications = totalApplications;
        this.totalAdmins = totalAdmins;
        this.totalFileUpload = totalFileUplaod;
        this.totalEmails = totalEmails;
        this.totalSubscriptionPlan = totalSubscriptionPlan;
        this.totalPayment = totalPayment;
        this.totalUserPaymentStatus = totalUserPaymentStatus;
    }

}
