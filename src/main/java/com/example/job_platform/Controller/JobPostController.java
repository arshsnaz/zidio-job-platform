package com.example.job_platform.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.job_platform.DTO.JobPostDTO;
import com.example.job_platform.Service.JobPostService;

@RestController
@RequestMapping("/api/jobPosts")
public class JobPostController {

    @Autowired
    private JobPostService jobPostService;

    @PostMapping
    public ResponseEntity<JobPostDTO> createJob(@RequestBody JobPostDTO dto) {
        return ResponseEntity.ok(jobPostService.createJobPost(dto));
    }

    @GetMapping
    public ResponseEntity<List<JobPostDTO>> getAllJobs(@RequestParam(required = false) String location,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String title) {
        // For now, return all jobs - you can add filtering later in service
        return ResponseEntity.ok(jobPostService.getAllJobPosts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobPostDTO> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobPostService.getJobPostById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobPostDTO> updateJob(@PathVariable Long id, @RequestBody JobPostDTO dto) {
        return ResponseEntity.ok(jobPostService.updateJobPost(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobPostService.deleteJobPost(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/recruiter")
    public ResponseEntity<List<JobPostDTO>> getByPostedEmail(@RequestParam String email) {
        return ResponseEntity.ok(jobPostService.getJobPostsByRecruiterEmail(email));
    }

    @GetMapping("/jobTitle")
    public ResponseEntity<List<JobPostDTO>> geyByJobTitle(@RequestParam String jobTitle) {
        return ResponseEntity.ok(jobPostService.searchJobsByKeyword(jobTitle));
    }

    @GetMapping("/jobType")
    public ResponseEntity<List<JobPostDTO>> geByJobType(@RequestParam String jobType) {
        return ResponseEntity.ok(jobPostService.getJobPostsByType(jobType));
    }

    @GetMapping("/companyName")
    public ResponseEntity<List<JobPostDTO>> getByCompanyName(@RequestParam String companyName) {
        return ResponseEntity.ok(jobPostService.getJobPostsByLocation(companyName));
    }

}
