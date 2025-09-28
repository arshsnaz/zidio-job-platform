package com.example.job_platform.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.job_platform.DTO.JobPostDTO;
import com.example.job_platform.Service.RecommendationService;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<JobPostDTO>> getRecommendedJobsForStudent(@PathVariable Long studentId) {
        try {
            List<JobPostDTO> recommendations = recommendationService.getRecommendedJobsForStudent(studentId);
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/location")
    public ResponseEntity<List<JobPostDTO>> getJobsByLocation(@RequestParam String location) {
        try {
            List<JobPostDTO> jobs = recommendationService.getJobsByLocation(location);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/type")
    public ResponseEntity<List<JobPostDTO>> getJobsByType(@RequestParam String type) {
        try {
            List<JobPostDTO> jobs = recommendationService.getJobsByType(type);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/trending")
    public ResponseEntity<List<JobPostDTO>> getTrendingJobs() {
        try {
            List<JobPostDTO> trendingJobs = recommendationService.getTrendingJobs();
            return ResponseEntity.ok(trendingJobs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/recent")
    public ResponseEntity<List<JobPostDTO>> getRecentJobs() {
        try {
            List<JobPostDTO> recentJobs = recommendationService.getRecentJobs();
            return ResponseEntity.ok(recentJobs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/similar/{jobId}")
    public ResponseEntity<List<JobPostDTO>> getSimilarJobs(@PathVariable Long jobId) {
        try {
            List<JobPostDTO> similarJobs = recommendationService.getSimilarJobs(jobId);
            return ResponseEntity.ok(similarJobs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
