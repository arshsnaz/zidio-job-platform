package com.example.job_platform.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.job_platform.DTO.JobPostDTO;
import com.example.job_platform.Service.SearchService;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping("/jobs")
    public ResponseEntity<List<JobPostDTO>> getAllJobs() {
        try {
            List<JobPostDTO> jobs = searchService.getAllJobs();
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/jobs/title")
    public ResponseEntity<List<JobPostDTO>> searchJobsByTitle(@RequestParam String title) {
        try {
            List<JobPostDTO> jobs = searchService.searchJobsByTitle(title);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/jobs/location")
    public ResponseEntity<List<JobPostDTO>> searchJobsByLocation(@RequestParam String location) {
        try {
            List<JobPostDTO> jobs = searchService.searchJobsByLocation(location);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/jobs/type")
    public ResponseEntity<List<JobPostDTO>> searchJobsByType(@RequestParam String type) {
        try {
            List<JobPostDTO> jobs = searchService.searchJobsByType(type);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/jobs/keywords")
    public ResponseEntity<List<JobPostDTO>> searchJobsByKeywords(@RequestParam String keywords) {
        try {
            List<JobPostDTO> jobs = searchService.searchJobsByKeywords(keywords);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/jobs/stipend")
    public ResponseEntity<List<JobPostDTO>> searchJobsByStipend(@RequestParam String stipend) {
        try {
            List<JobPostDTO> jobs = searchService.searchJobsByStipend(stipend);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/jobs/recruiter")
    public ResponseEntity<List<JobPostDTO>> searchJobsByRecruiter(@RequestParam String recruiterName) {
        try {
            List<JobPostDTO> jobs = searchService.searchJobsByRecruiter(recruiterName);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/jobs/recent")
    public ResponseEntity<List<JobPostDTO>> getRecentJobs(@RequestParam(defaultValue = "10") int limit) {
        try {
            List<JobPostDTO> jobs = searchService.getRecentJobs(limit);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/jobs/advanced")
    public ResponseEntity<List<JobPostDTO>> advancedSearch(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String stipend) {
        try {
            List<JobPostDTO> jobs = searchService.advancedSearch(title, location, type, stipend);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
