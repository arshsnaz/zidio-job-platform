package com.example.job_platform.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.job_platform.DTO.ApplicationDTO;
import com.example.job_platform.Entity.Application;
import com.example.job_platform.Entity.JobPost;
import com.example.job_platform.Entity.Student;
import com.example.job_platform.Enum.Status;
import com.example.job_platform.Repository.ApplicationRepository;
import com.example.job_platform.Repository.JobPostRepository;
import com.example.job_platform.Repository.StudentRepository;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private JobPostRepository jobPostRepository;

    public ApplicationDTO applyToJob(ApplicationDTO dto) {
        try {
            Optional<Student> studentOpt = studentRepository.findById(dto.getStudentId());
            Optional<JobPost> jobOpt = jobPostRepository.findById(dto.getJobId());

            if (!studentOpt.isPresent()) {
                throw new RuntimeException("Student not found with id: " + dto.getStudentId());
            }

            if (!jobOpt.isPresent()) {
                throw new RuntimeException("Job not found with id: " + dto.getJobId());
            }

            Student student = studentOpt.get();
            JobPost job = jobOpt.get();

            // Check if already applied
            Application existingApplication = applicationRepository.findByStudentAndJob(student, job);
            if (existingApplication != null) {
                throw new RuntimeException("Student has already applied to this job");
            }

            Application application = new Application(student, job);
            Application savedApplication = applicationRepository.save(application);

            return mapToDTO(savedApplication);

        } catch (Exception e) {
            throw new RuntimeException("Error applying to job: " + e.getMessage());
        }
    }

    public List<ApplicationDTO> getApplicationsByStudentId(Long studentId) {
        try {
            Optional<Student> studentOpt = studentRepository.findById(studentId);
            if (!studentOpt.isPresent()) {
                throw new RuntimeException("Student not found with id: " + studentId);
            }

            List<Application> applications = applicationRepository.findByStudent(studentOpt.get());
            return applications.stream().map(this::mapToDTO).collect(Collectors.toList());

        } catch (Exception e) {
            throw new RuntimeException("Error fetching applications: " + e.getMessage());
        }
    }

    public List<ApplicationDTO> getApplicationsByJobId(Long jobId) {
        try {
            Optional<JobPost> jobOpt = jobPostRepository.findById(jobId);
            if (!jobOpt.isPresent()) {
                throw new RuntimeException("Job not found with id: " + jobId);
            }

            List<Application> applications = applicationRepository.findByJob(jobOpt.get());
            return applications.stream().map(this::mapToDTO).collect(Collectors.toList());

        } catch (Exception e) {
            throw new RuntimeException("Error fetching applications: " + e.getMessage());
        }
    }

    public ApplicationDTO updateApplicationStatus(Long applicationId, Status status) {
        try {
            Optional<Application> applicationOpt = applicationRepository.findById(applicationId);
            if (!applicationOpt.isPresent()) {
                throw new RuntimeException("Application not found with id: " + applicationId);
            }

            Application application = applicationOpt.get();
            application.setStatus(status);
            Application savedApplication = applicationRepository.save(application);

            return mapToDTO(savedApplication);

        } catch (Exception e) {
            throw new RuntimeException("Error updating application status: " + e.getMessage());
        }
    }

    public List<ApplicationDTO> getAllApplications() {
        try {
            List<Application> applications = applicationRepository.findAll();
            return applications.stream().map(this::mapToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all applications: " + e.getMessage());
        }
    }

    public ApplicationDTO getApplicationById(Long applicationId) {
        try {
            Optional<Application> applicationOpt = applicationRepository.findById(applicationId);
            if (!applicationOpt.isPresent()) {
                throw new RuntimeException("Application not found with id: " + applicationId);
            }
            return mapToDTO(applicationOpt.get());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching application: " + e.getMessage());
        }
    }

    public void deleteApplication(Long applicationId) {
        try {
            Optional<Application> applicationOpt = applicationRepository.findById(applicationId);
            if (!applicationOpt.isPresent()) {
                throw new RuntimeException("Application not found with id: " + applicationId);
            }
            applicationRepository.deleteById(applicationId);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting application: " + e.getMessage());
        }
    }

    private ApplicationDTO mapToDTO(Application application) {
        ApplicationDTO dto = new ApplicationDTO();
        dto.setId(application.getId());
        dto.setStudentId(application.getStudent().getId());
        dto.setJobId(application.getJob().getId());
        dto.setStatus(application.getStatus());
        dto.setAppliedDate(application.getAppliedDate());
        dto.setStudentName(application.getStudent().getUser().getName());
        dto.setJobTitle(application.getJob().getTitle());
        return dto;
    }
}
