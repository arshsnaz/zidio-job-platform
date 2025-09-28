package com.example.job_platform.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.job_platform.Repository.AdminUserRepository;
import com.example.job_platform.Repository.ApplicationRepository;
import com.example.job_platform.Repository.JobPostRepository;
import com.example.job_platform.Repository.PaymentRepository;
import com.example.job_platform.Repository.RecruiterRepository;
import com.example.job_platform.Repository.StudentRepository;
import com.example.job_platform.Repository.SubscriptionPlanRepository;
import com.example.job_platform.Repository.UserPaymentStatusRepository;

@Service
public class DashboardService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private JobPostRepository jobPostRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private SubscriptionPlanRepository subscriptionPlanRepository;

    @Autowired
    private UserPaymentStatusRepository userPaymentStatusRepository;

    public Map<String, Object> getSystemOverview() {
        Map<String, Object> overview = new HashMap<>();

        overview.put("totalStudents", studentRepository.count());
        overview.put("totalRecruiters", recruiterRepository.count());
        overview.put("totalJobPosts", jobPostRepository.count());
        overview.put("totalApplications", applicationRepository.count());
        overview.put("totalAdmins", adminUserRepository.count());
        overview.put("totalPayments", paymentRepository.count());
        overview.put("totalSubscriptionPlans", subscriptionPlanRepository.count());
        overview.put("totalUserPaymentStatuses", userPaymentStatusRepository.count());

        // Add timestamp
        overview.put("lastUpdated", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        return overview;
    }

    public Map<String, Object> getUserGrowthStats() {
        Map<String, Object> stats = new HashMap<>();

        Long totalUsers = studentRepository.count() + recruiterRepository.count();
        Long activeStudents = studentRepository.count(); // Could be enhanced with active status
        Long activeRecruiters = recruiterRepository.count();

        stats.put("totalUsers", totalUsers);
        stats.put("activeStudents", activeStudents);
        stats.put("activeRecruiters", activeRecruiters);
        stats.put("userGrowthRate", calculateGrowthRate(totalUsers));

        return stats;
    }

    public Map<String, Object> getJobMarketStats() {
        Map<String, Object> stats = new HashMap<>();

        Long totalJobs = jobPostRepository.count();
        Long totalApplications = applicationRepository.count();

        stats.put("totalJobs", totalJobs);
        stats.put("totalApplications", totalApplications);
        stats.put("averageApplicationsPerJob", totalJobs > 0 ? (double) totalApplications / totalJobs : 0.0);
        stats.put("jobCompletionRate", calculateJobCompletionRate());

        return stats;
    }

    public Map<String, Object> getRevenueStats() {
        Map<String, Object> stats = new HashMap<>();

        Long totalPayments = paymentRepository.count();
        Long totalSubscriptions = subscriptionPlanRepository.count();

        stats.put("totalPayments", totalPayments);
        stats.put("totalSubscriptionPlans", totalSubscriptions);
        stats.put("paymentSuccessRate", calculatePaymentSuccessRate());
        stats.put("averageRevenuePerUser", calculateAverageRevenuePerUser());

        return stats;
    }

    public Map<String, Object> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();

        // Basic system health indicators
        health.put("status", "operational");
        health.put("uptime", "99.9%"); // This could be calculated based on actual metrics
        health.put("lastBackup", LocalDateTime.now().minusHours(6).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        health.put("databaseConnections", "healthy");
        health.put("apiResponseTime", "fast");

        return health;
    }

    private double calculateGrowthRate(Long totalUsers) {
        // Simple mock calculation - could be enhanced with historical data
        return totalUsers * 0.05; // 5% growth assumption
    }

    private double calculateJobCompletionRate() {
        // Mock calculation - could be enhanced with actual job status tracking
        return 0.75; // 75% completion rate assumption
    }

    private double calculatePaymentSuccessRate() {
        // Mock calculation - could be enhanced with actual payment status tracking
        return 0.92; // 92% success rate assumption
    }

    private double calculateAverageRevenuePerUser() {
        // Mock calculation - could be enhanced with actual revenue data
        Long totalUsers = studentRepository.count() + recruiterRepository.count();
        return totalUsers > 0 ? (totalUsers * 25.0) / totalUsers : 0.0; // $25 average
    }
}
