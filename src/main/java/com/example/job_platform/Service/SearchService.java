package com.example.job_platform.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.job_platform.DTO.JobPostDTO;
import com.example.job_platform.Entity.JobPost;
import com.example.job_platform.Repository.JobPostRepository;

@Service
public class SearchService {

    @Autowired
    private JobPostRepository jobPostRepository;

    public List<JobPostDTO> searchJobsByTitle(String title) {
        return jobPostRepository.findAll().stream()
                .filter(job -> job.getTitle() != null
                && job.getTitle().toLowerCase().contains(title.toLowerCase()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobPostDTO> searchJobsByLocation(String location) {
        return jobPostRepository.findAll().stream()
                .filter(job -> job.getLocation() != null
                && job.getLocation().toLowerCase().contains(location.toLowerCase()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobPostDTO> searchJobsByType(String type) {
        return jobPostRepository.findAll().stream()
                .filter(job -> job.getType() != null
                && job.getType().toLowerCase().contains(type.toLowerCase()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobPostDTO> searchJobsByKeywords(String keywords) {
        String[] keywordArray = keywords.toLowerCase().split("\\s+");

        return jobPostRepository.findAll().stream()
                .filter(job -> {
                    String searchableText = (job.getTitle() + " "
                            + job.getDescription() + " "
                            + job.getType() + " "
                            + job.getLocation()).toLowerCase();

                    for (String keyword : keywordArray) {
                        if (searchableText.contains(keyword)) {
                            return true;
                        }
                    }
                    return false;
                })
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobPostDTO> searchJobsByStipend(String stipendKeyword) {
        return jobPostRepository.findAll().stream()
                .filter(job -> job.getStipend() != null
                && job.getStipend().toLowerCase().contains(stipendKeyword.toLowerCase()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobPostDTO> searchJobsByRecruiter(String recruiterName) {
        return jobPostRepository.findAll().stream()
                .filter(job -> job.getRecruiter() != null
                && job.getRecruiter().getCompanyName() != null
                && job.getRecruiter().getCompanyName().toLowerCase().contains(recruiterName.toLowerCase()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobPostDTO> advancedSearch(String title, String location, String type, String stipend) {
        return jobPostRepository.findAll().stream()
                .filter(job -> {
                    // Filter by title
                    if (title != null && !title.isEmpty()) {
                        if (job.getTitle() == null
                                || !job.getTitle().toLowerCase().contains(title.toLowerCase())) {
                            return false;
                        }
                    }

                    // Filter by location
                    if (location != null && !location.isEmpty()) {
                        if (job.getLocation() == null
                                || !job.getLocation().toLowerCase().contains(location.toLowerCase())) {
                            return false;
                        }
                    }

                    // Filter by type
                    if (type != null && !type.isEmpty()) {
                        if (job.getType() == null
                                || !job.getType().toLowerCase().contains(type.toLowerCase())) {
                            return false;
                        }
                    }

                    // Filter by stipend
                    if (stipend != null && !stipend.isEmpty()) {
                        if (job.getStipend() == null
                                || !job.getStipend().toLowerCase().contains(stipend.toLowerCase())) {
                            return false;
                        }
                    }

                    return true;
                })
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobPostDTO> getRecentJobs(int limit) {
        return jobPostRepository.findAll().stream()
                .sorted((a, b) -> {
                    if (a.getCreatedAt() == null && b.getCreatedAt() == null) {
                        return 0;
                    }
                    if (a.getCreatedAt() == null) {
                        return 1;
                    }
                    if (b.getCreatedAt() == null) {
                        return -1;
                    }
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .limit(limit)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobPostDTO> getAllJobs() {
        return jobPostRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private JobPostDTO convertToDTO(JobPost job) {
        JobPostDTO dto = new JobPostDTO();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setStipend(job.getStipend());
        dto.setType(job.getType());
        dto.setLocation(job.getLocation());
        dto.setCreatedAt(job.getCreatedAt());

        if (job.getRecruiter() != null) {
            dto.setCompanyName(job.getRecruiter().getCompanyName());

            // Get email from associated User entity
            if (job.getRecruiter().getUser() != null) {
                dto.setRecruiterEmail(job.getRecruiter().getUser().getEmail());
            }
        }

        return dto;
    }
}
