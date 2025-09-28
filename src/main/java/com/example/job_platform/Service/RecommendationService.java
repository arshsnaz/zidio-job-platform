package com.example.job_platform.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.job_platform.DTO.JobPostDTO;
import com.example.job_platform.Entity.JobPost;
import com.example.job_platform.Entity.Student;
import com.example.job_platform.Repository.ApplicationRepository;
import com.example.job_platform.Repository.JobPostRepository;
import com.example.job_platform.Repository.StudentRepository;

@Service
public class RecommendationService {

    @Autowired
    private JobPostRepository jobPostRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    public List<JobPostDTO> getRecommendedJobsForStudent(Long studentId) {
        try {
            Student student = studentRepository.findById(studentId).orElse(null);
            if (student == null) {
                return getAllAvailableJobs();
            }

            // Get jobs the student hasn't applied to
            List<Long> appliedJobIds = getAppliedJobIds(studentId);

            List<JobPost> allJobs = jobPostRepository.findAll();

            // Filter out already applied jobs and recommend based on student profile
            List<JobPost> recommendedJobs = allJobs.stream()
                    .filter(job -> !appliedJobIds.contains(job.getId()))
                    .filter(job -> isJobSuitableForStudent(job, student))
                    .limit(10) // Limit to top 10 recommendations
                    .collect(Collectors.toList());

            return recommendedJobs.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            System.err.println("Error getting recommendations: " + e.getMessage());
            return getAllAvailableJobs();
        }
    }

    public List<JobPostDTO> getJobsByLocation(String location) {
        try {
            List<JobPost> jobs = jobPostRepository.findAll().stream()
                    .filter(job -> job.getLocation() != null
                    && job.getLocation().toLowerCase().contains(location.toLowerCase()))
                    .collect(Collectors.toList());

            return jobs.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return getAllAvailableJobs();
        }
    }

    public List<JobPostDTO> getJobsByType(String type) {
        try {
            List<JobPost> jobs = jobPostRepository.findAll().stream()
                    .filter(job -> job.getType() != null
                    && job.getType().toLowerCase().contains(type.toLowerCase()))
                    .collect(Collectors.toList());

            return jobs.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return getAllAvailableJobs();
        }
    }

    public List<JobPostDTO> getTrendingJobs() {
        try {
            // Get jobs with most applications (trending)
            List<JobPost> allJobs = jobPostRepository.findAll();

            List<JobPost> trendingJobs = allJobs.stream()
                    .sorted((a, b) -> {
                        int aApplications = getApplicationCountForJob(a.getId());
                        int bApplications = getApplicationCountForJob(b.getId());
                        return Integer.compare(bApplications, aApplications);
                    })
                    .limit(10)
                    .collect(Collectors.toList());

            return trendingJobs.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return getAllAvailableJobs();
        }
    }

    public List<JobPostDTO> getRecentJobs() {
        try {
            List<JobPost> recentJobs = jobPostRepository.findAll().stream()
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
                    .limit(10)
                    .collect(Collectors.toList());

            return recentJobs.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return getAllAvailableJobs();
        }
    }

    public List<JobPostDTO> getSimilarJobs(Long jobId) {
        try {
            JobPost referenceJob = jobPostRepository.findById(jobId).orElse(null);
            if (referenceJob == null) {
                return getAllAvailableJobs();
            }

            List<JobPost> similarJobs = jobPostRepository.findAll().stream()
                    .filter(job -> !job.getId().equals(jobId)) // Exclude the reference job
                    .filter(job -> isSimilarJob(job, referenceJob))
                    .limit(5)
                    .collect(Collectors.toList());

            return similarJobs.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return getAllAvailableJobs();
        }
    }

    private List<Long> getAppliedJobIds(Long studentId) {
        try {
            return applicationRepository.findAll().stream()
                    .filter(app -> app.getStudent() != null
                    && app.getStudent().getId().equals(studentId))
                    .filter(app -> app.getJob() != null)
                    .map(app -> app.getJob().getId())
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return java.util.Collections.emptyList();
        }
    }

    private boolean isJobSuitableForStudent(JobPost job, Student student) {
        // Basic suitability check - can be enhanced with more complex logic
        try {
            // Check if job type matches student preferences (basic implementation)
            if (job.getType() != null && student.getSkills() != null) {
                String jobType = job.getType().toLowerCase();
                String studentSkills = student.getSkills().toLowerCase();

                // Simple keyword matching - can be enhanced
                if (jobType.contains("internship") || jobType.contains("entry")
                        || jobType.contains("junior") || jobType.contains("trainee")) {
                    return true;
                }

                // Check if job description contains student's skills
                if (job.getDescription() != null
                        && job.getDescription().toLowerCase().contains(studentSkills)) {
                    return true;
                }
            }

            return true; // Default to showing all available jobs
        } catch (Exception e) {
            return true;
        }
    }

    private boolean isSimilarJob(JobPost job, JobPost referenceJob) {
        try {
            // Check similar type
            if (job.getType() != null && referenceJob.getType() != null) {
                if (job.getType().equalsIgnoreCase(referenceJob.getType())) {
                    return true;
                }
            }

            // Check similar location
            if (job.getLocation() != null && referenceJob.getLocation() != null) {
                if (job.getLocation().equalsIgnoreCase(referenceJob.getLocation())) {
                    return true;
                }
            }

            // Check similar company
            if (job.getRecruiter() != null && referenceJob.getRecruiter() != null) {
                if (job.getRecruiter().getCompanyName() != null
                        && referenceJob.getRecruiter().getCompanyName() != null) {
                    if (job.getRecruiter().getCompanyName()
                            .equalsIgnoreCase(referenceJob.getRecruiter().getCompanyName())) {
                        return true;
                    }
                }
            }

            return false;
        } catch (Exception e) {
            return false;
        }
    }

    private int getApplicationCountForJob(Long jobId) {
        try {
            return (int) applicationRepository.findAll().stream()
                    .filter(app -> app.getJob() != null
                    && app.getJob().getId().equals(jobId))
                    .count();
        } catch (Exception e) {
            return 0;
        }
    }

    private List<JobPostDTO> getAllAvailableJobs() {
        try {
            return jobPostRepository.findAll().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return java.util.Collections.emptyList();
        }
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

            if (job.getRecruiter().getUser() != null) {
                dto.setRecruiterEmail(job.getRecruiter().getUser().getEmail());
            }
        }

        return dto;
    }
}
