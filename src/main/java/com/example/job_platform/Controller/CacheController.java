package com.example.job_platform.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.job_platform.DTO.JobPostDTO;
import com.example.job_platform.Service.CacheService;

@RestController
@RequestMapping("/api/cache")
public class CacheController {

    @Autowired
    private CacheService cacheService;

    @GetMapping("/recent-jobs")
    public ResponseEntity<List<JobPostDTO>> getCachedRecentJobs(@RequestParam(defaultValue = "10") int limit) {
        try {
            List<JobPostDTO> jobs = cacheService.getCachedRecentJobs(limit);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/jobs-by-location")
    public ResponseEntity<List<JobPostDTO>> getCachedJobsByLocation(@RequestParam String location) {
        try {
            List<JobPostDTO> jobs = cacheService.getCachedJobsByLocation(location);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/job-statistics")
    public ResponseEntity<Map<String, Long>> getCachedJobStatistics() {
        try {
            Map<String, Long> stats = cacheService.getCachedJobStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getCacheStats() {
        try {
            Map<String, Object> stats = cacheService.getCacheStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/preload")
    public ResponseEntity<String> preloadCommonData() {
        try {
            cacheService.preloadCommonData();
            return ResponseEntity.ok("Cache preloaded successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to preload cache: " + e.getMessage());
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<String> clearCache() {
        try {
            cacheService.clear();
            return ResponseEntity.ok("Cache cleared successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to clear cache: " + e.getMessage());
        }
    }

    @DeleteMapping("/invalidate/jobs")
    public ResponseEntity<String> invalidateJobCaches() {
        try {
            cacheService.invalidateJobCaches();
            return ResponseEntity.ok("Job caches invalidated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to invalidate job caches: " + e.getMessage());
        }
    }

    @DeleteMapping("/invalidate/user/{userId}")
    public ResponseEntity<String> invalidateUserCaches(@PathVariable Long userId) {
        try {
            cacheService.invalidateUserCaches(userId);
            return ResponseEntity.ok("User caches invalidated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to invalidate user caches: " + e.getMessage());
        }
    }
}
