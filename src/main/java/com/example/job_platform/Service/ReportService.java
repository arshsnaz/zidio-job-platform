package com.example.job_platform.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.job_platform.Entity.JobPost;
import com.example.job_platform.Entity.Recruiter;
import com.example.job_platform.Entity.User;
import com.example.job_platform.Repository.ApplicationRepository;
import com.example.job_platform.Repository.JobPostRepository;
import com.example.job_platform.Repository.RecruiterRepository;
import com.example.job_platform.Repository.StudentRepository;
import com.example.job_platform.Repository.UserRepository;

@Service
public class ReportService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobPostRepository jobPostRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    public Map<String, Object> generateSystemOverviewReport() {
        Map<String, Object> report = new HashMap<>();

        try {
            // Basic counts
            long totalUsers = userRepository.count();
            long totalStudents = studentRepository.count();
            long totalRecruiters = recruiterRepository.count();
            long totalJobs = jobPostRepository.count();
            long totalApplications = applicationRepository.count();

            report.put("totalUsers", totalUsers);
            report.put("totalStudents", totalStudents);
            report.put("totalRecruiters", totalRecruiters);
            report.put("totalJobs", totalJobs);
            report.put("totalApplications", totalApplications);
            report.put("generatedAt", new Date());

        } catch (Exception e) {
            report.put("error", "Failed to generate system overview: " + e.getMessage());
        }

        return report;
    }

    public Map<String, Object> generateJobPostingReport() {
        Map<String, Object> report = new HashMap<>();

        try {
            List<JobPost> allJobs = jobPostRepository.findAll();

            // Job type distribution
            Map<String, Long> jobTypeDistribution = allJobs.stream()
                    .filter(job -> job.getType() != null)
                    .collect(Collectors.groupingBy(
                            JobPost::getType,
                            Collectors.counting()
                    ));

            // Location distribution
            Map<String, Long> locationDistribution = allJobs.stream()
                    .filter(job -> job.getLocation() != null)
                    .collect(Collectors.groupingBy(
                            JobPost::getLocation,
                            Collectors.counting()
                    ));

            // Company distribution (top recruiters)
            Map<String, Long> companyDistribution = allJobs.stream()
                    .filter(job -> job.getRecruiter() != null
                    && job.getRecruiter().getCompanyName() != null)
                    .collect(Collectors.groupingBy(
                            job -> job.getRecruiter().getCompanyName(),
                            Collectors.counting()
                    ));

            report.put("totalJobs", allJobs.size());
            report.put("jobTypeDistribution", jobTypeDistribution);
            report.put("locationDistribution", locationDistribution);
            report.put("companyDistribution", companyDistribution);
            report.put("generatedAt", new Date());

        } catch (Exception e) {
            report.put("error", "Failed to generate job posting report: " + e.getMessage());
        }

        return report;
    }

    public Map<String, Object> generateApplicationReport() {
        Map<String, Object> report = new HashMap<>();

        try {
            List<Object[]> applications = applicationRepository.findAll().stream()
                    .map(app -> new Object[]{
                app.getId(),
                app.getStatus(),
                app.getAppliedDate(),
                app.getStudent() != null ? app.getStudent().getId() : null,
                app.getJob() != null ? app.getJob().getId() : null
            })
                    .collect(Collectors.toList());

            // Status distribution
            Map<String, Long> statusDistribution = applicationRepository.findAll().stream()
                    .filter(app -> app.getStatus() != null)
                    .collect(Collectors.groupingBy(
                            app -> app.getStatus().toString(),
                            Collectors.counting()
                    ));

            // Applications per job
            Map<Long, Long> applicationsPerJob = applicationRepository.findAll().stream()
                    .filter(app -> app.getJob() != null)
                    .collect(Collectors.groupingBy(
                            app -> app.getJob().getId(),
                            Collectors.counting()
                    ));

            report.put("totalApplications", applications.size());
            report.put("statusDistribution", statusDistribution);
            report.put("applicationsPerJob", applicationsPerJob);
            report.put("generatedAt", new Date());

        } catch (Exception e) {
            report.put("error", "Failed to generate application report: " + e.getMessage());
        }

        return report;
    }

    public Map<String, Object> generateUserActivityReport() {
        Map<String, Object> report = new HashMap<>();

        try {
            List<User> allUsers = userRepository.findAll();

            // Role distribution
            Map<String, Long> roleDistribution = allUsers.stream()
                    .filter(user -> user.getRole() != null)
                    .collect(Collectors.groupingBy(
                            user -> user.getRole().toString(),
                            Collectors.counting()
                    ));

            // Active vs inactive users
            Map<String, Long> statusDistribution = allUsers.stream()
                    .collect(Collectors.groupingBy(
                            user -> user.isStatus() ? "Active" : "Inactive",
                            Collectors.counting()
                    ));

            report.put("totalUsers", allUsers.size());
            report.put("roleDistribution", roleDistribution);
            report.put("statusDistribution", statusDistribution);
            report.put("generatedAt", new Date());

        } catch (Exception e) {
            report.put("error", "Failed to generate user activity report: " + e.getMessage());
        }

        return report;
    }

    public Map<String, Object> generatePopularJobsReport() {
        Map<String, Object> report = new HashMap<>();

        try {
            List<JobPost> allJobs = jobPostRepository.findAll();

            // Calculate application count for each job
            Map<Long, Integer> jobApplicationCounts = new HashMap<>();
            for (JobPost job : allJobs) {
                int applicationCount = (int) applicationRepository.findAll().stream()
                        .filter(app -> app.getJob() != null && app.getJob().getId().equals(job.getId()))
                        .count();
                jobApplicationCounts.put(job.getId(), applicationCount);
            }

            // Sort jobs by application count (most popular first)
            List<Map<String, Object>> popularJobs = allJobs.stream()
                    .sorted((a, b) -> {
                        int aCount = jobApplicationCounts.getOrDefault(a.getId(), 0);
                        int bCount = jobApplicationCounts.getOrDefault(b.getId(), 0);
                        return Integer.compare(bCount, aCount);
                    })
                    .limit(10)
                    .map(job -> {
                        Map<String, Object> jobInfo = new HashMap<>();
                        jobInfo.put("jobId", job.getId());
                        jobInfo.put("title", job.getTitle());
                        jobInfo.put("company", job.getRecruiter() != null
                                ? job.getRecruiter().getCompanyName() : "N/A");
                        jobInfo.put("type", job.getType());
                        jobInfo.put("location", job.getLocation());
                        jobInfo.put("applicationCount", jobApplicationCounts.getOrDefault(job.getId(), 0));
                        return jobInfo;
                    })
                    .collect(Collectors.toList());

            report.put("popularJobs", popularJobs);
            report.put("generatedAt", new Date());

        } catch (Exception e) {
            report.put("error", "Failed to generate popular jobs report: " + e.getMessage());
        }

        return report;
    }

    public Map<String, Object> generateRecruiterPerformanceReport() {
        Map<String, Object> report = new HashMap<>();

        try {
            List<Recruiter> allRecruiters = recruiterRepository.findAll();

            List<Map<String, Object>> recruiterStats = allRecruiters.stream()
                    .map(recruiter -> {
                        Map<String, Object> stats = new HashMap<>();

                        // Count jobs posted by this recruiter
                        long jobsPosted = jobPostRepository.findAll().stream()
                                .filter(job -> job.getRecruiter() != null
                                && job.getRecruiter().getId().equals(recruiter.getId()))
                                .count();

                        // Count total applications for this recruiter's jobs
                        long totalApplications = jobPostRepository.findAll().stream()
                                .filter(job -> job.getRecruiter() != null
                                && job.getRecruiter().getId().equals(recruiter.getId()))
                                .mapToLong(job -> applicationRepository.findAll().stream()
                                .filter(app -> app.getJob() != null && app.getJob().getId().equals(job.getId()))
                                .count())
                                .sum();

                        stats.put("recruiterId", recruiter.getId());
                        stats.put("companyName", recruiter.getCompanyName());
                        stats.put("designation", recruiter.getDesignation());
                        stats.put("jobsPosted", jobsPosted);
                        stats.put("totalApplications", totalApplications);

                        return stats;
                    })
                    .sorted((a, b) -> {
                        Long aJobs = (Long) a.get("jobsPosted");
                        Long bJobs = (Long) b.get("jobsPosted");
                        return Long.compare(bJobs, aJobs);
                    })
                    .collect(Collectors.toList());

            report.put("recruiterStats", recruiterStats);
            report.put("generatedAt", new Date());

        } catch (Exception e) {
            report.put("error", "Failed to generate recruiter performance report: " + e.getMessage());
        }

        return report;
    }

    public Map<String, Object> generateComprehensiveReport() {
        Map<String, Object> report = new HashMap<>();

        try {
            report.put("systemOverview", generateSystemOverviewReport());
            report.put("jobPostings", generateJobPostingReport());
            report.put("applications", generateApplicationReport());
            report.put("userActivity", generateUserActivityReport());
            report.put("popularJobs", generatePopularJobsReport());
            report.put("recruiterPerformance", generateRecruiterPerformanceReport());
            report.put("generatedAt", new Date());

        } catch (Exception e) {
            report.put("error", "Failed to generate comprehensive report: " + e.getMessage());
        }

        return report;
    }
}
