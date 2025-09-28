package com.example.job_platform.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.job_platform.DTO.JobPostDTO;
import com.example.job_platform.Entity.JobPost;
import com.example.job_platform.Entity.Recruiter;
import com.example.job_platform.Repository.JobPostRepository;
import com.example.job_platform.Repository.RecruiterRepository;

@Service
public class JobPostService {

    @Autowired
    private JobPostRepository jobPostRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    public JobPostDTO createJobPost(JobPostDTO jobPostDTO) {
        try {
            Optional<Recruiter> recruiterOpt = recruiterRepository.findByUserEmail(jobPostDTO.getRecruiterEmail());
            if (!recruiterOpt.isPresent()) {
                throw new RuntimeException("Recruiter not found with email: " + jobPostDTO.getRecruiterEmail());
            }

            Recruiter recruiter = recruiterOpt.get();

            JobPost jobPost = new JobPost();
            jobPost.setTitle(jobPostDTO.getTitle());
            jobPost.setDescription(jobPostDTO.getDescription());
            jobPost.setStipend(jobPostDTO.getStipend());
            jobPost.setType(jobPostDTO.getType());
            jobPost.setLocation(jobPostDTO.getLocation());
            jobPost.setCreatedAt(new Date());
            jobPost.setRecruiter(recruiter);

            JobPost saved = jobPostRepository.save(jobPost);
            return mapToDTO(saved);
        } catch (Exception e) {
            throw new RuntimeException("Error creating job post: " + e.getMessage());
        }
    }

    public List<JobPostDTO> getAllJobPosts() {
        try {
            return jobPostRepository.findAll().stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving job posts: " + e.getMessage());
        }
    }

    public JobPostDTO getJobPostById(Long id) {
        try {
            Optional<JobPost> jobPostOpt = jobPostRepository.findById(id);
            if (!jobPostOpt.isPresent()) {
                throw new RuntimeException("Job post not found with id: " + id);
            }
            return mapToDTO(jobPostOpt.get());
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving job post: " + e.getMessage());
        }
    }

    public JobPostDTO updateJobPost(Long id, JobPostDTO jobPostDTO) {
        try {
            Optional<JobPost> jobPostOpt = jobPostRepository.findById(id);
            if (!jobPostOpt.isPresent()) {
                throw new RuntimeException("Job post not found with id: " + id);
            }

            JobPost jobPost = jobPostOpt.get();
            jobPost.setTitle(jobPostDTO.getTitle());
            jobPost.setDescription(jobPostDTO.getDescription());
            jobPost.setStipend(jobPostDTO.getStipend());
            jobPost.setType(jobPostDTO.getType());
            jobPost.setLocation(jobPostDTO.getLocation());

            JobPost saved = jobPostRepository.save(jobPost);
            return mapToDTO(saved);
        } catch (Exception e) {
            throw new RuntimeException("Error updating job post: " + e.getMessage());
        }
    }

    public void deleteJobPost(Long id) {
        try {
            if (!jobPostRepository.existsById(id)) {
                throw new RuntimeException("Job post not found with id: " + id);
            }
            jobPostRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting job post: " + e.getMessage());
        }
    }

    public List<JobPostDTO> getJobPostsByRecruiterEmail(String email) {
        try {
            return jobPostRepository.findByRecruiterEmail(email).stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving job posts by recruiter: " + e.getMessage());
        }
    }

    public List<JobPostDTO> searchJobsByKeyword(String keyword) {
        try {
            return jobPostRepository.searchByKeyword(keyword)
                    .stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error searching jobs: " + e.getMessage());
        }
    }

    public List<JobPostDTO> getJobPostsByType(String type) {
        try {
            return jobPostRepository.findByTypeIgnoreCase(type).stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving job posts by type: " + e.getMessage());
        }
    }

    public List<JobPostDTO> getJobPostsByLocation(String location) {
        try {
            return jobPostRepository.findByLocationContainingIgnoreCase(location).stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving job posts by location: " + e.getMessage());
        }
    }

    private JobPostDTO mapToDTO(JobPost jobPost) {
        JobPostDTO dto = new JobPostDTO();
        dto.setId(jobPost.getId());
        dto.setTitle(jobPost.getTitle());
        dto.setDescription(jobPost.getDescription());
        dto.setStipend(jobPost.getStipend());
        dto.setType(jobPost.getType());
        dto.setLocation(jobPost.getLocation());
        dto.setCreatedAt(jobPost.getCreatedAt());
        dto.setRecruiterEmail(jobPost.getRecruiter().getUser().getEmail());
        dto.setCompanyName(jobPost.getRecruiter().getCompanyName());
        return dto;
    }
}