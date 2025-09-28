package com.example.job_platform.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.job_platform.Service.ReportService;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/system-overview")
    public ResponseEntity<Map<String, Object>> getSystemOverviewReport() {
        try {
            Map<String, Object> report = reportService.generateSystemOverviewReport();
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/job-postings")
    public ResponseEntity<Map<String, Object>> getJobPostingReport() {
        try {
            Map<String, Object> report = reportService.generateJobPostingReport();
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/applications")
    public ResponseEntity<Map<String, Object>> getApplicationReport() {
        try {
            Map<String, Object> report = reportService.generateApplicationReport();
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user-activity")
    public ResponseEntity<Map<String, Object>> getUserActivityReport() {
        try {
            Map<String, Object> report = reportService.generateUserActivityReport();
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/popular-jobs")
    public ResponseEntity<Map<String, Object>> getPopularJobsReport() {
        try {
            Map<String, Object> report = reportService.generatePopularJobsReport();
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/recruiter-performance")
    public ResponseEntity<Map<String, Object>> getRecruiterPerformanceReport() {
        try {
            Map<String, Object> report = reportService.generateRecruiterPerformanceReport();
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/comprehensive")
    public ResponseEntity<Map<String, Object>> getComprehensiveReport() {
        try {
            Map<String, Object> report = reportService.generateComprehensiveReport();
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
