package com.example.job_platform.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.job_platform.DTO.AnalysticsResponse;
import com.example.job_platform.Repository.AdminUserRepository;
import com.example.job_platform.Repository.ApplicationRepository;
import com.example.job_platform.Repository.JobPostRepository;
import com.example.job_platform.Repository.PaymentRepository;
import com.example.job_platform.Repository.RecruiterRepository;
import com.example.job_platform.Repository.StudentRepository;
import com.example.job_platform.Repository.SubscriptionPlanRepository;
import com.example.job_platform.Repository.UserPaymentStatusRepository;
import com.example.job_platform.Repository.UserRepository;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private JobPostRepository jobPostRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private SubscriptionPlanRepository subscriptionPlanRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserPaymentStatusRepository userPaymentStatusRepository;

    @GetMapping("/summary")
    public ResponseEntity<AnalysticsResponse> getSummary() {
        Long students = studentRepository.count();
        Long recruiters = recruiterRepository.count();
        Long jobPosts = jobPostRepository.count();
        Long applications = applicationRepository.count();
        Long users = userRepository.count();
        Long admins = adminUserRepository.count();
        Long subscriptionPlans = subscriptionPlanRepository.count();
        Long payments = paymentRepository.count();
        Long userPaymentStatuses = userPaymentStatusRepository.count();

        AnalysticsResponse response = new AnalysticsResponse(
                users, // totalAuth
                students, // totalStudents
                recruiters, // totalRecruiters
                jobPosts, // totalJobPosts
                applications, // totalApplications
                admins, // totalAdmins
                0L, // totalFileUpload
                0L, // totalEmails
                subscriptionPlans, // totalSubscriptionPlan
                payments, // totalPayment
                userPaymentStatuses // totalUserPaymentStatus
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalJobs", jobPostRepository.count());
        stats.put("totalApplications", applicationRepository.count());
        stats.put("totalUsers", userRepository.count());
        stats.put("totalStudents", studentRepository.count());
        stats.put("totalRecruiters", recruiterRepository.count());

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/applications")
    public ResponseEntity<Map<String, Object>> getApplicationStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalApplications", applicationRepository.count());
        // Add more application-specific stats as needed

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/jobs")
    public ResponseEntity<Map<String, Object>> getJobStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalJobs", jobPostRepository.count());
        // Add more job-specific stats as needed

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/interviews")
    public ResponseEntity<Map<String, Object>> getInterviewStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalInterviews", 0); // Mock data - implement actual logic

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/trends")
    public ResponseEntity<Map<String, Object>> getRecruitmentTrends() {
        Map<String, Object> trends = new HashMap<>();
        trends.put("jobPostingTrend", "increasing");
        trends.put("applicationTrend", "stable");

        return ResponseEntity.ok(trends);
    }
}
